import React from "react";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import { KEY_NG_WORDS } from "../../config";
import { NgWord } from "./NgWord";
import { IParameter } from "../../moderate";
import { HomePage } from "./HomePage";
import { NgWordPage } from "./NgWordPage";
import { Navigation } from "./Navigation";

export default function PopupPage(props: { params: IParameter }) {
  const { params } = props;
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route path="/ngword">
          <NgWordPage params={params} />
        </Route>
        <Route path="/">
          <HomePage params={params} />
        </Route>
      </Switch>
    </Router>
  );
}
