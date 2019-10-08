import React from 'react'
import Head from 'next/head'
import BasePage from '../components/base-page'
import dynamic from 'next/dynamic'
import "@macrostrat/ui-components/lib/index.css"

const GDDReferenceCard = dynamic(()=>
  import('@macrostrat/ui-components').then(mod => mod.GDDReferenceCard)
)

const Articles = () => {
  return <BasePage title="article search">
    <p>An article</p>
    <GDDReferenceCard docid="58b6b0dfcf58f110b18271ae" />
  </BasePage>
}

export default Articles

