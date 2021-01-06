import React, { Fragment } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import routes from './routes';
import { Provider } from 'react-redux'
import { store } from './store.js'
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import common_en from "./translations/en/common.json"
import common_vn from "./translations/vn/common.json"

i18next.init({
  interpolation: { escapeValue: false },  // React already does escaping
  lng: 'vn',                              // language to use
  resources: {
      en: {
          common: common_en               // 'common' is our custom namespace
      },
      vn: {
          common: common_vn
      },
  },
});

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
        <I18nextProvider i18n={i18next}>
          <Provider store={store}>
            <div className="app">   
                <Switch>
                    { this.showContentMenu(routes) }
                </Switch>
            </div>
          </Provider>
        </I18nextProvider>
      </Router>
    );
  } 
  
};

ReactDOM.render(<App />, document.getElementById('__root'))