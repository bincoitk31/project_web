import React, { Fragment } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import routes from './routes';
import { Provider } from 'react-redux'
import { store } from './store.js'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
  }
  showContentMenu = (routes) => {
    var result = null;

    if (routes.length > 0) {
        result = routes.map((route, index) => {
            return (
              <Route 
                  key={index} 
                  path={route.path} 
                  exact={route.exact} 
                  component={route.main} 
              />
            );
        });
    }

    return result;
  }

  render() {
    return (
      <Router>
        <Provider store={store}>
          <div className="app">
             
              <Switch>
                  { this.showContentMenu(routes) }
              </Switch>
          </div>
        </Provider>
      </Router>
    );
  } 
  
};

ReactDOM.render(<App />, document.getElementById('__root'))