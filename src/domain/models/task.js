import { Priority, TaskState } from '../enums.js';

/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} title
 * @property {'P1'|'P2'|'P3'} priority
 * @property {'todo'|'doing'|'review'|'done'} state
 * @property {string} project
 * @property {string} projectColor
 * @property {string} deadline
 * @property {boolean} urgent
 * @property {boolean} fromMgmt
 * @property {{ done:number, total:number }|null} subtasks
 * @property {string} assigner
 */

/** @param {Partial<Task>} data @returns {Task} */
export function createTask(data = {}) {
  return {
    id: data.id,
    title: data.title ?? '',
    priority: data.priority ?? Priority.P3,
    state: data.state ?? TaskState.TODO,
    project: data.project ?? '',
    projectColor: data.projectColor ?? 'var(--sf-muted)',
    deadline: data.deadline ?? '',
    urgent: data.urgent ?? false,
    fromMgmt: data.fromMgmt ?? false,
    subtasks: data.subtasks ?? null,
    assigner: data.assigner ?? '',
  };
}

/** Priority → CSS color. */
export function priorityColor(priority) {
  if (priority === Priority.P1) return 'var(--sf-danger)';
  if (priority === Priority.P2) return 'var(--sf-warn)';
  return 'var(--sf-muted)';
}

/** Chip tone matching a task state. */
export function stateTone(state) {
  switch (state) {
    case TaskState.DOING:
      return 'primary';
    case TaskState.REVIEW:
      return 'accent';
    case TaskState.DONE:
      return 'success';
    default:
      return 'neutral';
  }
}
