export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav className="container mb-6 mt-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item.href}>
          {index > 0 ? <span className="mx-2">/</span> : null}
          <a href={item.href}>{item.label}</a>
        </span>
      ))}
    </nav>
  )
}
