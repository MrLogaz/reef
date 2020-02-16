<template>
  <q-page padding>
    <q-btn flat to="/api" color="primary" icon="keyboard_backspace" label="Back to Api" />
    <div class="q-pa-sm">
      <div class="text-h5 q-mb-lg">BipToPhone</div>
      <div class="q-mb-lg text-subtitle2">
        URL:
        <br>
        <b>{{ reefApi }}strategy/biptophone</b>
        <pre class="bg-grey-2 q-pa-sm"><code>{
  check: 'Mcf8a33101843b9…f72',
  pass: 1581722547647,
  data: {
    phone: '+79000000000'
  }
}</code></pre>
      </div>
      <div class="text-h5 q-mt-lg q-mb-lg">Test api online</div>
      <div class="q-mb-sm">
        <q-input outlined v-model="checkStr" label="Check" />
      </div>
      <div class="q-mb-sm">
        <q-input outlined v-model="checkPass" label="Password" />
      </div>
      <div class="q-mb-sm">
        <q-input outlined v-model="phone" label="Phone" />
      </div>
      <div>
        <div class="text-subtitle1">Methods:</div>
        <q-btn label="Pay" color="primary" @click="payBiptophone" />
        &nbsp;
        <q-btn label="Validate" color="primary" @click="validateBiptophone" />
        &nbsp;
        <q-btn label="Status" color="primary" @click="statusBiptophone" />
      </div>
      <div class="q-mt-sm text-subtitle1">Response:</div>
      <div class="q-pa-xs bg-grey-2" v-if="response">
        <pre><code>{{ JSON.stringify(response, undefined, 4) }}</code></pre>
      </div>
    </div>
    <q-separator class="q-ma-md" />
    <div class="q-pa-sm">
      <div class="text-subtitle1">Custom Methods:</div>
      <div class="row">
        <q-input outlined v-model.number="rubtobip" type="number" class="col-6" dense label="How many rubles are needed?" />
        <q-btn label="RubToBip" class="q-ml-sm" color="primary" @click="rubtobipBiptophone" />
      </div>
      &nbsp;
      <div class="q-mt-sm text-subtitle1">Response:</div>
      <div class="q-pa-xs bg-grey-2" v-if="customResponse">
        <pre><code>{{ JSON.stringify(customResponse, undefined, 4) }}</code></pre>
      </div>
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
      checkStr: null,
      checkPass: null,
      phone: '+79000000000',
      response: null,
      rubtobip: null,
      customResponse: null
    }
  },
  methods: {
    payBiptophone () {
      let sendData = {
        check: this.checkStr,
        pass: this.checkPass,
        data: {
          phone: this.phone
        }
      }
      this.$axios.post(this.reefApi + 'strategy/biptophone', sendData).then(data => {
        console.log(data.data)
        this.response = data.data
      }).catch(err => {
        this.response = err.response.data
        console.log(err.response)
      })
    },
    statusBiptophone () {
      let sendData = {}
      this.$axios.post(this.reefApi + 'strategy/biptophone/status', sendData).then(data => {
        console.log(data.data)
        this.response = data.data
      }).catch(err => {
        this.response = err.response.data
        console.log(err.response)
      })
    },
    validateBiptophone () {
      let sendData = {
        data: {
          phone: this.phone
        }
      }
      this.$axios.post(this.reefApi + 'strategy/biptophone/validate', sendData).then(data => {
        console.log(data.data)
        this.response = data.data
      }).catch(err => {
        this.response = err.response.data
        console.log(err.response)
      })
    },
    rubtobipBiptophone () {
      let sendData = {
        value: this.rubtobip
      }
      this.$axios.post(this.reefApi + 'strategy/biptophone/rubtobip', sendData).then(data => {
        console.log(data.data)
        this.customResponse = data.data
      }).catch(err => {
        this.customResponse = err.response.data
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
