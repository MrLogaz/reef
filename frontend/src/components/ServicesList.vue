<template>
  <div>
    <!-- <div class="row justify-center">
      <div class="col-sm-4 col-xs-6">
        <div class="card-app">
          <q-btn :to="'/' + seedkey + '/biptophone/'" no-caps>
            <q-avatar color="orange" size="3.7em" text-color="white">
              <q-icon name="system_update" size="1.2em" />
            </q-avatar>
            <div class="full-width">{{ $t('Top up phone balance') }}</div>
          </q-btn>
        </div>
      </div>
      <div class="col-sm-4 col-xs-6">
        <div class="card-app">
          <q-btn to="/gift/biptophone" no-caps>
            <q-avatar color="orange" size="3.7em" text-color="white">
              <q-icon name="system_update" size="1.2em" />
            </q-avatar>
            <div class="full-width">{{ $t('Top up phone balance') }}</div>
          </q-btn>
        </div>
      </div>
    </div> -->
    <div class="row justify-center" v-if="categories && categories.length">
      <div class="col-sm-4 col-xs-6" v-for="category in categories" :key="category.id">
        <div class="card-app category-giftery">
          <q-btn :to="'/' + seedkey + '/category/' + category.id" no-caps>
            <div class="full-width text-indigo-10 text-bold text-subtitle1">{{ language === 'ru' ? category.title : category.title_en.length ? category.title_en : category.code }}</div>
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
