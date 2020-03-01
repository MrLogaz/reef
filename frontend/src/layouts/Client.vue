<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <header-app />
      <router-view />
    </q-page-container>

    <q-dialog v-model="sending" size="md" position="bottom">
      <q-card class="dialog-min300">
        <q-card-section class="row items-center">
          <q-spinner-facebook />
          <div class="text-h6 text-center q-pl-md">{{ $t('Sending') }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="txReady" size="md" position="bottom">
      <q-card class="dialog-min300 text-center">
        <q-card-section>
          <div>
            <q-icon color="secondary" name="done" size="5em" />
          </div>
          <div class="text-h6">{{ $t('Payment was successful!') }}</div>
          <div class="text-subtitle1">{{ $t('After a few seconds, the certificate will be ready') }}</div>
        </q-card-section>
        <!-- <q-card-section class="row items-center">
          <div class="text-h6 text-center">{{ $t('Success') }}</div>
          <q-space />
        </q-card-section> -->
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
      address: null
    }
  },
  created () {
    this.$store.dispatch('FETCH_CURRENCY')
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
      username: state => state.app.username,
      from: state => state.app.from,
      message: state => state.app.message,
      currency: state => state.api.currency,
      language: state => state.app.language,
      // sending: state => state.wallet.sending,
      // txReady: state => state.wallet.txReady,
      balance: state => state.api.balance
    }),
    txReady: {
      get () {
        return this.$store.state.wallet.txReady
      },
      set (value) {
        this.$store.commit('SET_TXREADY', value)
      }
    },
    sending: {
      get () {
        return this.$store.state.wallet.sending
      },
      set (value) {
        this.$store.commit('SET_SENDING', value)
      }
    }
  }
}
</script>
