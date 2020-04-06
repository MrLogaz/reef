(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[11],{a586:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("q-page",[n("div",{staticClass:"q-pa-md"},[n("div",{staticClass:"text-h5 text-center full-width q-mb-md q-mt-md text-indigo-10"},[t._v(t._s(t.$t("Send to Flat.FM")))]),n("q-input",{staticClass:"q-mb-md",attrs:{outlined:"",clearable:"","clear-icon":"close",error:t.loginIsError,"error-message":t.loginErrorMsg,label:"Login Flat.FM",hint:"Id or email"},scopedSlots:t._u([{key:"after",fn:function(){return[n("q-btn",{attrs:{round:"",push:"","no-caps":"",icon:"search"},on:{click:function(e){return t.findFlatfmUser()}}})]},proxy:!0}]),model:{value:t.login,callback:function(e){t.login=e},expression:"login"}}),n("q-form",{staticClass:"q-pb-lg"},[n("q-input",{staticClass:"q-mb-md",attrs:{type:"number",step:"any",outlined:"",clearable:"","clear-icon":"close",error:t.amountIsError,"error-message":t.amountErrorMsg,label:t.$t("Amount"),hint:"Fee "+t.sendFee},scopedSlots:t._u([{key:"after",fn:function(){return[n("q-btn",{attrs:{round:"",push:"","no-caps":"",label:"Max"},on:{click:function(e){return t.maxAmountSend()}}})]},proxy:!0}]),model:{value:t.amount,callback:function(e){t.amount=e},expression:"amount"}}),n("q-input",{staticClass:"q-mb-md",attrs:{readonly:"",outlined:"","clear-icon":"close",error:t.addressIsError,"error-message":t.addressErrorMsg,label:t.$t("Mx address")},scopedSlots:t._u([{key:"after",fn:function(){return[n("q-btn",{attrs:{type:"submit",color:"indigo",round:"",icon:"send"},on:{click:t.onSendToAddress}})]},proxy:!0}]),model:{value:t.sendAddress,callback:function(e){t.sendAddress=e},expression:"sendAddress"}})],1),t.shareTest()?n("div",{staticClass:"q-pt-md"},[n("q-btn",{attrs:{color:"positive",icon:"share",label:t.$t("Save link")},on:{click:function(e){return t.saveLink()}}})],1):t._e()],1),n("q-dialog",{attrs:{size:"md",position:"bottom"},model:{value:t.txReady,callback:function(e){t.txReady=e},expression:"txReady"}},[n("q-card",{staticClass:"dialog-min300 text-center"},[n("q-card-section",[n("div",[n("q-icon",{attrs:{color:"secondary",name:"done",size:"5em"}})],1),n("div",{staticClass:"text-h6"},[t._v(t._s(t.$t("Payment was successful!")))])])],1)],1)],1)},s=[],o=(n("8e6e"),n("8a81"),n("ac6a"),n("cadf"),n("456d"),n("c47a")),a=n.n(o),i=(n("6b54"),n("06db"),n("967e")),c=n.n(i),l=(n("96cf"),n("fa84")),d=n.n(l),u=n("2f62"),m=n("9dcd"),f=n.n(m),h=n("b862"),g=n("158a");function p(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function b(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?p(Object(n),!0).forEach((function(e){a()(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var E={name:"FlatFm",data:function(){return{finded:null,sendAddress:null,login:null,loginErrorMsg:null,loginIsError:!1,amount:null,amountErrorMsg:null,amountIsError:!1,addressIsError:!1,addressErrorMsg:null,sendFee:Object(g["e"])(h["b"].SEND),txReady:!1}},created:function(){this.balanceBIP.gte(.2)&&this.maxAmountSend()},methods:{findFlatfmUser:function(){var t=this;return d()(c.a.mark((function e(){return c.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:console.log(t.login),t.loginIsError=!1,t.loginErrorMsg=null,t.$store.dispatch("REEF_API",["flatfm","validate",{user_id:t.login}]).then((function(e){e.validate&&e.validate.length?t.sendAddress=e.validate:(t.sendAddress=null,t.loginIsError=!0,t.loginErrorMsg="User not found")}));case 4:case"end":return e.stop()}}),e)})))()},shareTest:function(){return!!navigator.share},saveLink:function(){navigator.share({title:"Подарочный кошелек c бонусом",text:"Переходи для получения",url:document.location.href}).then((function(){return console.log("Successful share")})).catch((function(t){return console.log("Error sharing",t)}))},maxAmountSend:function(){var t=this.balanceBIP.minus(this.sendFee);this.amount=t.toString()},checkSend:function(){var t=this.balanceBIP.minus(this.sendFee);if(this.addressIsError=!1,this.addressErrorMsg=null,this.amountErrorMsg=null,this.amountIsError=!1,this.amount)return t.gte(this.amount)?!(!this.sendAddress||42!==this.sendAddress.length||"Mx"!==this.sendAddress.substring(0,2))||(this.addressIsError=!0,this.addressErrorMsg="Address not valid",!1):(this.amountIsError=!0,this.amountErrorMsg="Max "+t.toString()+" bip",!1);this.amountIsError=!0},onSendToAddress:function(){var t=this;if(this.checkSend()){var e={type:"send",data:{to:this.sendAddress,value:f()(this.amount).toString(),coin:"BIP"},gasCoin:"BIP"};this.$store.dispatch("SENDER",e).then((function(e){t.$store.dispatch("FETCH_BALANCE"),t.txReady=!0})).catch((function(e){t.$store.dispatch("FETCH_BALANCE"),t.$store.commit("SET_TXERROR",e)}))}}},computed:b({},Object(u["c"])({address:function(t){return t.wallet.address},balanceBIP:function(t){return t.api.balanceBIP}}))},v=E,y=n("2877"),x=n("eebe"),I=n.n(x),A=n("9989"),S=n("27f9"),q=n("9c40"),O=n("0378"),k=n("24e8"),w=n("f09f"),M=n("a370"),P=n("0016"),F=Object(y["a"])(v,r,s,!1,null,null,null);e["default"]=F.exports;I()(F,"components",{QPage:A["a"],QInput:S["a"],QBtn:q["a"],QForm:O["a"],QDialog:k["a"],QCard:w["a"],QCardSection:M["a"],QIcon:P["a"]})}}]);