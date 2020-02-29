<template>
  <q-page padding>
    <div class="text-h6 q-pb-sm q-pt-md">{{ $t('Send coins to address') }}</div>
    <q-input outlined v-model="address" :label="$t('Copy address')" stack-label readonly @click="copyAddress()">
      <template v-slot:after>
        <q-btn icon="file_copy" flat round @click="copyAddress()" />
      </template>
    </q-input>
    <div class="text-h6 q-mt-lg q-pb-sm">{{ $t('Or use deeplink') }}</div>
    <div class="row">
      <div class="col-sm-6 col-xs-12">
        <q-input
          v-model.number="deeplinkAmount"
          type="number"
          :label="$t('Amount') + ' BIP'"
          clearable
          outlined
        />
        <q-btn type="a" color="indigo-6" size="md" class="q-mt-md" target="_blank" icon="account_balance_wallet" :href="deepLink" :label="'Send ' + deeplinkAmount + ' Bip'" />
      </div>
      <div class="desktop-only col-sm-6">
        <div class="q-ml-md">
          <img style="max-width: 100%" :src="qrImage">
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { prepareLink, TX_TYPE } from 'minter-js-sdk'
import QRCode from 'qrcode'
import { copyToClipboard } from 'quasar'
export default {
  name: 'Recive',
  data () {
    return {
      qrImage: null,
      shareQRImage: null,
      deepLink: null,
      deeplinkAmount: 10,
      resultLink: null
    }
  },
  created () {
    this.generateDeepQRcode()
  },
  methods: {
    generateDeepQRcode () {
      const opts = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 200,
        margin: 0
      }
      const txParams = {
        type: TX_TYPE.SEND,
        data: {
          to: this.address,
          value: this.deeplinkAmount,
          coin: 'BIP'
        }
      }
      // let deepLinkTmp = prepareLink(txParams, 'minter://')
      this.deepLink = prepareLink(txParams)
      // this.deepLink = deepLinkTmp.replace('https://minter://', 'minter://')

      QRCode.toDataURL(this.deepLink, opts).then(url => {
        this.qrImage = url
      }).catch(err => {
        this.$q.notify({
          message: err,
          color: 'purple'
        })
        // console.error(err)
      })
    },
    copyAddress () {
      copyToClipboard(this.address)
      this.$q.notify({
        message: this.$t('Address copied'),
        color: 'purple',
        position: 'bottom',
        timeout: 400
      })
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address
    })
  },
  watch: {
    deeplinkAmount (newVal) {
      if (newVal) {
        this.generateDeepQRcode()
      }
    }
  }
}
</script>
