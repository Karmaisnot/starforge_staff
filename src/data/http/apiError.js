/** A machine-readable API error, preserving the server's response envelope. */
export class ApiError extends Error {
  constructor(status, method, path, body = null, retryAfter = null) {
    const message = body?.message || `HTTP ${status} ${method} ${path}`;
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.method = method;
    this.path = path;
    this.code = body?.code ?? 'error';
    this.body = body;
    this.fields = body?.errors ?? null;
    this.retryAfter = retryAfter;
  }
}
