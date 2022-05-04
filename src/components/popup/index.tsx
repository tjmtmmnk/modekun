import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./HomePage";
import { NgWordPage, NgWordBulkInsertPage } from "./NgWordPage";
import { Navigation } from "./Navigation";
import { OptionPage } from "./OptionPage";
import { IParameterV2 } from "../../config";

interface PopupPageProps {
  param: IParameterV2;
  isLoading: boolean;
}

export default function PopupPage(props: PopupPageProps) {
  const { param, isLoading } = props;
  return isLoading ? (
    <span>Loading...</span>
  ) : (
    <Router>
      <Navigation />
      <Switch>
        <Route path="/ngword/bulk">
          <NgWordBulkInsertPage param={param} />
        </Route>
        <Route path="/ngword">
          <NgWordPage param={param} />
        </Route>
        <Route path="/option">
          <OptionPage param={param} />
        </Route>
        <Route path="/">
          <HomePage param={param} />
        </Route>
      </Switch>
    </Router>
  );
}
