import axios from 'axios'
import Big from 'big.js'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const getDefaultState = () => {
  return {
    explorerApi: 'https://explorer-api.minter.network/api/v1/',
    reefApi: 'https://reef.mn/api/',
    currency: null,
    balance: null,
    balanceJSON: { BIP: 0 },
    balanceBIP: 0,
    balanceUSD: 0,
    balanceRUB: 0,
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
    state.reefApi = 'http://localhost:3000/api/'
  },
  RESET_API: state => {
    Object.assign(state, getDefaultState())
  },
  SET_CURRENCY: (state, payload) => {
    if (!state.currency) state.currency = {}
    state.currency['biptorub'] = payload.biptorub
  },
  SET_BALANCE: async (state, payload) => {
    let tmpJson = { BIP: 0 }
    payload.balances.forEach((item) => {
      tmpJson[item.coin] = item.amount
    })
    if (payload.available_balance_sum > 0) {
      let currencyUSD = Big(payload.available_balance_sum_usd).div(payload.available_balance_sum)
      state.balanceUSD = Big(tmpJson.BIP).times(currencyUSD).round(2)
    }
    state.balanceJSON = tmpJson
    state.balanceBIP = Big(tmpJson.BIP)
    if (state.currency && state.currency.biptorub) {
      state.balanceRUB = Big(tmpJson.BIP).times(state.currency.biptorub).round(2)
    } else {
      await sleep(2000)
      state.balanceRUB = Big(tmpJson.BIP).times(state.currency.biptorub).round(2)
    }
    state.balance = payload
  },
  SET_PRODUCTS: (state, payload) => {
    state.categories = payload.categories
    state.products = payload.products
  }
}

const actions = {
  REEF_API: async (context, payload) => {
    let { data } = await axios.post(context.state.reefApi + 'strategy/' + payload[0] + '/' + payload[1], payload[2])
    return data
  },
  SEND_CHECK: async (context, payload) => {
    let { data } = await axios.post(context.state.reefApi + 'strategy/' + payload.strategy + '/pay', payload)
    return data
  },
  FETCH_DEEPLINK: async (context, payload) => {
    let { data } = await axios.get('https://push.money/api/deeplink?address=' + payload.address + '&amount=' + payload.amount + '&coin=bip')
    return data
  },
  FETCH_BALANCE: async (context, payload) => {
    if (context.rootState.wallet.address && context.rootState.wallet.address.length > 20) {
      let { data } = await axios.get(context.state.explorerApi + 'addresses/' + context.rootState.wallet.address + '?withSum=true')
      context.commit('SET_BALANCE', data.data)
    }
  },
  FETCH_CURRENCY: async (context, payload) => {
    let { data } = await axios.get(context.state.reefApi + 'currency')
    context.commit('SET_CURRENCY', data)
  },
  FETCH_PRODUCTS: async (context, payload) => {
    let { data } = await axios.post(context.state.reefApi + 'strategy/giftery/products')
    context.commit('SET_PRODUCTS', data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
