<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="row">
        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="80px">
              <q-icon name="settings_remote" size="54px" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="text-h2">Minter Push</div>
            <q-item-label caption>Простой способ отправить кошелек с монетами</q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <div class="row q-pt-lg">
        <q-form
          @submit="onSubmit"
          class="q-gutter-md form"
        >
          <q-input
            clearable
            outlined
            v-model="mnemonic"
            label="Сид фраза *"
            hint="Вставьте сид фразу кошелька"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Поле обязательно',
              val => isValidMnemonic(val) || 'Фраза невалидна'
            ]"
          />
          <q-input
            clearable
            outlined
            v-model="username"
            label="Имя получателя"
            hint="Это не обязательное поле"
          />
          <q-input
            clearable
            outlined
            v-model="from"
            label="Имя отправителя"
            hint="Это не обязательное поле"
          />
          <div class="row justify-between">
            <div class="col">
              <q-checkbox v-model="isPassword" label="С паролем" />
            </div>
            <div class="col">
              <q-btn label="Сгенерировать ссылку" type="submit" color="secondary" />
            </div>
          </div>
          <div class="q-pt-lg" v-if="resultLink && resultLink.length">
            <q-input
              v-model="resultLink"
              readonly
              outlined
              class="input"
            >
              <template v-slot:before v-if="shareTest()">
                <q-btn @click="share(resultLink)" round dense flat icon="share" />
              </template>
              <template v-slot:after>
                <q-btn @click="copyToClipboard(resultLink)" round dense flat icon="file_copy" />
              </template>
            </q-input>
            <div class="text-teal">Ссылка уже скопирована в ваш буфер обмена</div>
            <div class="q-pt-lg text-right">
              <q-btn @click="openLink(resultLink)" color="primary" label="Посмотреть результат" />
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { wordlists } from 'bip39'
import { isValidMnemonic } from 'minterjs-wallet'
// import { isValidMnemonic, walletFromMnemonic, generateWallet } from 'minterjs-wallet'
import { copyToClipboard } from 'quasar'
export default {
  name: 'Index',
  data () {
    return {
      from: null,
      username: null,
      mnemonic: null,
      isPassword: false,
      mnemonicKey: null,
      resultLink: null
    }
  },
  created () {
  },
  methods: {
    openLink (val) {
      let win = window.open(val, '_blank')
      win.focus()
    },
    copyToClipboard (val) {
      copyToClipboard(val)
    },
    shareTest () {
      if (navigator.share) return true
      else return false
    },
    share () {
      navigator.share({
        title: 'Подарочный кошелек c бонусом',
        text: 'Переходи для получения',
        url: this.resultLink
      })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error))
    },
    isValidMnemonic (val) { return isValidMnemonic(val) },
    onSubmit () {
      if (isValidMnemonic(this.mnemonic)) {
        this.mnemonicKey = this.mnemonic.split(' ').map(word => wordlists.english.indexOf(word)).join('.')
        if (this.isPassword) {
          // this.mnemonicKey К следующей версии
        }
        let usernameStr = this.username ? ('&username=' + this.username) : ''
        let fromStr = this.from ? ('&from=' + this.from) : ''
        this.resultLink = 'https://cp002.cloudp.group/?#/hello?key=' + this.mnemonicKey + '&action=wallet' + usernameStr + fromStr
        copyToClipboard(this.resultLink)
      }
    }
  }
}
</script>
<style>
  .form {
    width: 97%;
    margin-left: 0%;
  }
  .input {
    width: 100%;
  }
</style>
