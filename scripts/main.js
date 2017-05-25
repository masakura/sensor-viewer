"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),_ref=function(){function e(e,t){return new Promise(function(n){var r=new Date(t.getFullYear(),t.getMonth(),t.getDate()),a=new Date(t.getFullYear(),t.getMonth(),t.getDate()+1),o=e.history();o.size(999),o.span(r.getTime(),a.getTime()),o.on("data",n),o.run()})}function t(e){return Object.assign({timestamp:new Date(e.timestamp)},{value:e.value})}function n(e){var t=_.chain(e.value).pairs().filter(function(e){return/temp/.test(e[0])}).object().value();return{timestamp:e.timestamp,value:t}}var r=function(){function e(t){_classCallCheck(this,e),this.storeName=t}return _createClass(e,[{key:"load",value:function(){var e=localStorage.getItem(this.storeName);return e?JSON.parse(e):[]}},{key:"save",value:function(e){localStorage.setItem(this.storeName,JSON.stringify(e))}},{key:"includes",value:function(e){return this.load().includes(e)}},{key:"add",value:function(e){if(!this.includes(e)){var t=this.load();t.push(e),this.save(t)}}}]),e}(),a=function(){function e(t){_classCallCheck(this,e),this.milkcocoa=new MilkCocoa(t)}return _createClass(e,[{key:"sensor",value:function(e){return new o(this.milkcocoa,e)}}]),e}(),o=function(){function r(e,t){_classCallCheck(this,r),this.dataStore=e.dataStore(t)}return _createClass(r,[{key:"today",value:function a(){var e=new Date,a=new Date(e.getFullYear(),e.getMonth(),e.getDate());return this.load(a)}},{key:"load",value:function(r){var a=this;return e(this.dataStore,r).then(function(e){return e.map(t).map(n).reverse()}).then(function(e){return a.wrap(e,r)})}},{key:"wrap",value:function(e,t){var n=this;return Object.assign(e,{date:t,reload:function(){return n.load(t)},next:function r(){var r=new Date(t.getTime()+864e5);return n.load(r)},prev:function a(){var a=new Date(t.getTime()-864e5);return n.load(a)}})}}]),r}();return{SensorStore:r,SensorFactory:a,Sensor:o}}(),SensorStore=_ref.SensorStore,SensorFactory=_ref.SensorFactory,Sensor=_ref.Sensor,_createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),_ref=function(){function e(t,n){var r=e.chart||(e.chart=new Chart(t,{type:"line",data:n}));Object.assign(r.data,n),r.update()}function t(e){console.log(e.map(function(e){return e.timestamp}));var t=e.map(function(e){return moment(e.timestamp).format("HH:mm")}),a=n(e),o=a.map(function(t){return{label:t,data:r(e,t)}});return{labels:t,datasets:o}}function n(e){return _.chain(e).map(function(e){return Object.keys(e.value)}).flatten().uniq().value()}function r(e,t){return e.map(function(e){return e.value[t]})}var a=function(){function e(){_classCallCheck(this,e)}return _createClass(e,null,[{key:"convert",value:function(e){return t(e)}}]),e}(),o=function(){function t(e){_classCallCheck(this,t),this.context=e}return _createClass(t,[{key:"draw",value:function(t){var n=a.convert(t);e(this.context,n)}}],[{key:"fromSelector",value:function(e){var n=document.querySelector("#graph-area").getContext("2d");return new t(n)}}]),t}();return{ChartUtility:a,ChartDrawer:o}}(),ChartUtility=_ref.ChartUtility,ChartDrawer=_ref.ChartDrawer;!function(){function e(){var e=window.location.hash.replace(/^#/,"");return e?e:"localhost"!==location.hostname?location.pathname.replace(/^\//,""):""}var t=e(),n=new SensorStore("sensors"),r=new SensorFactory("readirndedjx.mlkcca.com").sensor(t),a=ChartDrawer.fromSelector("#graph-area"),o=_.template($("#sensor-list-item-template").text()),i=void 0,u={hide:function(){$("#index").hide(),$("#sensor").hide(),$("#add").hide()},showIndex:function(){this.hide(),$("#index").show()},showSensor:function(){var e=this;this.hide(),$("#sensor").show(),r.today().then(function(t){return e.update(t)})},update:function(e){i=e,$("#date").text(e.date),a.draw(e)},showAdd:function(){this.hide(),$("#add").show()},prev:function(){var e=this;i&&i.prev().then(function(t){return e.update(t)})},next:function(){var e=this;i&&i.next().then(function(t){return e.update(t)})}};$(document).on("click","#prev",function(e){u.prev(),e.preventDefault()}),$(document).on("click","#next",function(e){u.next(),e.preventDefault()}),$(document).on("click","#add-sensor",function(){n.add(t),u.showSensor()}),$(document).ready(function(){$(".sensor-name").text(t);var e=n.load().map(function(e){return $(o({name:e}))});$("#sensor-index").empty().append(e),t?n.includes(t)?u.showSensor():u.showAdd():u.showIndex()}),navigator.serviceWorker.register("/sw.js")}();