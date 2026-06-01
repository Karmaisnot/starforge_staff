export class TaskService {
  /** @param {{ taskRepo: import('@/data/repositories/interfaces.js').ITaskRepository }} deps */
  constructor({ taskRepo }) {
    this.taskRepo = taskRepo;
  }
  async getList() {
    const [columns, tasks] = await Promise.all([
      this.taskRepo.listColumns(),
      this.taskRepo.list(),
    ]);
    return { columns, tasks };
  }
  getFilters() {
    return this.taskRepo.listFilters();
  }
  setState(id, state) {
    return this.taskRepo.setState(id, state);
  }
}
