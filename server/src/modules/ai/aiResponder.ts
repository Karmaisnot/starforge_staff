import { loc, type Localized } from '../../shared/locale';

/**
 * A turn of the conversation passed to a responder. `role` mirrors the
 * AiMessage role column ('user' | 'ai'); `text` is the plain outgoing/incoming
 * text (rich analysis messages are not replayed — only their plain content).
 */
export interface ResponderTurn {
  role: 'user' | 'ai';
  text: string;
}

/** The generated reply: localized leaf + a token estimate to bill against usage. */
export interface ResponderReply {
  /** Localized {uz,ru,en} reply leaf the transcript stores and the UI renders. */
  text: Localized;
  /** Estimated tokens this exchange consumed (decremented from AiUsage). */
  tokens: number;
}

/**
 * Port for producing an assistant reply (DIP). The service depends on this
 * abstraction, never on a concrete LLM client, so the app stays fully
 * functional with the offline fallback and can be upgraded to a live model by
 * swapping the injected implementation — no call-site change.
 */
export interface IAiResponder {
  /**
   * Generate a reply to `prompt` given the prior `history` (chronological).
   * Implementations must never throw on transport failure in a way that breaks
   * the chat — degrade to a sensible canned reply instead.
   */
  reply(prompt: string, history: ResponderTurn[]): Promise<ResponderReply>;
}

/**
 * Rough token estimate (~4 chars/token, the common heuristic) with a small
 * floor so trivial messages still cost something. Kept here so both responders
 * bill usage consistently and the estimate is testable in isolation.
 */
export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.trim().length / 4));
}

/**
 * Offline responder — the default. Returns a localized, context-aware canned
 * reply with no network dependency, so the assistant keeps working with no API
 * key configured. The reply echoes the prompt so the transcript reads
 * naturally, and the token cost covers the prompt plus the generated reply.
 */
export class FallbackAiResponder implements IAiResponder {
  async reply(prompt: string, _history: ResponderTurn[]): Promise<ResponderReply> {
    const text = cannedReply(prompt);
    const tokens = estimateTokens(prompt) + estimateTokens(text.en);
    return { text, tokens };
  }
}

/** Localized canned acknowledgement that references the teacher's prompt. */
function cannedReply(prompt: string): Localized {
  const snippet = prompt.trim().slice(0, 80);
  return loc(
    `So‘rovingizni qabul qildim: “${snippet}”. Hozircha AI ulanmagan, lekin guruh ma’lumotlaringizdan foydalanib yordam beraman.`,
    `Принял ваш запрос: «${snippet}». ИИ сейчас не подключён, но я помогу на основе данных вашей группы.`,
    `Got your request: “${snippet}”. The AI model is offline right now, but I can still help using your group's data.`,
  );
}

/** Minimal config slice the live responder needs (avoids a full AppConfig dep). */
export interface AnthropicResponderConfig {
  apiKey: string;
  model: string;
}

/**
 * Live responder backed by the Anthropic Messages API. Used ONLY when an API
 * key is configured (injected by the composition root). Uses the global fetch
 * — no SDK dependency — and on any failure degrades to the offline fallback so
 * a transient API error never breaks the teacher's chat.
 */
export class AnthropicAiResponder implements IAiResponder {
  private readonly fallback = new FallbackAiResponder();

  constructor(private readonly config: AnthropicResponderConfig) {}

  async reply(prompt: string, history: ResponderTurn[]): Promise<ResponderReply> {
    try {
      const messages = [
        ...history.map((t) => ({
          role: t.role === 'ai' ? ('assistant' as const) : ('user' as const),
          content: t.text,
        })),
        { role: 'user' as const, content: prompt },
      ];

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.config.model,
          max_tokens: 1024,
          system:
            'You are StarForge EDU, an assistant for teachers. Answer concisely and helpfully in the language of the question.',
          messages,
        }),
      });

      if (!res.ok) return this.fallback.reply(prompt, history);

      const data = (await res.json()) as {
        content?: Array<{ type: string; text?: string }>;
        usage?: { input_tokens?: number; output_tokens?: number };
      };
      const replyText = (data.content ?? [])
        .filter((b) => b.type === 'text' && typeof b.text === 'string')
        .map((b) => b.text as string)
        .join('')
        .trim();

      if (!replyText) return this.fallback.reply(prompt, history);

      // Prefer the API's own token accounting when present; fall back to the
      // char-based estimate so usage is always billed.
      const usage = data.usage;
      const tokens =
        usage && (usage.input_tokens || usage.output_tokens)
          ? (usage.input_tokens ?? 0) + (usage.output_tokens ?? 0)
          : estimateTokens(prompt) + estimateTokens(replyText);

      // The model replies in one language; store it across all three leaves so
      // the localized DTO contract holds and the UI renders it verbatim.
      return { text: loc(replyText, replyText, replyText), tokens };
    } catch {
      // Network/parse failure — never break the chat.
      return this.fallback.reply(prompt, history);
    }
  }
}
