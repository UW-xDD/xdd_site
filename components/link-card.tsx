import h from 'react-hyperscript'
import Link from 'next/link'
import classNames from 'classnames'

const LinkCard = (props)=>{
  let {href, className, ...rest} = props
  className = classNames(
    "link-card",
    "bp3-card",
    "bp3-elevation-0",
    className)

  return h(Link, {href}, h('a', { className, ...rest}))
}

export {LinkCard}
