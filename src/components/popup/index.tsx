import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./HomePage";
import { NgWordPage } from "./NgWordPage";
import { Navigation } from "./Navigation";
import { IParameter } from "../../config";

export default function PopupPage(props: { params: IParameter }) {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route path="/ngword">
          <NgWordPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}
