import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from './components/Header';

import PagesWelcome from './routes/Pages/PagesWelcome';
import PagesAcceptInvite from './routes/Pages/PagesAcceptInvite';
import UsersNew from './routes/Users/UsersNew';
import UsersIndex from './routes/Users/UsersIndex';
import RegistryEntitiesNew from './routes/RegistryEntities/RegistryEntitiesNew';
import RegistryEntitiesIndex from './routes/RegistryEntities/RegistryEntitiesIndex';
import PagesExplorer from './routes/Pages/PagesExplorer';

class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      current_user_role: undefined,
      query_params: this.parse_query_params(props)
    };

    if (this.state.query_params.email && this.state.query_params.token) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/users/check_token?email=${this.state.query_params.email}&token=${this.state.query_params.token}`)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              token_is_valid: result.token_is_valid
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            console.error(error);
          }
        )
    }
  }

  parse_query_params () {
    let query_params_str = window.location.search.split('?')[1];
    if (query_params_str) {
      let query_params = {};
      query_params_str.split('&').map( (query_param) => {
        let [ k, v ] = query_param.split('=');
        query_params[k] = v;
      });
      return query_params;
    } else {
      return {};
    }
  }

  render () {
    return (
      <div className="App">
        <Router>
          <Header current_user_role={this.state.current_user_role} token_is_valid={this.state.token_is_valid} />
          
          <Route path="/" exact                  render={(props) => <PagesWelcome app={this} {...props} />} />
          <Route path="/invites/accept"          render={(props) => <PagesAcceptInvite app={this} {...props} />} />
          <Route path="/users/new"               component={UsersNew} />
          <Route path="/users/index"             component={UsersIndex} />
          <Route path="/registry_entities/index" render={(props) => <RegistryEntitiesIndex current_user_role={this.state.current_user_role} token_is_valid={this.state.token_is_valid} {...props} /> } />
          <Route path="/registry_entities/new"   component={RegistryEntitiesNew} />
          <Route path="/explorer"                component={PagesExplorer} />
        </Router>
      </div>
    )
  }
}

export default App;
