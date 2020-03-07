<template>
  <q-page padding>
    <!-- <div class="text-center q-pt-md" v-if="balance">
      <div class="text-h5 text-bold text-indigo-10">You have {{ parseFloat(balance.total_balance_sum) }} bip</div>
      <div class="text-h6 text-grey">~ {{ bipRub(balance.total_balance_sum) }} rub | ~ {{ parseFloat(balance.total_balance_sum_usd) }} usd</div>
      <q-separator class="q-mt-md q-mb-md" color="indigo-6" />
    </div> -->

    <q-input
      v-model="searchGift"
      class="q-mb-md"
      clear-icon="close"
      clearable
      outlined
      :label="$t('Search')"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-list bordered separator v-if="giftFilter && giftFilter.length > 1">
      <q-item v-for="gift in giftFilter" :key="gift.id" clickable v-ripple :to="{ name: 'product', params: { productId: gift.id } }">
        <q-item-section side>
          <img style="height: 32px; width: 56px;" :src="'http://' + gift.image_url" />
        </q-item-section>
        <q-item-section>{{ gift.title }}</q-item-section>
      </q-item>
    </q-list>
    <services-list v-else />

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
    return {
      searchGift: null,
      giftFilter: []
    }
  },
  methods: {
    filterGift (searchVal) {
      if (searchVal.length > 1) {
        this.giftFilter = this.products.filter(v => v.title.toLowerCase().indexOf(searchVal.toLowerCase()) > -1)
      } else this.giftFilter = null
    },
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
      products: state => state.api.products,
      balance: state => state.api.balance,
      currency: state => state.api.currency,
      address: state => state.wallet.address
    })
  },
  watch: {
    searchGift (val) {
      this.filterGift(val)
    }
  }
}
</script>
