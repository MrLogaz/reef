<template>
  <q-page padding>
    <!-- <q-btn flat class="q-pl-none" label="Back" color="primary" icon="keyboard_backspace" v-go-back="'/' + seedkey + '/'" /> -->
    <div class="text-h5 text-center full-width q-mb-md q-mt-md text-bold text-indigo-10" v-if="category">
      {{ language === 'ru' ? category.title : category.title_en.length ? category.title_en : category.code }}
    </div>
    <div class="row justify-center" v-if="products && products.length">
      <div class="col-sm-6 col-xs-12" v-for="product in products" :key="product.id">
        <q-btn flat no-caps dense class="product-giftery q-ma-sm q-pa-none" :to="'/' + seedkey + '/product/' + product.id">
          <q-card>
            <q-img contain v-if="product.image_url" :src="'http://' + product.image_url" spinner-color="primary" spinner-size="82px" style="width: 100%" />
            <q-separator />
            <q-card-section>
              <div class="text-h6">{{ product.title }}</div>
              <div v-if="product.face_min != product.face_max" class="text-subtitle1">{{ product.face_min }} - {{ product.face_max }} rub</div>
              <div v-else class="text-subtitle1">{{ product.face_min }} rub</div>
            </q-card-section>
          </q-card>
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Category',
  data () {
    return {
      categoryId: null,
      category: null,
      products: null
    }
  },
  created () {
    if (this.$route.params.categoryId && this.$route.params.categoryId !== '') {
      this.categoryId = this.$route.params.categoryId
      if (this.categories) {
        this.category = this.getCategory(this.categoryId)
        this.products = this.getProducts(this.categoryId)
      }
    }
  },
  mounted () {
  },
  methods: {
    // 123
  },
  computed: {
    ...mapState({
      seedkey: state => state.wallet.seedkey,
      categories: state => state.api.categories,
      language: state => state.app.language
    }),
    ...mapGetters([
      'getCategory',
      'getProducts'
    ])
  },
  watch: {
    categories (val) {
      if (val && val.length && this.categoryId) {
        this.category = this.getCategory(this.categoryId)
        this.products = this.getProducts(this.categoryId)
      }
    }
  }
}
</script>
