<template>
  <q-page padding>
    <div v-if="products">
      <div class="text-h5 text-center full-width q-mb-md q-mt-md text-indigo-10">{{ product.title }}</div>
      <q-img contain v-if="product.image_url" :src="'http://' + product.image_url" spinner-color="primary" spinner-size="82px" style="width: 100%; max-height: 250px" />
      <div class="q-mt-md text-subtitle2" v-html="product.brief"></div>

      <q-separator class="q-mt-md" color="indigo" />

      <div class="q-mt-md q-mb-lg">
        <div class="text-h5 text-center full-width q-mb-md text-indigo-10">{{ $t('Buy certificate') }}</div>
        <div class="row justify-center">
          <div class="col-sm-8 col-xs-12">
            <!-- <q-input class="product__select q-mt-md"
              v-model="email"
              type="email"
              label="Email *"
              clearable
              outlined
              hint="A certificate will come to this mail"
            /> -->
            <q-select class="product__select"
              outlined
              v-model="selectFaces"
              :options="product.faces"
              :label="$t('Choose certificate')"
              :error="amountIsError && amountNotEnough > 0"
              :error-message="amountErrorMsg"
              :display-value="selectFaces ? selectFaces + ' rub' : ''"
            >
              <template v-slot:option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                  v-if="scope.opt > 0"
                >
                  <q-item-section>
                    <q-item-label><b>{{ scope.opt }} rub</b>&nbsp;&nbsp;=&nbsp;&nbsp;<span>{{ bipPrice(scope.opt) }} bip</span></q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:after>
                <q-btn @click="buy()" size="md" :disabled="amountIsError" color="indigo" stack icon="shopping_cart" :label="$t('Buy for ') + bipPrice(selectFaces) + ' bip'" />
              </template>
            </q-select>
          </div>
        </div>
        <not-enough v-if="amountIsError && amountNotEnough > 0" :amount="amountNotEnough" />
      </div>

      <q-separator class="q-mt-lg q-mb-lg" color="indigo-10" />
      <div class="text-center">
        <q-btn push @click="dialogDisclaimer = true" :label="$t('Disclaimer')" />
      </div>

      <q-dialog v-model="dialogDisclaimer">
        <q-card class="dialog-min300">
          <q-card-section>
            <div class="text-h6">{{ $t('Disclaimer') }}</div>
          </q-card-section>
          <q-card-section>
            <div v-html="product.disclaimer"></div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="txReady" size="md" position="bottom">
        <q-card class="dialog-min300 text-center">
          <q-card-section>
            <div>
              <q-icon color="secondary" name="done" size="5em" />
            </div>
            <div class="text-h6">{{ $t('Payment was successful!') }}</div>
            <div class="text-subtitle1">{{ $t('After a few seconds, the certificate will be ready') }}</div>
          </q-card-section>
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
import { TX_TYPE } from 'minterjs-tx'
import { getFeeValue } from 'minterjs-util'
import Big from 'big.js'
import notEnough from '../../components/NotEnough.vue'
export default {
  name: 'Settings',
  components: {
    'not-enough': notEnough
  },
  data () {
    return {
      certificateDialog: false,
      email: null,
      certificateHash: null,
      selectFaces: null,
      dialogDisclaimer: false,
      productId: null,
      product: null,
      amountIsError: true,
      amountNotEnough: 0,
      amountErrorMsg: null,
      checkFee: getFeeValue(TX_TYPE.REDEEM_CHECK),
      txReady: false
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
      this.amountIsError = false
      this.amountNotEnough = 0
      if (this.selectFaces && this.selectFaces > 0) {
        if (Big(this.balanceRUB).gte(this.selectFaces)) {
          return true
        } else {
          this.amountIsError = true
          let notEnough = Big(this.selectFaces).div(this.currency.biptorub).minus(this.balanceBIP).plus(this.checkFee)
          this.amountNotEnough = notEnough.round(1, 3).toString()
          this.amountErrorMsg = this.$t('Not enough ') + this.amountNotEnough + ' bip'
          // this.amountNotEnough = Big(this.selectFaces).minus(this.balanceRUB)
          return false
        }
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
          password: 'pass',
          nonce: nonce,
          chainId: 1,
          coin: 'BIP',
          value: amount.toString(),
          dueBlock: 999999999
        })
        const buyData = {
          check,
          strategy: 'giftery',
          product: {
            merchantId: this.productId,
            name: this.product.title,
            face: this.selectFaces
          }
        }
        this.selectFaces = null
        this.$store.commit('SET_SENDING', true)
        this.$store.dispatch('REEF_API', ['giftery', 'pay', buyData]).then(response => {
          this.$store.commit('SET_SENDING', false)
          this.txReady = true
          this.$store.commit('ADD_SERTIFICATES', {
            hash: response.orderHash,
            name: this.product.title,
            face: buyData.face
          })
          this.$store.dispatch('FETCH_BALANCE')
          this.$store.dispatch('LOAD_SERTIFICATE', response.orderHash).then(certificate => {
            this.certificateHash = response.orderHash
            this.txReady = false
            this.certificateDialog = true
          }).catch(error => {
            this.$store.commit('SET_TXERROR', error)
            console.log(error)
          })
        }).catch(error => {
          this.$store.dispatch('FETCH_BALANCE')
          this.$store.commit('SET_SENDING', false)
          this.$store.commit('SET_TXERROR', error)
        })
      }
    }
  },
  computed: {
    ...mapState({
      currency: state => state.api.currency,
      balance: state => state.api.balance,
      balanceBIP: state => state.api.balanceBIP,
      balanceRUB: state => state.api.balanceRUB,
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
    },
    selectFaces (val) {
      this.checkBuy()
    }
  }
}
</script>
