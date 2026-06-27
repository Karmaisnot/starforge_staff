import { navBadgesFixture } from '@/data/fixtures/navigation.js';

/**
 * Supplies sidebar/tab badge counts. Takes an optional repository (DIP): the
 * Http adapter returns live, computed counts from the backend; with no repo it
 * falls back to the static fixture (mock mode).
 */
export class NavigationService {
  #repo;
  constructor(navRepo = null) {
    this.#repo = navRepo;
  }
  getBadges() {
    if (this.#repo) return this.#repo.getBadges();
    return Promise.resolve({ ...navBadgesFixture });
  }
}
