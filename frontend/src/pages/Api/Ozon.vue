<template>
  <q-page padding>
    <q-btn flat to="/api" color="primary" icon="keyboard_backspace" label="Back to Api" />
    <div class="q-pa-sm">
      <q-btn label="test" @click="test()" />
      <br>
      <br>
      <q-btn label="products" @click="getProducts()" />
      <br>
      <br>
      <q-btn label="updateGiftery" @click="updateGiftery()" />
    </div>
    <q-separator class="q-ma-md" />
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Index',
  data () {
    return {
      customResponse: null
    }
  },
  methods: {
    test () {
      console.log('test')
      let sendData = {}
      this.$axios.post(this.reefApi + 'strategy/ozon/status', sendData).then(data => {
        console.log(data.data.status)
        this.response = data.data
      }).catch(err => {
        this.response = err.response.data
        console.log(err.response)
      })
    },
    getProducts () {
      console.log('getProducts')
      let sendData = {}
      this.$axios.post(this.reefApi + 'strategy/giftery/products', sendData).then(data => {
        console.log(data.data)
        this.response = data.data
      }).catch(err => {
        this.response = err.response.data
        console.log(err.response)
      })
    },
    updateGiftery () {
      console.log('updateGiftery')
      let sendData = {}
      this.$axios.post(this.reefApi + 'strategy/giftery/update', sendData).then(data => {
        console.log(data.data)
        this.response = data.data
      }).catch(err => {
        this.response = err.response.data
        console.log(err.response)
      })
    }
  },
  computed: {
    ...mapState({
      reefApi: state => state.api.reefApi
    }),
    language: {
      get () {
        return this.$store.state.app.language
      },
      set (value) {
        this.$store.commit('SET_LANG', value)
      }
    }
  }
}
</script>
