import { Prisma } from '@prisma/client';
import { ConflictError, NotFoundError } from '../../shared/errors';
import type { AuthContext } from '../../http/plugins/auth';
import type { SessionRepository } from '../auth/session.repository';
import type { AccountRepository, PreferencesPatch } from './account.repository';
import { mapSession, mapSettings, mapTeacher } from './account.mapper';

/** Account use-cases: profile, preferences, and device sessions. */
export class AccountService {
  constructor(
    private readonly repo: AccountRepository,
    private readonly sessions: SessionRepository,
  ) {}

  async getTeacher(ctx: AuthContext) {
    const teacher = await this.repo.getTeacher(ctx.teacherId, ctx.academyId);
    if (!teacher) throw new NotFoundError('Teacher');
    const summary = await this.repo.getSummary(ctx.teacherId);
    return mapTeacher(teacher, summary);
  }

  async updateProfile(ctx: AuthContext, patch: { name?: string; username?: string }) {
    try {
      await this.repo.updateTeacher(ctx.teacherId, patch);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictError('Username is already taken');
      }
      throw err;
    }
    return this.getTeacher(ctx);
  }

  async getSettings(ctx: AuthContext) {
    const prefs =
      (await this.repo.getPreferences(ctx.teacherId)) ??
      (await this.repo.upsertPreferences(ctx.teacherId, {}));
    return mapSettings(prefs);
  }

  async patchSettings(ctx: AuthContext, patch: PreferencesPatch) {
    const prefs = await this.repo.upsertPreferences(ctx.teacherId, patch);
    return mapSettings(prefs);
  }

  async listSessions(ctx: AuthContext) {
    const list = await this.sessions.listActive(ctx.teacherId);
    return list.map((s) => mapSession(s, ctx.sessionId));
  }

  async ejectSession(ctx: AuthContext, sessionId: string) {
    await this.sessions.revoke(sessionId, ctx.teacherId);
    return { ok: true };
  }
}
