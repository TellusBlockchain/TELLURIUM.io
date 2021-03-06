import React from 'react';
import './App.css';

import { Router as Router, Route, Switch } from "react-router-dom";
import history from './history';

import Header from './components/Header';

import PagesWelcome          from './routes/Pages/PagesWelcome';
import PagesAcceptInvite     from './routes/Pages/PagesAcceptInvite';
import UsersNew              from './routes/Users/UsersNew';
import UsersProfile          from './routes/Users/UsersProfile';
import UsersIndex            from './routes/Users/UsersIndex';
import RegistryEntitiesNew   from './routes/RegistryEntities/RegistryEntitiesNew';
import RegistryEntitiesIndex from './routes/RegistryEntities/RegistryEntitiesIndex';
import PagesExplorer         from './routes/Pages/PagesExplorer';

class App extends React.Component {
  constructor (props) {
    super(props);

    let current_user_role = localStorage.getItem('current_user_role');
    if (current_user_role != null) {
      current_user_role = current_user_role >> 0;
    }
    let token_is_valid    = localStorage.getItem('token_is_valid') === 'true';

    this.state = {
      current_user_role: current_user_role,
      query_params:      this.parse_query_params(props),
      token_is_valid:    token_is_valid
    };

    if (this.state.query_params.email && this.state.query_params.token) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/users/check_token?email=${this.state.query_params.email}&token=${this.state.query_params.token}`)
        .then(res => res.json())
        .then(
          (result) => {
            localStorage.setItem('token_is_valid', result.token_is_valid);
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
        <Router history={history}>
          <Header current_user_role={this.state.current_user_role} token_is_valid={this.state.token_is_valid} app={this} history={history} />
          
          <Switch>
            <Route path="/" exact                render={(props) => <PagesWelcome app={this} {...props} />} />
            <Route path="/invites/accept"        render={(props) => <PagesAcceptInvite app={this} {...props} />} />
            <Route path="/users/new"             component={UsersNew} />
            <Route path="/users/profile/my"      render={(props) => <UsersProfile app={this} {...props} />} />
            <Route path="/users"                 component={UsersIndex} />
            <Route path="/registry_entities/new" component={RegistryEntitiesNew} />
            <Route path="/registry_entities"     render={(props) => <RegistryEntitiesIndex current_user_role={this.state.current_user_role} token_is_valid={this.state.token_is_valid} {...props} /> } />
            <Route path="/explorer"              component={PagesExplorer} />
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;
