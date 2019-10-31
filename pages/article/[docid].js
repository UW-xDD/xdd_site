import React, {Component} from 'react'
import Head from 'next/head'
import BasePage from '../../components/base-page'
import dynamic from 'next/dynamic'
import {InputGroup, Callout} from "@blueprintjs/core"
import { useRouter } from 'next/router'
import Link from 'next/link'

const loadAPIResultView = async function(){
    const mod = await import('@macrostrat/ui-components') 
    return mod.APIResultView
}
const loadCard = async function(){
  const mod = await import('@macrostrat/ui-components')
  return mod.GDDReferenceCard
}
const loadSwatch = async function(){
  const mod = await import('@macrostrat/ui-components')
  return mod.GeoDeepDiveSwatchInner
}
const loadAuthorList = async function(){
  const mod = await import('@macrostrat/ui-components')
  return mod.AuthorList
}

const APIResultView = dynamic(loadAPIResultView, { ssr: false });
const GDDReferenceCard = dynamic(loadCard, { ssr: false });
const AuthorList = dynamic(loadAuthorList, { ssr: false });
const GeoDeepDiveSwatchInner = dynamic(loadSwatch, { ssr: false });


const RenderSwatch = (data) => {
    console.log("Trying to render swatch thing.") 
    return <GeoDeepDiveSwatchInner data/>
}

const RenderSimilarDocs = (docs) => {
    return <div name="similar_docs"><h2>Similar documents</h2>
        <ul>
            {docs.map( doc => { 
            return <li><a href={`${doc.url}`}>{doc.title} ({doc.doi})</a></li>
            })}
        </ul></div>
}

const functionForStuff = (data) =>{
    console.log(data)
    return <div><h1>{data.title}</h1>{RenderSwatch(data)}{RenderSimilarDocs(data.similar_docs)} </div>
}

const DocIDView = (props)=>{
  const {searchString} = props;
  let docid = null;
  if (searchString == null) return null
  if (searchString.length == 24) {
    docid = searchString;
  }
  if (docid != null) {
      return <APIResultView 
          route="http://geodeepdive.org/api/articles"
          params={{"docid": docid, "similar_docs": true}} 
          opts={{unwrapResponse: (res)=>res.success.data[0]}}>
          {functionForStuff}
      </APIResultView>

  }
  return <Callout icon="alert" title="Document results"
    intent="primary">
    Search for documents
  </Callout>

}


//const DocIDView = (props)=>{
//  const {searchString} = props;
//  let docid = null;
//  if (searchString == null) return null
//  if (searchString.length == 24) {
//    docid = searchString;
//  }
//  if (docid != null) {
//    return <GDDReferenceCard docid={docid} />
//  }
//  return <Callout icon="alert" title="Document results"
//    intent="primary">
//    Search for documents
//  </Callout>
//
//}
//
const ArticlePage = ()=>{
  const router = useRouter()
  const { docid } = router.query
  console.log(docid);

  return <BasePage title="article search">
    <DocIDView searchString={docid} />
  </BasePage>
}

export default ArticlePage

