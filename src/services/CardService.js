import { CardKind } from '@/domain/enums.js';

export class CardService {
  /** @param {{ cardRepo: import('@/data/repositories/interfaces.js').ICardRepository }} deps */
  constructor({ cardRepo }) {
    this.cardRepo = cardRepo;
  }
  getRecent() {
    return this.cardRepo.listRecent();
  }
  getStats() {
    return this.cardRepo.getStats();
  }
  /** Card catalogue split into up/down buckets for the Cards page. */
  async getTypesByKind() {
    const types = await this.cardRepo.listTypes();
    return {
      up: types.filter((t) => t.kind === CardKind.UP),
      down: types.filter((t) => t.kind === CardKind.DOWN),
      all: types,
    };
  }
}
