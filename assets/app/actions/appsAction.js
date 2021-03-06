import axios from 'axios';

export const createNewApp = params => {
  return dispatch => {
    axios.post(`api/private/create_app`, params )
    .then(res => {
      if (res.status === 200 && res.data.success === true) {
        dispatch({
          type: "CREATE_NEW_APP",
          payload: res.data.apps
        })
      }
    })
    .catch(err => {
      console.log(err, "err")
    })
  }
}

export const getApps = params => {
  return dispatch => {
    axios.get(`api/private/get_apps`, params)
    .then(res => {
      dispatch({
        type: "GET_APPS",
        payload: res.data.apps
      })
    })
  }
}
export const removeApp = params => {
  return dispatch => {
    axios.post(`api/private/remove_app`, {id: params})
    .then(res => {
      if (res.status === 200 && res.data.success === true) {
        dispatch({
          type: "REMOVE_APP",
          payload: params
        })  
      }
    })
    .catch(err => {
      console.log(err, "error remove app")
    })
  }
}
export const editApp = params => {
  return dispatch => {
    axios.post(`api/private/edit_app`, params)
    .then(res => {
      if (res.status === 200 && res.data.success === true) {
        dispatch({
          type: "EDIT_APP",
          payload: params
        })
      }
    })
    .catch(err => {
      console.log(err, "err")
    })
  }
}

