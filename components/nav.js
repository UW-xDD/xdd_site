import React, {Children} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import classNames from 'classnames'

const links = [
  { href: '/', label: 'Snippets' },
  { href: '/articles', label: 'Articles' },
  { href: '/snippets', label: 'Snippets' },
  { href: '/journals', label: 'Journals' } ].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`
  return link
  })

// Class to make an activeLink
const ActiveLink = ({children, ...props }) => {
  const router = useRouter();
  const child = Children.only(children);
  let className = child.props.className || '';
  const isActive = router.pathname === props.href;
  className = classNames(child.props.className, {"active": isActive});
  return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
};

const Nav = () => (
  <nav>
    <ul>
      {links.map(({ key, href, label }) => (

        <li key={key}>
          <ActiveLink href={href}>
            <a>{label}</a>
          </ActiveLink>
        </li>
      ))}
    </ul>
  </nav>
)

export default Nav
