<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container v-if="mnemonic">
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
    <q-dialog v-model="dialogPassword" size="md" persistent>
      <q-card class="dialog-min300 text-center">
        <q-card-section>
          <div>
            <q-icon color="indigo-10" name="lock" size="5em" />
          </div>
          <div class="text-h6 q-mt-sm q-mb-sm">{{ $t('Need password') }}</div>
          <q-form @submit="onSubmitPassword">
            <q-input
              v-model="password"
              :label="$t('Insert password')"
              clear-icon="close"
              :error="passwordIsError"
              clearable
              outlined
            >
              <template v-slot:after>
                <q-btn type="submit" round @click="onSubmitPassword" icon="lock_open">
                </q-btn>
              </template>
            </q-input>
          </q-form>
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
// import Big from 'big.js'
import BigNumber from 'bignumber.js'
import { generateMnemonic, walletFromMnemonic, isValidMnemonic } from 'minterjs-wallet'
import CryptoJS from 'crypto-js'

BigNumber.config({ ALPHABET: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' })

export default {
  name: 'App',
  components: {
    'header-app': headerApp
  },
  data () {
    return {
      mnemonic: null,
      dialogPassword: false,
      secret: '',
      passwordIsError: false,
      password: null,
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
    this.$store.dispatch('FETCH_PRODUCTS')
    this.$store.dispatch('GET_SERTIFICATES')
    if (this.$route.params.pathMatch && this.$route.params.pathMatch.substring(0, 4) === '/U2F' && this.$route.params.pathMatch.length > 30) {
      let secretTmp = this.$route.params.pathMatch
      if (secretTmp.substring(secretTmp.length - 1) === '/') {
        this.secret = this.$route.params.pathMatch.slice(1, -1)
      } else {
        this.secret = this.$route.params.pathMatch.slice(1)
      }
      this.dialogPassword = true
    } else if (this.$route.params.seed && this.$route.params.seed !== '') {
      const mnemonic = this.num62ToMnemonic(this.$route.params.seed)
      this.makeWallet(mnemonic, this.$route.params.seed)
      const path = '/' + this.$route.params.seed + '/gift'
      if (this.$route.path !== path) this.$router.push(path)
    } else {
      const mnemonic = generateMnemonic()
      const seedkey = this.mnemonicTo62(mnemonic)
      this.makeWallet(mnemonic, seedkey)
      const path = '/' + seedkey + '/receive'
      if (this.$route.path !== path) this.$router.push(path)
    }
    this.$store.dispatch('FETCH_BALANCE')
  },
  mounted () {
    setInterval(() => {
      this.$store.dispatch('FETCH_BALANCE')
    }, 6000)
  },
  methods: {
    mnemonicTo62 (mnemonic) {
      const seedNumkey = mnemonic.split(' ').map(word => wordlists.english.indexOf(word))
      const seed62FullNum = seedNumkey.map(numWord => ('000' + numWord).slice(-4)).join('')
      const seed62key = new BigNumber(seed62FullNum, 10).toString(62)
      return seed62key
    },
    num62ToMnemonic (seed62key) {
      const seed62FullNum = new BigNumber(seed62key, 62).toString(10)
      const seedNumkeyArr = ('000' + seed62FullNum).slice(-48).match(/[\S\s]{1,4}/g)
      const mnemonic = seedNumkeyArr.map(numWord => wordlists.english[parseInt(numWord)])
      return mnemonic.join(' ')
    },
    makeWallet (mnemonic, seedkey) {
      if (isValidMnemonic(mnemonic)) {
        this.mnemonic = mnemonic
        const wallet = walletFromMnemonic(mnemonic)
        this.$store.commit('SAVE_WALLET', {
          seedkey: seedkey,
          mnemonic: mnemonic,
          address: wallet.getAddressString(),
          privateKey: wallet.getPrivateKeyString()
        })
      }
    },
    onSubmitPassword () {
      if (this.password && this.password.length > 0) {
        const decodePass = CryptoJS.AES.decrypt(this.secret, this.password).toString(CryptoJS.enc.Utf8)
        if (decodePass.length > 0) {
          const mnemonic = this.num62ToMnemonic(decodePass)
          // const mnemonic = decodePass.split('.').map(n => wordlists.english[n]).join(' ')
          if (isValidMnemonic(mnemonic)) {
            this.makeWallet(mnemonic, decodePass)
            this.dialogPassword = false
            const path = '/' + decodePass + '/gift'
            if (this.$route.path !== path) this.$router.push(path)
          } else {
            this.passwordIsError = true
          }
        } else {
          this.passwordIsError = true
        }
      }
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
  },
  watch: {
    password (val) {
      this.passwordIsError = false
    }
  }
}
</script>
