import { StarMark } from './icons/StarMark.jsx';

// The physical "Up / Down" reward card. Sizing is computed from a scale factor
// so the whole card (a richly-decorated artifact) keeps its proportions — inline
// styles are intentional here, the geometry is data, not theme.
const KIND_PALETTE = {
  up: {
    bg: 'linear-gradient(135deg, #f6e0ac 0%, #e9c272 100%)',
    border: '#c49a3a',
    accent: '#7a4f0e',
    ink: '#3a2406',
    star: '#7a4f0e',
    chip: 'rgba(255,252,245,0.6)',
  },
  down: {
    bg: 'linear-gradient(135deg, #f0c9be 0%, #d88a75 100%)',
    border: '#a14026',
    accent: '#5c1a0c',
    ink: '#2d0f08',
    star: '#5c1a0c',
    chip: 'rgba(255,252,245,0.6)',
  },
};

const SCALE = { sm: 0.62, md: 0.82, lg: 1.0 };

/**
 * @param {{ kind?: 'up'|'down', size?: 'sm'|'md'|'lg', recipient?: string,
 *           reason?: string, issuer?: string, when?: string, typeName?: string,
 *           onClick?: Function }} props
 */
export function StudentCard({
  kind = 'up',
  size = 'md',
  recipient,
  reason,
  issuer,
  when,
  typeName,
  onClick,
}) {
  const p = KIND_PALETTE[kind];
  const s = SCALE[size] ?? SCALE.md;
  const name = typeName || (kind === 'up' ? 'Yulduz karta' : 'Ogohlantirish');

  // When an onClick is supplied the card becomes a real, keyboard-operable control;
  // otherwise it stays a plain decorative artifact (no misleading affordance).
  const interactive = typeof onClick === 'function';
  const interactiveProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e);
          }
        },
      }
    : {};

  return (
    <div
      {...interactiveProps}
      style={{
        width: 240 * s,
        height: 320 * s,
        background: p.bg,
        borderRadius: 14 * s,
        border: `1px solid ${p.border}`,
        position: 'relative',
        overflow: 'hidden',
        padding: 14 * s,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: `0 ${6 * s}px ${20 * s}px rgba(54,30,14,0.18), inset 0 1px 0 rgba(255,255,255,0.45)`,
        color: p.ink,
        flexShrink: 0,
        cursor: interactive ? 'pointer' : undefined,
      }}
    >
      <div style={{ position: 'absolute', right: -30 * s, top: -30 * s, opacity: 0.18 }}>
        <StarMark size={140 * s} color={p.star} />
      </div>
      <div style={{ position: 'absolute', right: -20 * s, bottom: -20 * s, opacity: 0.08 }}>
        <StarMark size={100 * s} color={p.star} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        <span
          style={{
            fontSize: 9 * s,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: p.accent,
          }}
        >
          {kind === 'up' ? '↑ UP CARD' : '↓ DOWN CARD'}
        </span>
        <StarMark size={18 * s} color={p.star} />
      </div>

      <div
        style={{
          marginTop: 8 * s,
          fontFamily: 'var(--sf-font-display)',
          fontStyle: 'italic',
          fontSize: 22 * s,
          lineHeight: 1.05,
          color: p.ink,
        }}
      >
        {name}
      </div>

      <div
        style={{
          marginTop: 10 * s,
          padding: `${4 * s}px ${8 * s}px`,
          background: p.chip,
          borderRadius: 6 * s,
          fontSize: 10 * s,
          color: p.accent,
          fontWeight: 600,
          display: 'inline-block',
          alignSelf: 'flex-start',
        }}
      >
        {recipient || 'Ism Familiya'}
      </div>

      <div
        style={{
          marginTop: 'auto',
          position: 'relative',
          fontSize: 11 * s,
          lineHeight: 1.4,
          color: p.ink,
        }}
      >
        {reason && (
          <div
            style={{
              fontStyle: 'italic',
              borderLeft: `2px solid ${p.accent}`,
              paddingLeft: 8 * s,
              opacity: 0.85,
            }}
          >
            “{reason}”
          </div>
        )}
        <div
          style={{
            marginTop: 10 * s,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontFamily: 'var(--sf-font-mono)',
            fontSize: 9 * s,
            color: p.accent,
          }}
        >
          <span>{issuer || 'N. Karimova'}</span>
          <span>{when || '19.05 · 09:42'}</span>
        </div>
      </div>
    </div>
  );
}
