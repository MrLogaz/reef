<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <header-app />
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import headerApp from '../components/HeaderApp.vue'
import { wordlists } from 'bip39'
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
  }
}
</script>
