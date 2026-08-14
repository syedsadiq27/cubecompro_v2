import Link from 'next/link';
import { Wordmark } from '@repo/ui/wordmark';
import { nav } from '@/lib/content';
import { seoPages } from '@/lib/seo-pages';
import { SITE_EMAIL } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--ink)] bg-[var(--ink)] text-[var(--canvas)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 md:px-8 md:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="landing-footer-brand">
              <Wordmark size="lg" showPro />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
              The Digital Product Stage — configure the product, sell the state.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] text-white/40 uppercase">
                On this site
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/demo" className="hover:text-white">
                    Live demo
                  </Link>
                </li>
                <li>
                  <a
                    href="https://docs.cubecompro.com"
                    className="hover:text-white"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] text-white/40 uppercase">
                Solutions
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                {seoPages.map((page) => (
                  <li key={page.path}>
                    <Link href={page.path} className="hover:text-white">
                      {page.eyebrow}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] text-white/40 uppercase">
                Contact
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                <li>
                  <Link href="/#contact" className="hover:text-white">
                    Book a session
                  </Link>
                </li>
                <li>
                  <a href={`mailto:${SITE_EMAIL}`} className="hover:text-white">
                    {SITE_EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-14 text-xs text-white/35">
          © {new Date().getFullYear()} CubeCom Pro. The Digital Product Stage.
        </p>
      </div>
    </footer>
  );
}
