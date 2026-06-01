/** Thrown by repository interface methods that a concrete impl forgot to override. */
export class NotImplementedError extends Error {
  constructor(method) {
    super(`Not implemented: ${method}`);
    this.name = 'NotImplementedError';
  }
}

/** Thrown by repositories/services when a requested aggregate does not exist. */
export class NotFoundError extends Error {
  constructor(entity, id) {
    super(`${entity} not found: ${id}`);
    this.name = 'NotFoundError';
  }
}
