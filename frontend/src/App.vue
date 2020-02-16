<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  name: 'App',
  created () {
    if (process.env.DEV || location.hostname === 'localhost') {
      this.$store.commit('SET_DEV')
    }
  },
  mounted () {
    this.$store.commit('SAVE_GATE')
  }
}
</script>
