import React, {createContext, Component} from 'react'
import Head from 'next/head'
import BasePage from '../components/base-page'
import dynamic from 'next/dynamic'
import {InputGroup, NonIdealState} from "@blueprintjs/core"
import Link from 'next/link'

const loadCard = async function(){
  const mod = await import('@macrostrat/ui-components')
  return mod.APIResultView
}

const APIResultView = dynamic(loadCard, { ssr: false });

function renderResponse(res) {
  if (res.success == null) {
    return <NonIdealState title={"No results"} icon="search" />
  }
  const {data} = res.success;
  return <ul className="papers">{data.map(paper => {
    return <li>
      <Link href={`/article/${paper._gddid}`}>
        <a>{paper.title}</a>
      </Link>
    </li>
  })}</ul>
}

const DocIDView = (props)=>{
  const {searchString} = props;
  let titleLike = null;
  if (searchString == null) return null
  if (searchString.length > 3) {
    titleLike = searchString;
  }
  if (titleLike != null) {
    return <APIResultView
      route="https://geodeepdive.org/api/articles"
      params={{title_like: titleLike, max: 10}}
      debounce={1000}
    >{renderResponse}</APIResultView>
  }
  return <NonIdealState icon="alert" title="Document results">
    Search for documents
  </NonIdealState>

  if (docid != null) {
    return <div>
      <GDDReferenceCard docid={docid} />
      <Link href={`/article/${docid}`}><a>Details page</a></Link>
    </div>
  }
  return <Callout icon="alert" title="Invalid docid"
    intent="warning">
    A valid docid is 24 characters long!
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
