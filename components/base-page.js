import h from 'react-hyperscript'
import Nav from './nav'
import "@macrostrat/ui-components/lib/index.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import './main.css'

const BasePage = (props) => {
  const {title, ...rest} = props

  let titleText = "xDD interface"
  if (title) {
    titleText += " — "+title
  }

  return h("div#main", [
    h("header", [
      h("div.title", [
        h("h1",titleText),
        h("h2","Papers, but fun")
      ]),
      h(Nav)
    ]),
    h("div.page-body", rest)
  ])
}

export default BasePage
