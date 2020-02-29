<template>
  <q-page padding>
    <div class="text-h5 text-center full-width q-mb-md q-mt-md text-bold text-indigo-10">Your seed phrase</div>
    <q-input outlined v-model="mnemonic" :label="$t('Copy address')" stack-label readonly @click="copySeed()">
      <template v-slot:after>
        <q-btn icon="file_copy" flat round @click="copySeed()" />
      </template>
    </q-input>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { copyToClipboard } from 'quasar'
export default {
  name: 'Settings',
  data () {
    return {}
  },
  methods: {
    copySeed () {
      copyToClipboard(this.mnemonic)
      this.$q.notify({
        message: this.$t('Seed phrase copied'),
        color: 'purple',
        position: 'bottom',
        timeout: 400
      })
    }
  },
  computed: {
    ...mapState({
      currency: state => state.api.currency,
      mnemonic: state => state.wallet.mnemonic
    })
  }
}
</script>
