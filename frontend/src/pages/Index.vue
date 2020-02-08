<template>
  <q-page class="flex flex-center">
    <div>
      <q-header bordered class="bg-white text-primary">
        <q-toolbar>
          <q-item>
            <q-item-section avatar>
              <q-avatar color="white" class="desktop-only" text-color="white" size="60px">
                <img src="statics/icons/Icon-120.png">
              </q-avatar>
              <q-avatar color="white" class="mobile-only" text-color="white" size="44px">
                <img src="statics/icons/Icon-88.png">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <div class="text-h4 desktop-only">REEF Push</div>
              <div class="text-h6 mobile-only">REEF Push</div>
              <q-item-label caption>{{ $t('Easy way to send a value') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-space />
          <q-btn round color="teal" :label="language.substr(0,2)" @click="alertLang = true"></q-btn>
        </q-toolbar>
      </q-header>
      <q-dialog v-model="alertLang">
        <q-card class="dialog-min300">
          <q-card-section>
            <div class="text-h6">{{ $t('Choose a language') }}</div>
          </q-card-section>
          <q-card-section>
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
          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-stepper
        v-model="step"
        vertical
        class="q-mt-none"
        style="min-width: 360px"
        color="primary"
        animated
        header-nav
      >
        <q-step
          :name="2"
          :title="`1. ${ $t('Send coins') }`"
          icon="card_giftcard"
          active-icon="card_giftcard"
        >
          <q-tabs
            v-model="tab"
            dense
            inline-label
            align="justify"
            class="bg-primary text-white shadow-2 q-mt-sm"
          >
            <q-tab name="address" :label="$t('Address')" />
            {{ $t('or') }}
            <q-tab name="DeepLink" label="DeepLink" @click="actionWallet()" />
          </q-tabs>
          <q-tab-panels v-model="tab"
            animated
            transition-prev="jump-right"
            transition-next="jump-left"
          >
            <q-tab-panel name="address">
              <div style="height: 240px;">
                <div class="text-subtitle1 q-pb-sm">{{ $t('Send coins to address') }}</div>
                <q-input outlined v-model="address" :label="$t('Copy address')" stack-label readonly @click="copyAddress()">
                  <template v-slot:after>
                    <q-btn icon="file_copy" flat round @click="copyAddress()" />
                  </template>
                </q-input>
                <div class="q-pt-sm">
                  <div class="text-subtitle1 q-pb-sm">{{ $t('Use web wallet') }}</div>
                  <q-btn type="a" color="purple" target="_blank" icon="account_balance_wallet" href="https://wallet.bip.to/send" label="Open wallet.bip.to" /><br>
                  <q-btn type="a" color="deep-orange-8" class="q-mt-sm" target="_blank" icon="account_balance_wallet" href="https://console.minter.network/" label="Open console.minter" />
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="DeepLink" style="padding-left: 0; padding-right: 0;">
              <div style="height: 240px">
                <q-input
                  v-model.number="deeplinkAmount"
                  type="number"
                  :label="$t('Amount') + ' BIP'"
                  clearable
                  outlined
                  dense
                />
                <div class="q-pt-lg mobile-only">
                  <div class="text-subtitle1 q-pb-sm">{{ $t('DeepLink open wallet') }}</div>
                  <q-btn @click="actionWallet()" type="a" color="purple" target="_blank" icon="account_balance_wallet" :href="deepLink" label="Open BIP Wallet" />
                </div>
                <div class="text-center desktop-only">
                  <img class="q-mt-sm" style="max-width: 100%;" :src="qrImage">
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
          <q-separator />
          <q-stepper-navigation>
            <!-- <q-spinner-ios color="grey-8" size="30px" />
            <span class="q-pl-md text-grey-8">{{ $t('Waiting for coins') }}</span> -->
            <q-item class="q-pt-none q-pb-none">
              <q-item-section avatar>
                <q-btn :loading="balanceUpdateLoading" v-if="balance && parseFloat(balance.total_balance_sum) > 0" size="12px" color="secondary" round @click="checkBalance()">
                  <q-icon name="autorenew" size="24px" />
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
                <q-spinner-ios v-else color="grey-8" size="30px" />
              </q-item-section>
              <q-item-section v-if="balance && parseFloat(balance.total_balance_sum) > 0">
                <div class="text-grey-8">{{ $t('Update balance') }}</div>
                <q-item-label caption>{{ $t('Balance') }}: {{ balance && parseFloat(balance.total_balance_sum) > 0 ? prettyNumber(balance.total_balance_sum, 3) : 0 }} Bip</q-item-label>
              </q-item-section>
              <q-item-section v-else>
                <div class="text-grey-8">{{ $t('Waiting for coins') }}</div>
                <q-item-label caption>{{ $t('Balance') }}: 0 Bip</q-item-label>
              </q-item-section>
            </q-item>
            <!-- <q-btn @click="checkBalance()" :loading="true" style="width: 200px" color="primary" :label="$t('Waiting for coins')">
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                {{ $t('Waiting for coins') }}
              </template>
            </q-btn> -->
          </q-stepper-navigation>
        </q-step>
        <q-step
          :name="3"
          :title="`2. ${ $t('Share link') }`"
          icon="done"
          active-icon="done"
          :header-nav="balance && parseFloat(balance.total_balance_sum) > 0"
        >
          <div class="text-subtitle1">
            <b>{{ $t('Gift balance') }}</b>
            <span class="text-subtitle1 text-grey-6"> ({{ address.substr(0,4) + "..." + address.substr(-4) }})</span>
          </div>
          <div class="text-subtitle1">
            {{ balance && parseFloat(balance.total_balance_sum) > 0 ? prettyNumber(balance.total_balance_sum, 3) : 0 }} BIP
            <span class="text-grey-6">(~ {{ balance && parseFloat(balance.total_balance_sum) > 0 ? prettyNumber(balance.total_balance_sum_usd, 2) : 0 }} usd)</span>
          </div>

          <q-btn class="q-mt-sm q-pr-sm q-pl-sm" @click="addMessageDialog = true" dense color="primary" :label="$t('Add message')" />

          <div class="text-subtitle1 q-pb-sm q-pt-md">{{ $t('Send this link to your friend') }}</div>
          <!-- :hint="$t('Link already copied')" -->
          <q-input
            v-model="resultLink"
            outlined
            :label="$t('Copy link')"
            stack-label
            readonly
            @click="copyLink()"
          >
            <template v-slot:after>
              <q-btn icon="file_copy" flat round @click="copyLink()" />
            </template>
          </q-input>
          <div class="q-pt-md" v-if="shareTest()">
            <q-btn @click="share(resultLink)" color="positive" icon="share" label="Share" />
          </div>
          <div class="text-subtitle1 q-pb-sm q-pt-sm">
            {{ $t('or') }}
          </div>
          <div class="">
            <q-btn @click="shareQRcode = true" class="q-mb-sm q-mr-sm" color="deep-purple" size="0.85em" icon="select_all" :label="$t('QR code')" />
            <!-- <q-btn @click="sendEmailDialog = true" class="q-mb-sm q-mr-sm" color="deep-purple" size="0.85em" icon="email" label="Email" /> -->
            <q-btn :disabled="true" class="q-mb-sm q-mr-sm" color="deep-purple" size="0.85em" icon="email" label="Email" />
            <br />
            <q-btn class="q-mb-sm q-mr-sm" :disabled="true" color="deep-purple" size="0.85em" icon="textsms" label="SMS" />
          </div>
        </q-step>
      </q-stepper>

      <q-dialog v-model="shareQRcode">
        <q-card>
          <q-card-section class="text-center">
            <img :src="shareQRImage">
            <br>
            <q-btn @click="downloadShareQR" class="q-mt-sm" color="deep-purple" icon="get_app" :label="$t('Download')" />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="addMessageDialog">
        <q-card class="dialog-min300">
          <q-card-section>
            <div class="q-pt-md">
              <q-input
                clearable
                outlined
                v-model="username"
                :label="$t('Receiver name')"
              />
              <q-input
                class="q-pt-md"
                clearable
                outlined
                v-model="from"
                :label="$t('Sender name')"
              />
              <q-input
                class="q-pt-md"
                clearable
                outlined
                v-model="message"
                :label="$t('Message')"
              />
            </div>
            <div class="text-grey-6 q-pb-sm q-pt-md">{{ $t('Fields are optional') }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat :label="$t('Add message')" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="sendEmailDialog">
        <q-card class="dialog-min300">
          <q-card-section>
            <div class="q-pt-md">
              <q-input
                v-model="emailUser"
                clearable
                outlined
                label="Email"
              />
            </div>
            <!-- <div class="text-grey-6 q-pb-sm q-pt-md">{{ $t('Fields are optional') }}</div> -->
          </q-card-section>
          <q-card-actions align="right">
            <q-btn @click="sendEmailAction" flat :label="$t('Send email')" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { wordlists } from 'bip39'
import { prepareLink, TX_TYPE } from 'minter-js-sdk'
import QRCode from 'qrcode'
import { generateMnemonic, walletFromMnemonic } from 'minterjs-wallet'
import { copyToClipboard } from 'quasar'
export default {
  name: 'Index',
  data () {
    return {
      tab: 'address',
      alertLang: false,
      addMessageDialog: false,
      sendEmailDialog: false,
      shareQRcode: false,
      languageList: [
        {
          label: 'English',
          value: 'en-us'
        }, {
          label: 'Russian',
          value: 'ru'
        }
      ],
      deeplinkAmount: 10,
      mnemonic: null,
      step: 2,
      username: null,
      from: null,
      message: null,
      isPassword: false,
      mnemonicKey: null,
      isActionWallet: false,
      wallet: null,
      balance: null,
      balanceUpdateLoading: false,
      address: null,
      qrImage: null,
      emailUser: null,
      shareQRImage: null,
      deepLink: null,
      resultLink: null
    }
  },
  created () {
    this.mnemonic = generateMnemonic()
    this.wallet = walletFromMnemonic(this.mnemonic)
    this.address = this.wallet.getAddressString()

    this.generateDeepQRcode()
    this.generateLink()
  },
  methods: {
    generateDeepQRcode () {
      const opts = {
        errorCorrectionLevel: 'H',
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
      let deepLinkTmp = prepareLink(txParams, 'minter://')
      this.deepLink = deepLinkTmp.replace('https://minter://', 'minter://')

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
    openLink (val) {
      let newWindow = window.open(val, '_blank')
      newWindow.focus()
    },
    copyToClipboard (val) {
      copyToClipboard(val)
    },
    copyAddress () {
      copyToClipboard(this.address)
      this.$q.notify({
        message: this.$t('Address copied'),
        color: 'purple',
        position: 'bottom',
        timeout: 400
      })
      this.actionWallet()
    },
    prettyNumber (summ, length) {
      let num = parseFloat(parseFloat(summ).toFixed(length))
      let parts = num.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      return parts.join('.')
    },
    copyLink () {
      copyToClipboard(this.resultLink)
      this.$q.notify({
        message: this.$t('Link copied'),
        color: 'purple',
        position: 'bottom',
        timeout: 400
      })
    },
    actionWallet () {
      if (!this.isActionWallet) {
        setTimeout(this.checkBalance, 8000)
        this.isActionWallet = true
      }
    },
    shareTest () {
      if (navigator.share) return true
      else return false
    },
    share () {
      navigator.share({
        title: 'Подарочный кошелек c бонусом',
        text: 'Переходи для получения',
        url: this.resultLink
      })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error))
    },
    downloadShareQR () {
      let link = document.createElement('a')
      link.download = 'qr-push-gift.png'
      link.href = this.shareQRImage
      link.click()
    },
    checkBalance () {
      this.balanceUpdateLoading = true
      this.$axios.get(`https://explorer-api.minter.network/api/v1/addresses/${this.address}?withSum=true`).then(data => {
        setTimeout(() => { this.balanceUpdateLoading = false }, 350)
        if (data && data.data && data.data.data && parseFloat(data.data.data.total_balance_sum) > 0) {
          this.balance = data.data.data
          this.step = 3
        } else {
          if (this.balance === null) {
            setTimeout(this.checkBalance, 4000)
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    sendEmailAction () {
      if (this.emailUser) {
        this.$store.dispatch('SEND_EMAIL', {
          email: this.emailUser,
          username: this.username,
          from: this.from,
          message: this.message
        }).then(response => {
          console.log(response)
        })
      }
    },
    generateLink () {
      this.mnemonicKey = this.mnemonic.split(' ').map(word => wordlists.english.indexOf(word)).join('.')
      if (this.isPassword) {
        // this.mnemonicKey К следующей версии
      }
      let usernameStr = this.username ? '&username=' + encodeURIComponent(this.username) : ''
      let fromStr = this.from ? '&from=' + encodeURIComponent(this.from) : ''
      let messageStr = this.message ? '&message=' + encodeURIComponent(this.message) : ''
      if (process.env.DEV || location.hostname === 'localhost') {
        this.resultLink = 'http://localhost:8080/#/gift?key=' + encodeURIComponent(this.mnemonicKey) + usernameStr + fromStr + messageStr
      } else {
        this.resultLink = 'https://push.reef.mn/#/gift?key=' + encodeURIComponent(this.mnemonicKey) + usernameStr + fromStr + messageStr
      }
      copyToClipboard(this.resultLink)

      const opts = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 200,
        margin: 0
      }
      QRCode.toDataURL(this.resultLink, opts).then(url => {
        this.shareQRImage = url
      }).catch(err => {
        console.error(err)
      })
    }
  },
  computed: {
    ...mapState({
      language: state => state.app.language
    }),
    language: {
      get () {
        return this.$store.state.app.language
      },
      set (value) {
        this.$store.commit('SET_LANG', value)
      }
    }
  },
  watch: {
    step (val) {
      if (val === 3) {
        this.generateLink()
        this.copyLink()
      }
    },
    deeplinkAmount () {
      this.generateDeepQRcode()
    },
    language (val) {
      this.$i18n.locale = val
    },
    username (val) {
      this.generateLink()
    },
    from (val) {
      this.generateLink()
    },
    message (val) {
      this.generateLink()
    }
  }
}
</script>
<style>
  .q-tab-panel {
    padding: 16px 0
  }
</style>
