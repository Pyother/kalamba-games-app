import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Article from "./pages/Article";
import ArticleList from "./pages/ArticleList";
import LoginRegister from "./pages/LoginRegister";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";

function App(): JSX.Element {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/login" exact component={LoginRegister} />
          <Route path="/logout" exact component={Logout} />
          <Route path="/profile/:username" exact component={Profile} />
          <Route path="/:slug" exact component={Article} />
          <Route path="/" component={ArticleList} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
