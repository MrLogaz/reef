import axios from 'axios'
// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const getDefaultState = () => {
  return {
    explorerApi: 'https://explorer-api.minter.network/api/v1/',
    reefApi: 'https://push.reef.mn/api/',
    currency: null,
    balance: null,
    balanceJSON: {},
    categories: null,
    products: null
  }
}
const state = getDefaultState()

const getters = {
  getCategory: state => categoryId => {
    let catId = state.categories.findIndex(item => item.id === parseInt(categoryId))
    return state.categories[catId]
  },
  getProducts: state => categoryId => state.products.filter(item => item.categories.includes(parseInt(categoryId))),
  getProduct: state => productId => state.products.find(item => item.id === parseInt(productId))
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
    state.currency['biptorub'] = payload.biptorub
  },
  SET_BALANCE: (state, payload) => {
    let tmpJson = {}
    payload.balances.forEach((item) => {
      tmpJson[item.coin] = item.amount
    })
    state.balanceJSON = tmpJson
    state.balance = payload
  },
  SET_PRODUCTS: (state, payload) => {
    state.categories = payload.categories
    state.products = payload.products
  }
}

const actions = {
  SAVE_WALLET_PUSH: async (context, payload) => {
    let { data } = await axios.post(context.state.reefApi + 'wallet', payload)
    return data
  },
  SEND_EMAIL: async (context, payload) => {
    let { data } = await axios.post(context.state.reefApi + 'email/solo', payload)
    return data.data
  },
  SEND_CHECK: async (context, payload) => {
    let { data } = await axios.post(context.state.reefApi + 'strategy/giftery/pay', payload)
    return data
  },
  FETCH_BALANCE: async (context, payload) => {
    let { data } = await axios.get(context.state.explorerApi + 'addresses/' + context.rootState.wallet.address + '?withSum=true')
    context.commit('SET_BALANCE', data.data)
  },
  FETCH_CURRENCY: async (context, payload) => {
    let { data } = await axios.get(context.state.reefApi + 'currency')
    context.commit('SET_CURRENCY', data)
  },
  FETCH_PRODUCTS: async (context, payload) => {
    let { data } = await axios.get(context.state.reefApi + 'strategy/giftery/products')
    context.commit('SET_PRODUCTS', data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
