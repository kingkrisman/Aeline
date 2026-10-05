/** Unsplash helper — one place to tune width/quality for every image on the page. */
export const photo = (id: string, w = 1200, opts = '') =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80${opts}`

export const IMG = {
  hero: '1501854140801-50d01698950b', // aerial green hills
  tree: '1502082553048-f009c37129b9', // lone oak
  ocean: '1518837695005-2083093ee35b', // open water
  tiger: '1615824996195-f780bba7cfab', // tiger on a branch
  valley: '1506744038136-46273834b3fb', // river valley
  ridge: '1470071459604-3b5ec3a7fe05', // cliffs at sunrise
  harvest: '1464226184884-fa280b87c399', // market produce
  turtle: '1437622368342-7a3d73a34c8f', // sea turtle
  falls: '1432405972618-c60b0225b8f9', // forest waterfall
  summit: '1511497584788-876760111969', // pines at sunset
  beams: '1441974231531-c6227db76b6e', // sunbeams through forest
  trail: '1516214104703-d870798883c5', // woodland trail
} as const

export const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Our Mission', href: '#mission' },
  { label: 'Projects', href: '#initiatives' },
  { label: 'Resources', href: '#resources' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export const HERO_CARDS = [
  {
    title: 'Reforestation',
    body: 'Planting trees, restoring forests.',
    img: IMG.tree,
  },
  {
    title: 'Clean Oceans',
    body: 'Removing waste, protecting marine life.',
    img: IMG.ocean,
  },
  {
    title: 'Wildlife Protection',
    body: 'Safeguarding species, preserving habitats.',
    img: IMG.tiger,
  },
]

export const STATS = [
  { value: 520, suffix: 'K+', label: 'Trees Planted' },
  { value: 120, suffix: '+', label: 'Communities' },
  { value: 350, suffix: '+', label: 'Projects Completed' },
  { value: 100, suffix: '%', label: 'For the Planet', accent: true },
]

export const PILLARS = [
  {
    title: 'Sustainable\nLand Use',
    body: 'Promoting responsible land management.',
    img: IMG.valley,
    icon: 'sprout' as const,
  },
  {
    title: 'Climate\nAction',
    body: 'Reducing emissions, building resilience.',
    img: IMG.ridge,
    icon: 'waves' as const,
  },
  {
    title: 'Community\nEmpowerment',
    body: 'Empowering local heroes, creating impact.',
    img: IMG.harvest,
    icon: 'gift' as const,
  },
]

export const INITIATIVES = [
  {
    tag: 'Ocean Cleanup',
    title: 'Clean Oceans,\nBright Future',
    body: 'Removing plastic and debris from our oceans and coastlines.',
    img: IMG.turtle,
  },
  {
    tag: 'Reforestation',
    title: 'More Trees,\nBetter Planet',
    body: 'Planting and restoring forests for a healthier Earth.',
    img: IMG.falls,
  },
  {
    tag: 'Community',
    title: 'Stronger Communities,\nStronger Future',
    body: 'Empowering communities to lead local change.',
    img: IMG.summit,
  },
  {
    tag: 'Clean Air',
    title: 'Cleaner Air,\nHealthier Cities',
    body: 'Cutting emissions where people live and breathe.',
    img: IMG.beams,
  },
  {
    tag: 'Wildlife',
    title: 'Safe Corridors,\nThriving Species',
    body: 'Reconnecting habitats so wildlife can roam again.',
    img: IMG.trail,
  },
]

export const FOOTER_COLUMNS = [
  {
    title: 'Explore',
    links: ['Our Mission', 'Projects', 'Resources', 'Blog'],
  },
  {
    title: 'Get Involved',
    links: ['Volunteer', 'Donate', 'Partner With Us', 'Events'],
  },
  {
    title: 'Support',
    links: ['FAQs', 'Contact Us', 'Privacy Policy', 'Terms of Use'],
  },
]

/** Deterministic avatar set for the social-proof cluster. */
export const AVATARS = [
  'https://i.pravatar.cc/96?img=32',
  'https://i.pravatar.cc/96?img=12',
  'https://i.pravatar.cc/96?img=47',
  'https://i.pravatar.cc/96?img=5',
]
