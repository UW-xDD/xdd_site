import React, {createContext, Component} from 'react'
import Head from 'next/head'
import BasePage from '../components/base-page'
import dynamic from 'next/dynamic'
import "@macrostrat/ui-components/lib/index.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import {InputGroup, Callout} from "@blueprintjs/core"

const loadCard = async function(){
  const mod = await import('@macrostrat/ui-components')
  return mod.APIResultView
}
const APIResultView = dynamic(loadCard, { ssr: false });

const loadRefCard = async function(){
  const mod = await import('@macrostrat/ui-components')
  return mod.GddReferenceCard
}
const GddReferenceCard = dynamic(loadRefCard, { ssr: false });

function RenderHighlights(highlights) {
    return <ul>{highlights.map( (highlight) => {return <li><div dangerouslySetInnerHTML={{__html : highlight}}/></li>} )}</ul>
}

function RenderResult(res){
    let data = res.success.data
    let results = {}
    data.map ( (art) => {
        if ( !(art["pubname"] in results) ) {
            results[art['pubname']] = []
        }
        results[art['pubname']].push(art)
    } )
    return <div className="snippets">
        {Object.keys(results).map( (pub)=> {
            return <div><h1>{pub}</h1>
                <ul>{results[pub].map(paper => {
                    return <div><h2>{paper.title}<p>({paper._gddid})</p></h2>{RenderHighlights(paper.highlight)}</div>
                })}</ul></div>
        })}
        </div>
}

const ResultView = (props)=>{
  const {searchString} = props;
  if (searchString != null) {
    return <APIResultView route="https://geodeepdive.org/api/snippets" params={{"term":searchString}} debounce="800">{RenderResult}</APIResultView>
  }
  return <Callout icon="alert" title="Snippets"
    intent="info">
    Search xDD for contextual use of a term or phrase.
  </Callout>

}

//const LoginContext = createContext({user: "Guest"});
//
////const Provider = <LoginContext.Provider value={{user: "Daven"}} />
//

class Snippets extends Component {
//  static contextType = LoginContext;
  constructor(props) {
    super(props);
    this.timeout = 0;
    this.state = {
      searchString: null
    }
    this.updateSearchString = this.updateSearchString.bind(this);
  }

  render() {
    const {user} = this.context;
    return <BasePage title="snippets search">
      <InputGroup
        className="main-search"
        placeholder="Enter a search term"
        leftIcon="search"
        large
        value={this.state.searchString}
        onChange={this.updateSearchString}
        onKeyPress={event => {
          if (event.key === 'Enter') {
              this.updateSearchString;
              this.timeout=0
          }
        }}
      />
      <ResultView searchString={this.state.searchString} />
    </BasePage>
  }

  updateSearchString(evt) {
    this.setState({searchString: evt.target.value})
  }
}

export default Snippets

