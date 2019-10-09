import React, {createContext, Component} from 'react'
import Head from 'next/head'
import BasePage from '../components/base-page'
import dynamic from 'next/dynamic'
import "@macrostrat/ui-components/lib/index.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import {InputGroup, Callout} from "@blueprintjs/core"

const loadCard = async function(){
  const mod = await import('@macrostrat/ui-components')
  return mod.GDDReferenceCard
}

const GDDReferenceCard = dynamic(loadCard, { ssr: false });

const DocIDView = (props)=>{
  const {searchString} = props;
  let docid = null;
  if (searchString.length == 24) {
    docid = searchString;
  }
  if (docid != null) {
    return <GDDReferenceCard docid={docid} />
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
      searchString: "58b6b0dfcf58f110b18271ae"
    }
    this.updateSearchString = this.updateSearchString.bind(this)
  }
  render() {
    const {user} = this.context;
    return <BasePage title="article search">
      <InputGroup
        className="main-search"
        placeholder="Enter a docid"
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

