// Feature data hooks — thin bridges from services to components via useAsync.
// Components never touch services or repositories directly; they call these.
// Each hook depends on `locale` so data refetches (localized) when language changes.
import { useServices } from './useServices.js';
import { useAsync } from './useAsync.js';
import { useT } from './useT.js';

export function useTeacher() {
  const { account } = useServices();
  const { locale } = useT();
  return useAsync(() => account.getTeacher(), [locale]);
}

export function useNavBadges() {
  const { navigation } = useServices();
  return useAsync(() => navigation.getBadges(), []);
}

export function useToday() {
  const { dashboard } = useServices();
  const { locale } = useT();
  return useAsync(() => dashboard.getToday(), [locale]);
}

export function useCohorts() {
  const { cohorts } = useServices();
  const { locale } = useT();
  return useAsync(() => cohorts.list(), [locale]);
}

export function useRoster(cohortId) {
  const { cohorts } = useServices();
  const { locale } = useT();
  return useAsync(
    () => (cohortId ? cohorts.getRoster(cohortId) : Promise.resolve([])),
    [cohortId, locale],
  );
}

export function useCardsPage() {
  const { cards } = useServices();
  const { locale } = useT();
  return useAsync(
    () =>
      Promise.all([cards.getRecent(), cards.getTypesByKind(), cards.getStats()]).then(
        ([recent, types, stats]) => ({ recent, types, stats }),
      ),
    [locale],
  );
}

export function useAiPage() {
  const { ai } = useServices();
  const { locale } = useT();
  return useAsync(
    () =>
      Promise.all([
        ai.getConversations(),
        ai.getUsage(),
        ai.getWorkspace(),
        ai.getActiveConversation(),
      ]).then(([conversations, usage, workspace, active]) => ({
        conversations,
        usage,
        workspace,
        active,
      })),
    [locale],
  );
}

export function usePrintPage() {
  const { print } = useServices();
  const { locale } = useT();
  return useAsync(
    () =>
      Promise.all([print.getPrinters(), print.getJobs(), print.getLibrary()]).then(
        ([printers, jobs, library]) => ({ printers, jobs, library }),
      ),
    [locale],
  );
}

export function useSurveysPage() {
  const { surveys } = useServices();
  const { locale } = useT();
  return useAsync(
    () =>
      Promise.all([surveys.getActive(), surveys.getHistory()]).then(([active, history]) => ({
        active,
        history,
      })),
    [locale],
  );
}

export function useMgmtThreads() {
  const { mgmt } = useServices();
  const { locale } = useT();
  return useAsync(() => mgmt.getThreads(), [locale]);
}

export function useMgmtTranscript(threadId) {
  const { mgmt } = useServices();
  const { locale } = useT();
  return useAsync(() => mgmt.getTranscript(threadId), [threadId, locale]);
}

export function useNotificationsPage() {
  const { notifications } = useServices();
  const { locale } = useT();
  return useAsync(
    () =>
      Promise.all([notifications.getGroups(), notifications.getFilters()]).then(
        ([groups, filters]) => ({ groups, filters }),
      ),
    [locale],
  );
}

export function useMaterialsPage() {
  const { materials } = useServices();
  const { locale } = useT();
  return useAsync(
    () =>
      Promise.all([materials.getList(), materials.getStats(), materials.getStorage()]).then(
        ([list, stats, storage]) => ({ list, stats, storage }),
      ),
    [locale],
  );
}

export function useAcademicPage(revision = 0) {
  const { academic } = useServices();
  const { locale } = useT();
  return useAsync(() => academic.getWorkspace(), [locale, revision]);
}

export function useOperationsPage(revision = 0) {
  const { operations } = useServices();
  const { locale } = useT();
  return useAsync(() => operations.getWorkspace(), [locale, revision]);
}
