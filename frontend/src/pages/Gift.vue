<template>
  <q-page padding>
    <div class="text-center q-pt-md">
      <div class="text-h5 text-bold text-indigo-10">You have {{ parseFloat(balance.total_balance_sum) }} bip</div>
      <div class="text-h6 text-grey">~ {{ parseFloat(balance.total_balance_sum) * currency.biptorub }} rub | ~ {{ parseFloat(balance.total_balance_sum_usd) }} usd</div>
      <q-separator class="q-mt-md q-mb-md" color="indigo-6" />
      <services-list />
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
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
    // 123
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
