import Link from 'next/link'
import { adminPath } from '@/lib/admin-route'

const shortcuts = [
  { href: adminPath(), label: 'Dashboard' },
  { href: adminPath('/visual-composer'), label: 'Visual Composer' },
]

export function AdminNavShortcuts() {
  return (
    <div className="plusmit-admin-shortcuts" aria-label="PlusMIT admin shortcuts">
      <p className="plusmit-admin-shortcuts__label">Website Tools</p>
      <nav className="plusmit-admin-shortcuts__links">
        {shortcuts.map((shortcut) => (
          <Link href={shortcut.href} key={shortcut.href}>
            {shortcut.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
