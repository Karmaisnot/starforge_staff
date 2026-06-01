import { navBadgesFixture } from '@/data/fixtures/navigation.js';

/** Supplies sidebar/tab badge counts. Static for now; swap to a repo when live. */
export class NavigationService {
  getBadges() {
    return Promise.resolve({ ...navBadgesFixture });
  }
}
