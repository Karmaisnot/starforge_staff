import styles from './Avatar.module.css';

const PALETTE = ['#b85535', '#d89a2e', '#4f7b3b', '#2a6f9f', '#7a4a82', '#a55a24', '#3f6e5c'];

function initialsOf(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function colorFor(name) {
  const hash = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % PALETTE.length;
  return PALETTE[hash];
}

/**
 * Initials avatar with a stable per-name color.
 * @param {{ name?: string, size?: number, color?: string, style?: object }} props
 */
export function Avatar({ name = 'A', size = 36, color, style }) {
  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        background: color || colorFor(name),
        fontSize: size * 0.4,
        ...style,
      }}
    >
      {initialsOf(name)}
    </div>
  );
}
