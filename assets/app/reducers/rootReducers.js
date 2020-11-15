  // reducers/rootReducers.js
  import { combineReducers } from 'redux';
  import appsReducer from './appsReducer';

  const rootReducer = combineReducers({
    appsReducer
  });

  export default rootReducer;