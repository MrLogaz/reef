<template>
  <div>
    <div class="row justify-center q-mt-md">
      <div class="col-sm-4 col-xs-6">
        <div class="card-app category-giftery">
          <q-btn outline color="indigo-10" class="shadow-2" :to="'/' + seedkey + '/product/phone'" no-caps>
            <q-icon name="system_update" size="2em" />
            <div class="full-width text-subtitle1 text-uppercase">{{ $t('Phone') }}</div>
          </q-btn>
        </div>
      </div>
      <div class="col-sm-4 col-xs-6">
        <div class="card-app category-giftery">
          <q-btn outline color="indigo-10" class="shadow-2" :to="'/' + seedkey + '/product/minter'" no-caps>
            <q-icon name="account_balance_wallet" size="2em" />
            <div class="full-width text-subtitle1 text-uppercase">Minter</div>
          </q-btn>
        </div>
      </div>
    </div>
    <q-separator class="q-mt-md q-mb-md" color="indigo-10" />
    <div class="row justify-center" v-if="categories && categories.length">
      <div class="col-sm-4 col-xs-6" v-for="category in categories" :key="category.id">
        <div class="card-app category-giftery">
          <q-btn :to="'/' + seedkey + '/category/' + category.id" no-caps>
            <div class="full-width text-indigo-10 text-subtitle1">{{ language === 'ru' ? category.title : category.title_en.length ? category.title_en : category.code }}</div>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
export default {
  name: 'Strategy',
  components: {},
  data () {
    return {
      biptophone: false,
      soonDialog: false
    }
  },
  methods: {
    createWallet () {
      // openURL('https://cp002.cloudp.group/?#/hello?key=' + this.seedkey)
    }
  },
  computed: {
    ...mapState({
      seedkey: state => state.wallet.seedkey,
      currency: state => state.api.currency,
      categories: state => state.api.categories,
      balance: state => state.api.balance,
      language: state => state.app.language
    })
  }
}
</script>
