<template>
  <div>
    <carousel :navigationEnabled="false" :perPage="3" :paginationEnabled="false">
      <slide>
        <div class="card-app">
          <q-card @click="biptophone = true" v-ripple clickable>
            <q-card-section>
              <q-avatar color="red" size="48px" text-color="white" icon="phone_iphone" />
              <div class="q-pt-sm">{{ $t('Top up phone balance') }}</div>
            </q-card-section>
          </q-card>
        </div>
        <q-dialog v-model="biptophone" size="md" transition-show="slide-up" transition-hide="slide-down">
          <q-card class="text-white bg-purple-10 dialog-min300">
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6 text-center">{{ $t('Top up phone balance') }}</div>
              <q-space />
              <!-- <q-btn icon="close" flat round dense v-close-popup /> -->
            </q-card-section>
            <service-biptophone></service-biptophone>
          </q-card>
        </q-dialog>
      </slide>

      <slide>
        <div class="card-app">
          <q-card @click="soonDialog = true">
            <q-card-section>
              <q-avatar color="grey" size="48px" text-color="white" icon="redeem" />
              <div class="q-pt-sm">{{ $t('Buy OZON certificate') }}</div>
            </q-card-section>
          </q-card>
        </div>
      </slide>
      <slide>
        <div class="card-app">
          <q-card @click="soonDialog = true">
            <q-card-section>
              <q-avatar color="grey" size="48px" text-color="white" icon="fastfood" />
              <div class="q-pt-sm">{{ $t('Buy eda.yandex') }}</div>
            </q-card-section>
          </q-card>
        </div>
      </slide>
      <slide>
        <div class="card-app">
          <q-card @click="soonDialog = true">
            <q-card-section>
              <q-avatar color="grey" size="48px" text-color="white" icon="videogame_asset" />
              <div class="q-pt-sm">{{ $t('Top up online game') }}</div>
            </q-card-section>
          </q-card>
        </div>
      </slide>
      <slide>
        <div class="card-app">
          <q-card @click="soonDialog = true">
            <q-card-section>
              <q-avatar color="grey" size="48px" text-color="white" icon="language" />
              <div class="q-pt-sm">{{ $t('Top up internet balance') }}</div>
            </q-card-section>
          </q-card>
        </div>
      </slide>
      <slide>
        <div class="card-app">
          <q-card @click="soonDialog = true">
            <q-card-section>
              <q-avatar color="grey" size="48px" text-color="white" icon="credit_card" />
              <div class="q-pt-sm">{{  $t('Card transfer') }}</div>
            </q-card-section>
          </q-card>
        </div>
      </slide>
    </carousel>

    <q-dialog v-model="soonDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300 text-center q-pt-lg q-pb-lg">
        <div class="text-h4">SOON</div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import ServiceBiptophone from '../components/ServiceBiptophone.vue'
import { Carousel, Slide } from 'vue-carousel'

export default {
  name: 'Apps',
  components: {
    'service-biptophone': ServiceBiptophone,
    Carousel,
    Slide
  },
  data () {
    return {
      biptophone: false,
      soonDialog: false
    }
  }
}
</script>

<style>
  .card-app {
    padding: 5px;
    font-size: 14px;
    line-height: 1.2em;
    font-weight: 500;
  }
</style>
