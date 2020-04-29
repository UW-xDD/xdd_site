import React, {createContext, useState, Component, useEffect} from 'react';
import debounce from 'lodash.debounce';
import Head from 'next/head'
import BasePage from '../components/base-page'
import dynamic from 'next/dynamic'
import h from '@macrostrat/hyper'
import "@macrostrat/ui-components/lib/esm/index.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import { InputGroup, Callout, Button, Intent, Spinner } from "@blueprintjs/core"
import { useSearchString } from '../components/search'
import { LinkCard } from '../components/link-card'
import { useRouter } from 'next/router';

let ROUTE = "https://geodeepdive.org/api/snippets";

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
    return <ul>{highlights.slice(0,5).map( (highlight, index) => {
        return <Highlight highlight={highlight} key={index} />
    })}
    </ul>
};

const PaperResult = ({paper}) => {
    return <LinkCard key={paper._gddid} className={`${paper._gddid} hit`} href={`/article/${paper._gddid}`}>
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
    const { numberOfResults, data} = props;

    if (data == null || data.length == 0) return h('div.results', null, h(Spinner));

    let results = {};
    data.map ( (art) => {
        if ( !(art["pubname"] in results) ) {
            results[art['pubname']] = []
        }
        results[art['pubname']].push(art)
    } );

    let countItem = null;
    if (numberOfResults > 0) {
        countItem = <div className="flex-end"><p className="count">{`${numberOfResults} articles found.`}</p></div>
    }

    return <div className='results'>
        {countItem}
        <div className="snippets">
            {data.map((d,i) => h(SnippetResultsPage, {data: d, key: i}))}
        </div>
    </div>
};


const RelatedTermsView = (props) => {
    const {searchString, debounce} = props;

    if (searchString != null && searchString != '') {
        return <APIResultView
            route="https://geodeepdive.org/api/similar_terms"
            params={{"term": searchString}}
            debounce={debounce}>{renderRelatedTerms}</APIResultView>
    }
    return null
};



const ResultView = (props)=> {
    const [data, setData] = useState({
        params: { term: '', full_results: true, inclusive: true, article_limit: 2 },
        success: null,
        hits: 0 }
        );
    // const [loading, setLoading] =  useState(false);

    const { searchString } = props;


    useEffect( () => {
        setData({
            params: {...data.params, term: searchString },
            success: null,
            hits: 0
        });

        // setLoading(true);

    }, [searchString]);


    if(searchString == null || searchString == '') {
        return <Callout icon="search-text" title="Snippets" intent="primary">
            Search xDD for contextual use of a term or phrase.
        </Callout>
    }


    function setDataState(response) {
        if(response && response.success) {
            // setLoading( false);

            setData({
                ...data,
                success: response.success,
                hits: response.success.hits
            });
        }
    }

    const handleResponse = (response) => {
        if(response && response.success) {
            setDataState(response);
            return response.success;
        }
    };


    const handleGetItems = (response) => {
        if(response.success && response.success.data) {
            setDataState(response);
            return [response.success.data];
        }
    };


    const handleGetNextParams = (response) => {
        const { scrollId } = response?.success;
        if (scrollId == null || scrollId == "") return null;
        setDataState(response);
        return { scroll_id: scrollId }
    };


    return <InfiniteScrollView
        route={ ROUTE }
        params={ data.params }
        unwrapResponse={ handleResponse }
        getNextParams={ handleGetNextParams }
        getItems={ handleGetItems }
    >
        <SnippetResults numberOfResults={ data.hits } />
    </InfiniteScrollView>

};


export default function SnippetsPage() {
    const [inputValue, setInputValue] = useState("");
    const [path, setPath] = useState("/snippets");
    const [searchString, setSearchString] = useState("");
    const router = useRouter();

    useEffect( () => {
        router.push(path, path, {shallow: true});
    }, [path]);


    function handleInputValueChange(e) {
        if (e.target.value !== '') {
            setPath('/snippets?search=' + e.target.value);
        } else {
            setPath("/snippets");
        }

        setInputValue(e.target.value);
    }

    function initiateSearch() {
        setSearchString(inputValue);
    }


    return<BasePage title="Snippets Search" fixedHeader={true}>
        <div className="search-bar">
            <InputGroup
                className="main-search"
                placeholder="Enter a search term"
                leftIcon="search"
                large
                value={inputValue}
                onChange={handleInputValueChange}
                onKeyPress={event => {
                    if (event.key === 'Enter') {
                        initiateSearch()
                    }
                }}
            />

            <Button icon='arrow-right' large onClick={() => {
                initiateSearch()
            }}/>
        </div>

        <ResultView searchString={searchString}/>

    </BasePage>
};
