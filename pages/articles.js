import React, {createContext, Component} from 'react'
import Head from 'next/head'
import BasePage from '../components/base-page'
import dynamic from 'next/dynamic'
import {InputGroup, NonIdealState, Callout} from "@blueprintjs/core"
import Link from 'next/link'

const loadCard = async function(){
  const mod = await import('@macrostrat/ui-components')
  return mod.APIResultView
}

const loadSwatch = async function(){
  const mod = await import('../ui-components/components')
  return mod.GeoDeepDiveSwatchInnerBare
}

const APIResultView = dynamic(loadCard, { ssr: false });
const GeoDeepDiveSwatchInnerBare = dynamic(loadSwatch, { ssr: false });

const Swatch = ({data}) => {
    return <GeoDeepDiveSwatchInnerBare {...data} />
}

function renderResponse(res) {
  if (res.success == null) {
    return <NonIdealState title={"No results"} icon="search" />
  }
  const {data} = res.success;
  return <ul className="papers">{data.map(paper => {
      return <div><Link href={`/article/${paper._gddid}`}><a><Swatch data={paper} /></a></Link></div>
  })}</ul>
}

const DocIDView = (props)=>{
  const {searchString} = props;
  if (searchString != null && searchString != '') {
    return <APIResultView
      route="https://geodeepdive.org/api/articles"
      params={{title_like: searchString, max: 10}}
      debounce={1000}
    >{renderResponse}</APIResultView>
  }
  return <Callout icon="alert" title="Articles">
    Search for published articles within the xDD corpus.
  </Callout>
}

const LoginContext = createContext({user: "Guest"});

//const Provider = <LoginContext.Provider value={{user: "Daven"}} />


class Articles extends Component {
  static contextType = LoginContext;
  constructor(props) {
    super(props);
    this.state = {
      searchString: null
    }
    this.updateSearchString = this.updateSearchString.bind(this)
  }
  render() {
    const {user} = this.context;
    return <BasePage title="article search">
      <InputGroup
        className="main-search"
        placeholder="Search for articles"
        leftIcon="search"
        large
        value={this.state.searchString}
        onChange={this.updateSearchString}
      />
      <DocIDView searchString={this.state.searchString} />
    </BasePage>
  }

  updateSearchString(evt) {
    this.setState({searchString: evt.target.value})
  }
}

export default Articles
