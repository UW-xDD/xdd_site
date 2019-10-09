import React, {Component} from 'react'
import Head from 'next/head'
import BasePage from '../../components/base-page'
import dynamic from 'next/dynamic'
import {InputGroup, Callout} from "@blueprintjs/core"
import { useRouter } from 'next/router'

const loadCard = async function(){
  const mod = await import('@macrostrat/ui-components')
  return mod.GDDReferenceCard
}

const GDDReferenceCard = dynamic(loadCard, { ssr: false });

const DocIDView = (props)=>{
  const {searchString} = props;
  let docid = null;
  if (searchString == null) return null
  if (searchString.length == 24) {
    docid = searchString;
  }
  if (docid != null) {
    return <GDDReferenceCard docid={docid} />
  }
  return <Callout icon="alert" title="Document results"
    intent="primary">
    Search for documents
  </Callout>

}

const ArticlePage = ()=>{
  const router = useRouter()
  const { docid } = router.query
  console.log(docid);

  return <BasePage title="article search">
    <DocIDView searchString={docid} />
  </BasePage>
}

export default ArticlePage

