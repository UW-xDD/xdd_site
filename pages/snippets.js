import React, {createContext, useState, Component, useEffect} from 'react'
import Head from 'next/head'
import BasePage from '../components/base-page'
import dynamic from 'next/dynamic'
import h from 'react-hyperscript'
import "@macrostrat/ui-components/lib/index.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import {InputGroup, Callout} from "@blueprintjs/core"
import { useRouter } from 'next/router'

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

const loadRelatedTerms = async function(){
  const mod = await import('../ui-components/components')
  return mod.GeoDeepDiveRelatedTerms
}
const GddRelatedTerms = dynamic(loadRelatedTerms, { ssr: false });

const renderRelatedTerms = (res) => {
    const related_terms = res.success
    return <GddRelatedTerms {related_terms} />
}

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
            return <div>
              <h1>{pub}</h1>
              <ul>{results[pub].map((paper, i) => {
                return <div key={i}><h2>{paper.title}<p>({paper._gddid})</p></h2>{RenderHighlights(paper.highlight)}</div>
              })}
              </ul>
            </div>
        })}
        </div>
}

const RelatedTermsView = (props)=>{
  const router = useRouter()
  const {searchString, debounce} = props;

  if (searchString != null && searchString != '') {
      return <APIResultView
          route="https://geodeepdive.org/api/similar_terms"
          params={{"term": searchString}}
          debounce={debounce}>{renderRelatedTerms}</APIResultView>
  }
  return null
//  return <Callout icon="alert" title="Related Terms"
//    intent="info">
//    Terms related to the one you searched for.
//  </Callout>

}
const ResultView = (props)=>{
  const router = useRouter()
  const {searchString, debounce} = props;

  if (searchString != null && searchString != '') {
      return <APIResultView
          route="https://geodeepdive.org/api/snippets"
          params={{"term":searchString, "full_results": true, inclusive: true}}
          debounce={debounce}>{RenderResult}</APIResultView>
  }
  return <Callout icon="alert" title="Snippets"
    intent="info">
    Search xDD for contextual use of a term or phrase.
  </Callout>

}

const useSearchString = (pathname)=> {
  /*
  A React hook to manage a search string and
  synchronize URL query parameters
  */
  const router = useRouter();

  const [searchString, setState] = useState()

  useEffect(()=>{
    if (searchString == null) {
      setState(router.query.search)
    }
  }, [router.query]);

  const updateSearchString = (val)=>{
    setState(val)
    // Update query to house search string
    const href = {
      pathname,
      query: {search: searchString}
    };
    const as = href;
    router.push(href, as, {shallow: true});
  }

  return [searchString, updateSearchString]
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
    <RelatedTermsView searchString={searchString} debounce={timeout} />
    <ResultView searchString={searchString} debounce={timeout} />
  </BasePage>
}

export default SnippetsPage
