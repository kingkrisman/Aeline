import { Reveal } from './ui/Reveal'

/** Six small placeholder marks, so the strip has visual variety. */
const MARKS = [
  <path key="a" d="M12 2 2 12l10 10 10-10L12 2Zm0 5.5L18.5 12 12 16.5 5.5 12 12 7.5Z" />,
  <path key="b" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" />,
  <path key="c" d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm14 0a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />,
  <path key="d" d="M12 2c3 5 8 7 8 12a8 8 0 0 1-16 0c0-5 5-7 8-12Z" />,
  <path key="e" d="M2 12a10 10 0 0 1 10-10v10h10a10 10 0 0 1-20 0Z" />,
  <path key="f" d="M4 4h16v4H4V4Zm0 6h10v4H4v-4Zm0 6h16v4H4v-4Z" />,
]

const LOGOS = MARKS.map((mark, i) => ({ id: i, mark }))

function Logo({ mark }: { mark: React.ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-2 px-7 text-muted transition-colors duration-300 ease-out hover:text-ink lg:px-10">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 opacity-70">
        {mark}
      </svg>
      <span className="font-display text-[15px] font-medium tracking-[-0.02em]">Logoipsum</span>
    </div>
  )
}

export function TrustedBy() {
  return (
    <section className="relative mx-2 mt-3 overflow-hidden sm:mx-3 lg:mx-4">
      <Reveal className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:gap-6 lg:gap-10">
        <span className="shrink-0 pl-5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted sm:pl-8 lg:pl-12 xl:pl-16">
          Trusted by
        </span>

        {/* Marquee. linear and CSS-driven — constant motion shouldn't ease,
            and it should keep time while React renders the rest of the page. */}
        <div className="group relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="animate-marquee flex w-max will-change-transform group-hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex" aria-hidden={copy === 1}>
                {LOGOS.map((logo) => (
                  <Logo key={`${copy}-${logo.id}`} mark={logo.mark} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
