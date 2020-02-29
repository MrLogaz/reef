<template>
  <q-page padding>
    <div class="text-center q-pt-md" v-if="balance">
      <div class="text-h5 text-bold text-indigo-10">You have {{ parseFloat(balance.total_balance_sum) }} bip</div>
      <div class="text-h6 text-grey">~ {{ bipRub(balance.total_balance_sum) }} rub | ~ {{ parseFloat(balance.total_balance_sum_usd) }} usd</div>
      <q-separator class="q-mt-md q-mb-md" color="indigo-6" />
    </div>
    <services-list />
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import Big from 'big.js'
import ServicesList from '../components/ServicesList.vue'
export default {
  name: 'Gift',
  components: {
    'services-list': ServicesList
  },
  data () {
    return {}
  },
  methods: {
    bipRub (sum) {
      if (sum) {
        let toRub = Big(sum).times(this.currency.biptorub).round(2)
        return toRub.toString()
      } else return 0
    },
    bipPrice (price) {
      if (price) {
        let toBip = Big(price).div(this.currency.biptorub).round()
        return toBip.toString()
      } else return '0'
    }
  },
  computed: {
    ...mapState({
      balance: state => state.api.balance,
      currency: state => state.api.currency,
      address: state => state.wallet.address
    })
  }
}
</script>
