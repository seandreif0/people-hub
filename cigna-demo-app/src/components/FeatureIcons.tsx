import type { ReactNode } from 'react'

type IconProps = { className?: string }

function IconSvg({ className = '', children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`feature-icon ${className}`}
    >
      {children}
    </svg>
  )
}

export function ClaimsIcon({ className }: IconProps) {
  return (
    <IconSvg className={className}>
      <path className="fi-draw" pathLength={1} d="M14 6H28L36 14V40A2 2 0 0 1 34 42H14A2 2 0 0 1 12 40V8A2 2 0 0 1 14 6Z" />
      <path className="fi-draw" pathLength={1} d="M28 6V14H36" />
      <path className="fi-draw" pathLength={1} d="M17 15H24" />
      <path className="fi-draw" pathLength={1} d="M17 21H31" />
      <path className="fi-accent fi-check text-leaf" pathLength={1} strokeWidth={2.5} d="M17 30l5 5l10 -10" />
    </IconSvg>
  )
}

export function FindCareIcon({ className }: IconProps) {
  return (
    <IconSvg className={className}>
      <path className="fi-draw" pathLength={1} d="M24 43C14 31 10 25 10 19a14 14 0 0 1 28 0c0 6 -4 12 -14 24Z" />
      <g className="fi-accent fi-pin text-leaf">
        <path fill="currentColor" stroke="none" d="M22 13.5h4v3.5h3.5v4H26v3.5h-4V21h-3.5v-4H22Z" />
      </g>
    </IconSvg>
  )
}

export function RxIcon({ className }: IconProps) {
  return (
    <IconSvg className={className}>
      <path className="fi-draw" pathLength={1} d="M8 5H24A2 2 0 0 1 26 7V10A2 2 0 0 1 24 12H8A2 2 0 0 1 6 10V7A2 2 0 0 1 8 5Z" />
      <path className="fi-draw" pathLength={1} d="M8 12V40A3 3 0 0 0 11 43H21A3 3 0 0 0 24 40V12" />
      <path className="fi-draw" pathLength={1} d="M12 21H20" />
      <path className="fi-draw" pathLength={1} d="M12 26H20" />
      <path className="fi-draw" pathLength={1} d="M12 31H17" />
      <g className="fi-accent fi-pill text-leaf">
        <g transform="rotate(-35 36 31)">
          <path fill="currentColor" stroke="none" d="M31 31h10v4a5 5 0 0 1 -10 0Z" />
          <rect x={31} y={22} width={10} height={18} rx={5} />
          <path d="M31 31h10" />
        </g>
      </g>
    </IconSvg>
  )
}

export function IdCardIcon({ className }: IconProps) {
  return (
    <IconSvg className={className}>
      <path className="fi-draw" pathLength={1} d="M9 11H39A3 3 0 0 1 42 14V34A3 3 0 0 1 39 37H9A3 3 0 0 1 6 34V14A3 3 0 0 1 9 11Z" />
      <path className="fi-draw" pathLength={1} d="M25 19H36" />
      <path className="fi-draw" pathLength={1} d="M25 24H36" />
      <path className="fi-draw" pathLength={1} d="M25 29H32" />
      <g className="fi-accent fi-card text-leaf">
        <circle cx={15} cy={20.5} r={3.5} />
        <path d="M9.5 31a5.5 5.5 0 0 1 11 0" />
      </g>
    </IconSvg>
  )
}
