import React, {createContext, useState, Component, useEffect} from 'react'
import Head from 'next/head'
import BasePage from '../components/base-page'
import dynamic from 'next/dynamic'
import h from '@macrostrat/hyper'
import "@macrostrat/ui-components/lib/esm/index.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import { InputGroup, Callout, Button, Intent } from "@blueprintjs/core"
import { useSearchString } from '../components/search'
import {LinkCard} from '../components/link-card'
import { Collapse, Card } from '@blueprintjs/core';

const loadAPIResultView = async function(){
  const mod = await import('@macrostrat/ui-components');
  return mod.APIResultView
};
const APIResultView = dynamic(loadAPIResultView, { ssr: false });

const loadCard = async function(){
  const mod = await import('@macrostrat/ui-components/lib/esm/infinite-scroll');
  return mod.InfiniteScrollView
};
const InfiniteScrollView = dynamic(loadCard, { ssr: false });

const loadRefCard = async function(){
  const mod = await import('@macrostrat/ui-components');
  return mod.GddReferenceCard
};
const GddReferenceCard = dynamic(loadRefCard, { ssr: false });

const loadRelatedTerms = async function(){
  const mod = await import('@macrostrat/ui-components');
  return mod.GeoDeepDiveRelatedTerms
};
const GddRelatedTerms = dynamic(loadRelatedTerms, { ssr: false });

const renderRelatedTerms = (res) => {
    const related_terms = res.success;
    return <GddRelatedTerms {...related_terms} />
};

const Highlight = ({highlight})=> {
  return <li dangerouslySetInnerHTML={{__html : highlight}} />
};

const Highlights = ({highlights}) => {
    if (highlights == null) return null;
    return <ul>{highlights.slice(0,5).map( highlight => {
      return <Highlight highlight={highlight} />
    })}
    </ul>
};

const PaperResult = ({paper}) => {
    return <LinkCard className={`${paper._gddid} hit`} href={`/article/${paper._gddid}`}>
      <h2>{paper.title}</h2>
      <Highlights highlights={paper.highlight} />
    </LinkCard>
};

const PublicationSnippets = (props) => {
  const {name, papers} = props;
  const inner = papers.map( (paper, i) => h(PaperResult, {key: i, paper}));

    return h("div.publication", [
        h("h1.journal-title", name),
        h("div", inner)
    ])
};

const SnippetResultsPage = (props)=>{
  const {data} = props;
  if (data == null || data.length == 0) return null;

  let results = {};
  data.map ( (art) => {
      if ( !(art["pubname"] in results) ) {
          results[art['pubname']] = []
      }
      results[art['pubname']].push(art)
  } );
  const pubNames = Object.keys(results);

  return <div className="snippets-page">
    {pubNames.map((pub,i) => h(PublicationSnippets, {name: pub, papers: results[pub], key: i}))}
  </div>
};

const SnippetResults = (props) => {
  const {data, count} = props;
  if (data == null || data.length == 0) return null;
  console.log(data);

  let results = {};
  data.map ( (art) => {
      if ( !(art["pubname"] in results) ) {
          results[art['pubname']] = []
      }
      results[art['pubname']].push(art)
  } );

  const pubNames = Object.keys(results);

  let countItem = null;
  if (count != null) {
    countItem = <p className="count">{`${count} articles found.`}</p>
  }

  return <div className='results'>
    {countItem}
    <div className="snippets">
      {data.map((d,i) => h(SnippetResultsPage, {data: d, key: i}))}
    </div>
  </div>
};

const RelatedTermsView = (props)=>{
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

};

const InitialPlaceholder = (props)=>{

};

const ResultView = (props)=>{
  const {searchString, debounce} = props;

  if (searchString != null && searchString != '') {
      return <InfiniteScrollView
          route="https://geodeepdive.org/api/snippets"
          params={{"term":searchString, "full_results": true, inclusive: true, article_limit: 2}}
          unwrapResponse={res=>res.success}
          getCount={res => res?.success?.hits }
          getNextParams={(res, params)=>{
            console.log(res);
            const {scrollId} = res?.success;
            if (scrollId == null || scrollId == "") return null;
            return {scroll_id: scrollId}
          }}
          getItems={res=>{
            // Make page data into a single item so we can group by pages
            return [res.success.data]
          }}>
        <SnippetResults />
      </InfiniteScrollView>
  }
  return <Callout icon="alert" title="Snippets"
    intent="info">
    Search xDD for contextual use of a term or phrase.
  </Callout>

};

const SnippetsPage = (props)=>{
  const [searchString, updateSearchString] = useSearchString("/snippets");
  const [inputValue, setInputValue] = useState("");
  // Set input value to search string when it changes (enables default search behaviour)
  useEffect(()=>{
    setInputValue(searchString)
  }, [searchString]);


  return <BasePage title="snippets search" fixedHeader={true}>
    <div className="searchbar">
      <InputGroup
        className="main-search"
        placeholder="Enter a search term"
        leftIcon="search"
        large
        value={inputValue}
        onChange={event => setInputValue(event.target.value)}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            updateSearchString(event.target.value);
          }
        }}
      />
      <Button icon='arrow-right' large onClick={()=>{
        updateSearchString(inputValue)
      }
      }/>
    </div>
    <ResultView searchString={searchString} />
  </BasePage>
};

export default SnippetsPage
