import { FOOTER_COLUMNS } from '../lib/data'
import { Reveal, RevealGroup, RevealItem } from './ui/Reveal'
import { Leaf, SOCIALS } from './ui/Icons'

export function Footer() {
  return (
    <footer id="contact" className="relative mx-2 mb-3 mt-3 px-5 pb-8 pt-12 sm:mx-3 sm:px-8 lg:mx-4 lg:px-12 xl:px-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2.4fr)]">
        <Reveal>
          <a href="#home" className="group flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-forest-deep text-lime">
              <Leaf className="h-[18px] w-[18px] transition-transform duration-500 ease-out group-hover:-rotate-12" />
            </span>
            <span className="font-display text-[19px] font-semibold tracking-[-0.03em] text-ink">
              Aeline
            </span>
          </a>
          <p className="mt-4 max-w-[230px] text-[12.5px] leading-relaxed text-muted">
            Together, we can create a sustainable future for generations to come.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((col, i) => (
            <RevealGroup key={col.title} delay={i * 0.06} stagger={0.05}>
              <RevealItem>
                <h4 className="text-[13px] font-semibold tracking-[-0.01em] text-ink">
                  {col.title}
                </h4>
              </RevealItem>
              <ul className="mt-3.5 space-y-2.5">
                {col.links.map((link) => (
                  <RevealItem key={link} as="li">
                    <a
                      href="#contact"
                      className="group relative inline-block text-[12.5px] text-muted transition-colors duration-200 ease-out hover:text-ink"
                    >
                      {link}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    </a>
                  </RevealItem>
                ))}
              </ul>
            </RevealGroup>
          ))}

          <RevealGroup delay={0.18} stagger={0.05}>
            <RevealItem>
              <h4 className="text-[13px] font-semibold tracking-[-0.01em] text-ink">Follow Us</h4>
            </RevealItem>
            <RevealItem>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {SOCIALS.map(({ name, Icon }) => (
                  <a
                    key={name}
                    href="#contact"
                    aria-label={name}
                    className="pressable grid h-9 w-9 place-items-center rounded-full bg-ink/6 text-ink-soft transition-colors duration-200 ease-out hover:bg-forest-deep hover:text-lime"
                  >
                    <Icon className="h-[17px] w-[17px]" />
                  </a>
                ))}
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>

      <Reveal delay={0.1}>
        <p className="mt-12 border-t border-ink/8 pt-5 text-right text-[11.5px] text-muted">
          © {new Date().getFullYear()} Aeline. All rights reserved.
        </p>
      </Reveal>
    </footer>
  )
}
