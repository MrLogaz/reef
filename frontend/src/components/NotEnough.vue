<template>
  <div class="text-red-10 q-mt-md q-mb-md">
    <q-btn :to="{ name: 'receive', params: { amount: amount } }" color="orange-14" class="full-width" :label="$t('Top up balance by ') + amount + ' bip'" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'NotEnough',
  props: ['amount'],
  data () {
    return {}
  },
  computed: {
    ...mapState({
      balanceJSON: state => state.api.balanceJSON
    })
  }
}
</script>
