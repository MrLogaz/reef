(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[10],{"17be":function(t,e,a){"use strict";a.r(e);var c=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-page",{attrs:{padding:""}},[t.product?a("div",{},[a("div",{staticClass:"text-h5 text-center full-width q-mb-md q-mt-md text-bold text-indigo-10"},[t._v(t._s(t.product.title))]),t.product.image_url?a("q-img",{staticStyle:{width:"100%","max-height":"250px"},attrs:{contain:"",src:"http://"+t.product.image_url,"spinner-color":"primary","spinner-size":"82px"}}):t._e(),a("div",{staticClass:"q-mt-md text-subtitle2"},[t._v(t._s(t.product.brief))]),a("q-separator",{staticClass:"q-mt-md",attrs:{color:"indigo"}}),a("div",{staticClass:"q-mt-md q-mb-lg"},[a("div",{staticClass:"text-h6 text-center full-width q-mb-md text-bold text-indigo-10"},[t._v("Buy certificate")]),a("div",{staticClass:"row justify-center"},[a("div",{staticClass:"col-sm-8 col-xs-12"},[a("div",{staticClass:"text-subtitle1 text-center text-bold text-indigo-10"},[t._v("You have "+t._s(parseFloat(t.balance.total_balance_sum))+" bip")]),a("div",{staticClass:"text-subtitle2 text-center text-grey"},[t._v("~ "+t._s(parseFloat(t.balance.total_balance_sum)*t.currency.biptorub)+" rub | ~ "+t._s(parseFloat(t.balance.total_balance_sum_usd))+" usd")]),a("q-input",{staticClass:"product__select q-mt-md",attrs:{type:"email",label:"Email *",clearable:"",outlined:"",hint:"A certificate will come to this mail"},model:{value:t.email,callback:function(e){t.email=e},expression:"email"}}),a("q-select",{staticClass:"product__select q-mt-md",attrs:{outlined:"",options:t.product.faces,label:"Choose certificate","display-value":t.selectFaces?t.selectFaces+" rub":""},scopedSlots:t._u([{key:"option",fn:function(e){return[a("q-item",t._g(t._b({},"q-item",e.itemProps,!1),e.itemEvents),[a("q-item-section",[a("q-item-label",[a("b",[t._v(t._s(e.opt)+" rub")]),t._v("  =  "),a("span",[t._v(t._s(t.bipPrice(e.opt))+" bip")])])],1)],1)]}},{key:"after",fn:function(){return[a("q-btn",{attrs:{disabled:!t.checkBuy(),size:"md",color:"indigo",stack:"",icon:"shopping_cart",label:"Buy for "+t.bipPrice(t.selectFaces)+" bip"},on:{click:function(e){return t.buy()}}})]},proxy:!0}],null,!1,2412330731),model:{value:t.selectFaces,callback:function(e){t.selectFaces=e},expression:"selectFaces"}})],1)])]),a("q-separator",{staticClass:"q-mt-lg q-mb-md",attrs:{color:"indigo"}}),a("div",{staticClass:"text-right"},[a("q-btn",{attrs:{flat:"",label:"Disclaimer",color:"indigo-4"},on:{click:function(e){t.dialogDisclaimer=!0}}})],1),a("q-dialog",{model:{value:t.dialogDisclaimer,callback:function(e){t.dialogDisclaimer=e},expression:"dialogDisclaimer"}},[a("q-card",{staticClass:"dialog-min300"},[a("q-card-section",[a("div",{staticClass:"text-h6"},[t._v("Disclaimer")])]),a("q-card-section",[a("div",{domProps:{innerHTML:t._s(t.product.disclaimer)}})]),a("q-card-actions",{attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"OK",color:"primary"}})],1)],1)],1),a("q-dialog",{model:{value:t.success,callback:function(e){t.success=e},expression:"success"}},[a("q-card",{staticClass:"dialog-min300 text-center"},[a("q-card-section",[a("div",[a("q-icon",{attrs:{color:"secondary",name:"email",size:"5em"}})],1),a("div",{staticClass:"text-h6"},[t._v("Письмо с сертификатом отправилось к вам на почту "+t._s(t.email))])]),a("q-card-actions",{attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"OK",color:"primary"}})],1)],1)],1),a("br"),a("br")],1):t._e()])},i=[],s=(a("8e6e"),a("8a81"),a("ac6a"),a("cadf"),a("456d"),a("c47a")),r=a.n(s),o=(a("6b54"),a("06db"),a("2f62")),n=a("b862"),l=a("9dcd"),u=a.n(l);function d(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(t);e&&(c=c.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,c)}return a}function p(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?d(Object(a),!0).forEach((function(e){r()(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):d(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var m={name:"Settings",data:function(){return{success:!1,email:null,selectFaces:null,dialogDisclaimer:!1,productId:null,product:null}},created:function(){this.$route.params.productId&&""!==this.$route.params.productId&&(this.productId=this.$route.params.productId,this.products&&(this.product=this.getProduct(this.productId)))},methods:{checkBuy:function(){if(this.email&&this.selectFaces&&this.selectFaces>0){var t=new u.a(this.balance.total_balance_sum).times(this.currency.biptorub);return!!t.gt(this.selectFaces)}return!1},bipPrice:function(t){if(t){var e=u()(t).times(this.currency.biptorub);return e.toString()}return"0"},buy:function(){var t=this;if(this.checkBuy()){var e=new u.a(this.selectFaces).times(this.currency.biptorub),a=(new Date).getTime()-158248e7,c=Object(n["c"])({privateKey:this.privateKey,passPhrase:"pass",nonce:a,chainId:1,coin:"BIP",value:e.toString(),dueBlock:999999999});this.$store.dispatch("SEND_CHECK",{check:c,product:this.productId,face:this.selectFaces,address:this.address,email:this.email}).then((function(e){t.success=!0,t.$store.dispatch("FETCH_BALANCE"),console.log(e)})).catch((function(t){console.log(t)}))}}},computed:p({},Object(o["c"])({currency:function(t){return t.api.currency},balance:function(t){return t.api.balance},products:function(t){return t.api.products},privateKey:function(t){return t.wallet.privateKey},address:function(t){return t.wallet.address}}),{},Object(o["b"])(["getProduct"])),watch:{products:function(t){t&&t.length&&this.productId&&(this.product=this.getProduct(this.productId))}}},b=m,h=a("2877"),f=a("eebe"),g=a.n(f),v=a("9989"),_=a("068f"),y=a("eb85"),q=a("27f9"),x=a("ddd8"),C=a("66e5"),w=a("4074"),O=a("0170"),P=a("9c40"),k=a("24e8"),I=a("f09f"),j=a("a370"),F=a("4b7e"),D=a("0016"),Q=a("7f67"),S=Object(h["a"])(b,c,i,!1,null,null,null);e["default"]=S.exports;g()(S,"components",{QPage:v["a"],QImg:_["a"],QSeparator:y["a"],QInput:q["a"],QSelect:x["a"],QItem:C["a"],QItemSection:w["a"],QItemLabel:O["a"],QBtn:P["a"],QDialog:k["a"],QCard:I["a"],QCardSection:j["a"],QCardActions:F["a"],QIcon:D["a"]}),g()(S,"directives",{ClosePopup:Q["a"]})}}]);