<template>
  <div>
    <q-header bordered elevated class="bg-white text-primary">
      <q-toolbar>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="white" class="desktop-only" text-color="white" size="42px">
              <img src="statics/icons/Icon-120.png">
            </q-avatar>
            <q-avatar color="white" class="mobile-only" text-color="white" size="36px">
              <img src="statics/icons/Icon-88.png">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="text-h6 text-indigo-10 desktop-only">REEF Push</div>
            <div class="text-bold text-indigo-10 mobile-only">REEF Push</div>
            <q-item-label caption>{{ $t('Easy way to send a value') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-space />
        <q-btn color="indigo-10" round outline dense size="0.9em" :label="language.substr(0,2)" @click="alertLang = true" />
        <q-btn color="indigo-10" flat :to="'/' + seedkey + '/settings'" name="settings" label="" icon="settings" />
      </q-toolbar>

      <q-separator class="q-mt-sm" color="indigo" />

      <q-tabs v-model="headerTab" narrow-indicator inline-label class="bg-white text-indigo-10">
        <q-route-tab :to="'/' + seedkey + '/gift'" name="gift" :label="$t('Gift')" icon="card_giftcard" style="min-width: 140px" />
        <q-route-tab :to="'/' + seedkey + '/recive'" name="recive" :label="$t('Recive')" icon="system_update_alt" />
        <!-- <q-route-tab :to="'/' + seedkey + '/settings'" name="settings" label="" icon="settings" /> -->
      </q-tabs>
    </q-header>

    <q-dialog v-model="alertLang">
      <q-card class="dialog-min300">
        <q-card-section>
          <div class="text-h6">{{ $t('Choose a language') }}</div>
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item tag="label" v-ripple v-for="lang in languageList" :key="lang.value">
              <q-item-section avatar>
                <q-radio v-model="language" :val="lang.value" color="teal" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ lang.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { openURL } from 'quasar'
export default {
  name: 'Index',
  data () {
    return {
      headerTab: 'gift',
      alertLang: false,
      languageList: [
        {
          label: 'English',
          value: 'en-us'
        }, {
          label: 'Russian',
          value: 'ru'
        }
      ]
    }
  },
  methods: {
    clickLink (link) {
      openURL(link)
    },
    openLink (val) {
      let newWindow = window.open(val, '_blank')
      newWindow.focus()
    }
  },
  computed: {
    ...mapState({
      seedkey: state => state.wallet.seedkey
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
