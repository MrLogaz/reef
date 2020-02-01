import axios from 'axios'

const getDefaultState = () => {
  return {
    explorerApi: 'https://explorer-api.minter.network/api/v1/',
    reefApi: 'http://push.reef.mn/api/',
    currency: null,
    balance: null,
    balanceJSON: {}
  }
}
const state = getDefaultState()

const getters = {
}

const mutations = {
  SET_DEV: (state) => {
    console.log('SET_DEV')
    state.reefApi = 'http://localhost:3000/api/'
  },
  RESET_API: state => {
    Object.assign(state, getDefaultState())
  },
  SET_CURRENCY: (state, payload) => {
    if (!state.currency) state.currency = {}
    state.currency['BIPRUB'] = payload.RUB
  },
  SET_BALANCE: (state, payload) => {
    let tmpJson = {}
    payload.balances.forEach((item) => {
      tmpJson[item.coin] = item.amount
    })
    state.balanceJSON = tmpJson
    state.balance = payload
  }
}

const actions = {
  // FETCH_BALANCE_ADDRESS: async (context, payload) => {
  //   let { data } = await axios.get(`${ state.explorerApi }addresses/${ payload }?withSum=true`)
  //   return data.data
  // },
  FETCH_BALANCE: async (context, payload) => {
    let { data } = await axios.get(context.state.explorerApi + 'addresses/' + context.rootState.wallet.address + '?withSum=true')
    context.commit('SET_BALANCE', data.data)
  },
  FETCH_CURRENCY: async (context, payload) => {
    let { data } = await axios.get(context.state.reefApi + 'services/biptophone/')
    context.commit('SET_CURRENCY', data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
