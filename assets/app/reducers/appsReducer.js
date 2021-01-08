import produce from "immer"
import update from "immutability-helper"
import { findIndex } from "lodash"
const initState = {
  apps: []
}

export default (state = initState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case "CREATE_NEW_APP": {
        return update(state, {
          apps: { $set: action.payload }
        })
      }

      case "GET_APPS": {
        return update(state, {
          apps: { $set: action.payload }
        })
      }

      case "REMOVE_APP": {
        let idx = findIndex(state.apps, el => el.id == action.payload)
        return update(state, {
          apps: {$splice: [[idx, 1]] }
        })
      }

    }
  })
}