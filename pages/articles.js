import React from 'react'
import Head from 'next/head'
import BasePage from '../components/base-page'
import dynamic from 'next/dynamic'
import "@macrostrat/ui-components/lib/index.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import {InputGroup} from "@blueprintjs/core"

const loadCard = async function(){
  const mod = await import('@macrostrat/ui-components')
  return mod.GDDReferenceCard
}

const GDDReferenceCard = dynamic(loadCard, { ssr: false });

const Articles = () => {
  return <BasePage title="article search">
    <p>An article</p>
    <InputGroup
      className="main-search"
      placeholder="Enter a docid"
      leftIcon="search"
      large
    />
    <GDDReferenceCard docid="58b6b0dfcf58f110b18271ae" />
  </BasePage>
}

export default Articles

