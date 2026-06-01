import { ICONS } from './icons.jsx';

/**
 * Single-responsibility icon renderer. Looks a glyph up in the registry and
 * draws it at the requested size/stroke. Inherits color via `currentColor`.
 *
 * @param {{ name: string, size?: number, stroke?: number, className?: string, style?: object, title?: string }} props
 */
export function Icon({ name, size = 22, stroke, className, style, title }) {
  const entry = ICONS[name];
  if (!entry) {
    if (import.meta.env?.DEV) console.warn(`[Icon] unknown glyph "${name}"`);
    return null;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke ?? entry.stroke ?? 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {entry.children}
    </svg>
  );
}
