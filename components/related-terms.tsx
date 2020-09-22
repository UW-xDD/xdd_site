import React from "react";
import dynamic from "next/dynamic";
import "@macrostrat/ui-components/lib/esm/index.css";
import "@blueprintjs/core/lib/css/blueprint.css";

/* These async functions create dynamically-loaded components that
support next.js server-side rendering */

const loadAPIResultView = async function () {
  const mod = await import("@macrostrat/ui-components");
  return mod.APIResultView;
};
const APIResultView = dynamic(loadAPIResultView, { ssr: false });

const loadRelatedTerms = async function () {
  const mod = await import("@macrostrat/ui-components");
  return mod.GeoDeepDiveRelatedTerms;
};
const GddRelatedTerms = dynamic(loadRelatedTerms, { ssr: false });

const renderRelatedTerms = (res) => {
  const related_terms = res.success;
  return <GddRelatedTerms {...related_terms} />;
};

const RelatedTermsView = (props) => {
  const { searchString, debounce } = props;

  if (searchString == null || searchString == "") return null;
  return (
    <APIResultView
      route="https://geodeepdive.org/api/similar_terms"
      params={{ term: searchString }}
      debounce={debounce}
    >
      {renderRelatedTerms}
    </APIResultView>
  );
};

export { RelatedTermsView };
