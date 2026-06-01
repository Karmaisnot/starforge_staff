/** Tiny classnames joiner — filters out falsy values. */
export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}
