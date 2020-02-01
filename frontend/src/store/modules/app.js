import { i18n } from 'boot/i18n'

const getDefaultState = () => {
  return {
    language: 'ru'
  }
}
const state = getDefaultState()

const getters = {
  // isLogin: state => (!!state.address && !!state.address.length),
}

const mutations = {
  RESET_APP: state => {
    Object.assign(state, getDefaultState())
  },
  SET_LANG: (state, payload) => {
    i18n.locale = payload
    state.language = payload
  }
}

const actions = {
  // s
}

export default {
  state,
  getters,
  mutations,
  actions
}
