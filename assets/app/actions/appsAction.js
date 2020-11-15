import axios from 'axios';

export const createNewApp = params => {
  return dispatch => {
    axios.post(`api/private/create_app`, params )
    .then(res => {
      console.log(res, "res create app")
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
      console.log(res, "get app")
      dispatch({
        type: "GET_APPS",
        payload: res.data.apps
      })
    })
  }
}


