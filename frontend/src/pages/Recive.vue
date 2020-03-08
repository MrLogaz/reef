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
// import { prepareLink, TX_TYPE } from 'minter-js-sdk'
import QRCode from 'qrcode'
import { Platform, copyToClipboard } from 'quasar'
export default {
  name: 'Recive',
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
    generateDeepQRcode () {
      const opts = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 200,
        margin: 0
      }
      // const txParams = {
      //   type: TX_TYPE.SEND,
      //   data: {
      //     to: this.address,
      //     value: this.deeplinkAmount,
      //     coin: 'BIP'
      //   }
      // }
      this.$store.dispatch('FETCH_DEEPLINK', {
        address: this.address,
        amount: this.deeplinkAmount
      }).then(data => {
        console.log(data)
        // this.deepLink = prepareLink(txParams)
        if (Platform.is.desktop) {
          this.deepLink = data.web
        } else {
          this.deepLink = data.mobile
        }
        QRCode.toDataURL(this.deepLink, opts).then(url => {
          this.qrImage = url
        }).catch(err => {
          this.$q.notify({
            message: err,
            color: 'purple'
          })
          // console.error(err)
        })
      })
      // let deepLinkTmp = prepareLink(txParams, 'minter://')
      // this.deepLink = deepLinkTmp.replace('https://minter://', 'minter://')
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
