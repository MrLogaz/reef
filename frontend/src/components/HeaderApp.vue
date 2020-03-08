<template>
  <div>
    <q-header bordered elevated class="bg-white text-primary">
      <q-toolbar>
        <img color="white" class="q-ml-sm q-mr-md" text-color="white" width="32px" src="statics/icons/Icon-88.png">
        <div>
          <div class="text-h6 text-indigo-10 desktop-only">REEF Push</div>
          <div class="text-indigo-10 mobile-only">REEF Push</div>
          <q-item-label caption>{{ $t('Easy way to send a value') }}</q-item-label>
        </div>
        <!-- <q-item class="q-pl-xs">
          <q-item-section avatar>
            <q-avatar color="white" class="desktop-only" text-color="white" size="42px">
              <img src="statics/icons/Icon-120.png">
            </q-avatar>
            <q-avatar color="white" class="mobile-only" text-color="white" size="36px">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="text-h6 text-indigo-10 desktop-only">REEF Push</div>
            <div class="text-indigo-10 mobile-only">REEF Push</div>
            <q-item-label caption>{{ $t('Easy way to send a value') }}</q-item-label>
          </q-item-section>
        </q-item> -->
        <q-space />
        <q-btn color="indigo-10" round outline dense class="q-mr-sm" :label="language.substr(0,2)" @click="alertLang = true" />
        <q-btn color="indigo-10" dense flat :to="'/' + seedkey + '/settings'" name="settings" label="" icon="settings" />
      </q-toolbar>

      <q-separator class="q-mt-sm" color="indigo" />
      <div class="bg-indigo-9 text-white text-weight-thin q-pa-sm q-pr-md q-pl-md full-width row justify-between">
        <div class="row">
          <img src="~assets/icons/coins_100px.png" width="34px" class="self-center q-mr-md" />
          <!-- <q-icon color="indigo-3" name="img:~assets/icons/coins_100px.png" size="36px" class="self-center q-mr-md" /> -->
          <!-- <q-icon color="indigo-3" name="account_balance_wallet" size="36px" class="self-center q-mr-md" /> -->
          <!-- <i class="las la-coins self-center q-mr-md" style="font-size: 3em"></i> -->
          <div>
            <div v-if="language === 'en-us'" style="font-size: 1.6em; line-height: 1.2em">{{ balanceUSD }}&nbsp;&nbsp;USD</div>
            <div v-else style="font-size: 1.6em; line-height: 1.2em">{{ balanceRUB }}&nbsp;&nbsp;RUB</div>
            <div style="font-size: 1.2em;">{{ balanceBIP }}&nbsp;&nbsp;BIP</div>
          </div>
        </div>
        <div class="self-center">
          <q-btn dense class="text-weight-thin q-pl-xs q-pr-xs" outline @click="dialogShare = true" :label="$t('Share')" icon="share" />
        </div>
      </div>

      <div v-if="!hideMsg && (from || message)">
        <div class="q-pa-md text-grey-10" style="position: relative;">
          <q-btn icon="close" @click="hideMsg = true" flat round style="position: absolute; right: 20px; top: 8px;" />
          <div v-if="from" class="text-caption text-grey">{{ $t('From') }}</div>
          <div v-if="from" style="font-size: 1.4em; line-height: 1em;">{{ from }}</div>
          <div v-if="message" class="text-caption text-grey q-mt-md">{{ $t('Message') }}</div>
          <div v-if="message" style="font-size: 1.4em">{{ message }}</div>
        </div>
        <q-separator color="indigo" />
      </div>

      <q-tabs v-model="headerTab" align="justify" inline-label class="bg-white text-indigo-10">
        <q-route-tab :to="'/' + seedkey + '/gift'" name="gift" :label="$t('Gift')" icon="card_giftcard" style="min-width: 140px" />
        <q-route-tab :to="'/' + seedkey + '/recive'" name="recive" :label="$t('Receive')" icon="system_update_alt" />
        <!-- <q-route-tab :to="'/' + seedkey + '/settings'" name="settings" label="" icon="settings" /> -->
      </q-tabs>
    </q-header>

    <q-dialog v-model="dialogShare">
      <q-card class="dialog-min300">
        <q-card-section>
          <div class="text-h5 full-width q-mb-md text-indigo-10">{{ $t('Add message') }}</div>
          <q-input
            v-model="shareFrom"
            :label="$t('From')"
            class="q-mb-md"
            clear-icon="close"
            clearable
            outlined
          />
          <q-input
            v-model="shareMsg"
            :label="$t('Message')"
            clear-icon="close"
            clearable
            outlined
          />
          <div class="text-h5 full-width q-mb-md q-mt-md text-indigo-10">{{ $t('Share link') }}</div>
          <q-input outlined v-model="shareUrl" :label="$t('Copy address')" stack-label readonly @click="copyUrl()">
            <template v-slot:after>
              <q-btn v-if="shareTest()" round @click="share(shareUrl)" color="positive" icon="share" />
              <q-btn v-else icon="file_copy" flat round @click="copyUrl()" />
            </template>
          </q-input>
          <div class="text-center q-mt-md">
            <img :src="shareQRCode">
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="alertLang">
      <q-card class="dialog-min300">
        <q-card-section>
          <div class="text-h5 full-width q-mb-md q-mt-md text-indigo-10">{{ $t('Choose a language') }}</div>
          <q-list>
            <q-item tag="label" v-ripple v-for="lang in languageList" :key="lang.value">
              <q-item-section avatar>
                <q-radio v-model="language" :val="lang.value" color="teal" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ lang.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { openURL, copyToClipboard } from 'quasar'
import QRCode from 'qrcode'
export default {
  name: 'Index',
  data () {
    return {
      headerTab: 'gift',
      shareQRCode: null,
      alertLang: false,
      dialogShare: false,
      hideMsg: false,
      shareFrom: null,
      shareMsg: null,
      shareUrl: null,
      languageList: [
        {
          label: 'English',
          value: 'en-us'
        }, {
          label: 'Russian',
          value: 'ru'
        }
      ]
    }
  },
  created () {
    this.generateQRcode()
  },
  methods: {
    generateQRcode () {
      this.shareUrl = 'https://push.reef.mn/' + this.seedkey + '/'
      if (this.shareFrom || this.shareMsg) this.shareUrl += '?'
      if (this.shareFrom) {
        this.shareUrl += 'f=' + encodeURIComponent(this.shareFrom)
        if (this.shareMsg) this.shareUrl += '&m=' + encodeURIComponent(this.shareMsg)
      } else if (this.shareMsg) this.shareUrl += 'm=' + encodeURIComponent(this.shareMsg)
      const opts = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 200,
        margin: 0
      }
      QRCode.toDataURL(this.shareUrl, opts).then(url => {
        this.shareQRCode = url
      }).catch(err => {
        this.$q.notify({
          message: err,
          color: 'purple'
        })
        // console.error(err)
      })
    },
    shareTest () {
      if (navigator.share) return true
      else return false
    },
    share () {
      navigator.share({
        title: 'Подарочный кошелек',
        url: this.shareUrl
      })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error))
    },
    copyUrl () {
      copyToClipboard(this.shareUrl)
      this.$q.notify({
        message: this.$t('Address copied'),
        color: 'purple',
        position: 'bottom',
        timeout: 400
      })
    },
    clickLink (link) {
      openURL(link)
    },
    openLink (val) {
      let newWindow = window.open(val, '_blank')
      newWindow.focus()
    }
  },
  computed: {
    ...mapState({
      from: state => state.app.from,
      message: state => state.app.message,
      reefApi: state => state.api.reefApi,
      urlKey: state => state.wallet.urlKey,
      seedkey: state => state.wallet.seedkey,
      balance: state => state.api.balance,
      balanceUSD: state => state.api.balanceUSD,
      balanceRUB: state => state.api.balanceRUB,
      balanceBIP: state => state.api.balanceBIP
    }),
    language: {
      get () {
        return this.$store.state.app.language
      },
      set (value) {
        this.alertLang = false
        this.$store.commit('SET_LANG', value)
      }
    }
  },
  watch: {
    shareMsg () {
      this.generateQRcode()
    },
    shareFrom () {
      this.generateQRcode()
    }
  }
}
</script>
