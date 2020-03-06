<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <header-app />
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <router-view></router-view>
      </transition>
    </q-page-container>

    <q-dialog v-model="sending" size="md" position="bottom">
      <q-card class="dialog-min300 text-center">
        <q-card-section>
          <div>
            <q-spinner-puff size="5em" />
          </div>
          <div class="text-h6 text-center">{{ $t('Sending') }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="txError" size="md" position="bottom">
      <q-card class="dialog-min300 text-center">
        <q-card-section>
          <div>
            <q-icon color="negative" name="error_outline" size="5em" />
          </div>
          <div class="text-h6">{{ $t('Payment was failed!') }}</div>
          <div class="text-subtitle1">{{ txErrorData }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import headerApp from '../components/HeaderApp.vue'
import { wordlists } from 'bip39'
import { mapState } from 'vuex'
import { generateMnemonic, walletFromMnemonic, isValidMnemonic } from 'minterjs-wallet'
export default {
  name: 'App',
  components: {
    'header-app': headerApp
  },
  data () {
    return {
      mnemonic: null,
      wallet: null,
      address: null,
      from: null,
      message: null
    }
  },
  created () {
    if (this.$route.query.f && this.$route.query.f !== '') this.from = this.$route.query.f
    if (this.$route.query.m && this.$route.query.m !== '') this.message = this.$route.query.m
    this.$store.commit('SAVE_MESSAGE', {
      from: this.from,
      message: this.message
    })
    // if (this.$route.query.from && this.$route.query.from !== '') this.from = this.$route.query.from
    // if (this.$route.query.message && this.$route.query.message !== '') this.message = this.$route.query.message
    this.$store.dispatch('FETCH_PRODUCTS')
    this.$store.dispatch('GET_SERTIFICATES')

    if (this.$route.params.seed && this.$route.params.seed !== '') {
      const mnemonic = this.$route.params.seed.split('.').map(n => wordlists.english[n]).join(' ')
      if (isValidMnemonic(mnemonic)) {
        const wallet = walletFromMnemonic(mnemonic)
        this.$store.commit('SAVE_WALLET', {
          seedkey: this.$route.params.seed,
          mnemonic: mnemonic,
          address: wallet.getAddressString(),
          privateKey: wallet.getPrivateKeyString()
        })
        this.$store.dispatch('FETCH_BALANCE')
        // const path = '/' + this.$route.params.seed + '/'
        // if (this.$route.path !== path) this.$router.push(path)
      }
    } else {
      const mnemonic = generateMnemonic()
      const wallet = walletFromMnemonic(mnemonic)
      const seedkey = mnemonic.split(' ').map(word => wordlists.english.indexOf(word)).join('.')
      this.$store.commit('SAVE_WALLET', {
        seedkey: seedkey,
        mnemonic: mnemonic,
        address: wallet.getAddressString(),
        privateKey: wallet.getPrivateKeyString()
      })
      this.$store.dispatch('FETCH_BALANCE')
      const path = '/' + seedkey + '/recive'
      if (this.$route.path !== path) this.$router.push(path)
    }
  },
  computed: {
    ...mapState({
      currency: state => state.api.currency,
      language: state => state.app.language,
      balance: state => state.api.balance,
      txErrorData: state => state.wallet.txErrorData
    }),
    sending: {
      get () {
        return this.$store.state.wallet.sending
      },
      set (value) {
        this.$store.commit('SET_SENDING', value)
      }
    },
    txError: {
      get () {
        return this.$store.state.wallet.txError
      },
      set (value) {
        this.$store.commit('SET_TXERROR', value)
      }
    }
  }
}
</script>
