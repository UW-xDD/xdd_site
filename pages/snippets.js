import React, {createContext, useState, Component} from 'react'
import Head from 'next/head'
import BasePage from '../components/base-page'
import dynamic from 'next/dynamic'
import h from 'react-hyperscript'
import "@macrostrat/ui-components/lib/index.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import {InputGroup, Callout} from "@blueprintjs/core"
import { useSearchString } from '../components/search'
import {LinkCard} from '../components/link-card'

const loadCard = async function(){
  const mod = await import('../ui-components/components/api-frontend')
  return mod.APIResultView
}
const APIResultView = dynamic(loadCard, { ssr: false });

const loadRefCard = async function(){
  const mod = await import('@macrostrat/ui-components')
  return mod.GddReferenceCard
}
const GddReferenceCard = dynamic(loadRefCard, { ssr: false });

const Highlight = ({highlight})=> {
  return <li dangerouslySetInnerHTML={{__html : highlight}} />
}

const Highlights = ({highlights}) => {
    if (highlights == null) return null
    return <ul>{highlights.slice(0,5).map( highlight => {
      return <Highlight highlight={highlight} />
    })}
    </ul>
}

const PaperResult = ({paper}) => {
    return <LinkCard className={paper._gddid} href={`/article/${paper._gddid}`}>
      <h2>{paper.title}</h2>
      <Highlights highlights={paper.highlight} />
    </LinkCard>
}

const renderResult = (res) => {
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
            return <div>
              <h1 className="journal-title">{pub}</h1>
              <div>{results[pub].map((paper, i) => {
                return <PaperResult key={i} paper={paper} />
              })}
              </div>
            </div>
        })}
        </div>
}

const ResultView = (props)=>{
  const {searchString, debounce} = props;

  if (searchString != null && searchString != '') {
      return <APIResultView
          route="https://geodeepdive.org/api/snippets"
          params={{"term":searchString, "full_results": true, inclusive: true, article_limit: 1}}
          debounce={debounce}>{renderResult}</APIResultView>
  }
  return <Callout icon="alert" title="Snippets"
    intent="info">
    Search xDD for contextual use of a term or phrase.
  </Callout>

}

const SnippetsPage = (props)=>{
  const [searchString, updateSearchString] = useSearchString("/snippets");
  const [timeout, setTimeout] = useState(2000)

  return <BasePage title="snippets search">
    <InputGroup
      className="main-search"
      placeholder="Enter a search term"
      leftIcon="search"
      large
      value={searchString}
      onChange={ event =>{
        updateSearchString(event.target.value)
        setTimeout(2000)
      }}
      onKeyPress={event => {
        if (event.key === 'Enter') {
            updateSearchString(event.target.value);
            setTimeout(0)
            // Should set timeout to zero here...
        }
      }}
    />
    <ResultView searchString={searchString} debounce={timeout} />
  </BasePage>
}

export default SnippetsPage
