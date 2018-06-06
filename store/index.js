const cookieparser = require("cookieparser")
import axios from "axios"
import { COMBO_DATA_URL } from "~/utils/apis"

export const state = () => ({
  sidebar: false,
  user: {},
  token: null,
  currentEdit: null,
  comboData: null
})

export const mutations = {
  toggleSidebar(state) {
    state.sidebar = !state.sidebar
  },
  user(state, p) {
    state.user = p
  },
  token(state, p) {
    state.token = p
  },
  currentEdit(state, p) {
    state.currentEdit = p
  },
  comboData(state, p) {
    state.comboData = p
  }
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let token = null
    let user = null

    if (req.headers.cookie) {
      let parsed = cookieparser.parse(req.headers.cookie)
      let data = JSON.parse(parsed.lj_token)
      token = data.token
      user = data.user
    }
    commit("token", token)
    commit("user", user)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  },
  async populateComboData({ commit }, model) {
    try {
      console.log('populateComboData') //eslint-disable-line
      const resp = await axios
        .get(COMBO_DATA_URL + "?model=" + model)
        .then(res => res.data)

        console.log(resp) //eslint-disable-line
      commit("comboData", resp)
    } catch (e) {
      console.log(e) //eslint-disable-line
    }
  }
}
