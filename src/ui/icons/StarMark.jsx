/**
 * The StarForge 8-point star logomark.
 * @param {{ size?: number, color?: string, className?: string, style?: object }} props
 */
export function StarMark({ size = 24, color = 'currentColor', className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M16 1 L19.4 11.2 L29.9 11.5 L21.3 17.6 L24.5 27.9 L16 21.4 L7.5 27.9 L10.7 17.6 L2.1 11.5 L12.6 11.2 Z"
        fill={color}
      />
      <circle cx="16" cy="16" r="2.2" fill="var(--sf-bg, #fbf6ec)" />
    </svg>
  );
}
