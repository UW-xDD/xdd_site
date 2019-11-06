import h from 'react-hyperscript'
import Nav from './nav'
import "@macrostrat/ui-components/lib/index.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import './main.styl'

const Subtitle = ({title})=>{
  if (title == null) return null
  return h("span.subtitle",[
    " — ",
    title
  ])
};

const TitleBlock = ({title})=>{
  return h("div.title", [
    h("h1",[
      "xDD",
      h(Subtitle,{title})
    ]),
  ])
};

const Footer = (props) => {
  return <footer>
    <b>xDD</b> is a project of University of Wisconsin — Madison
  </footer>
}

const BasePage = (props) => {
  const {title, ...rest} = props

  return h("div#main", [
    h("header", [
      h(TitleBlock, {title}),
      h(Nav)
    ]),
    h("div.page-body", rest),
    h(Footer)
  ])
}

export default BasePage
