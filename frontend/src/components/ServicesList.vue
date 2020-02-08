<template>
  <div>
    <div class="row">
      <div class="col-sm-4 col-xs-6">
        <div class="card-app">
          <q-btn to="/gift/biptophone" no-caps>
            <q-avatar color="red" size="3.5em" text-color="white">
              <q-icon name="phone_iphone" size="1.2em" />
            </q-avatar>
            <div class="q-pt-sm">{{ $t('Top up phone balance') }}</div>
          </q-btn>
        </div>
      </div>

      <div class="col-sm-4 col-xs-6">
        <div class="card-app">
          <q-btn class="card-app" no-caps @click="createWallet">
            <q-avatar color="red" size="3.5em" text-color="white">
              <q-icon name="account_balance_wallet" size="1.2em" />
            </q-avatar>
            <div class="q-pt-sm">{{ $t('Create wallet') }}</div>
          </q-btn>
        </div>
      </div>

      <div class="col-sm-4 col-xs-6">
        <div class="card-app">
          <q-btn :disabled="true" class="card-app" no-caps>
            <q-avatar color="grey" size="3.5em" text-color="white">
              <q-icon name="fastfood" size="1.2em" />
            </q-avatar>
            <div class="q-pt-sm">{{ $t('Buy eda.yandex') }}</div>
          </q-btn>
        </div>
      </div>
      <div class="col-sm-4 col-xs-6">
        <div class="card-app">
          <q-btn :disabled="true" class="card-app" no-caps>
            <q-avatar color="grey" size="3.5em" text-color="white">
              <q-icon name="credit_card" size="1.2em" />
            </q-avatar>
            <div class="q-pt-sm">{{ $t('Card transfer') }}</div>
          </q-btn>
        </div>
        </div>
    </div>

    <q-dialog v-model="soonDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300 text-center q-pt-lg q-pb-lg">
        <div class="text-h4">SOON</div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import { openURL } from 'quasar'
export default {
  name: 'Apps',
  components: {
    // 'service-biptophone': ServiceBiptophone
    // Carousel,
    // Slide
  },
  data () {
    return {
      biptophone: false,
      soonDialog: false
    }
  },
  methods: {
    createWallet () {
      openURL('https://cp002.cloudp.group/?#/hello?key=' + this.urlKey)
    }
  },
  computed: {
    ...mapState({
      urlKey: state => state.wallet.urlKey,
      currency: state => state.api.currency,
      balance: state => state.api.balance,
      balanceJSON: state => state.api.balanceJSON
    })
  }
}
</script>

<style>
  .card-app {
    padding: 0 5px 7px;
  }
  .card-app .q-btn {
    padding: 5px 0;
    font-size: 14px;
    line-height: 1.2em;
    font-weight: 500;
    min-height: 128px
  }
</style>
