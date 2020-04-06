<template>
  <q-page padding>
    <div class="text-h5 full-width text-center text-indigo-10 q-pb-sm q-pt-md">{{ $t('Send coins to address') }}</div>
    <!-- <div class="text-h6 q-pb-sm q-pt-md">{{ $t('Send coins to address') }}</div> -->
    <q-input outlined v-model="address" :label="$t('Copy address')" stack-label readonly @click="copyAddress()">
      <template v-slot:after>
        <q-btn icon="file_copy" round @click="copyAddress()" />
      </template>
    </q-input>
    <div class="text-h5 full-width text-center text-indigo-10 q-mt-lg q-mb-sm">{{ $t('Or use deeplink') }}</div>
    <div class="row">
      <div class="col-sm-6 col-xs-12">
        <q-input
          v-model.number="deeplinkAmount"
          type="number"
          :label="$t('Amount') + ' BIP'"
          debounce="500"
          clear-icon="close"
          clearable
          outlined
        >
          <template v-slot:after>
            <q-btn round @click="dialogQrDeeplink = true">
              <i class="las la-qrcode" style="font-size: 2.3em"></i>
            </q-btn>
          </template>
        </q-input>
        <q-btn type="a" color="indigo-6" size="1.3em" class="q-mt-md" target="_blank" :href="deepLink">
          <q-icon name="account_balance_wallet" size="1.25em" class="q-mr-sm" />
          <div style="font-size: 0.7em">{{ $t('Send') }} {{ deeplinkAmount }} Bip</div>
        </q-btn>
      </div>
      <div class="desktop-only col-sm-6">
        <div class="q-ml-md">
          <img style="max-width: 100%" :src="qrImage">
        </div>
      </div>
    </div>
    <q-dialog v-model="dialogQrDeeplink">
      <q-card class="text-center">
        <q-card-section>
          <div class="text-h5">{{ $t('Send') }} {{ deeplinkAmount }} Bip</div>
        </q-card-section>
        <q-card-section>
          <img style="max-width: 100%" :src="qrImage">
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { prepareLink, TX_TYPE } from 'minter-js-sdk'
import QRCode from 'qrcode'
import { Platform, copyToClipboard } from 'quasar'
export default {
  name: 'Receive',
  data () {
    return {
      qrImage: null,
      dialogQrDeeplink: false,
      shareQRImage: null,
      deepLink: null,
      deeplinkAmount: 10,
      resultLink: null
    }
  },
  created () {
    this.generateDeepQRcode()
    if (this.$route.params.amount) {
      this.deeplinkAmount = this.$route.params.amount
    }
  },
  methods: {
    atobUTF16 (sBase64) {
      var sBinaryString = atob(sBase64), aBinaryView = new Uint8Array(sBinaryString.length)
      Array.prototype.forEach.call(aBinaryView, function (el, idx, arr) {
        arr[idx] = sBinaryString.charCodeAt(idx)
      })
      return String.fromCharCode.apply(null, new Uint16Array(aBinaryView.buffer))
    },
    btoaUTF16 (sString) {
      var aUTF16CodeUnits = new Uint16Array(sString.length)
      Array.prototype.forEach.call(aUTF16CodeUnits, function (el, idx, arr) { arr[idx] = sString.charCodeAt(idx) })
      return btoa(String.fromCharCode.apply(null, new Uint8Array(aUTF16CodeUnits.buffer)))
    },
    b64_to_utf8 (str) {
      return decodeURIComponent(escape(atob(str)))
    },
    base64ToHex (str) {
      let cropStr = str.replace('https:///tx/', '')
      // console.log(cropStr)
      // const raw = this.b64_to_utf8(cropStr)
      // const raw = this.btoaUTF16(cropStr)
      // const raw = this.atobUTF16(cropStr)
      const raw = atob(cropStr)
      // const raw = cropStr
      let result = ''
      for (let i = 0; i < raw.length; i++) {
        const hex = raw.charCodeAt(i).toString(16)
        result += (hex.length === 2 ? hex : '0' + hex)
      }
      return result.toLowerCase()
    },
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
      // const deepLinkMobile = 'minter:///tx?d=' + this.base64ToHex(prepareLink(txParams, ''))
      const deepLinkMobile = prepareLink(txParams, 'minter://').replace('https://', '')
      // const deepLinkMobile = prepareLink(txParams)
      if (Platform.is.desktop) {
        this.deepLink = prepareLink(txParams)
      } else {
        this.deepLink = deepLinkMobile
      }
      QRCode.toDataURL(deepLinkMobile, opts).then(url => {
        this.qrImage = url
      }).catch(err => {
        this.$q.notify({
          message: err,
          color: 'purple'
        })
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
