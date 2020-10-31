import React, { Fragment } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import routes from './routes';

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
          <div className="app">
              {/* Menu */}
             
              {/* Noi Dung */}
              <Switch>
                  { this.showContentMenu(routes) }
              </Switch>
          </div>
      </Router>
    );
  } 
  
};

ReactDOM.render(<App />, document.getElementById('__root'))