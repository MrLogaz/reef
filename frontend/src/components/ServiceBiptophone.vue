<template>
  <div class="q-pa-md">
    <!-- <div class="text-center text-h6 q-pb-lg">{{ $t('Top up phone balance') }}</div> -->
    <q-form @submit="onSend" class="q-pb-lg text-white">
      <q-input
        filled
        bottom-slots
        color="tale"
        label-color="purple-10"
        bg-color="white"
        clearable
        clear-icon="close"
        v-model="phone"
        :label="$t('Enter phone number')"
        mask="+# (###) ### - ####"
      >
        <template v-slot:hint>
          <div class="text-grey-3">Example: +7 (900) 000 - 0000</div>
        </template>
        <template v-slot:after>
          <q-btn type="submit" @click="onSend" :disabled="!checkPhone()" color="teal" round icon="send" />
        </template>
      </q-input>
    </q-form>
    <q-separator class="q-mb-lg" />
    <div class="text-grey-3">{{ $t('Money will be sent to the entered phone in 10 seconds') }}. {{ $t('Maximum') }} {{ currency['BIPRUB'] * 500 }} rub</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Big from 'big.js'
import { getFeeValue } from 'minterjs-util'
import { TX_TYPE_SEND } from 'minterjs-tx'
export default {
  name: 'ServiceBiptophone',
  data () {
    return {
      phone: null,
      maximum: 500
    }
  },
  methods: {
    checkPhone () {
      if (this.phone === null) return false
      let phoneFilter = this.phone.replace(/\D+/g, '')
      if (phoneFilter && phoneFilter.length === 11) return true
    },
    onSend () {
      if (!this.checkPhone()) return false
      let phoneFilter = this.phone.replace(/\D+/g, '')
      this.$store.dispatch('BIPTOPHONE_VALIDATE', { phone: phoneFilter }).then(validateData => {
        if (validateData && validateData.isvalid === '1') {
          this.$store.dispatch('BIPTOPHONE_CODE', { phone: validateData.phone }).then(data => {
            console.log(data)
            if (data && data.keyword) {
              let fee = getFeeValue(TX_TYPE_SEND, { payload: data.keyword })
              let amount = Big(this.balanceJSON['BIP']).minus(fee)
              if (amount.gte(500)) amount = Big(499.6)
              let txData = {
                txAction: 'SendTxParams',
                coinSymbol: 'BIP',
                feeCoinSymbol: 'BIP',
                amount: amount.toString(),
                address: 'Mx403b763ab039134459448ca7875c548cd5e80f77',
                message: data.keyword
              }
              this.$store.dispatch('SENDER', txData).then(txHash => {
                console.log(txHash)
                this.$parent.biptophone = false
              })
            }
          })
        }
      })
    }
  },
  created () {
  },
  computed: {
    ...mapState({
      currency: state => state.api.currency,
      balance: state => state.api.balance,
      balanceJSON: state => state.api.balanceJSON
    })
  }
}
</script>
