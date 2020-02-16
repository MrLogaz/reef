<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-white text-primary">
      <q-toolbar>
        <q-item @click.native="clickLink('http://push.reef.mn/')">
          <q-item-section avatar>
            <q-avatar color="white" class="desktop-only" text-color="white" size="60px">
              <img src="statics/icons/Icon-120.png">
            </q-avatar>
            <q-avatar color="white" class="mobile-only" text-color="white" size="44px">
              <img src="statics/icons/Icon-88.png">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="text-h4 desktop-only">REEF Push</div>
            <div class="text-h6 mobile-only">REEF Push</div>
            <q-item-label caption>{{ $t('Easy way to send a value') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-toolbar-title class="text-center">
        </q-toolbar-title>
        <q-btn round color="teal" :label="language.substr(0,2)" @click="alertLang = true"></q-btn>
      </q-toolbar>
    </q-header>
    <q-dialog v-model="alertLang">
      <q-card class="dialog-min300">
        <q-card-section>
          <div class="text-h6">{{ $t('Choose a language') }}</div>
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item tag="label" v-ripple v-for="lang in languageList" :key="lang.value">
              <q-item-section avatar>
                <q-radio v-model="language" :val="lang.value" color="teal" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ lang.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container>
      <div class="q-page text-center">
        <div class="text-h4 q-pt-lg">{{ `${ $t('Hello') }, ${ username && username !== '' ? username : $t('lucky') }` }}</div>
        <div class="text-h5 q-pb-xs">{{ from && from !== '' ? from : $t('Your friend') }} {{ $t('sent you') }}</div>
        <div class="q-pt-sm" v-if="balance && balance.total_balance_sum">
          <div class="text-h4" v-if="language === 'en-us'">~ <b>{{ prettyNumber(balance.total_balance_sum_usd, 2) }} usd</b></div>
          <div class="text-h4" v-if="language === 'ru' && currency.BIPRUB">~ <b>{{ prettyNumber(balance.total_balance_sum * currency.BIPRUB, 2) }} руб</b></div>
          <div class="text-h5 text-grey-6">
            {{ prettyNumber(balance.total_balance_sum, 3) }} BIP
            <q-btn icon="help_outline" round dense flat type="a" href="https://www.minter.network/ru" target="_blank" size="12px" />
          </div>
          <div class="text-body1 q-pt-md" v-if="message">{{ message }}</div>

          <q-separator class="q-mt-lg q-mb-lg" />
        </div>
      </div>

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
      <q-card class="dialog-min300">
        <q-card-section class="row items-center">
          <div class="text-h6 text-center">{{ $t('Success') }}</div>
          <q-space />
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { mapState } from 'vuex'
import { wordlists } from 'bip39'
import { walletFromMnemonic, isValidMnemonic } from 'minterjs-wallet'
export default {
  name: 'Gift',
  data () {
    return {
      tab: 'address',
      alertLang: false,
      sendAddress: null,
      languageList: [
        {
          label: 'English',
          value: 'en-us'
        }, {
          label: 'Russian',
          value: 'ru'
        }
      ],
      isPassword: false,
      total_balance_sum: null,
      total_balance_sum_usd: null,
      total_balance_sum_rub: null
    }
  },
  created () {
    this.$store.dispatch('FETCH_CURRENCY')
    let userData = {
      username: null,
      from: null,
      message: null
    }
    if (this.$route.query.username && this.$route.query.username !== '') userData.username = this.$route.query.username
    if (this.$route.query.from && this.$route.query.from !== '') userData.from = this.$route.query.from
    if (this.$route.query.message && this.$route.query.message !== '') userData.message = this.$route.query.message
    this.$store.commit('SAVE_USER', userData)

    if (this.$route.query.key && this.$route.query.key !== '') {
      this.$store.commit('SAVE_URLKEY', this.$route.query.key)
      let mnemonic = this.$route.query.key.split('.').map(n => wordlists.english[n]).join(' ')
      if (isValidMnemonic(mnemonic)) {
        const wallet = walletFromMnemonic(mnemonic)
        this.$store.commit('SAVE_WALLET', {
          mnemonic: mnemonic,
          address: wallet.getAddressString(),
          privateKey: wallet.getPrivateKeyString()
        })
        this.$store.dispatch('FETCH_BALANCE')
      }
    }
  },
  methods: {
    clickLink (link) {
      openURL(link)
    },
    prettyNumber (summ, length) {
      let num = parseFloat(parseFloat(summ).toFixed(length))
      let parts = num.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      return parts.join('.')
    }
  },
  computed: {
    ...mapState({
      username: state => state.app.username,
      from: state => state.app.from,
      message: state => state.app.message,
      currency: state => state.api.currency,
      language: state => state.app.language,
      sending: state => state.wallet.sending,
      txReady: state => state.wallet.txReady,
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
    },
    language: {
      get () {
        return this.$store.state.app.language
      },
      set (value) {
        this.$store.commit('SET_LANG', value)
      }
    }
  }
}
</script>
