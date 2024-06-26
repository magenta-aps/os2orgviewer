import "whatwg-fetch"
import spinner from "../spinner/Spinner.js"
import router from "../../router.js"
import store from "../../store.js"
import { initKeycloak } from "../../keycloak.js"

let loadstack = []

const api_url = OC_GLOBAL_CONF.VUE_APP_API_BASEURL
  ? OC_GLOBAL_CONF.VUE_APP_API_BASEURL
  : "https://moratest.magenta.dk"

function authFetch(url, args) {
  function addAuthHeader(args) {
    if (args.headers === undefined) {
      args.headers = { Authorization: `Bearer ${store.state.access_token}` }
    } else {
      args.headers["Authorization"] = `Bearer ${store.state.access_token}`
    }
  }

  // Make sure access_token has been retrieved
  if (store.state.access_token === undefined) {
    return initKeycloak().then(() => {
      addAuthHeader(args)
      return fetch(url, args)
    })
  }

  addAuthHeader(args)
  return fetch(url, args)
}

function startSpin() {
  loadstack.push(true)
  if (loadstack.length > 0) {
    spinner.spinOn()
    store.commit("setLoading", true)
  }
}

function stopSpin() {
  loadstack.pop()
  if (loadstack.length < 1) {
    spinner.spinOff()
    store.commit("setLoading", false)
  }
}

function getExternal(url) {
  startSpin()
  return authFetch(url, { method: "GET" })
    .then((response) => {
      return response.json()
    })
    .then((res) => {
      stopSpin()
      return res
    })
    .catch((err) => {
      stopSpin()
      console.error(err)
      router.push("/error")
    })
}

function postQuery(query, version = 22) {
  startSpin()

  return authFetch(`${api_url}/graphql/v${version}`, {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query), // body data type must match "Content-Type" header
  })
    .then((response) => {
      return response.json()
    })
    .then((res) => {
      stopSpin()
      return res.data
    })
    .catch((err) => {
      stopSpin()
      console.error(err)
      router.push("/error")
    })
}

export { postQuery, getExternal }
