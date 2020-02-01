import { Minter, SendTxParams, DelegateTxParams, SellTxParams, BuyTxParams } from 'minter-js-sdk'

const getDefaultState = () => {
  return {
    address: null,
    publicKey: null,
    privateKey: null,
    mnemonic: null,
    minterGate: null,
    sending: false,
    txReady: false
  }
}

const state = getDefaultState()

const getters = {
}

const mutations = {
  RESET_WALLET: state => {
    Object.assign(state, getDefaultState())
  },
  SAVE_WALLET: (state, payload) => {
    state.address = payload.address
    // state.publicKey = payload.publicKey
    state.privateKey = payload.privateKey
    state.mnemonic = payload.mnemonic
  },
  SAVE_GATE: (state) => {
    state.minterGate = new Minter({ apiType: 'gate', baseURL: 'https://gate-api.minter.network/api/v1/' })
    // state.minterGate = new Minter({ apiType: API_TYPE_NODE, baseURL: 'https://api.minter.stakeholder.space/' })
  },
  SET_SENDING: (state, payload) => {
    state.sending = payload
  },
  SET_TXREADY: (state, payload) => {
    state.txReady = payload
  }
}

const actions = {
  SENDER: (context, payload) => {
    payload.privateKey = context.state.privateKey
    payload.chainId = 1
    context.commit('SET_SENDING', true)
    let txParams = null
    switch (payload.txAction) {
      case 'SendTxParams':
        txParams = new SendTxParams(payload)
        break
      case 'DelegateTxParams':
        txParams = new DelegateTxParams(payload)
        break
      case 'SellTxParams':
        txParams = new SellTxParams(payload)
        break
      case 'BuyTxParams':
        txParams = new BuyTxParams(payload)
        break
      default:
        return false
    }
    return new Promise((resolve, reject) => {
      context.state.minterGate.postTx(txParams).then((txHash) => {
        console.log(payload.txAction + ' created: ' + txHash)
        context.commit('SET_SENDING', false)
        context.commit('SET_TXREADY', true)
        resolve(txHash)
      }).catch((error) => {
        context.commit('SET_SENDING', false)
        context.commit('SET_TXREADY', true)
        reject(error)
      })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
