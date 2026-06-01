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
}
