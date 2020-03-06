import { i18n } from 'boot/i18n'
import axios from 'axios'
import { Cookies } from 'quasar'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const getDefaultState = () => {
  return {
    productRoute: {},
    language: 'en-us',
    username: null,
    from: null,
    message: null,
    certificates: null
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
    Cookies.set('language', payload)
  },
  SAVE_MESSAGE: (state, payload) => {
    console.log(payload)
    state.from = payload.from
    state.message = payload.message
  },
  CLEAR_SERTIFICATES: (state, payload) => {
    state.certificates = null
    localStorage.removeItem('certificates')
  },
  ADD_SERTIFICATES: (state, payload) => {
    state.certificates.unshift({
      hash: payload.hash,
      name: payload.name,
      face: payload.face
    })
    localStorage.setItem('certificates', JSON.stringify(state.certificates))
  },
  SET_SERTIFICATES: (state, payload) => {
    if (!payload) payload = []
    state.certificates = payload
  }
}

const actions = {
  GET_SERTIFICATES: (context, payload) => {
    let certificates = JSON.parse(localStorage.getItem('certificates'))
    context.commit('SET_SERTIFICATES', certificates)
  },
  LOAD_SERTIFICATE: async (context, payload) => {
    await sleep(5000)
    try {
      let { data } = await axios.post(context.rootState.api.reefApi + 'strategy/giftery/certificate', { hash: payload })
      return data
    } catch (error) {
      console.log('error', error)
      context.dispatch('LOAD_SERTIFICATE', payload)
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
