(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{dcf1:function(t,e,s){"use strict";s.r(e);var o=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("q-page",{attrs:{padding:""}},[s("q-btn",{attrs:{flat:"",to:"/api",color:"primary",icon:"keyboard_backspace",label:"Back to Api"}}),s("div",{staticClass:"q-pa-sm"},[s("div",{staticClass:"text-h5 q-mb-lg"},[t._v("BipToPhone")]),s("div",{staticClass:"q-mb-lg text-subtitle2"},[t._v("\n        URL:\n        "),s("br"),s("b",[t._v(t._s(t.reefApi)+"strategy/biptophone")]),s("pre",{staticClass:"bg-grey-2 q-pa-sm"},[s("code",[t._v("{\n  check: 'Mcf8a33101843b9…f72',\n  pass: 1581722547647,\n  data: {\n    phone: '+79000000000'\n  }\n}")])])]),s("div",{staticClass:"text-h5 q-mt-lg q-mb-lg"},[t._v("Test api online")]),s("div",{staticClass:"q-mb-sm"},[s("q-input",{attrs:{outlined:"",label:"Check"},model:{value:t.checkStr,callback:function(e){t.checkStr=e},expression:"checkStr"}})],1),s("div",{staticClass:"q-mb-sm"},[s("q-input",{attrs:{outlined:"",label:"Password"},model:{value:t.checkPass,callback:function(e){t.checkPass=e},expression:"checkPass"}})],1),s("div",{staticClass:"q-mb-sm"},[s("q-input",{attrs:{outlined:"",label:"Phone"},model:{value:t.phone,callback:function(e){t.phone=e},expression:"phone"}})],1),s("div",[s("div",{staticClass:"text-subtitle1"},[t._v("Methods:")]),s("q-btn",{attrs:{label:"Pay",color:"primary"},on:{click:t.payBiptophone}}),t._v("\n         \n        "),s("q-btn",{attrs:{label:"Validate",color:"primary"},on:{click:t.validateBiptophone}}),t._v("\n         \n        "),s("q-btn",{attrs:{label:"Status",color:"primary"},on:{click:t.statusBiptophone}})],1),s("div",{staticClass:"q-mt-sm text-subtitle1"},[t._v("Response:")]),t.response?s("div",{staticClass:"q-pa-xs bg-grey-2"},[s("pre",[s("code",[t._v(t._s(JSON.stringify(t.response,void 0,4)))])])]):t._e()]),s("q-separator",{staticClass:"q-ma-md"}),s("div",{staticClass:"q-pa-sm"},[s("div",{staticClass:"text-subtitle1"},[t._v("Custom Methods:")]),s("div",{staticClass:"row"},[s("q-input",{staticClass:"col-6",attrs:{outlined:"",type:"number",dense:"",label:"How many rubles are needed?"},model:{value:t.rubtobip,callback:function(e){t.rubtobip=t._n(e)},expression:"rubtobip"}}),s("q-btn",{staticClass:"q-ml-sm",attrs:{label:"RubToBip",color:"primary"},on:{click:t.rubtobipBiptophone}})],1),t._v("\n       \n      "),s("div",{staticClass:"q-mt-sm text-subtitle1"},[t._v("Response:")]),t.customResponse?s("div",{staticClass:"q-pa-xs bg-grey-2"},[s("pre",[s("code",[t._v(t._s(JSON.stringify(t.customResponse,void 0,4)))])])]):t._e()]),s("q-separator",{staticClass:"q-ma-md"})],1)},a=[],n=(s("8e6e"),s("8a81"),s("ac6a"),s("cadf"),s("06db"),s("456d"),s("c47a")),i=s.n(n),c=s("2f62");function r(t,e){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),s.push.apply(s,o)}return s}function p(t){for(var e=1;e<arguments.length;e++){var s=null!=arguments[e]?arguments[e]:{};e%2?r(Object(s),!0).forEach((function(e){i()(t,e,s[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):r(Object(s)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(s,e))}))}return t}var l={name:"Index",data:function(){return{checkStr:null,checkPass:null,phone:"+79000000000",response:null,rubtobip:null,customResponse:null}},methods:{payBiptophone:function(){var t=this,e={check:this.checkStr,pass:this.checkPass,data:{phone:this.phone}};this.$axios.post(this.reefApi+"strategy/biptophone",e).then((function(e){console.log(e.data),t.response=e.data})).catch((function(e){t.response=e.response.data,console.log(e.response)}))},statusBiptophone:function(){var t=this,e={};this.$axios.post(this.reefApi+"strategy/biptophone/status",e).then((function(e){console.log(e.data),t.response=e.data})).catch((function(e){t.response=e.response.data,console.log(e.response)}))},validateBiptophone:function(){var t=this,e={data:{phone:this.phone}};this.$axios.post(this.reefApi+"strategy/biptophone/validate",e).then((function(e){console.log(e.data),t.response=e.data})).catch((function(e){t.response=e.response.data,console.log(e.response)}))},rubtobipBiptophone:function(){var t=this,e={value:this.rubtobip};this.$axios.post(this.reefApi+"strategy/biptophone/rubtobip",e).then((function(e){console.log(e.data),t.customResponse=e.data})).catch((function(e){t.customResponse=e.response.data,console.log(e.response)}))}},computed:p({},Object(c["c"])({reefApi:function(t){return t.api.reefApi}}),{language:{get:function(){return this.$store.state.app.language},set:function(t){this.$store.commit("SET_LANG",t)}}})},u=l,b=s("2877"),h=s("eebe"),d=s.n(h),f=s("9989"),v=s("9c40"),m=s("27f9"),g=s("eb85"),y=Object(b["a"])(u,o,a,!1,null,null,null);e["default"]=y.exports;d()(y,"components",{QPage:f["a"],QBtn:v["a"],QInput:m["a"],QSeparator:g["a"]})}}]);