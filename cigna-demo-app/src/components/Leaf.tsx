export default function Leaf({
  className = '',
  color = '#03CC54',
  rotate = 0,
}: {
  className?: string
  color?: string
  rotate?: number
}) {
  return (
    <svg
      viewBox="0 0 100 60"
      aria-hidden="true"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M50 55 C10 50 0 25 5 5 C35 5 55 20 50 55 Z"
        fill={color}
      />
      <path
        d="M50 55 C45 30 30 15 8 8"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}
