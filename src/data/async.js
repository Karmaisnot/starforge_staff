// Helpers shared by mock repositories so they behave like a real async API.

/** Resolve after a small, jittered delay — mimics network latency. */
export function simulateLatency(min = 80, max = 220) {
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Deep clone so callers can never mutate the in-memory fixture store. */
export function clone(value) {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

/** Resolve a cloned value after simulated latency. */
export async function respond(value) {
  await simulateLatency();
  return clone(value);
}
