import React, { useEffect } from "react";
import h from "react-hyperscript";
import Nav from "./nav";
import "./main.styl";

// Stuff for basic UI setup
import "core-js/stable";
import "regenerator-runtime/runtime";

import { FocusStyleManager } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@macrostrat/ui-components/lib/esm/index.css";

FocusStyleManager.onlyShowFocusOnTabs();

const TitleBlock = () => {
  return (
    <div className="page-title">
      <h1>xDD</h1>
      <h3>
        A digital assistant to <em>extract knowledge</em> from the{" "}
        <em>published literature</em>.
      </h3>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="logo">
      <img src="/static/xdd-logo-candidate.png" alt="xdd logo" />
    </div>
  );
};

const Footer = () => {
  return (
    <footer>
      <b>xDD</b> is a project of University of Wisconsin — Madison.
    </footer>
  );
};

const SideBar = () => {
  return (
    <aside className="sidebar">
      <img src="/static/xdd-logo-candidate.png" alt="xdd logo" />
      <TitleBlock />
      <Nav />
    </aside>
  );
};

const BasePage = (props) => {
  const { title, fixedHeader, ...rest } = props;
  const header = fixedHeader ? "header#fixed-header" : "header";

  useEffect(() => {
    document.title = title;
  }, [title]);

  return h("div#main", [
    h(header, [h(Logo), h("div.header-text", [h(TitleBlock), h(Nav)])]),
    h("div.page-body", rest),
    h(Footer),
  ]);
};

export default BasePage;
