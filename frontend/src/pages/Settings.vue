<template>
  <q-page padding>
    <div class="text-h5 text-center full-width q-mb-md q-mt-md text-indigo-10">{{ $t('Your seed phrase') }}</div>
    <q-input outlined v-model="mnemonic" :label="$t('Copy address')" stack-label readonly @click="copySeed()">
      <template v-slot:after>
        <q-btn round icon="file_copy" @click="copySeed()" />
      </template>
    </q-input>

    <div class="text-h5 text-center full-width q-mb-md q-mt-lg text-indigo-10">{{ $t('Your phone') }}</div>
    <q-input
      outlined
      bottom-slots
      color="tale"
      clearable
      clear-icon="close"
      v-model="phone"
      :label="$t('Enter phone number')"
      mask="+# (###) ### - ####"
      :hint="$t('Example') + ': +7 (900) 000 - 0000'"
    >
      <template v-slot:after>
        <q-btn round icon="save" @click="savePhone()" />
      </template>
    </q-input>

    <div class="text-h5 text-center full-width q-mb-md q-mt-lg text-indigo-10">{{ $t('Your address') }}</div>
    <q-input
      outlined
      bottom-slots
      color="tale"
      clearable
      clear-icon="close"
      v-model="address"
      :label="$t('Enter Mx address')"
    >
      <template v-slot:after>
        <q-btn round icon="save" @click="saveAddress()" />
      </template>
    </q-input>

    <div class="text-h5 text-center full-width q-mb-md q-mt-lg text-indigo-10">{{ $t('Your certificates') }}</div>
    <!-- <q-btn @click="addCertificates('8a7d145a', 'Yandex YandexYandex YandexYandex YandexYandex Yandex', 1500)" label="Add" /> -->
    <q-list bordered separator v-if="certificates && certificates.length">
      <q-item tag="a" target="_blank" :href="reefApi + 'certificate/' + item.hash + '.pdf'" v-for="item in certificates" :key="item.hash">
        <q-item-section>
          <q-item-label>{{ item.name }}</q-item-label>
          <q-item-label caption>Order id: {{ item.hash }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-badge color="teal" :label="item.face + ' rub'" />
        </q-item-section>
      </q-item>
    </q-list>
    <!-- <q-btn @click="clearCertificates()" label="remove" /> -->
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { copyToClipboard, openURL } from 'quasar'
export default {
  name: 'Settings',
  data () {
    return {
      address: null,
      phone: null
    }
  },
  created () {
    if (localStorage.getItem('phone') !== null) {
      this.phone = localStorage.getItem('phone')
    }
    if (localStorage.getItem('address') !== null) {
      this.address = localStorage.getItem('address')
    }
  },
  methods: {
    clickLink (link) {
      openURL(link)
    },
    addCertificates (hash, name, face) {
      this.$store.commit('ADD_SERTIFICATES', { hash, name, face })
    },
    clearCertificates () {
      this.$store.commit('CLEAR_SERTIFICATES')
    },
    copySeed () {
      copyToClipboard(this.mnemonic)
      this.$q.notify({
        message: this.$t('Seed phrase copied'),
        color: 'purple',
        position: 'bottom',
        timeout: 400
      })
    },
    savePhone () {
      this.$q.notify({
        message: this.$t('Phone number saved'),
        color: 'purple',
        position: 'bottom',
        timeout: 400
      })
      localStorage.setItem('phone', this.phone)
    },
    saveAddress () {
      this.$q.notify({
        message: this.$t('Address saved'),
        color: 'purple',
        position: 'bottom',
        timeout: 400
      })
      localStorage.setItem('address', this.address)
    }
  },
  computed: {
    ...mapState({
      certificates: state => state.app.certificates,
      reefApi: state => state.api.reefApi,
      currency: state => state.api.currency,
      mnemonic: state => state.wallet.mnemonic
    })
  }
}
</script>
