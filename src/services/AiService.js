import { usagePercent } from '@/domain/models/ai.js';

export class AiService {
  /** @param {{ aiRepo: import('@/data/repositories/interfaces.js').IAiRepository }} deps */
  constructor({ aiRepo }) {
    this.aiRepo = aiRepo;
  }
  getConversations() {
    return this.aiRepo.listConversations();
  }
  async getUsage() {
    const usage = await this.aiRepo.getUsage();
    return { ...usage, percent: usagePercent(usage) };
  }
  getWorkspace() {
    return this.aiRepo.getWorkspace();
  }
  async getActiveConversation() {
    const all = await this.aiRepo.listConversations();
    return all.find((c) => c.active) ?? all[0] ?? null;
  }
  /**
   * Persist a chat message and return the server's view of the exchange.
   * @param {string} conversationId
   * @param {string} text
   * @returns {Promise<{userMessage:object, aiMessage:object, usage:object}>}
   */
  sendMessage(conversationId, text) {
    return this.aiRepo.sendMessage(conversationId, text);
  }
  /**
   * Clear all messages in a conversation server-side.
   * @param {string} conversationId
   */
  clearMessages(conversationId) {
    return this.aiRepo.clearMessages(conversationId);
  }
}
