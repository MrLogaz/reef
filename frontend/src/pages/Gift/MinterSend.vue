<template>
  <q-page>
    <div class="q-pa-md">
      <div class="text-h5 text-center full-width q-mb-md q-mt-md text-indigo-10">{{ $t('Send to wallet') }}</div>
      <q-form class="q-pb-lg">
        <q-input
          v-model="amount"
          type="number"
          step="any"
          class="q-mb-md"
          outlined
          clearable
          clear-icon="close"
          :error="amountIsError"
          :error-message="amountErrorMsg"
          :label="$t('Amount')"
          :hint="'Fee ' + sendFee"
        >
          <template v-slot:after>
            <q-btn round push no-caps label="Max" @click="maxAmountSend()" />
          </template>
        </q-input>
        <q-input
          class="q-mb-md"
          clearable
          outlined
          clear-icon="close"
          v-model="sendAddress"
          :error="addressIsError"
          :error-message="addressErrorMsg"
          :label="$t('Mx address')"
          :hint="$t('Insert recipient wallet address')"
        >
          <template v-slot:after>
            <q-btn type="submit" @click="onSendToAddress" color="indigo" round icon="send" />
          </template>
        </q-input>
      </q-form>
      <div class="q-pt-md" v-if="shareTest()">
        <q-btn @click="saveLink()" color="positive" icon="share" :label="$t('Save link')" />
      </div>
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
import { TX_TYPE } from 'minter-js-sdk'
import { getFeeValue } from 'minterjs-util'
export default {
  name: 'MinterSend',
  data () {
    return {
      sendAddress: null,
      amount: null,
      amountErrorMsg: null,
      amountIsError: false,
      addressIsError: false,
      addressErrorMsg: null,
      sendFee: getFeeValue(TX_TYPE.SEND),
      txReady: false
    }
  },
  created () {
    if (this.address) {
      this.sendAddress = this.address
    }
  },
  methods: {
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
    maxAmountSend () {
      let available = this.balanceBIP.minus(this.sendFee)
      this.amount = available.toString()
    },
    checkSend () {
      let available = this.balanceBIP.minus(this.sendFee)
      this.addressIsError = false
      this.addressErrorMsg = null
      this.amountErrorMsg = null
      this.amountIsError = false
      if (this.amount) {
        if (available.gte(this.amount)) {
          if (this.sendAddress && this.sendAddress.length === 42 && this.sendAddress.substring(0, 2) === 'Mx') return true
          else {
            this.addressIsError = true
            this.addressErrorMsg = 'Address not valid'
            return false
          }
        } else {
          this.amountIsError = true
          this.amountErrorMsg = 'Max ' + available.toString() + ' bip'
          return false
        }
      } else {
        this.amountIsError = true
      }
    },
    onSendToAddress () {
      if (this.checkSend()) {
        let txData = {
          type: 'send',
          data: {
            to: this.sendAddress,
            value: Big(this.amount).toString(),
            coin: 'BIP'
          },
          gasCoin: 'BIP'
        }
        this.$store.dispatch('SENDER', txData).then(txHash => {
          this.$store.dispatch('FETCH_BALANCE')
          this.txReady = true
        }).catch(error => {
          this.$store.dispatch('FETCH_BALANCE')
          this.$store.commit('SET_TXERROR', error)
        })
      }
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      balanceBIP: state => state.api.balanceBIP
    })
  }
}
</script>
