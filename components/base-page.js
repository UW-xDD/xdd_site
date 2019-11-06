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
  return <div className="page-title">
    <h1>xDD</h1>
    <h3>A digital assistant to <em>extract knowledge</em> from <em>published documents</em>.</h3>
  </div>
};

const Logo = ()=>{
  return <div className="logo">
    <img src="/static/xdd-logo-candidate.png" width="130" />
  </div>
}

const Footer = (props) => {
  return <footer>
    <b>xDD</b> is a project of University of Wisconsin — Madison.
  </footer>
}

const BasePage = (props) => {
  const {title, ...rest} = props

  return h("div#main", [
      h("header", [
        h(Logo),
        h('div.header-text', [
          h(TitleBlock, {title}),
          h(Nav)
        ])
      ]),
      h("div.page-body", rest),
      h(Footer)
    ]);
}

export default BasePage
