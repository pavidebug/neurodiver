/**
 * NeuroDiver illustration system — one visual family for heroes, education,
 * empty states and accent scenes. Soft, premium, muted greens/beige/neutrals.
 */

const palette = {
  sage: '#A8C5B0',
  sageMid: '#6AAB7A',
  sageDeep: '#5A9A68',
  sageDark: '#4A8F5C',
  forest: '#2D5A3D',
  beige: '#F5E6C8',
  beigeSoft: '#E8E0D0',
  sand: '#D4C4A8',
  wood: '#C4A882',
  warm: '#F5D76E',
  lavenderSoft: '#E8E4F4',
} as const

function GroundShadow({ cx, cy, rx }: { cx: number; cy: number; rx: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.14} fill={palette.forest} opacity={0.06} />
}

/** Hero sections — calm workspace scene */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" aria-hidden="true" className={className}>
      <GroundShadow cx={100} cy={145} rx={72} />
      <rect x={118} y={88} width={8} height={52} rx={2} fill={palette.wood} />
      <ellipse cx={122} cy={88} rx={22} ry={6} fill={palette.sand} />
      <path
        d="M110 94c6-18 20-18 24 0"
        stroke={palette.sageMid}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        opacity={0.85}
      />
      <ellipse cx={122} cy={72} rx={14} ry={18} fill={palette.sageDeep} opacity={0.85} />
      <ellipse cx={118} cy={58} rx={10} ry={14} fill={palette.sageMid} opacity={0.9} />
      <rect x={36} y={78} width={64} height={44} rx={10} fill={palette.sageDark} opacity={0.9} />
      <rect x={40} y={82} width={56} height={32} rx={8} fill={palette.sageDeep} />
      <path d="M44 98h48" stroke={palette.forest} strokeWidth={1.5} strokeLinecap="round" opacity={0.25} />
      <rect x={148} y={100} width={28} height={4} rx={2} fill={palette.wood} />
      <rect x={152} y={72} width={20} height={32} rx={4} fill={palette.beigeSoft} />
      <ellipse cx={162} cy={68} rx={12} ry={14} fill={palette.beige} opacity={0.9} />
      <circle cx={58} cy={52} r={18} fill={palette.beige} opacity={0.55} />
      <rect x={52} y={32} width={6} height={22} rx={2} fill={palette.sand} />
      <ellipse cx={55} cy={30} rx={10} ry={4} fill={palette.beige} opacity={0.8} />
      <circle cx={55} cy={24} r={5} fill={palette.warm} opacity={0.85} />
    </svg>
  )
}

/** Educational cards — quiet togetherness, no cartoon faces */
export function CommunityIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 56" aria-hidden="true" className={className}>
      <circle cx={28} cy={28} r={26} fill={palette.beige} opacity={0.45} />
      <ellipse cx={20} cy={26} rx={9} ry={11} fill={palette.sage} opacity={0.75} />
      <ellipse cx={36} cy={26} rx={9} ry={11} fill={palette.sage} opacity={0.75} />
      <path
        d="M14 38c5-4 9-6 14-6s9 2 14 6"
        stroke={palette.sageDeep}
        strokeWidth={1.75}
        fill="none"
        strokeLinecap="round"
        opacity={0.45}
      />
    </svg>
  )
}

/** Empty states & saved collections */
export function SavedCollectionIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 64" aria-hidden="true" className={className}>
      <rect x={8} y={18} width={36} height={28} rx={4} fill={palette.forest} opacity={0.75} />
      <path
        d="M22 32c0-6 4-10 8-10s8 4 8 10"
        fill="none"
        stroke={palette.warm}
        strokeWidth={1.75}
        opacity={0.85}
      />
      <rect x={48} y={36} width={14} height={10} rx={2} fill={palette.sage} opacity={0.8} />
      <ellipse cx={55} cy={32} rx={6} ry={4} fill={palette.sageMid} opacity={0.65} />
      <path
        d="M58 28c2-2 4-1 4 1"
        stroke={palette.sageDeep}
        strokeWidth={1.5}
        fill="none"
        opacity={0.5}
      />
    </svg>
  )
}

/** Footer & banner landscape accents */
export function LandscapeIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 40" aria-hidden="true" className={className}>
      <ellipse cx={48} cy={34} rx={40} ry={6} fill={palette.sage} opacity={0.35} />
      <path d="M8 28 Q24 18 40 24 T72 22 T88 26" fill={palette.sageDeep} opacity={0.45} />
      <circle cx={72} cy={12} r={8} fill={palette.warm} opacity={0.75} />
      <path
        d="M64 14 Q72 6 80 14"
        stroke={palette.warm}
        strokeWidth={1.75}
        fill="none"
        strokeLinecap="round"
        opacity={0.55}
      />
    </svg>
  )
}

/** Calm check-in greeting — open sky, soft hills, gentle light */
export function CheckInCalmIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 220" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="checkin-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.lavenderSoft} />
          <stop offset="100%" stopColor={palette.beigeSoft} />
        </linearGradient>
      </defs>
      <rect width={280} height={220} fill="url(#checkin-sky)" rx={24} />
      <circle cx={210} cy={52} r={28} fill={palette.warm} opacity={0.35} />
      <circle cx={210} cy={52} r={18} fill={palette.warm} opacity={0.55} />
      <ellipse cx={140} cy={178} rx={118} ry={28} fill={palette.sage} opacity={0.35} />
      <path
        d="M0 168 Q70 138 140 152 T280 148 L280 220 L0 220 Z"
        fill={palette.sageDeep}
        opacity={0.28}
      />
      <path
        d="M0 182 Q90 162 160 172 T280 168 L280 220 L0 220 Z"
        fill={palette.sageMid}
        opacity={0.38}
      />
      <ellipse cx={72} cy={158} rx={34} ry={22} fill={palette.sage} opacity={0.55} />
      <ellipse cx={200} cy={148} rx={42} ry={26} fill={palette.sageDeep} opacity={0.4} />
      <path
        d="M118 120 Q140 88 162 120"
        stroke={palette.sageDark}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        opacity={0.5}
      />
      <ellipse cx={140} cy={108} rx={16} ry={20} fill={palette.sageDeep} opacity={0.65} />
      <GroundShadow cx={140} cy={198} rx={56} />
    </svg>
  )
}

/** Small plant accent for privacy & supportive cards */
export function PlantAccentIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <ellipse cx={24} cy={38} rx={14} ry={6} fill={palette.sage} opacity={0.5} />
      <rect x={20} y={22} width={8} height={16} rx={2} fill={palette.forest} opacity={0.65} />
      <ellipse cx={24} cy={18} rx={10} ry={8} fill={palette.sageDeep} opacity={0.8} />
      <path
        d="M18 24 Q24 14 30 24"
        stroke={palette.sageDeep}
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        opacity={0.4}
      />
    </svg>
  )
}
