import React, { useState, useEffect } from "react";
import h from "@macrostrat/hyper";
import { Callout, Spinner } from "@blueprintjs/core";
import { LinkCard } from "./link-card";
import { InfiniteScrollView } from "@macrostrat/ui-components";

let ROUTE = "https://geodeepdive.org/api/snippets";

const Highlight = ({ highlight }) => {
  return <li dangerouslySetInnerHTML={{ __html: highlight }} />;
};

const Highlights = ({ highlights }) => {
  if (highlights == null) return null;
  return (
    <ul>
      {highlights.slice(0, 5).map((highlight, index) => {
        return <Highlight highlight={highlight} key={index} />;
      })}
    </ul>
  );
};

const PaperResult = ({ paper }) => {
  return (
    <LinkCard
      key={paper._gddid}
      className={`${paper._gddid} hit`}
      href={`/article/${paper._gddid}`}
    >
      <h2>{paper.title}</h2>
      <Highlights highlights={paper.highlight} />
    </LinkCard>
  );
};

const PublicationSnippets = (props) => {
  const { name, papers } = props;
  const inner = papers.map((paper, i) => h(PaperResult, { key: i, paper }));

  return h("div.publication", [h("h1.journal-title", name), h("div", inner)]);
};

const SnippetResultsPage = (props) => {
  /** Snippets page that sorts by journal title */
  const { data } = props;
  if (data == null || data.length == 0) return null;

  let results = {};
  data.map((art) => {
    if (!(art["pubname"] in results)) {
      results[art["pubname"]] = [];
    }
    results[art["pubname"]].push(art);
  });
  const pubNames = Object.keys(results);

  return (
    <div className="snippets-page">
      {pubNames.map((pub, i) =>
        h(PublicationSnippets, { name: pub, papers: results[pub], key: i })
      )}
    </div>
  );
};

const ResultsCount = ({ numberOfResults }) => {
  if (numberOfResults == 0) return null;
  return (
    <div className="flex-end">
      <p className="count">{`${numberOfResults} articles found.`}</p>
    </div>
  );
};

const SnippetResults = (props) => {
  const { data } = props;

  if (data == null || data.length == 0)
    return h("div.results", null, h(Spinner));

  let results = {};
  data.map((art) => {
    if (!(art["pubname"] in results)) {
      results[art["pubname"]] = [];
    }
    results[art["pubname"]].push(art);
  });

  return (
    <div className="results">
      <div className="snippets">
        {data.map((d, i) => h(SnippetResultsPage, { data: d, key: i }))}
      </div>
    </div>
  );
};

const ResultView = (props) => {
  const [data, setData] = useState({
    params: { term: "", full_results: true, inclusive: true, article_limit: 2 },
    success: null,
    hits: 0,
  });

  const { searchString } = props;

  useEffect(() => {
    setData({
      params: { ...data.params, term: searchString },
      success: null,
      hits: 0,
    });
  }, [searchString]);

  if (searchString == null || searchString == "") {
    return (
      <Callout icon="search-text" title="Snippets" intent="primary">
        Search xDD for contextual use of a term or phrase.
      </Callout>
    );
  }

  function setDataState(response) {
    if (response && response.success) {
      // setLoading( false);

      setData({
        ...data,
        success: response.success,
        hits: response.success.hits,
      });
    }
  }

  const handleResponse = (response) => {
    if (response && response.success) {
      setDataState(response);
      return response.success;
    }
  };

  const handleGetItems = (response) => {
    if (response.success && response.success.data) {
      setDataState(response);
      return [response.success.data];
    }
  };

  const handleGetNextParams = (response) => {
    const { scrollId } = response?.success;
    if (scrollId == null || scrollId == "") return null;
    setDataState(response);
    return { scroll_id: scrollId };
  };

  const hasMore = (res) => {
    const { scrollId } = res?.success;
    // Override to short-circuit "load everything" bug
    return scrollId != null && scrollId != "";
  };

  return (
    <div>
      <ResultsCount numberOfResults={data.hits} />
      <InfiniteScrollView
        className={"infinite-scroll-view"}
        route={ROUTE}
        params={data.params}
        unwrapResponse={handleResponse}
        getNextParams={handleGetNextParams}
        getItems={handleGetItems}
        hasMore={hasMore}
      >
        <SnippetResults />
      </InfiniteScrollView>
    </div>
  );
};

export { ResultView };
