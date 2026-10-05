import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
}

export const ArrowRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
)

export const ArrowLeft = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 12H5M11 18l-6-6 6-6" />
  </svg>
)

export const ArrowUpRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const Play = (p: P) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M8.5 6.2a1 1 0 0 1 1.52-.85l8 5.8a1 1 0 0 1 0 1.7l-8 5.8a1 1 0 0 1-1.52-.85V6.2Z" />
  </svg>
)

export const Leaf = (p: P) => (
  <svg {...base} {...p}>
    <path d="M19 5c0 8-4.4 12.2-9.8 12.2-1.2 0-2.3-.2-3.3-.6C6.6 10.2 11.6 6 19 5Z" />
    <path d="M6 20c1.3-4.3 4-7.8 7.8-9.9" />
  </svg>
)

export const Sprout = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 20v-7" />
    <path d="M12 13c0-3 2-5.5 5.5-5.5C17.5 11 15.2 13 12 13Z" />
    <path d="M12 15c0-2.6-1.8-4.8-4.8-4.8C7.2 13.2 9.2 15 12 15Z" />
  </svg>
)

export const Waves = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2 7.5c2.2-1.8 3.8-1.8 6 0s3.8 1.8 6 0 3.8-1.8 6 0" />
    <path d="M2 13c2.2-1.8 3.8-1.8 6 0s3.8 1.8 6 0 3.8-1.8 6 0" />
    <path d="M2 18.5c2.2-1.8 3.8-1.8 6 0s3.8 1.8 6 0 3.8-1.8 6 0" />
  </svg>
)

export const Gift = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9Z" />
    <path d="M3 7.5h18V11H3zM12 7.5V21" />
    <path d="M12 7.5S10.8 3 8.4 3a2.2 2.2 0 0 0 0 4.5H12Zm0 0S13.2 3 15.6 3a2.2 2.2 0 0 1 0 4.5H12Z" />
  </svg>
)

export const Check = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
)

export const Close = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const Globe = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.6 2.6 2.6 15 0 18-2.6-3-2.6-15.4 0-18Z" />
  </svg>
)

export const ICONS = { sprout: Sprout, waves: Waves, gift: Gift, leaf: Leaf }

/* --- Social --- */

export const Twitter = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M18.9 3H22l-6.8 7.8L23 21h-6.3l-4.9-6.4L6.2 21H3l7.3-8.3L2.6 3H9l4.4 5.9L18.9 3Zm-1.1 16.1h1.7L8.3 4.8H6.5l11.3 14.3Z" />
  </svg>
)

export const Instagram = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const Facebook = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5H16.6V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.1H7.4v3H10V21h3.5Z" />
  </svg>
)

export const LinkedIn = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M6.9 8.7H4V20h2.9V8.7ZM5.45 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.6c0-3-1.6-4.4-3.8-4.4-1.7 0-2.5.95-2.95 1.6V8.7H10.4c0 .8 0 11.3 0 11.3h2.85v-6.3c0-.3 0-.6.1-.85.25-.6.8-1.25 1.75-1.25 1.25 0 1.75.95 1.75 2.35V20H20v-6.4Z" />
  </svg>
)

export const SOCIALS = [
  { name: 'Twitter', Icon: Twitter },
  { name: 'Instagram', Icon: Instagram },
  { name: 'Facebook', Icon: Facebook },
  { name: 'LinkedIn', Icon: LinkedIn },
]
