<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
// import { mapState } from 'vuex'
import { Cookies } from 'quasar'
export default {
  name: 'App',
  created () {
    if (process.env.DEV || location.hostname === 'localhost') {
      this.$store.commit('SET_DEV')
    }
    if (Cookies.has('language')) {
      this.$store.commit('SET_LANG', Cookies.get('language'))
    } else {
      this.$store.commit('SET_LANG', 'en-us')
    }
  },
  mounted () {
    this.$store.commit('SAVE_GATE')
    this.$store.dispatch('FETCH_CURRENCY')
  }
}
</script>
