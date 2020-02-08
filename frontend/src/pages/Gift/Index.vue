<template>
  <q-page padding>
    <div>
      <div class="text-center q-pt-sm" v-if="balance && balance.total_balance_sum">
        <div class="text-center text-h5 q-pb-sm">{{ $t('With this you can') }}</div>
        <services-list></services-list>

        <q-separator class="q-mt-lg q-mb-lg" />

        <div class="text-center text-h5 q-pb-xs">{{ $t('or send to someone else') }}</div>
        <q-form @submit="onSendToAddress" class="q-pb-lg">
          <q-input
            class="q-pt-md"
            clearable
            outlined
            v-model="sendAddress"
            :label="$t('Tx address')"
            :hint="$t('Insert recipient wallet address')"
          >
            <template v-slot:after>
              <q-btn type="submit" @click="onSendToAddress" :disabled="!checkAddress()" color="teal" round icon="send" />
            </template>
          </q-input>
        </q-form>
        <div class="q-pt-md" v-if="shareTest()">
          <q-btn @click="saveLink()" color="positive" icon="share" :label="$t('Save link')" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { openURL } from 'quasar'
import { mapState } from 'vuex'
import { wordlists } from 'bip39'
import ServicesList from '../../components/ServicesList.vue'
import Big from 'big.js'
import { getFeeValue } from 'minterjs-util'
import { TX_TYPE_SEND } from 'minterjs-tx'
// import { prepareLink, TX_TYPE } from 'minter-js-sdk'
// import QRCode from 'qrcode'
import { walletFromMnemonic, isValidMnemonic } from 'minterjs-wallet'
// import { copyToClipboard } from 'quasar'
export default {
  name: 'Index',
  components: {
    'services-list': ServicesList
  },
  data () {
    return {
      sendAddress: null,
      isPassword: false,
      total_balance_sum: null,
      total_balance_sum_usd: null,
      total_balance_sum_rub: null
    }
  },
  created () {
    if (this.$route.query.username && this.$route.query.username !== '') this.username = this.$route.query.username
    if (this.$route.query.from && this.$route.query.from !== '') this.from = this.$route.query.from
    if (this.$route.query.message && this.$route.query.message !== '') this.message = this.$route.query.message

    if (this.$route.query.key && this.$route.query.key !== '') {
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
    },
    shareTest () {
      if (navigator.share) return true
      else return false
    },
    saveLink () {
      navigator.share({
        title: 'Подарочный кошелек c бонусом',
        text: 'Переходи для получения',
        url: document.location.href
      })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error))
    },
    checkAddress () {
      return this.sendAddress && this.sendAddress.length === 42 && Big(this.balance.total_balance_sum).gte(0.5)
    },
    onSendToAddress () {
      if (!this.checkAddress) return false
      let fee = getFeeValue(TX_TYPE_SEND, { payload: '' })
      let amount = Big(this.balance.balances[0].amount).minus(fee)
      if (amount.gte(500)) amount = Big(499.6)
      let txData = {
        txAction: 'SendTxParams',
        coinSymbol: this.balance.balances[0].coin,
        feeCoinSymbol: this.balance.balances[0].coin,
        amount: amount.toString(),
        address: this.sendAddress,
        message: ''
      }
      this.$store.dispatch('SENDER', txData).then(txHash => {
        console.log(txHash)
        this.txReady = true
      })
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
  },
  watch: {
    language (val) {
      this.$i18n.locale = val
    }
  }
}
</script>
