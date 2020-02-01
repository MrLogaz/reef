<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  created () {
    this.$i18n.locale = this.language
    if (process.env.DEV || location.hostname === 'localhost') {
      this.$store.commit('SET_DEV')
    }
  },
  mounted () {
    this.$store.commit('SAVE_GATE')
    this.$store.dispatch('FETCH_CURRENCY')
  },
  computed: {
    ...mapState({
      // language: state => state.app.language
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
