(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{217:function(t,e,a){var n=a(235);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(5).default)("2e3efec6",n,!0,{})},218:function(t,e,a){var n=a(237);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(5).default)("7f0b2f10",n,!0,{})},219:function(t,e,a){var n=a(239);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(5).default)("d05ff3f4",n,!0,{})},220:function(t,e,a){var n=a(241);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(5).default)("05e5e213",n,!0,{})},232:function(t,e,a){"use strict";a(22);var n=a(233),r={name:"VThead",components:{InputStandard:a(224).a,Dropdown:n.a},props:{enableHeader:{type:Boolean,default:!1}},data:function(){return{entries:{intervals:[5,10,20,30,40,50],interval:10},search_text:""}},methods:{search:function(t){this.search_text=t,this.$emit("search_text",t)},setInterval:function(t){this.entries.interval=t,this.$emit("interval",this.entries.intervals[t])}}},o=(a(234),a(6)),i=Object(o.a)(r,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"card-header"},[t.enableHeader?[a("div",{staticClass:"row"},[a("div",{staticClass:"col col-12 col-sm-12 col-md-4 header"},[t._t("header")],2),t._v(" "),a("div",{staticClass:"col col-12 col-sm-12 col-md-4 entries"},[a("span",{staticClass:"text"},[t._v("\n          Show:\n        ")]),t._v(" "),a("div",{staticClass:"dropdown-wrapper"},[a("dropdown",{attrs:{options:t.entries.intervals,"default-selected":t.entries.intervals.indexOf(t.entries.interval)},on:{update:function(e){t.setInterval(e)}}})],1),t._v(" "),a("span",{staticClass:"text"},[t._v("\n          entries\n        ")])]),t._v(" "),a("div",{staticClass:"col col-12 col-sm-12 col-md-4 search"},[a("input-standard",{staticClass:"search-input",attrs:{computed_value:t.search_text,placeholder:"Type the text"},on:{update:function(e){t.search(e)}}})],1)])]:t._e()],2)},[],!1,null,"1264af22",null);i.options.__file="vThead.vue";var s=i.exports,d={name:"VTrow",props:{tr:{type:Array,default:function(){return[]}},actions:{type:Array,default:function(){return[]}}},data:function(){return{isActionsOpen:!1}},methods:{toggleActions:function(){this.isActionsOpen=!this.isActionsOpen},hideActions:function(){this.isActionsOpen=!1}}},c=(a(236),Object(o.a)(d,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("tr",[a("td",{staticClass:"actions text-center align-middle"},[t.actions.length?[a("fa",{staticClass:"icon",attrs:{icon:["fa","bars"]},on:{click:t.toggleActions}}),t._v(" "),t.isActionsOpen?a("ul",{directives:[{name:"click-outside",rawName:"v-click-outside",value:t.hideActions,expression:"hideActions"}],staticClass:"items list-unstyled text-left",class:{open:t.isActionsOpen}},[t._l(t.actions,function(e,n){return[a("li",{key:n,staticClass:"item",on:{click:e.action}},[t._v("\n            "+t._s(e.title)+"\n          ")])]})],2):t._e()]:t._e()],2),t._v(" "),t._l(t.tr,function(e,n){return[a("td",{key:n},[t._v(t._s(e))])]})],2)},[],!1,null,"29e512f8",null));c.options.__file="vTrow.vue";var l={name:"VTbody",components:{VTrow:c.exports,ButtonRounded:a(216).a},props:{emptyMessage:{type:Boolean,default:function(){return!1}},tbody:{type:Array,default:function(){return[]}},thead:{type:Array,default:function(){return[]}}},data:function(){return{sortingDirection:"asc",checkSortType:1,orderBy:""}},methods:{checkOrderBy:function(t){this.orderBy=t.hasOwnProperty("order_by")?t.order_by:"",this.sortingDirection="asc"===this.sortingDirection?"desc":"asc",this.$emit("order_by",{orderBy:this.orderBy,sortingDirection:this.sortingDirection})}}},u=(a(238),Object(o.a)(l,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"card-body"},[a("div",{staticClass:"table-responsive"},[a("table",{staticClass:"table"},[a("thead",[a("tr",[a("th",{staticClass:"text-center",style:{width:"3%"},attrs:{scope:"col"}},[t._v("#")]),t._v(" "),t._l(t.$order(t.thead),function(e,n){return[a("th",{key:n,style:{width:e.width+"%"},attrs:{scope:"col"},on:{click:function(a){t.checkOrderBy(e)}}},[a("div",{staticClass:"d-flex justify-content-between"},[a("span",{staticClass:"d-flex"},[t._v("\n                  "+t._s(e.title)+"\n                ")]),t._v(" "),e.order_by===t.orderBy?["asc"===t.sortingDirection?[a("fa",{staticClass:"sortable-icon d-flex my-auto",attrs:{icon:["fa","sort-up"]}})]:"desc"===t.sortingDirection?[a("fa",{staticClass:"sortable-icon d-flex my-auto",attrs:{icon:["fa","sort-down"]}})]:t._e()]:[a("fa",{staticClass:"sortable-icon d-flex my-auto",attrs:{icon:["fa","sort"]}})]],2)])]})],2)]),t._v(" "),a("tbody",[t._l(t.tbody,function(t,e){return[a("v-trow",{key:e,attrs:{tr:t.tr,actions:t.actions}})]})],2)]),t._v(" "),0===t.tbody.length?[t._m(0)]:t._e()],2)])},[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"col-12 text-center py-5"},[e("h4",{staticClass:"text-center"},[this._v("Nothing to show")])])}],!1,null,"27b7ead6",null));u.options.__file="vTbody.vue";var p=u.exports,f=a(246),h=a(225),v={name:"VTable",components:{ButtonRounded:a(214).a,SpinerLoader:h.a,VTbody:p,VThead:s,VFooter:f.a},props:{enableHeader:{type:Boolean,default:!1},thead:{type:Array,default:function(){return[]}},tbody:{type:Array,default:function(){return[]}},tfooter:{type:Object,default:function(){return{}}},isLoading:{type:Boolean,default:!1}},methods:{searchText:function(t){this.$emit("search_text",t),this.$emit("set_page",1)},updateInterval:function(t){this.$emit("interval",t),this.$emit("set_page",1)}}},m=(a(240),Object(o.a)(v,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"card"},[a("v-thead",{attrs:{"enable-header":t.enableHeader},on:{search_text:function(e){t.searchText(e)},interval:function(e){t.updateInterval(e)}}},[a("template",{slot:"header"},[t._t("header")],2)],2),t._v(" "),a("div",{staticClass:"position-relative"},[a("v-tbody",{attrs:{thead:t.thead,tbody:t.tbody},on:{order_by:function(e){t.$emit("order_by",e)}}}),t._v(" "),a("v-footer",{attrs:{paginator:t.tfooter},on:{update:function(e){t.$emit("set_page",e)}}}),t._v(" "),t.isLoading?a("div",{staticClass:"loader"},[a("spiner-loader")],1):t._e()],1)],1)},[],!1,null,"3186de4b",null));m.options.__file="vTable.vue";e.a=m.exports},233:function(t,e,a){"use strict";var n=a(244);e.a=n.a},234:function(t,e,a){"use strict";var n=a(217);a.n(n).a},235:function(t,e,a){(t.exports=a(4)(!1)).push([t.i,"\n.notifications[data-v-1264af22]{z-index:9998;margin:1.5rem 1.5rem 0 0\n}\n.notifications .vue-notification[data-v-1264af22]{margin:0 0 10px\n}\nul[data-v-1264af22]{list-style:none;padding:0;margin:0\n}\n.form-check[data-v-1264af22]{padding:0!important\n}\n.card-header[data-v-1264af22]{border-bottom:none\n}\n.card-header .entries[data-v-1264af22]{display:flex;flex-direction:row\n}\n.card-header .entries .dropdown-wrapper[data-v-1264af22],.card-header .entries .text[data-v-1264af22]{display:inline-flex;margin:auto 0\n}\n.card-header .entries .text[data-v-1264af22]{color:#818e9e;vertical-align:middle\n}\n.card-header .entries .text[data-v-1264af22]:first-child{margin-right:.5rem\n}\n.card-header .entries .text[data-v-1264af22]:last-child{margin-left:.5rem\n}\n.card-header .entries .dropdown-wrapper[data-v-1264af22]{width:80px\n}\n.card-header .search[data-v-1264af22]{display:flex;flex-direction:row;justify-content:flex-end\n}\n.card-header .search-input[data-v-1264af22]{display:inline-flex;margin:auto 0\n}\n@media only screen and (max-width:767px){\n.card-header .search[data-v-1264af22]{justify-content:center\n}\n}",""])},236:function(t,e,a){"use strict";var n=a(218);a.n(n).a},237:function(t,e,a){(t.exports=a(4)(!1)).push([t.i,'\n.notifications[data-v-29e512f8]{z-index:9998;margin:1.5rem 1.5rem 0 0\n}\n.notifications .vue-notification[data-v-29e512f8]{margin:0 0 10px\n}\nul[data-v-29e512f8]{list-style:none;padding:0;margin:0\n}\n.form-check[data-v-29e512f8]{padding:0!important\n}\ntr[data-v-29e512f8]:hover,tr[data-v-29e512f8]:nth-child(2n){background-color:#f7f9fa!important\n}\ntr[data-v-29e512f8]:hover{box-shadow:1px 1px 10px rgba(0,0,0,.1)\n}\ntr td[data-v-29e512f8]{font-size:.9rem;padding:.5rem\n}\ntr td.actions .icon[data-v-29e512f8]{cursor:pointer\n}\ntr td.actions .icon path[data-v-29e512f8]{fill:#007fb2\n}\ntr td.actions .items[data-v-29e512f8]{cursor:pointer;position:absolute;background:#d4d9e1;padding:1rem;border-radius:.3rem;width:10rem;left:.8%;margin:10px 0 0;z-index:2\n}\ntr td.actions .items[data-v-29e512f8]:before{content:" ";display:block;width:10px;height:5px;position:absolute;top:-10px;left:7px;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:10px solid #d4d9e1\n}\ntr td.actions .items.open[data-v-29e512f8]{display:block\n}\ntr td.actions .items .item[data-v-29e512f8]{position:relative\n}\ntr td.actions .items .item[data-v-29e512f8]:hover:after{width:50%\n}\ntr td.actions .items .item[data-v-29e512f8]:after{background:#818e9e;content:"";display:block;height:1px;transition:width .2s linear;width:20%\n}',""])},238:function(t,e,a){"use strict";var n=a(219);a.n(n).a},239:function(t,e,a){(t.exports=a(4)(!1)).push([t.i,"\n.notifications[data-v-27b7ead6]{z-index:9998;margin:1.5rem 1.5rem 0 0\n}\n.notifications .vue-notification[data-v-27b7ead6]{margin:0 0 10px\n}\nul[data-v-27b7ead6]{list-style:none;padding:0;margin:0\n}\n.form-check[data-v-27b7ead6]{padding:0!important\n}\n.card-body[data-v-27b7ead6]{padding:0\n}\n.card-body table[data-v-27b7ead6]{margin-bottom:0\n}\n.card-body table thead[data-v-27b7ead6]{background:#c3cad4\n}\n.card-body table thead tr th[data-v-27b7ead6]{cursor:pointer;font-size:1rem;font-weight:500;padding:.6rem;border-bottom:none;vertical-align:middle\n}\n.card-body table thead tr th[data-v-27b7ead6]:not(:first-child){border-left:1px solid #818e9e\n}\n.card-body table thead tr th .sortable-icon[data-v-27b7ead6]{opacity:.5;float:right\n}\n.card-body table tbody tr td[data-v-27b7ead6]{vertical-align:middle\n}\n@media only screen and (max-width:767px){\n.card-body .table[data-v-27b7ead6]{width:767px\n}\n}",""])},240:function(t,e,a){"use strict";var n=a(220);a.n(n).a},241:function(t,e,a){(t.exports=a(4)(!1)).push([t.i,"\n.notifications[data-v-3186de4b]{z-index:9998;margin:1.5rem 1.5rem 0 0\n}\n.notifications .vue-notification[data-v-3186de4b]{margin:0 0 10px\n}\nul[data-v-3186de4b]{list-style:none;padding:0;margin:0\n}\n.form-check[data-v-3186de4b]{padding:0!important\n}\n.card-footer[data-v-3186de4b]{background-color:#fff;border-radius:0 0 10px 10px\n}\n.card .loader[data-v-3186de4b]{position:absolute;display:flex;height:100%;width:100%;top:0;left:0;background:rgba(238,242,246,.6)\n}\n.card .loader .spinner-loader[data-v-3186de4b]{margin:auto\n}",""])},264:function(t,e,a){var n=a(330);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(5).default)("7938c1aa",n,!0,{})},329:function(t,e,a){"use strict";var n=a(264);a.n(n).a},330:function(t,e,a){(t.exports=a(4)(!1)).push([t.i,"\n.notifications[data-v-6ee2dd9b]{z-index:9998;margin:1.5rem 1.5rem 0 0\n}\n.notifications .vue-notification[data-v-6ee2dd9b]{margin:0 0 10px\n}\nul[data-v-6ee2dd9b]{list-style:none;padding:0;margin:0\n}\n.form-check[data-v-6ee2dd9b]{padding:0!important\n}",""])},418:function(t,e,a){"use strict";a.r(e);a(24),a(36);var n,r,o=a(0),i=a.n(o),s=(a(22),a(232)),d=a(214),c={name:"Name",components:{VModal:a(226).a,ButtonRounded:d.a,VTable:s.a},props:{dataGroup:{type:Object,default:function(){return{}}}},data:function(){return{search_text:"",orderBy:{},page:1,isLoading:!0,interval:10,deleteModal:{show:!1,id:null}}},computed:{tBodyRules:function(){return!this.dataGroup&&this.dataGroup.hasOwnProperty("body_rules")?[]:this.dataGroup.body_rules},tHead:function(){return!this.dataGroup&&this.dataGroup.hasOwnProperty("head_rules")?[]:this.dataGroup.head_rules},tBody:function(){var t=this;if(!this.recordGroups)return[];var e=[];return this.recordGroups.data.forEach(function(a){var n={actions:t.generateActions(a),tr:t.generateRow(a)};e.push(n)}),e},tFooter:function(){return this.recordGroups?{current_page:this.recordGroups.current_page,from:this.recordGroups.from,to:this.recordGroups.to,per_page:this.recordGroups.per_page,total:this.recordGroups.total,last:this.recordGroups.last_page}:{}}},asyncComputed:{recordGroups:(r=i()(regeneratorRuntime.mark(function t(){var e=this;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!this.$route.params.hasOwnProperty("id")){t.next=2;break}return t.abrupt("return",null);case 2:if(this.dataGroup.data_list_group_id){t.next=4;break}return t.abrupt("return",null);case 4:return this.isLoading=!0,t.next=7,this.$api().recordGroups.get({data_list_group_id:this.dataGroup.data_list_group_id,page:this.page,search_text:this.search_text,order_by_column:this.orderBy.orderBy,order_by_direction:this.orderBy.sortingDirection,interval:this.interval}).finally(function(){e.isLoading=!1});case 7:return t.abrupt("return",t.sent);case 8:case"end":return t.stop()}},t,this)})),function(){return r.apply(this,arguments)})},updated:function(){this.recordGroups},methods:{generateActions:function(t){var e=this,a=[];return this.$order(this.tBodyRules.actions).forEach(function(n){if("link"===n.action.module){var r={title:n.title,action:function(){e.$router.push({name:n.action.route,params:{name:n.action.name,id:_.get(t,n.action.param)}})}};a.push(r)}else if("delete"===n.action.module){var o={title:n.title,action:function(){e.deleteModal.show=!0,e.deleteModal.id=_.get(t,n.action.param)}};a.push(o)}}),a},generateRow:function(t){var e=[];return this.$order(this.tBodyRules.columns).forEach(function(a){var n=_.get(t,a.column);e.push(n)}),e},deleteRecordGroup:(n=i()(regeneratorRuntime.mark(function t(e){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!e){t.next=3;break}return t.next=3,this.$api().recordGroups.deleteById(e).then(function(t){document.location.reload(!0)});case 3:this.deleteModal.show=!1,this.deleteModal.id=null;case 5:case"end":return t.stop()}},t,this)})),function(t){return n.apply(this,arguments)})}},l=(a(329),a(6)),u=Object(l.a)(c,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",["data-groups-:name"===t.$route.name?[a("v-table",{attrs:{"enable-header":!0,thead:t.tHead,tbody:t.tBody,tfooter:t.tFooter,"is-loading":t.isLoading},on:{set_page:function(e){t.page=e},search_text:function(e){t.search_text=e},order_by:function(e){t.orderBy=e},interval:function(e){t.interval=e}}},[a("template",{slot:"header"},[a("button-rounded",{staticClass:"btn-green rounded",nativeOn:{click:function(e){t.$router.push({name:"data-groups-:name-create",params:{name:t.dataGroup.route}})}}},[t._v("\n          "+t._s(t.dataGroup.button.text)+"\n          "),a("fa",{staticClass:"ml-2",attrs:{icon:["fal","plus"]}})],1)],1)],2),t._v(" "),t.deleteModal.show?a("v-modal",{attrs:{header:"Are you sure want to delete this item?"},on:{close:function(e){t.deleteModal.show=!1}}},[a("template",{slot:"body"},[t._v("\n        Please confirm the deletion of this record. And all the records that depend on it.\n      ")]),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("button-rounded",{staticClass:"btn-smoke rounded small mr-2",nativeOn:{click:function(e){t.deleteModal.show=!1}}},[t._v("\n          Cancel\n        ")]),t._v(" "),a("button-rounded",{staticClass:"btn-green rounded small mr-2",nativeOn:{click:function(e){t.deleteRecordGroup(t.deleteModal.id)}}},[t._v("\n          Yes, delete this\n        ")])],1)],2):t._e()]:t._e(),t._v(" "),[a("nuxt-child",{key:t.$route.params.id,attrs:{"data-list-group-id":t.dataGroup.data_list_group_id,"child-tabs":t.dataGroup.tabs,"is-loading":t.isLoading}})]],2)},[],!1,null,"6ee2dd9b",null);u.options.__file=":name.vue";e.default=u.exports}}]);