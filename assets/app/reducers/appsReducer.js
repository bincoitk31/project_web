import produce from "immer"
import update from "immutability-helper"

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

    }
  })
}