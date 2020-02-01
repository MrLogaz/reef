import axios from 'axios'

const getDefaultState = () => {
  return {
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
  }
}

const actions = {
  BIPTOPHONE_CODE: async (context, payload) => {
    let { data } = await axios.post(context.rootState.api.reefApi + 'services/biptophone/code', payload)
    return data
  },
  BIPTOPHONE_VALIDATE: async (context, payload) => {
    let { data } = await axios.post(context.rootState.api.reefApi + 'services/biptophone/validate', payload)
    return data
  }
  // s
}

export default {
  state,
  getters,
  mutations,
  actions
}
