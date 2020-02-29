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
            <div class="text-subtitle1 text-center text-bold text-indigo-10">You have {{ parseFloat(balance.total_balance_sum) }} bip</div>
            <div class="text-subtitle2 text-center text-grey">~ {{ parseFloat(balance.total_balance_sum) * currency.biptorub }} rub | ~ {{ parseFloat(balance.total_balance_sum_usd) }} usd</div>
            <q-input class="product__select q-mt-md"
              v-model="email"
              type="email"
              label="Email *"
              clearable
              outlined
              hint="A certificate will come to this mail"
            />
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

      <q-dialog v-model="success">
        <q-card class="dialog-min300 text-center">
          <q-card-section>
            <div>
              <q-icon color="secondary" name="email" size="5em" />
            </div>
            <div class="text-h6">Письмо с сертификатом отправилось к вам на почту {{ email }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
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
      success: false,
      email: null,
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
      if (this.email && this.selectFaces && this.selectFaces > 0) {
        let balanceRub = new Big(this.balance.total_balance_sum).times(this.currency.biptorub)
        if (balanceRub.gt(this.selectFaces)) {
          return true
        } else return false
      } else return false
    },
    bipPrice (price) {
      if (price) {
        let toBip = Big(price).times(this.currency.biptorub)
        return toBip.toString()
      } else return '0'
    },
    buy () {
      if (this.checkBuy()) {
        let amount = new Big(this.selectFaces).times(this.currency.biptorub)
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
        this.$store.dispatch('SEND_CHECK', {
          check: check,
          product: this.productId,
          face: this.selectFaces,
          address: this.address,
          email: this.email
        }).then(response => {
          this.success = true
          this.$store.dispatch('FETCH_BALANCE')
          console.log(response)
        }).catch(error => {
          console.log(error)
        })
      }
    }
  },
  computed: {
    ...mapState({
      currency: state => state.api.currency,
      balance: state => state.api.balance,
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
