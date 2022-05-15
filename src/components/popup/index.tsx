import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./HomePage";
import { NgWordPage, NgWordBulkInsertPage } from "./NgWordPage";
import { Navigation } from "./Navigation";
import { OptionPage } from "./OptionPage";
import { IPopupState, PopupDispatch } from "../../popup";

interface PopupPageProps {
  state: IPopupState;
  dispatch: PopupDispatch;
}

export default function PopupPage(props: PopupPageProps) {
  const { state, dispatch } = props;
  return state.isLoading ? (
    <span>Loading...</span>
  ) : (
    <Router>
      <Navigation />
      <Switch>
        <Route path="/ngword/bulk">
          <NgWordBulkInsertPage param={state.param} popupDispatch={dispatch} />
        </Route>
        <Route path="/ngword">
          <NgWordPage param={state.param} popupDispatch={dispatch} />
        </Route>
        <Route path="/option">
          <OptionPage
            param={state.param}
            isUseSameParam={state.isUseSameParam}
            dispatch={dispatch}
          />
        </Route>
        <Route path="/">
          <HomePage param={state.param} dispatch={dispatch} />
        </Route>
      </Switch>
    </Router>
  );
}
