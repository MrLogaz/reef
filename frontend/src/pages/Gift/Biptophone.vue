<template>
  <q-page>
    <div class="q-pa-md">
      <div class="text-h5 text-center full-width q-mb-md q-mt-md text-indigo-10">{{ $t('Top up phone balance') }}</div>
      <q-form class="q-pb-lg">
        <q-input
          v-model="amount"
          type="number"
          step="any"
          class="q-mb-md"
          outlined
          clearable
          clear-icon="close"
          debounce="250"
          :error="amountIsError"
          :error-message="amountErrorMsg"
          :label="$t('Amount')"
          :hint="'Min 10 bip, max 500 bip'"
        >
          <template v-slot:after>
            <q-btn round push no-caps label="Max" @click="maxAmountSend()" />
          </template>
        </q-input>
        <not-enough v-if="amountIsError && amount && amount <= 500 && amount >= 10" :amount="amountNotEnough" />
        <q-input
          outlined
          bottom-slots
          color="tale"
          clearable
          clear-icon="close"
          :error="phoneIsError"
          v-model="phone"
          :label="$t('Enter phone number')"
          mask="+# (###) ### - ####"
          :hint="$t('Example') + ': +7 (900) 000 - 0000'"
        >
          <!-- <template v-slot:after>
            <q-btn @click="pay" color="indigo" round icon="shopping_cart" />
          </template> -->
        </q-input>
        <q-btn @click="pay" color="indigo-6" size="1.3em" class="q-mt-md">
          <q-icon name="system_update" size="1.25em" class="q-mr-sm" />
          <div style="font-size: 0.7em">{{ $t('Send') }} {{ amount ? amount : 0 }} Bip</div>
        </q-btn>
      </q-form>
      <q-separator class="q-mb-lg" />
      <div class="text-grey-6">{{ $t('Money will be sent to the entered phone in 10 seconds') }}.</div>
    </div>

    <q-dialog v-model="txReady" size="md" position="bottom">
      <q-card class="dialog-min300 text-center">
        <q-card-section>
          <div>
            <q-icon color="secondary" name="done" size="5em" />
          </div>
          <div class="text-h6">{{ $t('Payment was successful!') }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import Big from 'big.js'
import { getFeeValue } from 'minterjs-util'
import { TX_TYPE } from 'minterjs-tx'
import { issueCheck } from 'minter-js-sdk'
import notEnough from '../../components/NotEnough.vue'
export default {
  name: 'ServiceBiptophone',
  components: {
    'not-enough': notEnough
  },
  data () {
    return {
      phone: null,
      amount: null,
      amountNotEnough: null,
      amountErrorMsg: null,
      amountIsError: false,
      phoneIsError: false,
      sendFee: getFeeValue(TX_TYPE.SEND, { payload: '03esf0' }),
      checkFee: getFeeValue(TX_TYPE.REDEEM_CHECK),
      txReady: false
    }
  },
  created () {
    if (localStorage.getItem('phone') !== null) {
      this.phone = localStorage.getItem('phone')
    }
    if (this.balanceBIP) {
      this.maxAmountSend()
    }
  },
  methods: {
    checkBalance () {
      this.amountErrorMsg = null
      this.amountIsError = false
      this.amountNotEnough = null
      if (this.amount === null || this.amount === '') {
        this.amountIsError = true
        this.amountErrorMsg = 'Min 10 bip'
        return false
      }
      if (Big(this.amount).gte(500)) {
        this.amountIsError = true
        this.amountErrorMsg = 'Max 500 bip'
        return false
      }
      if (Big(this.amount).lt(10)) {
        this.amountIsError = true
        this.amountErrorMsg = 'Min 10 bip'
        return false
      }
      let available = Big(this.balanceBIP).minus(this.sendFee).minus(this.checkFee)
      if (this.amount === '') return false
      if (available.gte(this.amount)) return true
      else {
        this.amountIsError = true
        this.amountNotEnough = Big(this.amount).minus(available).toString()
        this.amountErrorMsg = this.$t('Not enough ') + this.amountNotEnough + ' bip'
        return false
      }
    },
    maxAmountSend () {
      let available = Big(this.balanceBIP).minus(this.sendFee).minus(this.checkFee)
      this.amount = available.toString()
    },
    checkPhone () {
      this.phoneIsError = false
      if (this.phone) {
        let phoneFilter = this.phone.replace(/\D+/g, '')
        if (phoneFilter && phoneFilter.length === 11) return true
        else {
          this.phoneIsError = true
          return false
        }
      } else {
        this.phoneIsError = true
        return false
      }
    },
    validate () {
      if (this.checkBalance() && this.checkPhone()) return true
      else return false
    },
    pay () {
      if (this.validate()) {
        let phoneFilter = this.phone.replace(/\D+/g, '')
        let amount = Big(this.amount).minus(this.checkFee)
        let nonce = new Date().getTime() - 1582480000000
        const check = issueCheck({
          privateKey: this.privateKey,
          password: 'pass',
          nonce: nonce,
          chainId: 1,
          coin: 'BIP',
          value: amount.toString(),
          dueBlock: 999999999
        })
        const buyData = {
          check,
          meta: {
            phone: phoneFilter
          }
        }
        this.$store.commit('SET_SENDING', true)
        this.$store.dispatch('REEF_API', ['biptophone', 'pay', buyData]).then(response => {
          this.$store.commit('SET_SENDING', false)
          this.$store.dispatch('FETCH_BALANCE')
          this.txReady = true
          console.log(response)
        }).catch(error => {
          this.$store.dispatch('FETCH_BALANCE')
          this.$store.commit('SET_SENDING', false)
          this.$store.commit('SET_TXERROR', error)
        })
      }
    }
  },
  computed: {
    ...mapState({
      privateKey: state => state.wallet.privateKey,
      currency: state => state.api.currency,
      balance: state => state.api.balance,
      balanceBIP: state => state.api.balanceBIP
    })
  },
  watch: {
    amount () { this.checkBalance() }
  }
}
</script>
