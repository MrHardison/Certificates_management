(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{213:function(t,e,a){var n=a(222);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(5).default)("7e6cc808",n,!0,{})},214:function(t,e,a){"use strict";var n={name:"ButtonRounded"},i=(a(221),a(6)),r=Object(i.a)(n,function(){var t=this.$createElement,e=this._self._c||t;return e("button",{staticClass:"btn"},[e("div",{staticClass:"content"},[this._t("default")],2)])},[],!1,null,"f607ae3e",null);r.options.__file="buttonRounded.vue";e.a=r.exports},215:function(t,e,a){var n=a(231);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(5).default)("eccfcbc4",n,!0,{})},216:function(t,e,a){"use strict";var n=a(214);e.a=n.a},221:function(t,e,a){"use strict";var n=a(213);a.n(n).a},222:function(t,e,a){(t.exports=a(4)(!1)).push([t.i,"\n.notifications[data-v-f607ae3e]{z-index:9998;margin:1.5rem 1.5rem 0 0\n}\n.notifications .vue-notification[data-v-f607ae3e]{margin:0 0 10px\n}\nul[data-v-f607ae3e]{list-style:none;padding:0;margin:0\n}\n.form-check[data-v-f607ae3e]{padding:0!important\n}",""])},223:function(t,e,a){"use strict";var n={name:"InputStandard",props:{placeholder:{type:String,default:""},label:{type:String,default:""},type:{type:String,default:"text"},computed_value:{type:String,default:""},limits:{type:Object,default:function(){return{}}},disabled:{type:Boolean,default:!1},warning_message:{type:String,default:"Pay attention to this field"},error_message:{type:String,default:"this field is not filled correctly"},warning:{type:Boolean,default:!1},error:{type:Boolean,default:!1}},data:function(){return{value:""}},watch:{value:{deep:!0,handler:function(t){null==t&&(t=""),t=this.clip(t),this.$emit("update",t)}},computed_value:{deep:!0,handler:function(t){this.value=t}}},mounted:function(){this.upd()},methods:{upd:function(){(this.computed_value||""===this.computed_value)&&(this.value=this.clip(this.computed_value))},clip:function(t){return this.limits&&this.limits.hasOwnProperty("max")&&(t=_.truncate(t,{},this.limits.max)),t}}},i=(a(230),a(6)),r=Object(i.a)(n,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"form-group"},[t.label?[a("label",[t._v(t._s(t.label))])]:t._e(),t._v(" "),a("div",{staticClass:"control-body"},["checkbox"===t.type?a("input",{directives:[{name:"model",rawName:"v-model",value:t.value,expression:"value"}],staticClass:"form-control",class:{limited:t.limits&&t.limits.hasOwnProperty("max"),"is-error":t.error,"is-warning":t.warning},attrs:{placeholder:t.placeholder,readonly:!!t.disabled,type:"checkbox"},domProps:{checked:Array.isArray(t.value)?t._i(t.value,null)>-1:t.value},on:{input:function(e){t.$emit("update",t.clip(e.target.value))},change:function(e){var a=t.value,n=e.target,i=!!n.checked;if(Array.isArray(a)){var r=t._i(a,null);n.checked?r<0&&(t.value=a.concat([null])):r>-1&&(t.value=a.slice(0,r).concat(a.slice(r+1)))}else t.value=i}}}):"radio"===t.type?a("input",{directives:[{name:"model",rawName:"v-model",value:t.value,expression:"value"}],staticClass:"form-control",class:{limited:t.limits&&t.limits.hasOwnProperty("max"),"is-error":t.error,"is-warning":t.warning},attrs:{placeholder:t.placeholder,readonly:!!t.disabled,type:"radio"},domProps:{checked:t._q(t.value,null)},on:{input:function(e){t.$emit("update",t.clip(e.target.value))},change:function(e){t.value=null}}}):a("input",{directives:[{name:"model",rawName:"v-model",value:t.value,expression:"value"}],staticClass:"form-control",class:{limited:t.limits&&t.limits.hasOwnProperty("max"),"is-error":t.error,"is-warning":t.warning},attrs:{placeholder:t.placeholder,readonly:!!t.disabled,type:t.type},domProps:{value:t.value},on:{input:[function(e){e.target.composing||(t.value=e.target.value)},function(e){t.$emit("update",t.clip(e.target.value))}]}}),t._v(" "),t.limits&&t.limits.hasOwnProperty("max")?[a("span",{staticClass:"limits",class:{disabled:t.disabled}},[a("span",{staticClass:"current"},[t._v(t._s(null!=t.value?t.value.length:0))]),t._v(" "),a("span",{staticClass:"delimiter"},[t._v("/")]),t._v(" "),a("span",{staticClass:"max"},[t._v(t._s(t.limits.max))])])]:t._e(),t._v(" "),t.error?[a("span",{staticClass:"message-error"},[t._v("\n        "+t._s(t.error_message)+"\n      ")])]:t.warning?[a("span",{staticClass:"message-warning"},[t._v("\n        "+t._s(t.warning_message)+"\n      ")])]:t._e()],2)],2)},[],!1,null,"0dfab192",null);r.options.__file="inputStandard.vue";e.a=r.exports},224:function(t,e,a){"use strict";var n=a(223);e.a=n.a},230:function(t,e,a){"use strict";var n=a(215);a.n(n).a},231:function(t,e,a){(t.exports=a(4)(!1)).push([t.i,"\n.notifications[data-v-0dfab192]{z-index:9998;margin:1.5rem 1.5rem 0 0\n}\n.notifications .vue-notification[data-v-0dfab192]{margin:0 0 10px\n}\nul[data-v-0dfab192]{list-style:none;padding:0;margin:0\n}\n.form-check[data-v-0dfab192]{padding:0!important\n}\n.form-group.error label[data-v-0dfab192]{color:#ca865f\n}\n.form-group.error .control-body .form-control[data-v-0dfab192]{border-color:#ca865f!important\n}\n.form-group label[data-v-0dfab192]{color:#818e9e;font-size:16px;font-weight:500;line-height:26px\n}\n.form-group .control-body[data-v-0dfab192]{position:relative\n}\n.form-group .control-body .form-control[data-v-0dfab192]{border:2px solid #d4d9e1;border-radius:.25rem;color:#2a313a\n}\n.form-group .control-body .form-control[data-v-0dfab192]::-webkit-input-placeholder{color:#d4d9e1!important\n}\n.form-group .control-body .form-control[data-v-0dfab192]:-ms-input-placeholder{color:#d4d9e1!important\n}\n.form-group .control-body .form-control[data-v-0dfab192]::-ms-input-placeholder{color:#d4d9e1!important\n}\n.form-group .control-body .form-control[data-v-0dfab192]::placeholder{color:#d4d9e1!important\n}\n.form-group .control-body .form-control.is-error[data-v-0dfab192]{border-color:#cc7070\n}\n.form-group .control-body .form-control.is-warning[data-v-0dfab192]{border-color:#c39f1a\n}\n.form-group .control-body .message-error[data-v-0dfab192],.form-group .control-body .message-warning[data-v-0dfab192]{position:absolute;bottom:-18px;right:4px;font-size:.75rem\n}\n.form-group .control-body .message-error[data-v-0dfab192]{color:#cc7070\n}\n.form-group .control-body .message-warning[data-v-0dfab192]{color:#c39f1a\n}\n.form-group .control-body .limits[data-v-0dfab192]{background:#fff;color:#d4d9e1;position:absolute;top:10px;right:10px;width:auto;display:block;text-align:right;cursor:default;font-size:13px;padding-left:.3rem\n}\n.form-group .control-body .limits.disabled[data-v-0dfab192]{background:#e9ecef\n}",""])},251:function(t,e,a){var n=a(266);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(5).default)("46120a11",n,!0,{})},252:function(t,e,a){var n=a(268);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(5).default)("396fdcb8",n,!0,{})},255:function(t,e,a){var n=a(283);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(5).default)("a49d9f62",n,!0,{})},265:function(t,e,a){"use strict";var n=a(251);a.n(n).a},266:function(t,e,a){(t.exports=a(4)(!1)).push([t.i,"\n.notifications[data-v-30324896]{z-index:9998;margin:1.5rem 1.5rem 0 0\n}\n.notifications .vue-notification[data-v-30324896]{margin:0 0 10px\n}\nul[data-v-30324896]{list-style:none;padding:0;margin:0\n}\n.form-check[data-v-30324896]{padding:0!important\n}\n.sub-navigation[data-v-30324896]{margin-bottom:1rem\n}\n.sub-navigation .btn[data-v-30324896]{margin-right:.8rem\n}\n.title[data-v-30324896]{margin-left:.5rem\n}\n@media only screen and (max-width:425px){\n.sub-navigation[data-v-30324896]{display:flex;flex-wrap:wrap;justify-content:space-between\n}\n.sub-navigation .btn[data-v-30324896]{margin:0;width:48%;font-size:.75rem\n}\n.sub-navigation .btn .content[data-v-30324896]{text-align:center;padding:8px 10px;justify-content:center\n}\n.sub-navigation .btn[data-v-30324896]:last-child{margin-top:.5rem\n}\n}",""])},267:function(t,e,a){"use strict";var n=a(252);a.n(n).a},268:function(t,e,a){(t.exports=a(4)(!1)).push([t.i,"\n.notifications[data-v-388e0299]{z-index:9998;margin:1.5rem 1.5rem 0 0\n}\n.notifications .vue-notification[data-v-388e0299]{margin:0 0 10px\n}\nul[data-v-388e0299]{list-style:none;padding:0;margin:0\n}\n.form-check[data-v-388e0299]{padding:0!important\n}",""])},282:function(t,e,a){"use strict";var n=a(255);a.n(n).a},283:function(t,e,a){(t.exports=a(4)(!1)).push([t.i,"\n.notifications{z-index:9998;margin:1.5rem 1.5rem 0 0\n}\n.notifications .vue-notification{margin:0 0 10px\n}\nul{list-style:none;padding:0;margin:0\n}\n.form-check{padding:0!important\n}\n#signature-pad .signature canvas{border:1px solid #d4d9e1\n}\n#signature-pad .clear_signature{margin:10px 0;background-color:#d4d9e1\n}\n@media only screen and (max-width:425px){\n#signature-pad{text-align:center\n}\n#signature-pad .signature canvas{width:100%\n}\n}",""])},305:function(t,e,a){var n=a(403);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(5).default)("249a471d",n,!0,{})},306:function(t,e,a){var n=a(405);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(5).default)("d074cc64",n,!0,{})},311:function(t,e,a){"use strict";a(24),a(54);var n={name:"VTabs",data:function(){return{tabs:[],activeTab:null}},computed:{ableTabs:function(){return this.tabs.filter(function(t){return!t.disable})}},watch:{activeTab:function(t,e){e&&(e.isActive=!1),t.isActive=!0}},created:function(){this.tabs=this.$children},mounted:function(){var t=this.tabs.find(function(t){return t.default});t?this.changeTab(t.name):this.changeTab(this.ableTabs[0].name)},methods:{addTab:function(t){this.tabs.push(t),this.activeTab=t},changeTab:function(t){var e=this.findTabByName(t);this.activeTab=e},findTabByName:function(t){return this.tabs.find(function(e){return e.name===t})}}},i=(a(265),a(6)),r=Object(i.a)(n,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"sub-navigation"},[t._l(t.ableTabs,function(e,n){return[a("button",{key:n,staticClass:"btn btn-white rounded small",class:{active:e.isActive},on:{click:function(a){t.changeTab(e.name)}}},[a("div",{staticClass:"content"},[t._v("\n          "+t._s(e.name)+"\n        ")])])]})],2),t._v(" "),t._t("default",[t._v("\n    No data\n  ")])],2)},[],!1,null,"30324896",null);r.options.__file="v-tabs.vue";var o=r.exports,s={name:"VTab",props:{name:{type:String,default:"No Name"},disable:{type:Boolean,default:!1},default:{type:Boolean,default:!1}},data:function(){return{title:this.name,isActive:!1}}},l=(a(267),Object(i.a)(s,function(){var t=this.$createElement,e=this._self._c||t;return this.isActive?e("div",{staticClass:"tab"},[this._t("default")],2):this._e()},[],!1,null,"388e0299",null));l.options.__file="v-tab.vue";var c=l.exports;a.d(e,"b",function(){return o}),a.d(e,"a",function(){return c})},312:function(t,e,a){"use strict";a(72);var n=a(281),i=a.n(n),r=a(314),o=a(1),s=a(315),l=a(216);o.default.use(s.a);var c={name:"Signature",components:{buttonRounded:l.a},props:{id:{type:String,default:""},signature:{type:String,default:""},data:{type:Object,default:function(){return{}}}},data:function(){return{signaturePad:!1}},mounted:function(){var t=this,e=document.querySelector("#"+this.id),a=Math.max(window.devicePixelRatio||1,1);Math.max(document.documentElement.clientWidth,window.innerWidth||0)<=425?(e.width=e.offsetWidth*a,e.height=(this.data.limits.image.width-e.offsetWidth)/e.offsetWidth*100/100*this.data.limits.image.height*a):(e.width=this.data.limits.image.width*a,e.height=this.data.limits.image.height*a),e.getContext("2d").scale(a,a);var n=new r.a(e,{onEnd:function(){t.$emit("update",t.signaturePad.toDataURL("image/png").split(",")[1])}});this.signature&&(i.a.isUri(this.signature)?this.$http.get(this.signature,{responseType:"blob"}).then(function(t){var e=new window.FileReader;e.readAsDataURL(t.data),e.onloadend=function(){n.fromDataURL(e.result)}}):n.fromDataURL("data:image/png;base64,"+this.signature)),this.signaturePad=n},methods:{clearSignature:function(){this.signaturePad.clear()}}},d=(a(282),a(6)),u=Object(d.a)(c,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"signature-pad",attrs:{id:"signature-pad"}},[a("div",{staticClass:"signature"},[a("canvas",{attrs:{id:t.id}})]),t._v(" "),a("button-rounded",{staticClass:"btn-smoke rounded bold floated-icon medium clear_signature",nativeOn:{click:function(e){t.clearSignature()}}},[a("span",{staticClass:"text"},[t._v("\n      Clear\n    ")]),t._v(" "),a("fa",{attrs:{icon:["fa","trash"]}})],1)],1)},[],!1,null,null,null);u.options.__file="canvasSignature.vue";var m=u.exports;e.a=m},316:function(t,e){},402:function(t,e,a){"use strict";var n=a(305);a.n(n).a},403:function(t,e,a){(t.exports=a(4)(!1)).push([t.i,"\n.notifications{z-index:9998;margin:1.5rem 1.5rem 0 0\n}\n.notifications .vue-notification{margin:0 0 10px\n}\nul{list-style:none;padding:0;margin:0\n}\n.form-check{padding:0!important\n}\n.btn{background-color:#fff\n}\n.image_isset img{display:block;border:1px solid #cfd4dd\n}\n@media only screen and (max-width:425px){\n.image_isset{text-align:center\n}\n}",""])},404:function(t,e,a){"use strict";var n=a(306);a.n(n).a},405:function(t,e,a){(t.exports=a(4)(!1)).push([t.i,"\n.notifications[data-v-40ceec4c]{z-index:9998;margin:1.5rem 1.5rem 0 0\n}\n.notifications .vue-notification[data-v-40ceec4c]{margin:0 0 10px\n}\nul[data-v-40ceec4c]{list-style:none;padding:0;margin:0\n}\n.form-check[data-v-40ceec4c]{padding:0!important\n}\n.big-logo[data-v-40ceec4c]{padding:0 15px 0 0!important\n}\n@media only screen and (max-width:767px){\n.big-logo[data-v-40ceec4c]{padding:0!important\n}\n}",""])},415:function(t,e,a){"use strict";a.r(e);a(36);var n=a(0),i=a.n(n),r=(a(24),a(8)),o=a.n(r),s=a(17),l=a(311),c=a(224),d=a(312),u=(a(72),a(281)),m=a.n(u),f=a(216),p={name:"ImageLoader",components:{ButtonRounded:f.a},props:{parent_image:{type:String,default:""}},data:function(){return{image:m.a.isUri(this.parent_image)?this.parent_image:"data:image/png;base64,"+this.parent_image}},watch:{image:{deep:!0,handler:function(t){t?this.$emit("update",t.split(",")[1]):this.$emit("update","")}}},mounted:function(){void 0!==this.parent_image&&""!==this.parent_image||(this.image=!1)},methods:{onFileChange:function(t){var e=t.target.files||t.dataTransfer.files;e.length&&this.createImage(e[0])},createImage:function(t){new Image;var e=new FileReader,a=this;e.onload=function(t){a.image=t.target.result},e.readAsDataURL(t)},removeImage:function(t){this.image=!1}}},g=(a(402),a(6)),v=Object(g.a)(p,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[t.image?a("div",{staticClass:"image_isset"},[a("img",{staticClass:"img-fluid",attrs:{src:t.image}}),t._v(" "),a("button-rounded",{staticClass:"btn-smoke rounded bold floated-icon medium clear_signature",staticStyle:{margin:"1.25rem 0"},nativeOn:{click:function(e){return t.removeImage(e)}}},[a("span",{staticClass:"text"},[t._v("\n        Remove\n      ")]),t._v(" "),a("fa",{attrs:{icon:["fa","trash"]}})],1)],1):a("div",[a("input",{staticClass:"btn",staticStyle:{"margin-bottom":"1.25rem"},attrs:{type:"file",accept:"image/*"},on:{change:t.onFileChange}})])])},[],!1,null,null,null);v.options.__file="imageLoader.vue";var h,b,y=v.exports,_={components:{inputStandard:c.a,vTab:l.a,vTabs:l.b,canvasSignature:d.a,imageLoader:y,buttonRounded:f.a},middleware:"pages",data:function(){return{user:null,company:null}},computed:o()({},Object(s.b)({getMenuPage:"menu/getMenuPage"}),{sections:function(){var t=this.getMenuPage(this.$route.name);return t?t.properties.sections:{}}}),mounted:function(){this.getUser(),this.getCompany()},methods:{getUser:(b=i()(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e={ui_id:5},t.next=3,this.$api().user.get(e);case 3:this.user=t.sent;case 4:case"end":return t.stop()}},t,this)})),function(){return b.apply(this,arguments)}),getCompany:(h=i()(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e={ui_id:5},t.next=3,this.$api().company.get(e);case 3:this.company=t.sent;case 4:case"end":return t.stop()}},t,this)})),function(){return h.apply(this,arguments)}),getByHolder:function(t){switch(t){case"user":return this.user;case"company":return this.company;default:return!1}},setByHolder:function(t,e,a){return this.getByHolder(t)&&(this[t][e]=a),!0},updateSettings:function(){this.$api().user.update(this.user),this.$api().company.update(this.company)}}},x=(a(404),Object(g.a)(_,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container-fluid"},[Object.keys(t.sections).length&&t.user&&t.company?a("v-tabs",[t._l(t.sections,function(e,n){return[a("v-tab",{key:n,attrs:{name:e.label}},[a("div",{staticClass:"row"},[a("div",{staticClass:"col"},[a("div",{staticClass:"card"},[a("transition",{attrs:{name:"table-fade",mode:"out-in",appear:""}},[a("div",{staticClass:"card-block"},[a("div",{staticClass:"row"},[t._l(t.$order(e.elements),function(e,n){return[1==e.field_type?[a("div",{key:n,staticClass:"col-md-6 col-lg-4"},[a("input-standard",{key:n,attrs:{label:e.element_label,computed_value:t.getByHolder(e.holder)[e.field_name],limits:e.hasOwnProperty("limits")&&e.limits.hasOwnProperty("char")?e.limits.char:{}},on:{update:function(a){t.setByHolder(e.holder,e.field_name,a)}}})],1)]:5==e.field_type?[a("div",{key:n,staticClass:"col-md-12"},[a("label",{staticClass:"control-label",attrs:{for:e.field_name}},[t._v(t._s(e.element_label))]),t._v(" "),a("canvas-signature",{key:n,attrs:{id:e.field_name,signature:t.getByHolder(e.holder)[e.field_name],data:e},on:{update:function(a){t.setByHolder(e.holder,e.field_name,a)}}})],1)]:10==e.field_type?[a("div",{key:n,staticClass:"col-md-12"},[a("label",{staticClass:"control-label",attrs:{for:e.field_name}},[t._v(t._s(e.element_label))]),t._v(" "),a("image-loader",{key:n,staticClass:"big-logo col-lg-4 col-md-6",attrs:{parent_image:t.getByHolder(e.holder)[e.field_name]},on:{update:function(a){t.setByHolder(e.holder,e.field_name,a)}}})],1)]:t._e()]})],2),t._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"col save"},[a("button-rounded",{staticClass:"btn-md btn-green rounded pull-right bold floated-icon medium",nativeOn:{click:function(e){t.updateSettings()}}},[a("span",{staticClass:"text"},[t._v("\n                          Save\n                        ")]),t._v(" "),a("fa",{attrs:{icon:["fa","check"]}})],1)],1)])])])],1)])])])]})],2):t._e()],1)},[],!1,null,"40ceec4c",null));x.options.__file="settings.vue";e.default=x.exports}}]);