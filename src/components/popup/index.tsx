import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./HomePage";
import { NgWordPage, NgWordBulkInsertPage } from "./NgWordPage";
import { Navigation } from "./Navigation";
import { OptionPage } from "./OptionPage";

export default function PopupPage() {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route path="/ngword/bulk">
          <NgWordBulkInsertPage />
        </Route>
        <Route path="/ngword">
          <NgWordPage />
        </Route>
        <Route path="/option">
          <OptionPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}
