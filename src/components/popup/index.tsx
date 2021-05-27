import React from "react";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import { KEY_NG_WORDS } from "../../config";
import { NgWord } from "./NgWord";
import { IParameter } from "../../moderate";
import { MainPage } from "./MainPage";

export default function PopupPage(props: { params: IParameter }) {
  const { params } = props;
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/ngword">NG words</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/ngword">
            <NgWord storageKey={KEY_NG_WORDS} defaultValue={params.ng_words} />
          </Route>
          <Route path="/">
            <MainPage params={params} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
