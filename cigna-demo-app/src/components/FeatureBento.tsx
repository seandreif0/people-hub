import type { ComponentType, ReactNode } from 'react'
import Leaf from './Leaf'

const LEAF_GREEN = '#03CC54'
const part = '[transform-box:fill-box] transition-transform duration-300 ease-out'

type IconProps = { className?: string }

function IconSvg({ className = '', children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`overflow-visible ${className}`}
    >
      {children}
    </svg>
  )
}

function LeafAccent({ d }: { d: string }) {
  return <path d={d} fill={LEAF_GREEN} stroke="none" />
}

function ReceiptIcon({ className }: IconProps) {
  return (
    <IconSvg className={className}>
      <path d="M6 3h11v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21z" />
      <path d="M9 7.5h5" />
      <path
        d="M9 13.5l2 2 3.5-4"
        pathLength={1}
        className="transition-[stroke-dashoffset] duration-500 ease-out [stroke-dasharray:1] [stroke-dashoffset:1] group-hover:[stroke-dashoffset:0] motion-reduce:transition-none"
      />
      <LeafAccent d="M17.5 4.5c2.6-.4 4.3.9 4.5 3.5-2.6.4-4.3-.9-4.5-3.5z" />
    </IconSvg>
  )
}

function PinIcon({ className }: IconProps) {
  return (
    <IconSvg className={className}>
      <ellipse
        cx="12"
        cy="21.5"
        rx="4"
        ry="1"
        fill="currentColor"
        stroke="none"
        opacity="0.25"
        className={`${part} origin-center motion-safe:group-hover:scale-x-75`}
      />
      <g className={`${part} motion-safe:group-hover:-translate-y-1`}>
        <path d="M12 19s-5.5-5-5.5-9.5a5.5 5.5 0 1 1 11 0C17.5 14 12 19 12 19z" />
        <circle cx="12" cy="9.5" r="2" />
        <LeafAccent d="M16 3.5c2.4-1 4.4-.3 5.3 2-2.4 1-4.4.3-5.3-2z" />
      </g>
    </IconSvg>
  )
}

function PillIcon({ className }: IconProps) {
  return (
    <IconSvg className={className}>
      <g transform="rotate(-45 12 12)">
        <g className={`${part} origin-center motion-safe:group-hover:-rotate-[20deg]`}>
          <path
            d="M7 9h5v6H7a3 3 0 0 1 0-6z"
            stroke="none"
            className="fill-primary-tint transition-colors duration-300 group-hover:fill-leaf"
          />
          <rect x="4" y="9" width="16" height="6" rx="3" />
          <path d="M12 9v6" />
        </g>
      </g>
      <LeafAccent d="M2.5 21.5c-.3-2.6 1-4.3 3.6-4.5.3 2.6-1 4.3-3.6 4.5z" />
    </IconSvg>
  )
}

function IdCardIcon({ className }: IconProps) {
  return (
    <IconSvg className={className}>
      <rect
        x="5"
        y="5"
        width="16"
        height="11"
        rx="2"
        className="opacity-50 transition-opacity duration-300 group-hover:opacity-100"
      />
      <g className={`${part} motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-0.5`}>
        <rect x="3" y="8" width="16" height="11" rx="2" fill="var(--badge-bg)" />
        <circle cx="7.5" cy="12.5" r="1.5" />
        <path d="M6 16h3M12 12h4M12 15h3" />
      </g>
      <LeafAccent d="M1.5 6.5c.2-2.6 1.8-3.9 4.4-3.8-.2 2.6-1.8 3.9-4.4 3.8z" />
    </IconSvg>
  )
}

function ClaimTracker() {
  return (
    <div aria-hidden="true" className="relative z-10 mt-6 rounded-2xl bg-white p-4 shadow-sm md:mt-auto">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-body">Office visit</span>
        <span className="inline-grid">
          <span className="chip col-start-1 row-start-1 justify-center bg-surface-neutral text-secondary transition-opacity duration-300 group-hover:opacity-0 group-hover:delay-500">
            In review
          </span>
          <span className="chip col-start-1 row-start-1 justify-center bg-surface-tint text-primary-pressed opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:delay-500">
            Processed
          </span>
        </span>
      </div>
      <div className="relative mt-5 h-4">
        <div className="absolute inset-x-2 top-[5px] h-1.5 overflow-hidden rounded-full bg-surface-neutral">
          <div className="h-full origin-left scale-x-50 rounded-full bg-primary transition-transform duration-700 ease-out group-hover:scale-x-100 motion-reduce:transition-none" />
        </div>
        <span className="absolute left-0 top-0 h-4 w-4 rounded-full bg-primary" />
        <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-primary" />
        <span className="absolute right-0 top-0 h-4 w-4 rounded-full border-2 border-divider bg-white transition-colors duration-300 group-hover:border-leaf group-hover:bg-leaf group-hover:delay-500" />
      </div>
      <ol className="mt-2 grid grid-cols-3 text-xs font-medium text-secondary">
        <li>Submitted</li>
        <li className="text-center">In review</li>
        <li className="text-right">Processed</li>
      </ol>
    </div>
  )
}

type Feature = {
  title: string
  text: string
  icon: ComponentType<IconProps>
  className: string
  hero?: boolean
  dark?: boolean
}

const features: Feature[] = [
  {
    title: 'Track claims',
    text: 'See status and details in real time.',
    icon: ReceiptIcon,
    className: 'bg-surface-tint sm:col-span-2 md:col-span-2 md:row-span-2',
    hero: true,
  },
  {
    title: 'Find care',
    text: 'Search in-network doctors and dentists.',
    icon: PinIcon,
    className: 'bg-surface-tint md:col-span-2',
  },
  {
    title: 'Manage Rx',
    text: 'Refill prescriptions and check costs.',
    icon: PillIcon,
    className: 'bg-primary-tint/60 md:col-span-1',
  },
  {
    title: 'View ID cards',
    text: 'Digital cards for the whole family.',
    icon: IdCardIcon,
    className: 'bg-navy sm:col-span-2 md:col-span-1',
    dark: true,
  },
]

export default function FeatureBento() {
  return (
    <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2">
      {features.map(({ title, text, icon: Icon, className, hero, dark }) => (
        <li
          key={title}
          className={`group relative flex flex-col overflow-hidden rounded-3xl p-6 text-left transition duration-300 ease-out hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] motion-safe:hover:-translate-y-1 ${className}`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute block transition-transform duration-500 ease-out motion-safe:group-hover:rotate-12 motion-safe:group-hover:scale-110 ${
              hero ? '-right-6 -top-4 md:-top-2' : '-bottom-4 -right-4'
            }`}
          >
            <Leaf
              className={hero ? 'h-28 w-44 opacity-25' : `h-16 w-24 ${dark ? 'opacity-40' : 'opacity-25'}`}
              rotate={hero ? 20 : -15}
            />
          </span>
          <div className="relative z-10">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                dark ? 'bg-[var(--badge-bg)] text-white [--badge-bg:#291A8E]' : 'bg-white text-primary [--badge-bg:#ffffff]'
              }`}
            >
              <Icon className="h-8 w-8" />
            </span>
            <h3 className={`mt-4 font-bold ${hero ? 'text-2xl' : 'text-lg'} ${dark ? 'text-white' : ''}`}>{title}</h3>
            <p className={`mt-1 ${hero ? 'text-base' : 'text-sm'} ${dark ? 'text-white/80' : 'text-secondary'}`}>{text}</p>
          </div>
          {hero && <ClaimTracker />}
        </li>
      ))}
    </ul>
  )
}
