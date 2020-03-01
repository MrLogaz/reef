<template>
  <q-page padding>
    <div v-if="product" class="">
      <div class="text-h5 text-center full-width q-mb-md q-mt-md text-bold text-indigo-10">{{ product.title }}</div>
      <q-img contain v-if="product.image_url" :src="'http://' + product.image_url" spinner-color="primary" spinner-size="82px" style="width: 100%; max-height: 250px" />
      <div class="q-mt-md text-subtitle2">{{ product.brief }}</div>

      <q-separator class="q-mt-md" color="indigo" />

      <div class="q-mt-md q-mb-lg">
        <div class="text-h6 text-center full-width q-mb-md text-bold text-indigo-10">Buy certificate</div>
        <div class="row justify-center">
          <div class="col-sm-8 col-xs-12">
            <div v-if="balance" class="text-subtitle1 text-center text-bold text-indigo-10">You have {{ parseFloat(balance.total_balance_sum) }} bip</div>
            <div v-if="balance" class="text-subtitle2 text-center text-grey">~ {{ bipRub(balance.total_balance_sum) }} rub | ~ {{ parseFloat(balance.total_balance_sum_usd) }} usd</div>
            <!-- <q-input class="product__select q-mt-md"
              v-model="email"
              type="email"
              label="Email *"
              clearable
              outlined
              hint="A certificate will come to this mail"
            /> -->
            <q-select class="product__select q-mt-md"
              outlined
              v-model="selectFaces"
              :options="product.faces"
              label="Choose certificate"
              :display-value="selectFaces ? selectFaces + ' rub' : ''"
            >
              <template v-slot:option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section>
                    <q-item-label><b>{{ scope.opt }} rub</b>&nbsp;&nbsp;=&nbsp;&nbsp;<span>{{ bipPrice(scope.opt) }} bip</span></q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:after>
                <q-btn @click="buy()" :disabled="!checkBuy()" size="md" color="indigo" stack icon="shopping_cart" :label="'Buy for ' + bipPrice(selectFaces) + ' bip'" />
              </template>
            </q-select>
          </div>
        </div>
      </div>

      <q-separator class="q-mt-lg q-mb-md" color="indigo" />
      <div class="text-right">
        <q-btn flat @click="dialogDisclaimer = true" label="Disclaimer" color="indigo-4" />
      </div>

      <q-dialog v-model="dialogDisclaimer">
        <q-card class="dialog-min300">
          <q-card-section>
            <div class="text-h6">Disclaimer</div>
          </q-card-section>
          <q-card-section>
            <div v-html="product.disclaimer"></div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="certificateDialog">
        <q-card class="dialog-min300 text-center">
          <q-card-section>
            <div>
              <q-icon color="secondary" name="done" size="5em" />
            </div>
            <div class="text-h6">{{ $t('Your certificate is ready') }}</div>
            <q-btn type="a" target="_blank" :href="reefApi + 'certificate/' + certificateHash + '.pdf'" color="positive" :label="$t('Open certificate')" size="1.2em" class="full-width q-mt-md" />
          </q-card-section>
        </q-card>
      </q-dialog>
      <br>
      <br>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { issueCheck } from 'minter-js-sdk'
import Big from 'big.js'
export default {
  name: 'Settings',
  data () {
    return {
      certificateDialog: false,
      email: null,
      certificateHash: null,
      selectFaces: null,
      dialogDisclaimer: false,
      productId: null,
      product: null
    }
  },
  created () {
    if (this.$route.params.productId && this.$route.params.productId !== '') {
      this.productId = this.$route.params.productId
      if (this.products) {
        this.product = this.getProduct(this.productId)
      }
    }
  },
  methods: {
    checkBuy () {
      if (this.selectFaces && this.selectFaces > 0) {
        let balanceRub = new Big(this.balance.total_balance_sum).times(this.currency.biptorub)
        if (balanceRub.gt(this.selectFaces)) {
          return true
        } else return false
      } else return false
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
    },
    buy () {
      if (this.checkBuy()) {
        let amount = new Big(this.selectFaces).div(this.currency.biptorub).round()
        let nonce = new Date().getTime() - 1582480000000
        const check = issueCheck({
          privateKey: this.privateKey,
          passPhrase: 'pass',
          nonce: nonce,
          chainId: 1,
          coin: 'BIP',
          value: amount.toString(),
          dueBlock: 999999999
        })
        const buyData = {
          check: check,
          product: this.productId,
          face: this.selectFaces,
          address: this.address
        }
        this.selectFaces = null
        this.$store.commit('SET_SENDING', true)
        this.$store.dispatch('SEND_CHECK', buyData).then(response => {
          this.$store.commit('SET_SENDING', false)
          this.$store.commit('SET_TXREADY', true)
          this.$store.commit('ADD_SERTIFICATES', {
            hash: response.orderHash,
            name: this.product.title,
            face: buyData.face
          })
          this.$store.dispatch('FETCH_BALANCE')
          this.$store.dispatch('LOAD_SERTIFICATE', response.orderHash).then(certificate => {
            this.certificateHash = response.orderHash
            this.$store.commit('SET_TXREADY', false)
            this.certificateDialog = true
          }).catch(error => {
            console.log(error)
          })
        }).catch(error => {
          this.$store.commit('SET_SENDING', false)
          console.log(error)
        })
      }
    }
  },
  computed: {
    ...mapState({
      currency: state => state.api.currency,
      balance: state => state.api.balance,
      reefApi: state => state.api.reefApi,
      products: state => state.api.products,
      privateKey: state => state.wallet.privateKey,
      address: state => state.wallet.address
    }),
    ...mapGetters([
      'getProduct'
    ])
  },
  watch: {
    products (val) {
      if (val && val.length && this.productId) {
        this.product = this.getProduct(this.productId)
      }
    }
  }
}
</script>
