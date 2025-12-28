import Link from 'next/link'

type FooterLink = {
  label: string
  href: string
}

const FOOTER_LINKS: FooterLink[] = [
  { label: 'FAQ', href: '/help' },
  { label: 'Help Center', href: '/help' },
  { label: 'Account', href: '/account' },
  { label: 'Media Center', href: '/help' },
  { label: 'Investor Relations', href: '/help' },
  { label: 'Jobs', href: '/help' },
  { label: 'Ways to Watch', href: '/help' },
  { label: 'Terms of Use', href: '/help' },
  { label: 'Privacy', href: '/help' },
  { label: 'Cookie Preferences', href: '/help' },
  { label: 'Corporate Information', href: '/help' },
  { label: 'Contact Us', href: '/help' },
  { label: 'Speed Test', href: '/help' },
  { label: 'Legal Notices', href: '/help' },
  { label: 'Only on Netflix', href: '/' },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-gray-300 md:px-10">
        <p className="mb-6">
          Questions?{' '}
          <a className="hover:underline" href="#">
            Call 1-800-000-0000
          </a>
        </p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="w-fit text-[13px] text-gray-400 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex items-center">
          <div className="inline-flex items-center rounded border border-gray-500/60 px-3 py-2 text-xs text-gray-300">
            English
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-500">Netflix Clone</p>
      </div>
    </footer>
  )
}