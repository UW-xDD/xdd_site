import React from 'react'
import Link from 'next/link'

const links = [
  { href: '/articles', label: 'Articles' },
  { href: '/snippets', label: 'Snippets' },
  { href: '/journals', label: 'Journals' } ].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`
  return link
})

const Nav = () => (
  <nav>
    <ul>
      <li>
        <Link href='/'>
          <a>Home</a>
        </Link>
      </li>
      {links.map(({ key, href, label }) => (
        <li key={key}>
          <a href={href}>{label}</a>
        </li>
      ))}
    </ul>
  </nav>
)

export default Nav
