import { applyMiddleware, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly"
import thunkMiddleware from "redux-thunk"

import rootReducers from "./reducers/rootReducers"

const getMiddleware = () => {
  return applyMiddleware(thunkMiddleware)
}

export const store = createStore(rootReducers, composeWithDevTools(getMiddleware()))
