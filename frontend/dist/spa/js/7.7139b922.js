(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[7],{"40c8":function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("q-page",{attrs:{padding:""}},[n("q-btn",{attrs:{flat:"",to:"/api",color:"primary",icon:"keyboard_backspace",label:"Back to Api"}}),n("div",{staticClass:"q-pa-sm"},[n("q-btn",{attrs:{label:"test"},on:{click:function(e){return t.test()}}}),n("br"),n("br"),n("q-btn",{attrs:{label:"products"},on:{click:function(e){return t.getProducts()}}}),n("br"),n("br"),n("q-btn",{attrs:{label:"updateGiftery"},on:{click:function(e){return t.updateGiftery()}}})],1),n("q-separator",{staticClass:"q-ma-md"})],1)},r=[],s=(n("8e6e"),n("8a81"),n("ac6a"),n("cadf"),n("06db"),n("456d"),n("c47a")),a=n.n(s),c=n("2f62");function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function p(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(Object(n),!0).forEach((function(e){a()(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var u={name:"Index",data:function(){return{customResponse:null}},methods:{test:function(){var t=this;console.log("test");var e={};this.$axios.post(this.reefApi+"strategy/ozon/status",e).then((function(e){console.log(e.data.status),t.response=e.data})).catch((function(e){t.response=e.response.data,console.log(e.response)}))},getProducts:function(){var t=this;console.log("getProducts");var e={};this.$axios.post(this.reefApi+"strategy/giftery/products",e).then((function(e){console.log(e.data),t.response=e.data})).catch((function(e){t.response=e.response.data,console.log(e.response)}))},updateGiftery:function(){var t=this;console.log("updateGiftery");var e={};this.$axios.post(this.reefApi+"strategy/giftery/update",e).then((function(e){console.log(e.data),t.response=e.data})).catch((function(e){t.response=e.response.data,console.log(e.response)}))}},computed:p({},Object(c["c"])({reefApi:function(t){return t.api.reefApi}}),{language:{get:function(){return this.$store.state.app.language},set:function(t){this.$store.commit("SET_LANG",t)}}})},l=u,f=n("2877"),d=n("eebe"),b=n.n(d),g=n("9989"),h=n("9c40"),y=n("eb85"),O=Object(f["a"])(l,o,r,!1,null,null,null);e["default"]=O.exports;b()(O,"components",{QPage:g["a"],QBtn:h["a"],QSeparator:y["a"]})}}]);