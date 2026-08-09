/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let r=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=n.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&n.set(i,e))}return e}toString(){return this.cssText}};const a=(e,...t)=>{const n=1===e.length?e[0]:t.reduce(((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1]),e[0]);return new r(n,e,i)},o=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,i))(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:s,defineProperty:d,getOwnPropertyDescriptor:l,getOwnPropertyNames:c,getOwnPropertySymbols:u,getPrototypeOf:h}=Object,p=globalThis,_=p.trustedTypes,m=_?_.emptyScript:"",g=p.reactiveElementPolyfillSupport,v=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},f=(e,t)=>!s(e,t),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:f};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=b){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&d(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:r}=l(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const a=n?.call(this);r?.call(this,t),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=h(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...c(e),...u(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,n)=>{if(t)i.adoptedStyleSheets=n.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const t of n){const n=document.createElement("style"),r=e.litNonce;void 0!==r&&n.setAttribute("nonce",r),n.textContent=t.cssText,i.appendChild(n)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=n;const a=r.fromAttribute(t,e.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(e,t,i){if(void 0!==e){const n=this.constructor,r=this[e];if(i??=n.getPropertyOptions(e),!((i.hasChanged??f)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:r},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==r||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,g?.({ReactiveElement:w}),(p.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,$=x.trustedTypes,E=$?$.createPolicy("lit-html",{createHTML:e=>e}):void 0,k="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+A,M=`<${S}>`,C=document,T=()=>C.createComment(""),z=e=>null===e||"object"!=typeof e&&"function"!=typeof e,j=Array.isArray,I="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,W=/>/g,U=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),O=/'/g,D=/"/g,R=/^(?:script|style|textarea|title)$/i,L=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),H=L(1),F=L(2),q=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),V=new WeakMap,G=C.createTreeWalker(C,129);function K(e,t){if(!j(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(t):t}const Y=(e,t)=>{const i=e.length-1,n=[];let r,a=2===t?"<svg>":3===t?"<math>":"",o=P;for(let t=0;t<i;t++){const i=e[t];let s,d,l=-1,c=0;for(;c<i.length&&(o.lastIndex=c,d=o.exec(i),null!==d);)c=o.lastIndex,o===P?"!--"===d[1]?o=N:void 0!==d[1]?o=W:void 0!==d[2]?(R.test(d[2])&&(r=RegExp("</"+d[2],"g")),o=U):void 0!==d[3]&&(o=U):o===U?">"===d[0]?(o=r??P,l=-1):void 0===d[1]?l=-2:(l=o.lastIndex-d[2].length,s=d[1],o=void 0===d[3]?U:'"'===d[3]?D:O):o===D||o===O?o=U:o===N||o===W?o=P:(o=U,r=void 0);const u=o===U&&e[t+1].startsWith("/>")?" ":"";a+=o===P?i+M:l>=0?(n.push(s),i.slice(0,l)+k+i.slice(l)+A+u):i+A+(-2===l?t:u)}return[K(e,a+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class Z{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let r=0,a=0;const o=e.length-1,s=this.parts,[d,l]=Y(e,t);if(this.el=Z.createElement(d,i),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=G.nextNode())&&s.length<o;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(k)){const t=l[a++],i=n.getAttribute(e).split(A),o=/([.?@])?(.*)/.exec(t);s.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?te:"?"===o[1]?ie:"@"===o[1]?ne:ee}),n.removeAttribute(e)}else e.startsWith(A)&&(s.push({type:6,index:r}),n.removeAttribute(e));if(R.test(n.tagName)){const e=n.textContent.split(A),t=e.length-1;if(t>0){n.textContent=$?$.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],T()),G.nextNode(),s.push({type:2,index:++r});n.append(e[t],T())}}}else if(8===n.nodeType)if(n.data===S)s.push({type:2,index:r});else{let e=-1;for(;-1!==(e=n.data.indexOf(A,e+1));)s.push({type:7,index:r}),e+=A.length-1}r++}}static createElement(e,t){const i=C.createElement("template");return i.innerHTML=e,i}}function J(e,t,i=e,n){if(t===q)return t;let r=void 0!==n?i._$Co?.[n]:i._$Cl;const a=z(t)?void 0:t._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(e),r._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=r:i._$Cl=r),void 0!==r&&(t=J(e,r._$AS(e,t.values),r,n)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??C).importNode(t,!0);G.currentNode=n;let r=G.nextNode(),a=0,o=0,s=i[0];for(;void 0!==s;){if(a===s.index){let t;2===s.type?t=new X(r,r.nextSibling,this,e):1===s.type?t=new s.ctor(r,s.name,s.strings,this,e):6===s.type&&(t=new re(r,this,e)),this._$AV.push(t),s=i[++o]}a!==s?.index&&(r=G.nextNode(),a++)}return G.currentNode=C,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),z(e)?e===B||null==e||""===e?(this._$AH!==B&&this._$AR(),this._$AH=B):e!==this._$AH&&e!==q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>j(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==B&&z(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Z.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new Q(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=V.get(e.strings);return void 0===t&&V.set(e.strings,t=new Z(e)),t}k(e){j(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const r of e)n===t.length?t.push(i=new X(this.O(T()),this.O(T()),this,this.options)):i=t[n],i._$AI(r),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,r){this.type=1,this._$AH=B,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(e,t=this,i,n){const r=this.strings;let a=!1;if(void 0===r)e=J(this,e,t,0),a=!z(e)||e!==this._$AH&&e!==q,a&&(this._$AH=e);else{const n=e;let o,s;for(e=r[0],o=0;o<r.length-1;o++)s=J(this,n[i+o],t,o),s===q&&(s=this._$AH[o]),a||=!z(s)||s!==this._$AH[o],s===B?e=B:e!==B&&(e+=(s??"")+r[o+1]),this._$AH[o]=s}a&&!n&&this.j(e)}j(e){e===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===B?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==B)}}class ne extends ee{constructor(e,t,i,n,r){super(e,t,i,n,r),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??B)===q)return;const i=this._$AH,n=e===B&&i!==B||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==B&&(i===B||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}(0,x.litHtmlPolyfillSupport)?.(Z,X),(x.litHtmlVersions??=[]).push("3.3.1");const ae=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class oe extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let r=n._$litPart$;if(void 0===r){const e=i?.renderBefore??null;n._$litPart$=r=new X(t.insertBefore(T(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}oe._$litElement$=!0,oe.finalized=!0,ae.litElementHydrateSupport?.({LitElement:oe});(0,ae.litElementPolyfillSupport)?.({LitElement:oe}),(ae.litElementVersions??=[]).push("4.2.1");var se={version:"Version",invalid_configuration:"Invalid configuration",show_warning:"Show Warning",show_error:"Show Error"},de={production:"Production",consumption:"Consumption",yield_today:"Yield today",grid_today:"Grid today",grid_feed:"Grid feed",battery:"Battery",inverter_state:"Inverter state",total_yield:"Total yield",grid_consumption:"Grid consumption",battery_capacity:"Battery capacity",inverter_mode:"Inverter mode",total_metric:"Metric",weather_today:"Weather today",solar_forecast:"Solar forecast",expected_forecast:"Expected forecast"},le={metrics_using_defaults:"Currently using defaults from totals data sources. Editing will save a custom list.",metrics_empty:"No metrics configured yet.",add_metric:"Add metric",metric_label:"Display label (optional)",metric_entity:"Entity",metric_unit:"Unit override (optional)",metric_icon:"Icon (optional)",metric_use_entity_icon:"Use entity's icon",remove_metric:"Remove metric",reorder_metric:"Reorder metric",section_overview:"Overview",section_totals_sources:"Production and consumption",section_custom_metrics:"Custom metrics",section_weather:"Weather forecast",section_top_devices:"Top consuming devices",section_trend:"Trend graphs",section_sankey:"Sankey flow graph",label_production_entity:"PV production entity (W / kW)",label_current_consumption_entity:"Current consumption entity (W / kW)",label_grid_feed_entity:"Grid feed entity (W / kW)",label_grid_feed_charging_entity:"Charging indicator entity (binary_sensor, optional)",label_show_energy_flow:"Show Energy Flow (built-in)",label_show_top_devices:"Show top devices row",label_top_devices_max:"Max device badges (1–8)",label_device_badge_intensity:"Show badge intensity",label_excluded_device_ids:"Exclude devices",label_show_solar_forecast:"Show solar forecast panel",label_weather_entity:"Weather entity (optional)",label_solar_forecast_today_entity:"Solar forecast today entity (kWh, optional)",label_show_today_metrics:"Show today's metrics (yield and grid)",label_total_yield_entity:"Total yield entity (kWh)",label_total_grid_consumption_entity:"Total grid consumption entity (kWh)",label_image_url:"Image URL (optional)",label_show_trend_graphs:"Show trend graphs",label_trend_graph_entities:"Trend graph entities (multiple sensors)",label_trend_graph_hours_to_show:"Trend graph hours (default 24)",helper_show_energy_flow:"Adds the built-in Energy Flow (Sankey) graph below this card (requires Energy configuration).",helper_show_top_devices:"Adds a single-row list of top-consuming devices from Energy preferences (requires Energy configuration).",helper_top_devices_max:"Number of top-consuming device badges to display",helper_device_badge_intensity:"Tints and progress fill reflect each device’s share. Turn off to render neutral badges",helper_excluded_device_ids:"Hide selected devices (from Energy) from the Top Devices row.",helper_show_solar_forecast:"Shows a compact forecast panel aligned to the right.",helper_weather_entity:"If set, shows temperature and condition for today.",helper_solar_forecast_today_entity:"If set and no weather entity, shows today's expected solar production.",helper_show_today_metrics:"Turn off to hide 'Yield today' and 'Grid today' and use up to 8 custom metrics.",helper_show_trend_graphs:"Displays trend graph tiles for selected sensors.",helper_trend_graph_entities:"Optional. Select one or more sensor entities to render as individual trend graphs (Tile features).",helper_trend_graph_hours_to_show:"Optional. Applies to all auto-generated trend graphs."},ce={common:se,card:de,editor:le},ue={production:"Producción",consumption:"Consumo",yield_today:"Producción hoy",grid_today:"Red hoy",grid_feed:"Intercambio con la red",battery:"Batería",inverter_state:"Estado del inversor",total_yield:"Producción total",grid_consumption:"Consumo de red",battery_capacity:"Capacidad de la batería",inverter_mode:"Modo del inversor",total_metric:"Métrica",weather_today:"Tiempo hoy",solar_forecast:"Pronóstico solar",expected_forecast:"Pronóstico esperado"},he={metrics_using_defaults:"Actualmente se usan los valores predeterminados de las fuentes de totales. Al editar se guardará una lista personalizada.",metrics_empty:"Todavía no hay métricas configuradas.",add_metric:"Añadir métrica",metric_label:"Etiqueta mostrada (opcional)",metric_entity:"Entidad",metric_unit:"Unidad personalizada (opcional)",metric_icon:"Icono (opcional)",metric_use_entity_icon:"Usar el icono de la entidad",remove_metric:"Eliminar métrica",reorder_metric:"Reordenar métrica",section_overview:"Resumen",section_totals_sources:"Producción y consumo",section_custom_metrics:"Métricas personalizadas",section_weather:"Pronóstico meteorológico",section_top_devices:"Dispositivos de mayor consumo",section_trend:"Gráficas de tendencia",section_sankey:"Diagrama de flujo Sankey",label_production_entity:"Entidad de producción fotovoltaica (W / kW)",label_current_consumption_entity:"Entidad de consumo actual (W / kW)",label_grid_feed_entity:"Entidad de intercambio con la red (W / kW)",label_grid_feed_charging_entity:"Entidad indicadora de carga (binary_sensor, opcional)",label_show_energy_flow:"Mostrar Energy Flow (integrado)",label_show_top_devices:"Mostrar fila de dispositivos principales",label_top_devices_max:"Máximo de insignias de dispositivos (1–8)",label_device_badge_intensity:"Mostrar intensidad en los badges",label_excluded_device_ids:"Excluir dispositivos",label_show_solar_forecast:"Mostrar panel de pronóstico solar",label_weather_entity:"Entidad meteorológica (opcional)",label_solar_forecast_today_entity:"Entidad de pronóstico solar de hoy (kWh, opcional)",label_show_today_metrics:"Mostrar métricas de hoy (producción y red)",label_total_yield_entity:"Entidad de producción total (kWh)",label_total_grid_consumption_entity:"Entidad de consumo total de red (kWh)",label_image_url:"URL de la imagen (opcional)",label_show_trend_graphs:"Mostrar gráficas de tendencia",label_trend_graph_entities:"Entidades de gráficos de tendencia (múltiples sensores)",label_trend_graph_hours_to_show:"Horas para mostrar en el gráfico de tendencia (por defecto 24)",helper_show_energy_flow:"Añade el gráfico Energy Flow (Sankey) integrado debajo de esta tarjeta (requiere configuración de Energía).",helper_show_top_devices:"Añade una fila con los dispositivos de mayor consumo de las preferencias de Energía (requiere configuración de Energía).",helper_top_devices_max:"Número de insignias de dispositivos de mayor consumo a mostrar",helper_device_badge_intensity:"El color y progreso reflejan la parte de cada dispositivo. Desactiva para badges neutros.",helper_excluded_device_ids:"Oculta los dispositivos seleccionados (de Energía) de la fila de dispositivos principales.",helper_show_solar_forecast:"Muestra un panel de pronóstico compacto alineado a la derecha.",helper_weather_entity:"Si se establece, muestra la temperatura y condición para hoy.",helper_solar_forecast_today_entity:"Si se establece y no hay entidad meteorológica, muestra la producción solar esperada para hoy.",helper_show_today_metrics:"Desactivar para ocultar 'Producción hoy' y 'Red hoy' y usar hasta 8 métricas personalizadas.",helper_show_trend_graphs:"Muestra tarjetas de tendencia para los sensores seleccionados.",helper_trend_graph_entities:"Opcional. Selecciona una o más entidades de sensores para mostrarlas como gráficos de tendencia individuales (característica Tile).",helper_trend_graph_hours_to_show:"Opcional. Se aplica a todos los gráficos de tendencia generados automáticamente."},pe={card:ue,editor:he},_e={production:"Production",consumption:"Consommation",yield_today:"Production aujourd'hui",grid_today:"Réseau aujourd'hui",grid_feed:"Échange réseau",battery:"Batterie",inverter_state:"État de l'onduleur",total_yield:"Production totale",grid_consumption:"Consommation réseau",battery_capacity:"Capacité de la batterie",inverter_mode:"Mode de l'onduleur",total_metric:"Métrique",weather_today:"Météo aujourd'hui",solar_forecast:"Prévision solaire",expected_forecast:"Prévision attendue"},me={metrics_using_defaults:"Utilise actuellement les valeurs par défaut des sources de totaux. La modification enregistrera une liste personnalisée.",metrics_empty:"Aucune métrique configurée.",add_metric:"Ajouter une métrique",metric_label:"Libellé affiché (facultatif)",metric_entity:"Entité",metric_unit:"Unité personnalisée (facultatif)",metric_icon:"Icône (facultatif)",metric_use_entity_icon:"Utiliser l'icône de l'entité",remove_metric:"Supprimer la métrique",reorder_metric:"Réordonner la métrique",section_overview:"Vue d'ensemble",section_totals_sources:"Production et consommation",section_custom_metrics:"Métriques personnalisées",section_weather:"Prévisions météo",section_top_devices:"Appareils les plus gourmands",section_trend:"Graphiques de tendances",section_sankey:"Graphique de flux Sankey",label_production_entity:"Entité de production PV (W / kW)",label_current_consumption_entity:"Entité de consommation actuelle (W / kW)",label_grid_feed_entity:"Entité d'échange réseau (W / kW)",label_grid_feed_charging_entity:"Entité indiquant la charge (binary_sensor, optionnel)",label_show_energy_flow:"Afficher le flux d'énergie (intégré)",label_show_top_devices:"Afficher la ligne des appareils principaux",label_top_devices_max:"Nombre maximal de badges d'appareils (1–8)",label_device_badge_intensity:"Afficher l’intensité des badges",label_excluded_device_ids:"Exclure des appareils",label_show_solar_forecast:"Afficher le panneau des prévisions solaires",label_weather_entity:"Entité météo (optionnel)",label_solar_forecast_today_entity:"Entité des prévisions solaires du jour (kWh, optionnel)",label_show_today_metrics:"Afficher les métriques du jour (production et réseau)",label_total_yield_entity:"Entité de production totale (kWh)",label_total_grid_consumption_entity:"Entité de consommation réseau totale (kWh)",label_image_url:"URL de l'image (optionnel)",label_show_trend_graphs:"Afficher les graphiques de tendances",label_trend_graph_entities:"Entités des graphiques de tendance (capteurs multiples)",label_trend_graph_hours_to_show:"Heures à afficher sur les graphiques de tendance (24 par défaut)",helper_show_energy_flow:"Ajoute le graphique de flux d'énergie (Sankey) intégré sous cette carte (nécessite la configuration Énergie).",helper_show_top_devices:"Ajoute une ligne d'appareils les plus gourmands depuis les préférences Énergie (nécessite la configuration Énergie).",helper_top_devices_max:"Nombre de badges d'appareils les plus gourmands à afficher",helper_device_badge_intensity:"La teinte et le remplissage reflètent la part de chaque appareil. Désactivez pour des badges neutres.",helper_excluded_device_ids:"Masquer les appareils sélectionnés (depuis Énergie) de la ligne des principaux appareils.",helper_show_solar_forecast:"Affiche un panneau de prévisions compact aligné à droite.",helper_weather_entity:"Si défini, affiche la température et le temps du jour.",helper_solar_forecast_today_entity:"Si défini et qu'aucune entité météo n'est fournie, affiche la production solaire attendue du jour.",helper_show_today_metrics:"Désactiver pour masquer « Production aujourd'hui » et « Réseau aujourd'hui » et utiliser jusqu'à 8 métriques personnalisées.",helper_show_trend_graphs:"Affiche des tuiles de tendances pour les capteurs sélectionnés.",helper_trend_graph_entities:"Optionnel. Sélectionnez une ou plusieurs entités de capteurs à afficher sous forme de graphiques de tendance individuels (fonctionnalité Tile).",helper_trend_graph_hours_to_show:"Optionnel. S'applique à tous les graphiques de tendance générés automatiquement."},ge={card:_e,editor:me},ve={production:"Erzeugung",consumption:"Verbrauch",yield_today:"Erzeugung heute",grid_today:"Netz heute",grid_feed:"Netzeinspeisung",battery:"Batterie",inverter_state:"Wechselrichterstatus",total_yield:"Gesamterzeugung",grid_consumption:"Netzverbrauch",battery_capacity:"Batteriekapazität",inverter_mode:"Wechselrichtermodus",total_metric:"Metrik",weather_today:"Wetter heute",solar_forecast:"Solarvorhersage",expected_forecast:"Erwartete Vorhersage"},ye={metrics_using_defaults:"Verwendet derzeit die Standardwerte der Totals-Quellen. Beim Bearbeiten wird eine benutzerdefinierte Liste gespeichert.",metrics_empty:"Noch keine Metriken konfiguriert.",add_metric:"Metrik hinzufügen",metric_label:"Anzeigename (optional)",metric_entity:"Entität",metric_unit:"Einheit überschreiben (optional)",metric_icon:"Symbol (optional)",metric_use_entity_icon:"Icon der Entität verwenden",remove_metric:"Metrik entfernen",reorder_metric:"Metrik neu anordnen",section_overview:"Übersicht",section_totals_sources:"Erzeugung und Verbrauch",section_custom_metrics:"Benutzerdefinierte Kennzahlen",section_weather:"Wettervorhersage",section_top_devices:"Verbrauchsstärkste Geräte",section_trend:"Trenddiagramme",section_sankey:"Sankey-Flussdiagramm",label_production_entity:"PV-Erzeugungsentität (W / kW)",label_current_consumption_entity:"Entität aktueller Verbrauch (W / kW)",label_grid_feed_entity:"Entität für Netzeinspeisung (W / kW)",label_grid_feed_charging_entity:"Entität Ladeanzeige (binary_sensor, optional)",label_show_energy_flow:"Energy Flow anzeigen (integriert)",label_show_top_devices:"Reihe der Top-Geräte anzeigen",label_top_devices_max:"Maximale Anzahl Gerätesymbole (1–8)",label_device_badge_intensity:"Intensität der Gerätesymbole anzeigen",label_excluded_device_ids:"Geräte ausschließen",label_show_solar_forecast:"Solarprognose anzeigen",label_weather_entity:"Wetterentität (optional)",label_solar_forecast_today_entity:"Solarprognose heute (kWh, optional)",label_show_today_metrics:"Heutige Werte anzeigen (Erzeugung/Netz)",label_total_yield_entity:"Gesamterzeugung (kWh)",label_total_grid_consumption_entity:"Gesamtverbrauch Netz (kWh)",label_image_url:"Bild-URL (optional)",label_show_trend_graphs:"Trenddiagramme anzeigen",label_trend_graph_entities:"Trenddiagramm-Entitäten (mehrere Sensoren)",label_trend_graph_hours_to_show:"Trenddiagramm-Stunden (Standard 24)",helper_show_energy_flow:"Fügt das integrierte Energy-Flow-(Sankey-)Diagramm unterhalb der Karte hinzu (erfordert Energie-Konfiguration).",helper_show_top_devices:"Fügt eine Zeile mit den verbrauchsstärksten Geräten aus den Energieeinstellungen hinzu (erfordert Energie-Konfiguration).",helper_top_devices_max:"Anzahl der anzuzeigenden Gerätesymbole",helper_device_badge_intensity:"Färbung und Fortschritt zeigen den Anteil je Gerät. Abschalten für neutrale Gerätesymbole.",helper_excluded_device_ids:"Ausgewählte Geräte (aus Energie) in der Top-Geräte-Reihe ausblenden.",helper_show_solar_forecast:"Zeigt ein kompaktes Prognosefeld rechts an.",helper_weather_entity:"Falls gesetzt, werden Temperatur und Zustand für heute angezeigt.",helper_solar_forecast_today_entity:"Falls gesetzt und keine Wetterentität vorhanden, wird die erwartete solare Tagesproduktion angezeigt.",helper_show_today_metrics:"Deaktivieren, um 'Erzeugung heute' und 'Netz heute' auszublenden und bis zu 8 benutzerdefinierte Metriken zu verwenden.",helper_show_trend_graphs:"Trenddiagramme für ausgewählte Sensoren anzeigen.",helper_trend_graph_entities:"Optional. Wählen Sie eine oder mehrere Sensorentitäten für einzelne Trenddiagramme (Tile-Feature).",helper_trend_graph_hours_to_show:"Optional. Gilt für alle automatisch erzeugten Trenddiagramme."},fe={card:ve,editor:ye},be={production:"Produção",consumption:"Consumo",yield_today:"Produção hoje",grid_today:"Rede hoje",grid_feed:"Troca com a rede",battery:"Bateria",inverter_state:"Estado do inversor",total_yield:"Produção total",grid_consumption:"Consumo da rede",battery_capacity:"Capacidade da bateria",inverter_mode:"Modo do inversor",total_metric:"Métrica",weather_today:"Tempo hoje",solar_forecast:"Previsão solar",expected_forecast:"Previsão esperada"},we={metrics_using_defaults:"Atualmente usando padrões das fontes dos totais. Ao editar será guardada uma lista personalizada.",metrics_empty:"Nenhuma métrica configurada.",add_metric:"Adicionar métrica",metric_label:"Rótulo exibido (opcional)",metric_entity:"Entidade",metric_unit:"Unidade personalizada (opcional)",metric_icon:"Ícone (opcional)",metric_use_entity_icon:"Usar o ícone da entidade",remove_metric:"Remover métrica",reorder_metric:"Reordenar métrica",section_overview:"Visão geral",section_totals_sources:"Produção e consumo",section_custom_metrics:"Métricas personalizadas",section_weather:"Previsão do tempo",section_top_devices:"Dispositivos com maior consumo",section_trend:"Gráficos de tendência",section_sankey:"Gráfico de fluxo Sankey",label_production_entity:"Entidade de produção PV (W / kW)",label_current_consumption_entity:"Entidade de consumo atual (W / kW)",label_grid_feed_entity:"Entidade de troca com a rede (W / kW)",label_grid_feed_charging_entity:"Entidade indicadora de carga (binary_sensor, opcional)",label_show_energy_flow:"Mostrar Energy Flow (integrado)",label_show_top_devices:"Mostrar linha dos principais dispositivos",label_top_devices_max:"Máximo de badges de dispositivos (1–8)",label_excluded_device_ids:"Excluir dispositivos",label_show_solar_forecast:"Mostrar painel de previsão solar",label_weather_entity:"Entidade de clima (opcional)",label_solar_forecast_today_entity:"Entidade de previsão solar de hoje (kWh, opcional)",label_show_today_metrics:"Mostrar métricas de hoje (produção e rede)",label_total_yield_entity:"Entidade de produção total (kWh)",label_total_grid_consumption_entity:"Entidade de consumo total da rede (kWh)",label_image_url:"URL da imagem (opcional)",label_show_trend_graphs:"Mostrar gráficos de tendência",label_trend_graph_entities:"Entidades dos gráficos de tendência (múltiplos sensores)",label_trend_graph_hours_to_show:"Horas a exibir no gráfico de tendência (padrão 24)",helper_show_energy_flow:"Adiciona o gráfico Energy Flow (Sankey) integrado abaixo desta carta (requer configuração de Energia).",helper_show_top_devices:"Adiciona uma linha com os dispositivos de maior consumo das preferências de Energia (requer configuração de Energia).",helper_top_devices_max:"Número de badges para os dispositivos de maior consumo",helper_excluded_device_ids:"Ocultar os dispositivos selecionados (de Energia) da linha dos principais dispositivos.",helper_show_solar_forecast:"Mostra um painel compacto de previsão alinhado à direita.",helper_weather_entity:"Se definido, mostra a temperatura e condição de hoje.",helper_solar_forecast_today_entity:"Se definido e sem entidade de clima, mostra a produção solar esperada para hoje.",helper_show_today_metrics:"Desative para ocultar 'Produção hoje' e 'Rede hoje' e usar até 8 métricas personalizadas.",helper_show_trend_graphs:"Exibe gráficos de tendência para os sensores selecionados.",helper_trend_graph_entities:"Opcional. Selecione uma ou mais entidades de sensor para exibir como gráficos de tendência individuais (recurso Tile).",helper_trend_graph_hours_to_show:"Opcional. Aplica-se a todos os gráficos de tendência gerados automaticamente."},xe={card:be,editor:we},$e={production:"Productie",consumption:"Verbruik",yield_today:"Opbrengst vandaag",grid_today:"Net vandaag",grid_feed:"Netuitwisseling",battery:"Batterij",inverter_state:"Status omvormer",total_yield:"Totale opbrengst",grid_consumption:"Netverbruik",battery_capacity:"Batterijcapaciteit",inverter_mode:"Omvormermodus",total_metric:"Metriek",weather_today:"Weer vandaag",solar_forecast:"Zonneprognose",expected_forecast:"Verwachte prognose"},Ee={metrics_using_defaults:"Gebruikt momenteel de standaardwaarden van de totale gegevensbronnen. Bewerken slaat een aangepaste lijst op.",metrics_empty:"Nog geen metrieken geconfigureerd.",add_metric:"Metriek toevoegen",metric_label:"Weergavelabel (optioneel)",metric_entity:"Entiteit",metric_unit:"Eenheid overschrijven (optioneel)",metric_icon:"Icoon (optioneel)",metric_use_entity_icon:"Pictogram van entiteit gebruiken",remove_metric:"Metriek verwijderen",reorder_metric:"Metriek opnieuw ordenen",section_overview:"Overzicht",section_totals_sources:"Productie en verbruik",section_custom_metrics:"Aangepaste statistieken",section_weather:"Weersvoorspelling",section_top_devices:"Meest verbruikende apparaten",section_trend:"Trendgrafieken",section_sankey:"Sankey-stroomdiagram",label_production_entity:"PV-productie-entiteit (W / kW)",label_current_consumption_entity:"Huidige verbruiksentiteit (W / kW)",label_grid_feed_entity:"Entiteit voor netuitwisseling (W / kW)",label_grid_feed_charging_entity:"Entiteit laadindicator (binary_sensor, optioneel)",label_show_energy_flow:"Energy Flow tonen (ingebouwd)",label_show_top_devices:"Rij met belangrijkste apparaten tonen",label_top_devices_max:"Maximaal aantal apparaatbadges (1–8)",label_device_badge_intensity:"Badge-intensiteit tonen",label_excluded_device_ids:"Apparaten uitsluiten",label_show_solar_forecast:"Zonvoorspelling tonen",label_weather_entity:"Weer-entiteit (optioneel)",label_solar_forecast_today_entity:"Zonvoorspelling vandaag (kWh, optioneel)",label_show_today_metrics:"Metrieken van vandaag tonen (opbrengst en net)",label_total_yield_entity:"Totale opwek-entiteit (kWh)",label_total_grid_consumption_entity:"Totale netverbruiksentiteit (kWh)",label_image_url:"Afbeeldings-URL (optioneel)",label_show_trend_graphs:"Trendgrafieken tonen",label_trend_graph_entities:"Trendgrafiek-entiteiten (meerdere sensoren)",label_trend_graph_hours_to_show:"Trendgrafiek-uren (standaard 24)",helper_show_energy_flow:"Voegt de ingebouwde Energy Flow (Sankey) grafiek onder deze kaart toe (vereist Energie-configuratie).",helper_show_top_devices:"Voegt een rij toe met de meest verbruikende apparaten uit de Energi-instellingen (vereist Energie-configuratie).",helper_top_devices_max:"Aantal apparaatbadges voor hoogste verbruik",helper_device_badge_intensity:"Tint en voortgang tonen aandeel per apparaat. Uitschakelen voor neutrale badges.",helper_excluded_device_ids:"Geselecteerde apparaten (van Energie) verbergen in de rij met belangrijkste apparaten.",helper_show_solar_forecast:"Toont een compact prognosepaneel rechts.",helper_weather_entity:"Indien ingesteld, toont temperatuur en conditie voor vandaag.",helper_solar_forecast_today_entity:"Indien ingesteld en zonder weerentiteit, toont de verwachte zonneproductie van vandaag.",helper_show_today_metrics:"Uitschakelen om 'Opbrengst vandaag' en 'Net vandaag' te verbergen en tot 8 aangepaste metrieken te gebruiken.",helper_show_trend_graphs:"Trendgrafiektegels voor geselecteerde sensoren tonen.",helper_trend_graph_entities:"Optioneel. Kies een of meer sensorentiteiten om als individuele trendgrafieken (Tile-functie) weer te geven.",helper_trend_graph_hours_to_show:"Optioneel. Geldt voor alle automatisch gegenereerde trendgrafieken."},ke={card:$e,editor:Ee};const Ae={en:Object.freeze({__proto__:null,card:de,common:se,default:ce,editor:le}),es:Object.freeze({__proto__:null,card:ue,default:pe,editor:he}),fr:Object.freeze({__proto__:null,card:_e,default:ge,editor:me}),de:Object.freeze({__proto__:null,card:ve,default:fe,editor:ye}),pt:Object.freeze({__proto__:null,card:be,default:xe,editor:we}),nl:Object.freeze({__proto__:null,card:$e,default:ke,editor:Ee})};function Se(e,t="",i=""){var n,r,a;let o="en";try{const e=document.querySelector("home-assistant")||document.querySelector("hc-main")||document.querySelector("home-assistant-main"),t=null==e?void 0:e.hass;o=(null===(n=null==t?void 0:t.locale)||void 0===n?void 0:n.language)||(null==t?void 0:t.language)||(null===(r=document.documentElement)||void 0===r?void 0:r.lang)||navigator.language||"en"}catch(e){o=(null===(a=document.documentElement)||void 0===a?void 0:a.lang)||navigator.language||"en"}const s=String(o).replace(/['"]+/g,"").replace("-","_"),d=s.split("_")[0],l=Ae[s]||Ae[d]||Ae.en;let c;try{c=e.split(".").reduce(((e,t)=>null==e?void 0:e[t]),l)}catch(e){c=void 0}return void 0===c&&(c=e.split(".").reduce(((e,t)=>null==e?void 0:e[t]),Ae.en)),"string"!=typeof c&&(c=e),""!==t&&""!==i&&(c=c.replace(t,i)),c}function Me(e){var t;try{const i=new Date;return`${i.toLocaleDateString((null===(t=null==e?void 0:e.locale)||void 0===t?void 0:t.language)||void 0,{weekday:"short"})} ${i.getDate()}/${i.getMonth()+1}`}catch(e){const t=new Date;return`${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()}`}}function Ce(e,t,i={}){var n;if(null==e||""===e)return"—";const r=Number(e);if(Number.isNaN(r))return String(e);const a=(null===(n=null==t?void 0:t.locale)||void 0===n?void 0:n.language)||(null==t?void 0:t.language)||navigator.language||"en";try{return new Intl.NumberFormat(a,i).format(r)}catch(e){return String(r)}}const Te=new Set(["unknown","unavailable","none"]);function ze(e,t){var i;if(!t)return{value:"—",unit:""};const n=null===(i=null==e?void 0:e.states)||void 0===i?void 0:i[t];if(!n)return{value:"—",unit:""};const r=n.attributes.unit_of_measurement||"",a=n.state;if(Te.has(a))return{value:"—",unit:r};return{value:Ce(a,e,{maximumFractionDigits:2}),unit:r}}var je,Ie;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(je||(je={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Ie||(Ie={}));var Pe={alert:"mdi:alert",automation:"mdi:playlist-play",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",configurator:"mdi:settings",conversation:"mdi:text-to-speech",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",history_graph:"mdi:chart-line",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_boolean:"mdi:drawing",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",person:"mdi:account",plant:"mdi:flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:google-pages",script:"mdi:file-document",sensor:"mdi:eye",simple_alarm:"mdi:bell",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",water_heater:"mdi:thermometer",weblink:"mdi:open-in-new"};function Ne(e,t){if(e in Pe)return Pe[e];switch(e){case"alarm_control_panel":switch(t){case"armed_home":return"mdi:bell-plus";case"armed_night":return"mdi:bell-sleep";case"disarmed":return"mdi:bell-outline";case"triggered":return"mdi:bell-ring";default:return"mdi:bell"}case"binary_sensor":return t&&"off"===t?"mdi:radiobox-blank":"mdi:checkbox-marked-circle";case"cover":return"closed"===t?"mdi:window-closed":"mdi:window-open";case"lock":return t&&"unlocked"===t?"mdi:lock-open":"mdi:lock";case"media_player":return t&&"off"!==t&&"idle"!==t?"mdi:cast-connected":"mdi:cast";case"zwave":switch(t){case"dead":return"mdi:emoticon-dead";case"sleeping":return"mdi:sleep";case"initializing":return"mdi:timer-sand";default:return"mdi:z-wave"}default:return console.warn("Unable to find icon for domain "+e+" ("+t+")"),"mdi:bookmark"}}var We=function(e,t,i){void 0===i&&(i=!1),i?history.replaceState(null,"",t):history.pushState(null,"",t),function(e,t,i,n){n=n||{},i=null==i?{}:i;var r=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});r.detail=i,e.dispatchEvent(r)}(window,"location-changed",{replace:i})},Ue={humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",temperature:"mdi:thermometer",pressure:"mdi:gauge",power:"mdi:flash",signal_strength:"mdi:wifi"},Oe={binary_sensor:function(e,t){var i="off"===e;switch(null==t?void 0:t.attributes.device_class){case"battery":return i?"mdi:battery":"mdi:battery-outline";case"battery_charging":return i?"mdi:battery":"mdi:battery-charging";case"cold":return i?"mdi:thermometer":"mdi:snowflake";case"connectivity":return i?"mdi:server-network-off":"mdi:server-network";case"door":return i?"mdi:door-closed":"mdi:door-open";case"garage_door":return i?"mdi:garage":"mdi:garage-open";case"power":case"plug":return i?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return i?"mdi:check-circle":"mdi:alert-circle";case"smoke":return i?"mdi:check-circle":"mdi:smoke";case"heat":return i?"mdi:thermometer":"mdi:fire";case"light":return i?"mdi:brightness-5":"mdi:brightness-7";case"lock":return i?"mdi:lock":"mdi:lock-open";case"moisture":return i?"mdi:water-off":"mdi:water";case"motion":return i?"mdi:walk":"mdi:run";case"occupancy":case"presence":return i?"mdi:home-outline":"mdi:home";case"opening":return i?"mdi:square":"mdi:square-outline";case"running":return i?"mdi:stop":"mdi:play";case"sound":return i?"mdi:music-note-off":"mdi:music-note";case"update":return i?"mdi:package":"mdi:package-up";case"vibration":return i?"mdi:crop-portrait":"mdi:vibrate";case"window":return i?"mdi:window-closed":"mdi:window-open";default:return i?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}},cover:function(e){var t="closed"!==e.state;switch(e.attributes.device_class){case"garage":return t?"mdi:garage-open":"mdi:garage";case"door":return t?"mdi:door-open":"mdi:door-closed";case"shutter":return t?"mdi:window-shutter-open":"mdi:window-shutter";case"blind":return t?"mdi:blinds-open":"mdi:blinds";case"window":return t?"mdi:window-open":"mdi:window-closed";default:return Ne("cover",e.state)}},sensor:function(e){var t=e.attributes.device_class;if(t&&t in Ue)return Ue[t];if("battery"===t){var i=Number(e.state);if(isNaN(i))return"mdi:battery-unknown";var n=10*Math.round(i/10);return n>=100?"mdi:battery":n<=0?"mdi:battery-alert":"hass:battery-"+n}var r=e.attributes.unit_of_measurement;return"°C"===r||"°F"===r?"mdi:thermometer":Ne("sensor")},input_datetime:function(e){return e.attributes.has_date?e.attributes.has_time?Ne("input_datetime"):"mdi:calendar":"mdi:clock"}};function De(e,t){var i,n,r,a,o,s;const d=null===(i=null==e?void 0:e.states)||void 0===i?void 0:i[t];if(!d)return"mdi:power-plug";const l=null===(n=d.attributes)||void 0===n?void 0:n.icon;if(l)return l;try{const e=function(e){if(!e)return"mdi:bookmark";if(e.attributes.icon)return e.attributes.icon;var t=function(e){return e.substr(0,e.indexOf("."))}(e.entity_id);return t in Oe?Oe[t](e):Ne(t,e.state)}(d);if("string"==typeof e&&e)return e}catch(e){}const c=t.split(".")[0],u=null===(r=d.attributes)||void 0===r?void 0:r.device_class;if(("sensor"===c||"binary_sensor"===c)&&"battery"===u){const e=String(d.state),t=Number(e),i=Number.isFinite(t)?Math.max(0,Math.min(100,t)):Number.NaN,n=Boolean(!0===(null===(a=d.attributes)||void 0===a?void 0:a.charging)||!0===(null===(o=d.attributes)||void 0===o?void 0:o.battery_charging)||"on"===String(null===(s=d.attributes)||void 0===s?void 0:s.charging).toLowerCase());if(!Number.isNaN(i)){const e=i>=95?"100":i>=85?"90":i>=75?"80":i>=65?"70":i>=55?"60":i>=45?"50":i>=35?"40":i>=25?"30":i>=15?"20":"10";return n?`mdi:battery-charging-${e}`:"100"===e?"mdi:battery":`mdi:battery-${e}`}return"mdi:battery"}return"light"===c?"mdi:lightbulb":"switch"===c?"mdi:power-plug":"fan"===c?"mdi:fan":"climate"===c?"mdi:thermostat":"sensor"===c&&"power"===u?"mdi:flash":"sensor"===c&&"energy"===u?"mdi:lightning-bolt":"mdi:power-plug"}function Re(e,t,i){var n,r,a,o,s;const d=null===(n=i.statToDeviceId)||void 0===n?void 0:n[e];if(!d)return"mdi:power-plug";const l=null===(r=i.deviceIconById)||void 0===r?void 0:r[d];if(l)return l;const c=(null===(a=i.deviceEntitiesMap)||void 0===a?void 0:a[d])||[];if(!c.length)return"mdi:power-plug";const u=(null==t?void 0:t.states)||{},h=i.entityRegistryByEntityId||{},p=["light","switch","climate","fan","vacuum","media_player","water_heater","humidifier","cover"];for(const e of p){const t=c.find((t=>t.startsWith(e+"."))),i=t?h[t]:void 0;if(null==i?void 0:i.icon)return i.icon}for(const e of c){const t=h[e];if(null==t?void 0:t.icon)return t.icon}for(const e of p){const t=c.find((t=>t.startsWith(e+"."))),i=t?u[t]:void 0;if(null===(o=null==i?void 0:i.attributes)||void 0===o?void 0:o.icon)return i.attributes.icon}for(const e of c){const t=u[e];if(null===(s=null==t?void 0:t.attributes)||void 0===s?void 0:s.icon)return t.attributes.icon}for(const e of p){const i=c.find((t=>t.startsWith(e+".")));if(i)return De(t,i)}for(const e of c)if(u[e])return De(t,e);return"mdi:power-plug"}function Le(e,t){const i=function(e){return Array.isArray(e.totals_metrics)?e.totals_metrics.filter((e=>e&&"object"==typeof e)).slice(0,8).map(((e,t)=>{const i="string"==typeof e.entity&&e.entity?e.entity:`metric-${t+1}`;return Object.assign(Object.assign({},e),{id:"string"==typeof e.id&&e.id?e.id:i})})):[]}(t);return i.map(((t,i)=>{const n=t.entity,r=n?ze(e,n):{value:"—",unit:""},a=function(e,t,i){var n,r;if("string"==typeof t.label&&t.label.trim())return t.label.trim();if(i){const t=null===(n=null==e?void 0:e.states)||void 0===n?void 0:n[i],a=null===(r=null==t?void 0:t.attributes)||void 0===r?void 0:r.friendly_name;if(a)return a;const[,o]=i.split(".",2);if(o)return o.replace(/_/g," ")}return"Total"}(e,t,n),o="string"==typeof t.unit&&t.unit?t.unit:r.unit,s=t.id||n||`metric-${i+1}`;let d=null;if(!1!==t.use_entity_icon&&n){const t=De(e,n);"string"==typeof t&&t.trim()&&(d=t.trim())}if(!d){d=("string"==typeof t.icon&&t.icon.trim()?t.icon.trim():"")||null}return{key:s,label:a,value:r.value,unit:o,icon:d,entity:n||null}}))}async function He(e,t){const i=new Date,n=new Date(i.getFullYear(),i.getMonth(),i.getDate()).toISOString(),r=i.toISOString(),a=`history/period/${n}?filter_entity_id=${encodeURIComponent(t)}&end_time=${r}&minimal_response`,o=await e.callApi("GET",a);if(!Array.isArray(o)||!Array.isArray(o[0])||!o[0].length)return 0;const s=o[0].map((e=>{const t=Number(e.state);return Number.isFinite(t)?t:null})).filter((e=>null!==e));if(!s.length)return 0;const d=s[0],l=s[s.length-1]-d;return l>0?l:0}const Fe={};function qe(e){(null==e?void 0:e.timerId)&&(clearTimeout(e.timerId),e.timerId=null)}function Be(e,t,i){var n;if(!t)return null;const r=(new Date).toDateString(),a=function(e,t){var i,n,r;return null!==(r=null===(n=null===(i=null==e?void 0:e.states)||void 0===i?void 0:i[t])||void 0===n?void 0:n.state)&&void 0!==r?r:null}(e,t),o=Fe[t],s=!(!o||o.dateKey===r);let d=function(e,t,i){return t&&t.dateKey!==i?(qe(t),void delete Fe[e]):t}(t,o,r);if(d&&d.dateKey===r&&null!=d.value)return d.lastState===a||d.inflight||function(e,t,i,n,r){const a=Fe[t];qe(a);const o=setTimeout((()=>{const a=Fe[t];Fe[t]=Object.assign(Object.assign({},a||{dateKey:i}),{inflight:!0,timerId:null}),He(e,t).then((e=>{Fe[t]={dateKey:i,inflight:!1,value:e,lastState:n,timerId:null},null==r||r()})).catch((()=>{var e;Fe[t]={dateKey:i,inflight:!1,value:null!==(e=null==a?void 0:a.value)&&void 0!==e?e:null,lastState:n,timerId:null},null==r||r()}))}),3e4);Fe[t]=Object.assign(Object.assign({},a||{dateKey:i,inflight:!1,value:null,lastState:n}),{dateKey:i,lastState:n,timerId:o})}(e,t,r,a,i),d.value;if(d&&d.inflight&&d.dateKey===r)return null!==(n=d.value)&&void 0!==n?n:null;const l=s?0:d&&d.dateKey===r?d.value:null;return function(e,t,i,n,r,a){Fe[t]={dateKey:i,inflight:!0,value:r,lastState:n,timerId:null},He(e,t).then((e=>{Fe[t]={dateKey:i,inflight:!1,value:e,lastState:n,timerId:null},null==a||a()})).catch((()=>{Fe[t]={dateKey:i,inflight:!1,value:null,lastState:n,timerId:null},null==a||a()}))}(e,t,r,a,l,i),null!=l?l:null}let Ve=null,Ge=null;async function Ke(e){const t=Date.now();if(Ve&&t-Ve.ts<6e4)return Ve.data;const i=await e.callWS({type:"config/entity_registry/list"});return Ve={ts:t,data:Array.isArray(i)?i:[]},Ve.data}async function Ye(e){const t=Date.now();if(Ge&&t-Ge.ts<6e4)return Ge.data;try{const i=await e.callWS({type:"config/device_registry/list"});Ge={ts:t,data:Array.isArray(i)?i:[]}}catch(e){Ge={ts:t,data:[]}}return Ge.data}let Ze=null,Je=null;function Qe(e,t){const i=(e||"").trim(),n=function(e){if(!e||!Ze||!Je)return null;const t=Ze.find((t=>(null==t?void 0:t.entity_id)===e)),i=(null==t?void 0:t.device_id)?Je.find((e=>(null==e?void 0:e.id)===t.device_id)):null;return(null==i?void 0:i.name)||null}(t||"")||"";if(!n)return i;const r=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");let a=i.replace(new RegExp(r,"i"),"").trim();return a=a.replace(/^[\s\-—–:|•·.]+/,"").trim(),a||i}async function Xe(e){var t,i,n,r,a,o;const{hass:s,container:d,tileConfigs:l,existing:c}=e;if(await async function(e){e&&(Ze||(Ze=await Ke(e)),Je||(Je=await Ye(e)))}(s),!d||!(null==l?void 0:l.length))return c;if(Array.isArray(c)&&c.length===l.length){for(const e of c)try{e.hass=s}catch(e){}return c}d.innerHTML="";const u=[];for(const e of l){if(!e)continue;let l=null;const c=e.entity;let h=c&&(null===(n=null===(i=null===(t=null==s?void 0:s.states)||void 0===t?void 0:t[c])||void 0===i?void 0:i.attributes)||void 0===n?void 0:n.friendly_name);const p=Object.assign({type:"tile"},e);!("name"in p)&&h&&(p.name=Qe(String(h),c));try{const e=await(null===(r=window.loadCardHelpers)||void 0===r?void 0:r.call(window));(null==e?void 0:e.createCardElement)&&(l=e.createCardElement(p))}catch(e){}l||(l=document.createElement("hui-tile-card"),null===(o=(a=l).setConfig)||void 0===o||o.call(a,p)),l.hass=s,d.appendChild(l),u.push(l)}return u}function et(e){const t=[],i=Array.isArray(null==e?void 0:e.feature_tiles)?e.feature_tiles:[];for(const e of i)e&&"object"==typeof e&&t.push(Object.assign({type:"tile"},e));if(!1===(null==e?void 0:e.show_trend_graphs))return t;const n=Array.isArray(null==e?void 0:e.trend_graph_entities)?e.trend_graph_entities:[],r=new Set(n),a=Number(null==e?void 0:e.trend_graph_hours_to_show)||24,o=Number(null==e?void 0:e.trend_graph_detail)||void 0;for(const e of Array.from(r)){const i=[{type:"trend-graph",hours_to_show:a}];null!=o&&(i[0].detail=o),t.push({type:"tile",entity:e,features:i})}return t}const tt=a`
  :host {
    display: block;
  }

  ha-card {
    padding: 16px;
    --label-color: var(--secondary-text-color);
    container-type: inline-size;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 0;
    align-items: stretch;
    grid-auto-rows: auto;
  }

  .container.has-forecast {
    grid-template-columns: 1fr 2fr auto;
  }

  /* Right side sections wrappers */
  .forecast-panel {
    border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding-left: 16px;
    display: grid;
    align-content: start;
    align-self: stretch;
  }

  .energy-section {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    margin-top: 12px;
    padding-top: 12px;
  }

  /* Legacy grid-kwh section removed */
  .graphs-section {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    margin-top: 12px;
    padding-top: 8px;
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  /* Grids for top/bottom sections */
  .metrics-panel {
    display: grid;
    border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding: 4px 16px 12px;
    gap: 12px;
  }

  @container (max-width: 1200px) {
    .container,
    .container.has-forecast {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .forecast-panel {
      display: flex;
    }
    .metrics-panel {
      min-width: calc(100% - 320px);
      padding-left: 0;
      border-left: none;
    }
  }

  @container (max-width: 756px) {
    .metrics-panel {
      min-width: 100%;
    }
    .forecast-panel {
      order: 3;
      width: 100%;
      border-left: none;
      padding-left: 0;
      padding-top: 12px;
    }
  }

  @container (max-width: 568px) {
    .metrics-panel {
      width: 100%;
    }
  }
`;function it(e,t,i){var n;const r=[],a=[],o=new Set,s=(e,t)=>{t&&!o.has(t)&&(e.push(t),o.add(t))},d=t=>{var i,n;if(!t)return;const o=null===(i=null==e?void 0:e.states)||void 0===i?void 0:i[t],d="power"===(null===(n=null==o?void 0:o.attributes)||void 0===n?void 0:n.device_class)?r:a;s(d,t)};for(const e of[t,i])if(Array.isArray(e))for(const t of e)d(t);if(e){const t=Object.values(e.states||{});for(const e of t){const t=e.entity_id;if(!t.startsWith("sensor."))continue;const i="power"===(null===(n=e.attributes)||void 0===n?void 0:n.device_class)?r:a;s(i,t)}}return{power:r,fallback:a}}function nt(e,t){const i=function(e,t){var i,n,r,a,o;if(!t)return{temperature:null};const s=null===(i=null==e?void 0:e.states)||void 0===i?void 0:i[t];if(!s)return{temperature:null};const d=null===(n=s.attributes)||void 0===n?void 0:n.temperature,l=(null===(r=s.attributes)||void 0===r?void 0:r.temperature_unit)||(null===(o=null===(a=null==e?void 0:e.config)||void 0===a?void 0:a.unit_system)||void 0===o?void 0:o.temperature)||"°C",c=s.state||"",u={clear:"mdi:weather-sunny","clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy",windy:"mdi:weather-windy",exceptional:"mdi:alert"}[c]||"mdi:weather-partly-cloudy";return{temperature:null!=d?String(d):null,unit:l,condition:c,icon:u}}(e,t.weather_entity),n=ze(e,t.solar_forecast_today_entity),r=!!t.weather_entity,a=!!t.solar_forecast_today_entity||!r;return{title:Se(r?"card.weather_today":"card.solar_forecast"),icon:r?i.icon||"mdi:weather-partly-cloudy":"mdi:white-balance-sunny",majorValue:a?`${n.value}`:`${null!=i.temperature?i.temperature:"—"}`,majorUnit:a?`${n.unit}`:`${i.unit||""}`,minor:a?Se("card.expected_forecast"):i.condition||""}}async function rt(e){return e.callWS({type:"energy/get_prefs"})}async function at(e,t){const i=await Ke(e),n=await Ye(e),r={};for(const e of i)(null==e?void 0:e.entity_id)&&(r[e.entity_id]=e);const a={};for(const e of n)(null==e?void 0:e.id)&&(null==e?void 0:e.icon)&&(a[e.id]=e.icon);const o={};for(const e of i)(null==e?void 0:e.entity_id)&&(null==e?void 0:e.device_id)&&(o[e.device_id]=o[e.device_id]||[]).push(e.entity_id);const s={},d={},l={},c=e.states||{};for(const e of null!=t?t:[]){const t=e.stat_consumption;if(!t||!t.includes("."))continue;const n=i.find((e=>e.entity_id===t)),r=null==n?void 0:n.device_id;if(!r)continue;const a=(o[r]||[]).filter((e=>{var t,i;const n=c[e],r=null===(t=null==n?void 0:n.attributes)||void 0===t?void 0:t.device_class,a=(null===(i=null==n?void 0:n.attributes)||void 0===i?void 0:i.unit_of_measurement)||"";return"power"===r&&/k?W/i.test(a)}));a.length&&(s[t]=a),d[t]=r,l[r]=o[r]||[]}return{devicePowerMap:s,statToDeviceId:d,deviceEntitiesMap:l,entityRegistryByEntityId:r,deviceIconById:a}}function ot(e,t,i={}){if(!Number.isFinite(e))return"";const n=Math.abs(e),r=Number.isFinite(i.digitsKW)?Math.max(0,Number(i.digitsKW)):1,a=Number.isFinite(i.digitsW)?Math.max(0,Number(i.digitsW)):0;if(n>=1e3){return`${Ce(e/1e3,t,{minimumFractionDigits:r,maximumFractionDigits:r})} kW`}return`${Ce(e,t,{minimumFractionDigits:a,maximumFractionDigits:a})} W`}function st(e,t){var i,n;if(!t)return null;const r=null===(i=null==e?void 0:e.states)||void 0===i?void 0:i[t];if(!r)return null;const a=Number(r.state);if(!Number.isFinite(a))return null;const o=String((null===(n=r.attributes)||void 0===n?void 0:n.unit_of_measurement)||"").toLowerCase();let s=a;return o.includes("mw")?s=1e6*a:o.includes("kw")?s=1e3*a:o.includes("w")&&(s=a),Number.isFinite(s)?s:null}class dt extends oe{static get properties(){return{_hass:{attribute:!1},config:{attribute:!1}}}constructor(){super(),this._energyDeviceIds=[],this._loadingEnergyDevices=!1,this._metricFormSchema=[{name:"entity",selector:{entity:{}}},{name:"label",selector:{text:{}}},{name:"unit",selector:{text:{}}},{name:"use_entity_icon",selector:{boolean:{}}}],this._handleAddMetric=e=>{e.stopPropagation();const t=this._prepareMetricsForMutation();if(t.length>=this._maxMetrics())return;const i=this._generateMetricId(t.length);t.push({id:i});const n=new Set(this._expandedMetricIds);n.add(i),this._expandedMetricIds=n,this._commitMetrics(t)},this._onMetricValueChanged=e=>{var t,i,n;e.stopPropagation();const r=e.currentTarget,a=Number(null!==(i=null===(t=null==r?void 0:r.dataset)||void 0===t?void 0:t.index)&&void 0!==i?i:-1);if(a<0)return;const o=this._prepareMetricsForMutation();o[a]&&(o[a]=Object.assign(Object.assign({},o[a]),(null===(n=e.detail)||void 0===n?void 0:n.value)||{}),this._commitMetrics(o))},this._onMetricDelete=e=>{var t,i,n;e.stopPropagation();const r=Number(null!==(n=null===(i=null===(t=e.currentTarget)||void 0===t?void 0:t.dataset)||void 0===i?void 0:i.index)&&void 0!==n?n:-1);if(r<0)return;const a=this._prepareMetricsForMutation();a[r]&&(a.splice(r,1),this._commitMetrics(a))},this._onMetricReorder=e=>{e.stopPropagation();const t=e.detail;if(!t)return;const i=Number.isFinite(t.oldIndex)?t.oldIndex:-1,n=Number.isFinite(t.newIndex)?t.newIndex:-1;if(i<0||n<0||i===n)return;const r=this._prepareMetricsForMutation();if(!r.length||i>=r.length)return;const[a]=r.splice(i,1);if(!a)return;const o=Math.min(n,r.length);r.splice(o,0,a),this._commitMetrics(r)},this._onMetricExpandedChanged=e=>{var t,i;e.stopPropagation();const n=e.currentTarget,r=null===(t=null==n?void 0:n.dataset)||void 0===t?void 0:t.metricId;if(!r)return;const a=Boolean(null===(i=e.detail)||void 0===i?void 0:i.expanded),o=new Set(this._expandedMetricIds);a?o.add(r):o.delete(r),this._expandedMetricIds=o},this._computeMetricFieldLabel=e=>({label:Se("editor.metric_label"),entity:Se("editor.metric_entity"),unit:Se("editor.metric_unit"),icon:Se("editor.metric_icon"),use_entity_icon:Se("editor.metric_use_entity_icon")}[e.name]||e.name),this._onHandleClick=e=>{e.stopPropagation()},this._valueChanged=e=>{e.stopPropagation(),this._applyConfigUpdate(e.detail.value)},this._onExcludedDeviceRowChanged=e=>{var t,i,n,r;e.stopPropagation();const a=Number(null!==(n=null===(i=null===(t=e.currentTarget)||void 0===t?void 0:t.dataset)||void 0===i?void 0:i.index)&&void 0!==n?n:-1),o=e.detail&&e.detail.value;if(a<0)return;const s=Array.isArray(null===(r=this.config)||void 0===r?void 0:r.excluded_device_ids)?[...this.config.excluded_device_ids]:[];if(o){s[a]=o;const e=Array.from(new Set(s.filter((e=>"string"==typeof e&&e))));this._applyConfigUpdate({excluded_device_ids:e})}else a>=0&&a<s.length&&s.splice(a,1),this._applyConfigUpdate({excluded_device_ids:s})},this._onExcludedDeviceAdd=e=>{var t;e.stopPropagation();const i=e.currentTarget,n=e.detail&&e.detail.value;if(!n)return;const r=Array.isArray(null===(t=this.config)||void 0===t?void 0:t.excluded_device_ids)?[...this.config.excluded_device_ids]:[];r.includes(n)||r.push(n),this._applyConfigUpdate({excluded_device_ids:r});try{i&&(i.value="")}catch(e){}},this._computeLabel=e=>{const t=`editor.label_${e.name}`,i=Se(t);return i&&i!==t?i:e.name},this._computeHelper=e=>{const t=`editor.helper_${e.name}`,i=Se(t);return i&&i!==t?i:void 0},this.config={type:"custom:solar-card"},this._hass=null,this._expandedMetricIds=new Set}set hass(e){var t;this._hass=e,(null===(t=this.config)||void 0===t?void 0:t.show_top_devices)&&this._loadEnergyDevicesIfNeeded(),this.requestUpdate()}get hass(){return this._hass}setConfig(e){var t;this.config=e||{},this._hass&&(null===(t=this.config)||void 0===t?void 0:t.show_top_devices)&&this._loadEnergyDevicesIfNeeded(),this.requestUpdate()}_buildSchemas(){const e=this.config||{},t=!!e.show_solar_forecast,i=!!e.show_trend_graphs,n=!!e.show_top_devices;return{overview:[{name:"production_entity",required:!0,selector:{entity:{domain:"sensor",device_class:"power"}}},{name:"current_consumption_entity",required:!0,selector:{entity:{domain:"sensor",device_class:"power"}}},{name:"image_url",selector:{text:{}}}],totalsToggle:[{name:"show_today_metrics",selector:{boolean:{}}}],totalsOptions:!1!==e.show_today_metrics?[{name:"total_yield_entity",selector:{entity:{domain:"sensor",device_class:"energy"}}},{name:"total_grid_consumption_entity",selector:{entity:{domain:"sensor",device_class:"energy"}}}]:[],weatherToggle:[{name:"show_solar_forecast",selector:{boolean:{}}}],weatherOptions:t?[{name:"weather_entity",selector:{entity:{domain:"weather"}}},{name:"solar_forecast_today_entity",selector:{entity:{domain:"sensor",device_class:"energy"}}}]:[],topDevicesToggle:[{name:"show_top_devices",selector:{boolean:{}}}],topDevicesOptions:n?[{name:"grid_feed_entity",selector:{entity:{domain:"sensor",device_class:"power"}}},{name:"top_devices_max",selector:{number:{min:1,max:8,mode:"box"}}},{name:"grid_feed_charging_entity",selector:{entity:{domain:"binary_sensor"}}},{name:"device_badge_intensity",selector:{boolean:{}}}]:[],trendToggle:[{name:"show_trend_graphs",selector:{boolean:{}}}],trendOptions:i?[{name:"trend_graph_entities",selector:{entity:{multiple:!0,domain:"sensor"}}},{name:"trend_graph_hours_to_show",selector:{number:{min:1,max:168,mode:"box"}}}]:[],sankey:[{name:"show_energy_flow",selector:{boolean:{}}}]}}render(){const e=this._buildSchemas();return H`
      <div class="editor">
        <div class="section">
          <h3>${Se("editor.section_overview")}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${e.overview}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
        <div class="section">
          <h3>${Se("editor.section_totals_sources")}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${e.totalsToggle}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
          ${e.totalsOptions.length?H`<div class="dependent">
                <ha-form
                  .hass=${this._hass}
                  .data=${this.config}
                  .schema=${e.totalsOptions}
                  .computeLabel=${this._computeLabel}
                  .computeHelper=${this._computeHelper}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>`:null}
        </div>
        <div class="section">
          <h3>${Se("editor.section_custom_metrics")}</h3>
          ${this._renderTotalsMetricsSection()}
        </div>
        <div class="section">
          <h3>${Se("editor.section_weather")}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${e.weatherToggle}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
          ${e.weatherOptions.length?H`<div class="dependent">
                <ha-form
                  .hass=${this._hass}
                  .data=${this.config}
                  .schema=${e.weatherOptions}
                  .computeLabel=${this._computeLabel}
                  .computeHelper=${this._computeHelper}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>`:null}
        </div>
        <div class="section">
          <h3>${Se("editor.section_top_devices")}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${e.topDevicesToggle}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
          ${e.topDevicesOptions.length?H`<div class="dependent">
                <ha-form
                  .hass=${this._hass}
                  .data=${this.config}
                  .schema=${e.topDevicesOptions}
                  .computeLabel=${this._computeLabel}
                  .computeHelper=${this._computeHelper}
                  @value-changed=${this._valueChanged}
                ></ha-form>
                ${this._renderExcludeDevicesPicker()}
                <div style="display: none">
                  <ha-form
                    .hass=${this._hass}
                    .data=${{}}
                    .schema=${[{name:"_dev_loader",selector:{device:{}}}]}
                  >
                  </ha-form>
                </div>
              </div>`:null}
        </div>
        <div class="section">
          <h3>${Se("editor.section_trend")}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${e.trendToggle}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
          ${e.trendOptions.length?H`<div class="dependent">
                <ha-form
                  .hass=${this._hass}
                  .data=${this.config}
                  .schema=${e.trendOptions}
                  .computeLabel=${this._computeLabel}
                  .computeHelper=${this._computeHelper}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>`:null}
        </div>
        <div class="section">
          <h3>${Se("editor.section_sankey")}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${e.sankey}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
      </div>
    `}_renderTotalsMetricsSection(){var e;const t=Array.isArray(null===(e=this.config)||void 0===e?void 0:e.totals_metrics)?this._getMetricsForEditor():[];this._syncExpandedMetricIds(t);const i=t.length>=this._maxMetrics(),n=0===t.length;return H`
      <div class="metrics-editor">
        ${t.length?H`<ha-sortable
              .disabled=${t.length<2}
              draggable-selector=".metric-item"
              handle-selector=".metric-handle"
              @item-moved=${this._onMetricReorder}
            >
              <div class="metrics-list">${t.map(((e,t)=>this._renderMetricItem(e,t)))}</div>
            </ha-sortable>`:B}
        ${n?H`<div class="metrics-empty">${Se("editor.metrics_empty")}</div>`:B}
        <ha-button class="add-metric" @click=${this._handleAddMetric} .disabled=${i}>
          <ha-icon slot="start" icon="mdi:plus"></ha-icon>
          ${Se("editor.add_metric")}
        </ha-button>
      </div>
    `}_renderMetricItem(e,t){const i=this._metricFormSchema,n=e.id||`metric-${t+1}`,r=this._expandedMetricIds.has(n),a=this._metricTitle(e,t),o=this._resolveMetricPreviewIcon(e);return H`
      <ha-expansion-panel
        class="metric-item"
        .expanded=${r}
        data-metric-id=${n}
        @expanded-changed=${this._onMetricExpandedChanged}
      >
        <div slot="header" class="metric-summary">
          <div
            class="metric-handle"
            role="button"
            aria-label=${Se("editor.reorder_metric")}
            title=${Se("editor.reorder_metric")}
            @click=${this._onHandleClick}
          >
            <ha-icon icon="mdi:drag"></ha-icon>
          </div>
          <span class="title">
            <span class="title-icon ${o?"":"placeholder"}">
              ${o?H`<ha-icon icon="${o}"></ha-icon>`:B}
            </span>
            <span>${a}</span>
          </span>
          <div class="summary-actions">
            <ha-icon-button
              class="remove-icon"
              data-index=${t}
              .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
              .label=${Se("editor.remove_metric")}
              @click=${this._onMetricDelete}
            ></ha-icon-button>
          </div>
        </div>
        <div class="metric-content">
          <ha-form
            .hass=${this._hass}
            .data=${e}
            .schema=${i}
            .computeLabel=${this._computeMetricFieldLabel}
            data-index=${t}
            @value-changed=${this._onMetricValueChanged}
          ></ha-form>
          ${!1!==e.use_entity_icon?B:H`<div class="dependent">
                <ha-form
                  .hass=${this._hass}
                  .data=${e}
                  .schema=${[{name:"icon",selector:{icon:{}}}]}
                  .computeLabel=${this._computeMetricFieldLabel}
                  data-index=${t}
                  @value-changed=${this._onMetricValueChanged}
                ></ha-form>
              </div>`}
        </div>
      </ha-expansion-panel>
    `}_metricTitle(e,t){var i,n,r,a;const o="string"==typeof e.label?e.label.trim():"";if(o)return o;const s="string"==typeof e.entity?e.entity.trim():"";if(s){const e=null===(a=null===(r=null===(n=null===(i=this._hass)||void 0===i?void 0:i.states)||void 0===n?void 0:n[s])||void 0===r?void 0:r.attributes)||void 0===a?void 0:a.friendly_name;if(e&&"string"==typeof e)return e;const[,t]=s.split(".",2);return t?t.replace(/_/g," "):s}return`${Se("card.total_metric")} ${t+1}`}_getMetricsForEditor(){var e;const t=null===(e=this.config)||void 0===e?void 0:e.totals_metrics;return Array.isArray(t)?t.map(((e,t)=>this._normalizeMetric(e,t))):[]}_normalizeMetric(e,t){const i="string"==typeof(null==e?void 0:e.entity)&&e.entity?e.entity:void 0,n="string"==typeof(null==e?void 0:e.label)?e.label:"",r=n.trim()?n:void 0,a="string"==typeof(null==e?void 0:e.unit)&&e.unit?e.unit:void 0,o="string"==typeof(null==e?void 0:e.icon)&&e.icon?e.icon:void 0,s=!1!==(null==e?void 0:e.use_entity_icon),d={id:"string"==typeof(null==e?void 0:e.id)&&e.id?e.id:i||`metric-${t+1}`};return i&&(d.entity=i),r&&(d.label=r),a&&(d.unit=a),o&&(d.icon=o),d.use_entity_icon=s,d}_syncExpandedMetricIds(e){const t=new Set(e.map((e=>"string"==typeof e.id&&e.id?e.id:"")).filter(Boolean));let i=!1;for(const e of Array.from(this._expandedMetricIds))t.has(e)||(this._expandedMetricIds.delete(e),i=!0);i&&(this._expandedMetricIds=new Set(this._expandedMetricIds))}_prepareMetricsForMutation(){return this._getMetricsForEditor().map((e=>Object.assign({},e)))}_commitMetrics(e){const t=e.map(((e,t)=>this._sanitizeMetric(e,t)));this._applyConfigUpdate({totals_metrics:t.length?t:[]})}_sanitizeMetric(e,t){const i="string"==typeof e.entity&&e.entity.trim()?e.entity.trim():void 0,n="string"==typeof e.label?e.label:"",r=n.trim()?n:void 0,a="string"==typeof e.unit&&e.unit.trim()?e.unit.trim():void 0,o="string"==typeof e.icon&&e.icon.trim()?e.icon.trim():void 0,s=!1!==e.use_entity_icon,d={id:"string"==typeof e.id&&e.id?e.id:i||this._generateMetricId(t)};return i&&(d.entity=i),r&&(d.label=r),a&&(d.unit=a),o&&(d.icon=o),s||(d.use_entity_icon=!1),d}_generateMetricId(e){try{if("undefined"!=typeof crypto&&"randomUUID"in crypto)return crypto.randomUUID()}catch(e){}return`metric-${Date.now()}-${e}`}async _loadEnergyDevicesIfNeeded(){if(!this._loadingEnergyDevices&&!this._energyDeviceIds.length&&this._hass){this._loadingEnergyDevices=!0;try{const e=await rt(this._hass),t=await at(this._hass,(null==e?void 0:e.device_consumption)||[]),i=(null==t?void 0:t.statToDeviceId)||{},n=Array.from(new Set(Object.values(i))).filter(Boolean);this._energyDeviceIds=n}catch(e){this._energyDeviceIds=[]}finally{this._loadingEnergyDevices=!1,this.requestUpdate()}}}_renderExcludeDevicesPicker(){var e;const t=Array.isArray(null===(e=this.config)||void 0===e?void 0:e.excluded_device_ids)?this.config.excluded_device_ids:[],i=Se("editor.helper_excluded_device_ids")||"",n=Se("editor.label_excluded_device_ids")||"Exclude devices",r=e=>!(!Array.isArray(this._energyDeviceIds)||!this._energyDeviceIds.length)&&this._energyDeviceIds.includes(e.id);return H`
      <div class="section" style="margin-top: 8px; display: grid; gap: 8px;">
        <div class="subsection-label">${n}</div>
        <div class="metrics-empty" style="margin-top: -4px;">${i}</div>
        ${t.map(((e,t)=>H`
            <div class="device-row" style="display: grid; grid-template-columns: 1fr; gap: 8px; align-items: center;">
              <ha-device-picker
                .hass=${this._hass}
                .value=${e}
                .deviceFilter=${r}
                @value-changed=${this._onExcludedDeviceRowChanged}
                data-index=${t}
              ></ha-device-picker>
            </div>
          `))}
        <div class="device-row" style="display: grid; grid-template-columns: 1fr; gap: 8px; align-items: center;">
          <ha-device-picker
            .hass=${this._hass}
            .value=${""}
            .deviceFilter=${r}
            @value-changed=${this._onExcludedDeviceAdd}
          ></ha-device-picker>
        </div>
      </div>
    `}_applyConfigUpdate(e){const t=Object.assign(Object.assign({},this.config),e);this.config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_isTodayShown(){const e=this.config||{},t=!1!==e.show_today_metrics,i=!(!e.total_yield_entity&&!e.total_grid_consumption_entity);return t&&i}_maxMetrics(){return this._isTodayShown()?6:8}_resolveMetricPreviewIcon(e){const t=!1!==(null==e?void 0:e.use_entity_icon),i="string"==typeof(null==e?void 0:e.entity)?e.entity:void 0;if(t&&i){const e=De(this._hass,i);if("string"==typeof e&&e)return e}return("string"==typeof(null==e?void 0:e.icon)&&e.icon.trim()?e.icon.trim():"")||null}}dt.styles=a`
    .editor {
      padding: 8px 0;
      display: grid;
      gap: 16px;
    }
    .section {
      display: grid;
      gap: 8px;
    }
    .section h3 {
      margin: 8px 0 0;
      font-weight: 600;
    }
    .dependent {
      margin-inline-start: 8px;
      padding: 12px;
      border-inline-start: 3px solid var(--divider-color, #d3dce5);
    }
    .dependent ha-form {
      margin-top: 4px;
    }
    .metrics-editor {
      display: grid;
      gap: 12px;
    }
    .metrics-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .metrics-list {
      display: grid;
      gap: 12px;
    }
    .metric-item {
      border: 1px solid var(--divider-color, #d3dce5);
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
      background: var(--card-background-color, var(--ha-card-background, white));
    }
    .metrics-empty {
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    .subsection-label {
      color: var(--secondary-text-color);
      font-size: 0.9rem;
      font-weight: 600;
      margin: 4px 0 0;
    }
    ha-expansion-panel.metric-item {
      --expansion-panel-content-padding: 0;
      --expansion-panel-summary-padding: 0;
      --expansion-panel-border-color: var(--divider-color, #d3dce5);
      --expansion-panel-border-radius: var(--ha-card-border-radius, 12px);
    }
    .metric-summary {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 12px;
      padding: 4px 16px;
    }
    .metric-summary .metric-handle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      color: var(--secondary-text-color);
      cursor: grab;
      flex: 0 0 auto;
    }
    .metric-summary .metric-handle:active {
      cursor: grabbing;
    }
    .metric-summary .metric-handle ha-icon {
      --mdc-icon-size: 20px;
    }
    .metric-summary .title {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-width: 0;
      font-weight: 600;
      font-size: 0.95rem;
      flex: 1 1 auto;
    }
    .metric-summary .title span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .metric-summary .title-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }
    .metric-summary .title-icon.placeholder {
      visibility: hidden;
    }
    .metric-summary .title-icon ha-icon {
      --mdc-icon-size: 24px;
      color: var(--secondary-text-color);
    }
    .summary-actions {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-inline-start: auto;
    }
    .summary-actions ha-icon-button {
      --mdc-icon-size: 20px;
      color: var(--error-color);
      --mdc-icon-button-ink-color: var(--error-color);
    }
    .metric-content {
      display: grid;
      gap: 12px;
      padding: 0 16px 16px;
    }
    .remove-metric {
      justify-self: start;
      color: var(--error-color);
    }
    ha-button.add-metric {
      justify-self: end;
    }
  `,customElements.define("solar-card-editor",dt);customElements.define("solar-overview",class extends oe{constructor(){super(...arguments),this.imageUrl="",this.productionLabel="",this.consumptionLabel="",this.fallback=null,this.hass=null,this.imageFallback=!1}static get properties(){return{production:{attribute:!1},consumption:{attribute:!1},imageUrl:{attribute:"image-url"},productionLabel:{attribute:"production-label"},consumptionLabel:{attribute:"consumption-label"},fallback:{attribute:!1},hass:{attribute:!1},productionEntity:{attribute:"production-entity"},consumptionEntity:{attribute:"consumption-entity"},imageFallback:{type:Boolean,attribute:"image-fallback"}}}_defaultPanelsSvg(){const e=Array.from({length:3}),t=Array.from({length:6}),i=e.flatMap(((e,i)=>t.map(((e,t)=>F`<rect x="${8+31*t}" y="${8+36*i}" width="28" height="28" rx="3" fill="rgba(255,255,255,0.25)" />`))));return H`
      <svg viewBox="0 0 240 200" part="image" aria-hidden="true">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#2d6cdf" />
            <stop offset="100%" stop-color="#0d3fa6" />
          </linearGradient>
        </defs>
        <g transform="translate(20,20)">
          <rect x="0" y="0" width="200" height="120" rx="6" fill="url(#g1)" />
          ${i}
          <rect x="0" y="0" width="200" height="120" rx="6" fill="none" stroke="rgba(255,255,255,0.6)" />
        </g>
        <rect x="40" y="150" width="160" height="10" rx="5" fill="#8892a0" opacity="0.7" />
      </svg>
    `}createRenderRoot(){return this}render(){let e=this.production||{value:"—",unit:""},t=this.consumption||{value:"—",unit:""};return e&&e.value||!this.hass||!this.productionEntity||(e=ze(this.hass,this.productionEntity)),t&&t.value||!this.hass||!this.consumptionEntity||(t=ze(this.hass,this.consumptionEntity)),H`
      <style>
        ${"\n  :host {\n    display: contents;\n  }\n\n  .overview-panel {\n    display: flex;\n    width: 100%;\n    justify-content: space-between;\n    gap: 40px;\n    align-items: center;\n    padding-right: 16px;\n  }\n\n  .content {\n    display: grid;\n    gap: 10px;\n  }\n\n  .metric .label {\n    color: var(--secondary-text-color);\n    font-size: 0.9rem;\n  }\n\n  .overview-panel .metric .label {\n    display: inline-flex;\n    align-items: center;\n    gap: 6px;\n    font-size: 1.2rem;\n    padding-bottom: 4px;\n  }\n\n  .overview-panel .metric .label ha-icon {\n    color: var(--secondary-text-color);\n    width: 28px;\n    height: 28px;\n    --mdc-icon-size: 28px;\n  }\n\n  .overview-panel .metric .value {\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n  }\n\n  .image {\n    width: 30%;\n    max-width: 180px;\n    min-width: 140px;\n    justify-self: end;\n  }\n\n  .image > img,\n  .image > svg {\n    width: 100%;\n    height: auto;\n    display: block;\n    border-radius: 8px;\n  }\n\n  @container (max-width: 1200px) {\n    .overview-panel {\n      padding-right: 0;\n      padding-bottom: 12px;\n      display: flex;\n      gap: 12px;\n      align-items: start;\n    }\n\n    .image {\n      width: clamp(100px, 28cqi, 150px);\n      max-width: 150px;\n      justify-self: end;\n    }\n  }\n\n  @container (max-width: 700px) {\n    .overview-panel .content { order: 1; }\n\n    .overview-panel .image {\n      order: 2;\n      justify-self: start;\n      width: clamp(80px, 40cqi, 120px);\n      max-width: 120px;\n    }\n  }\n\n  @container (max-width: 568px) {\n    .overview-panel { grid-template-columns: 1fr auto; }\n  }\n\n  @container (max-width: 350px) {\n    .image > svg { width: 80%; }\n  }\n\n  @container (max-width: 280px) {\n    .image { display: none; }\n  }\n"}
      </style>
      <div class="overview-panel">
        <div class="content">
          <div class="metric">
            <div class="label"><ha-icon icon="mdi:solar-panel"></ha-icon> ${this.productionLabel}</div>
            <div class="value">${e.value} ${e.unit}</div>
          </div>
          <div class="metric">
            <div class="label"><ha-icon icon="mdi:power-socket-eu"></ha-icon> ${this.consumptionLabel}</div>
            <div class="value smaller">${t.value} ${t.unit}</div>
          </div>
        </div>
        <div class="image">
          ${this.imageUrl?H`<img src="${this.imageUrl}" alt="Solar panels" loading="lazy" />`:this.fallback||(this.imageFallback?this._defaultPanelsSvg():null)}
        </div>
      </div>
    `}});customElements.define("solar-metrics",class extends oe{constructor(){super(...arguments),this.labels={yieldToday:"Yield today",gridToday:"Grid today"},this.showToday=!0,this._emitMetricClick=e=>{var t,i;const n="data-entity";let r;const a=e;if("function"==typeof a.composedPath){r=a.composedPath().find((e=>{var t;return null===(t=null==e?void 0:e.getAttribute)||void 0===t?void 0:t.call(e,n)}))}if(!r){let t=e.currentTarget;for(t||(t=e.target);t;){if(t.getAttribute&&t.getAttribute(n)){r=t;break}t=t.parentElement}}const o=(null===(t=null==r?void 0:r.getAttribute)||void 0===t?void 0:t.call(r,n))||void 0,s=(null===(i=null==r?void 0:r.getAttribute)||void 0===i?void 0:i.call(r,"data-metric-key"))||void 0;this.dispatchEvent(new CustomEvent("metric-click",{detail:{entityId:o,key:s},bubbles:!0,composed:!0}))}}static get properties(){return{today:{attribute:!1},totals:{attribute:!1},labels:{attribute:!1},showToday:{attribute:!1}}}createRenderRoot(){return this}render(){const e=this.today||{yieldToday:{value:"—",unit:""},gridToday:{value:"—",unit:""},yieldEntity:null,gridEntity:null},t=Array.isArray(this.totals)?this.totals:[],i=[];this.showToday&&(i.push(H`<div class="metric metric-top" data-entity="${e.yieldEntity||""}" @click=${this._emitMetricClick}>
          <ha-icon class="icon" icon="mdi:solar-power-variant"></ha-icon>
          <div class="label">${this.labels.yieldToday}</div>
          <div class="value smaller">${e.yieldToday.value}${e.yieldToday.unit?H` ${e.yieldToday.unit}`:""}</div>
        </div>`),i.push(H`<div class="metric metric-top" data-entity="${e.gridEntity||""}" @click=${this._emitMetricClick}>
          <ha-icon class="icon" icon="mdi:transmission-tower"></ha-icon>
          <div class="label">${this.labels.gridToday}</div>
          <div class="value smaller">${e.gridToday.value}${e.gridToday.unit?H` ${e.gridToday.unit}`:""}</div>
        </div>`)),i.push(...t.map((e=>H`<div
            class="metric metric-bottom"
            data-metric-key="${e.key}"
            data-entity="${e.entity||""}"
            @click=${this._emitMetricClick}
          >
            ${e.icon?H`<ha-icon class="icon" icon="${e.icon}"></ha-icon>`:H`<span class="icon placeholder"></span>`}
            <div class="label">${e.label}</div>
            <div class="value smaller">${e.value}${e.unit?H` ${e.unit}`:B}</div>
          </div>`)));const n=Math.min(Math.max(i.length,1),4),r=i.reduce(((e,t,i)=>{const r=i%n;return e[r]||(e[r]=[]),e[r].push(t),e}),[]);return r.length?H`
          <style>
            ${"\n  :host {\n    display: block;\n    width: 100%;\n    container-type: inline-size;\n  }\n\n  .metrics-grid {\n    display: grid;\n    grid-template-columns: repeat(var(--metrics-cols, 4), minmax(0, 1fr));\n    gap: 12px;\n    align-items: start;\n  }\n\n  .metric-column {\n    display: grid;\n    gap: 24px;\n  }\n\n  .metric { min-width: 0; }\n\n  .metric .label {\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    display: block;\n    color: var(--secondary-text-color);\n    font-size: 0.9rem;\n  }\n\n  .metric-top,\n  .metric-bottom {\n    cursor: pointer;\n    display: grid;\n    grid-template-columns: 24px 1fr;\n    grid-template-rows: auto auto;\n    column-gap: 8px;\n  }\n\n  .metric-top > .icon,\n  .metric-bottom > .icon {\n    grid-row: 1 / span 2;\n    align-self: center;\n    color: var(--secondary-text-color);\n    --mdc-icon-size: 24px;\n  }\n\n  .metric-bottom > .icon.placeholder {\n    display: block;\n    width: 24px;\n    height: 24px;\n    grid-row: 1 / span 2;\n    align-self: center;\n    visibility: hidden;\n  }\n\n  .metric-top > .label,\n  .metric-bottom > .label { grid-column: 2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n\n  .metric-top > .value,\n  .metric-bottom > .value { grid-column: 2; white-space: nowrap; }\n\n  .metric .value {\n    font-weight: 700;\n    font-size: 2rem;\n    line-height: 1.1;\n  }\n\n  .metric .value.smaller { font-size: 1.4rem; }\n\n  @container (max-width: 900px) {\n    .metric .value { font-size: 1.6rem; }\n    .metric .value.smaller { font-size: 1.2rem; }\n  }\n\n  @container (max-width: 700px) {\n    .metrics-grid { grid-template-columns: repeat(var(--metrics-cols, 4), minmax(0, 1fr)); }\n    .metric .value { font-size: 1.5rem; }\n    .metric .value.smaller { font-size: 1.1rem; }\n  }\n\n  @container (max-width: 568px) {\n    .metrics-grid { grid-template-columns: repeat(min(var(--metrics-cols, 4), 2), minmax(0, 1fr)); min-width: 0; }\n  }\n"}
          </style>
          <div class="metrics-grid" style="--metrics-cols: ${n}">
            ${r.map((e=>H`<div class="metric-column">${e}</div>`))}
          </div>
        `:B}});customElements.define("solar-forecast",class extends oe{constructor(){super(...arguments),this.title="",this.icon="mdi:weather-partly-cloudy",this.majorValue="",this.majorUnit="",this.minor="",this.dateText="",this.hass=null}static get properties(){return{title:{reflect:!0},icon:{reflect:!0},majorValue:{attribute:"major-value"},majorUnit:{attribute:"major-unit"},minor:{},dateText:{attribute:"date-text"},hass:{attribute:!1},weatherEntity:{attribute:"weather-entity"},solarForecastEntity:{attribute:"solar-forecast-entity"}}}_iconFor(e){return{clear:"mdi:weather-sunny","clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy",windy:"mdi:weather-windy",exceptional:"mdi:alert"}[e]||"mdi:weather-partly-cloudy"}_computeFromEntities(){var e,t,i,n,r,a,o;if(!this.hass)return;const s=!!this.weatherEntity,d=!!this.solarForecastEntity||!s;if(this.title||(this.title=s?"Weather Today":"Solar Forecast"),s&&!this.icon){const t=null===(e=this.hass.states)||void 0===e?void 0:e[this.weatherEntity],i=(null==t?void 0:t.state)||"";this.icon=this._iconFor(i)}if(this.dateText||(this.dateText=Me(this.hass)),d){const e=ze(this.hass,this.solarForecastEntity);this.majorValue||(this.majorValue=`${e.value}`),this.majorUnit||(this.majorUnit=`${e.unit||""}`),this.minor||(this.minor="Expected forecast")}else{const e=null===(t=this.hass.states)||void 0===t?void 0:t[this.weatherEntity],s=null===(i=null==e?void 0:e.attributes)||void 0===i?void 0:i.temperature,d=(null===(n=null==e?void 0:e.attributes)||void 0===n?void 0:n.temperature_unit)||(null===(o=null===(a=null===(r=this.hass)||void 0===r?void 0:r.config)||void 0===a?void 0:a.unit_system)||void 0===o?void 0:o.temperature)||"°C";this.majorValue||(this.majorValue=null!=s?String(s):"—"),this.majorUnit||(this.majorUnit=d),this.minor||(this.minor=(null==e?void 0:e.state)||"")}}createRenderRoot(){return this}render(){return this.majorValue||!this.weatherEntity&&!this.solarForecastEntity||this._computeFromEntities(),H` <div class="forecast-panel">
      <style>
        ${"\n  :host {\n    display: contents;\n  }\n\n  .forecast {\n    border: 0;\n    border-radius: 10px;\n    padding: 12px;\n    display: grid;\n    grid-template-columns: 1fr auto;\n    gap: 8px;\n    align-items: center;\n    max-width: 320px;\n    justify-self: end;\n  }\n\n  .forecast .title { font-weight: 700; }\n\n  .forecast .subtle {\n    color: var(--secondary-text-color);\n    font-size: 0.9rem;\n  }\n\n  .forecast .temp {\n    font-weight: 800;\n    font-size: 1.8rem;\n  }\n\n  .forecast .icon ha-icon {\n    width: 40px;\n    height: 40px;\n    --mdc-icon-size: 40px;\n  }\n\n  @container (max-width: 756px) {\n    .forecast { \n      display: flex; \n      width: 100%; \n      justify-content: space-between;\n      max-width: unset;\n    }\n  }\n"}
      </style>
      <div class="forecast" id="forecast">
        <div>
          <div class="title">${this.title}</div>
          <div class="subtle">${this.dateText}</div>
          <div class="temp">${this.majorValue} ${this.majorUnit}</div>
          <div class="subtle">${this.minor}</div>
        </div>
        <div class="icon">
          <ha-icon icon="${this.icon}"></ha-icon>
        </div>
      </div>
    </div>`}});function lt(e,t){const i=t.startsWith("/")?t:`/${t}`;try{return void We(0,i)}catch(e){}window.location.assign(i)}function ct(e,t){var i,n;const r=t.grid_feed_entity||"",a=r?null===(i=null==e?void 0:e.states)||void 0===i?void 0:i[r]:void 0,o=a?Number(a.state):NaN,s=!!r&&!!a&&"unavailable"!==a.state&&"unknown"!==a.state&&"none"!==a.state&&Number.isFinite(o),d=s,l=s&&o<0?"export":"import";let c=!1;if(d&&t.grid_feed_charging_entity){const i=null===(n=null==e?void 0:e.states)||void 0===n?void 0:n[t.grid_feed_charging_entity];i&&(c=function(e){if("boolean"==typeof e)return e;const t=String(null!=e?e:"").trim().toLowerCase();if("on"===t||"true"===t||"1"===t||"open"===t||"active"===t||"charging"===t)return!0;if("off"===t||"false"===t||"0"===t||"closed"===t||"inactive"===t)return!1;const i=Number(t);return!Number.isNaN(i)&&0!==i}(i.state))}return{entity:r,visible:d,direction:l,rawWatts:s?o:null,charging:c}}customElements.define("solar-devices-row",class extends oe{constructor(){super(...arguments),this.hass=null,this.intensityEnabled=!0,this._leaving=new Map,this._prevItems=[],this._prevTotal=0,this._rafScheduled=!1,this._onResize=()=>this._layoutRings(),this._onAnimEnd=e=>{const t=e.currentTarget;if(t&&t.classList.contains("leave")&&"badge-out"===e.animationName){const e=t.dataset||{},i=e.itemId||e.statId||t.getAttribute("data-item-id")||t.getAttribute("data-stat-id")||"";i&&this._leaving.delete(i),this._scheduleRender()}},this._onBadgeClick=e=>{var t;const i=e;let n;if("function"==typeof i.composedPath){n=i.composedPath().find((e=>{var t,i;return null===(i=null===(t=null==e?void 0:e.classList)||void 0===t?void 0:t.contains)||void 0===i?void 0:i.call(t,"badge")}))}if(!n){let i=e.target;for(;i;){if(null===(t=i.classList)||void 0===t?void 0:t.contains("badge")){n=i;break}i=i.parentElement}}if(!n)return;const r=n.dataset||{},a=r.entityId;if(a)return void this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:a},bubbles:!0,composed:!0}));const o=r.statId||r.itemId;o&&this.dispatchEvent(new CustomEvent("device-selected",{detail:{statId:o},bubbles:!0,composed:!0}))}}static get properties(){return{items:{attribute:!1},hass:{attribute:!1},intensityEnabled:{attribute:!1}}}createRenderRoot(){return this}willUpdate(e){if(!e.has("items")&&!e.has("intensityEnabled"))return;const t=Array.isArray(this.items)?this.items:[],i=new Set(t.map((e=>e.id)));!1!==this.intensityEnabled?this._prevTotal=this._prevItems.reduce(((e,t)=>{if("grid-feed"===(null==t?void 0:t.id))return e;return e+("number"==typeof(null==t?void 0:t.watts)&&Number.isFinite(t.watts)?t.watts:0)}),0):this._prevTotal=0;for(const e of this._prevItems)i.has(e.id)||this._leaving.set(e.id,Object.assign({},e));for(const e of i)this._leaving.delete(e);this._prevItems=t.map((e=>Object.assign({},e)))}connectedCallback(){super.connectedCallback(),window.addEventListener("resize",this._onResize,{passive:!0})}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("resize",this._onResize)}_scheduleRender(){this._rafScheduled||(this._rafScheduled=!0,requestAnimationFrame((()=>{this._rafScheduled=!1,this.requestUpdate()})))}render(){const e=Array.isArray(this.items)?this.items:[],t=e,i=!1!==this.intensityEnabled,n=i?e.reduce(((e,t)=>{if("grid-feed"===(null==t?void 0:t.id))return e;return e+("number"==typeof(null==t?void 0:t.watts)&&Number.isFinite(t.watts)?t.watts:0)}),0):0,r=new Set(e.map((e=>e.id))),a=[],o=[];for(const e of t)"grid-feed"===e.id?a.push(e):o.push(e);const s=e=>{const t="number"==typeof e.watts&&Number.isFinite(e.watts),a=!r.has(e.id),o="grid-feed"===e.id,s=i?a?this._prevTotal:n:0,d=i&&!o&&s>0&&t?Math.max(0,Math.min(1,e.watts/s)):0,l=`badge tier-${i?d>=2/3?3:d>=1/3?2:1:1}${t?"":" no-value"}${a?" leave":""}${o?" grid-feed":""}${o&&e.charging?" charging":""}`,c=o?"0%":`${Math.round(100*d)}%`,u=t?e.powerText||ot(e.watts,this.hass):"",h=e.name?u?`${e.name} • ${u}`:e.name:u;return H`<div
        class="${l}"
        role="listitem"
        data-item-id=${e.id}
        data-stat-id=${o?B:e.id}
        data-entity-id=${e.entityId||B}
        style="--badge-usage: ${c}"
        title=${h}
        @animationend=${this._onAnimEnd}
        @click=${this._onBadgeClick}
      >
        ${o&&e.charging?H`<svg class="grid-feed-ring" aria-hidden="true" preserveAspectRatio="none">
              <path class="ring" pathLength="100"></path>
            </svg>`:B}
        <ha-icon icon="${e.icon||"mdi:power-plug"}"></ha-icon>
        <span class="name">${e.name}</span>
        <span class="value">${u}</span>
      </div>`},d=a.length>0&&o.length>0;return H` <div class="devices-row" id="devices-row">
      <style>
        ${"\n  @property --grid-feed-angle {\n    syntax: '<angle>';\n    inherits: false;\n    initial-value: 0deg;\n  }\n\n  :host {\n    display: block;\n    width: 100%;\n    container-type: inline-size;\n  }\n\n  .devices-row {\n    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));\n    margin-top: 12px;\n    padding-top: 12px;\n  }\n\n  .badges {\n    display: flex;\n    gap: var(--solar-badges-gap, 12px);\n    align-items: stretch;\n    width: 100%;\n    cursor: default;\n    flex-wrap: wrap;\n    --grid-feed-divider-width: 1px;\n    --device-badge-count: var(--solar-badge-max-count, 4);\n  }\n\n  .badge {\n    display: grid;\n    grid-template-columns: auto 1fr auto;\n    align-items: center;\n    gap: var(--solar-badge-gap, 10px);\n    /* Tier-controlled default alphas (can be overridden via --solar-badge-*) */\n    --badge-bg-alpha: var(--solar-badge-bg-alpha, 0.04);\n    --badge-border-alpha: var(--solar-badge-border-alpha, 0.10);\n    --badge-icon-alpha: var(--solar-badge-icon-alpha, 0.10);\n    --badge-progress-alpha: var(--solar-badge-progress-alpha, 0.20);\n    /* Accent color hooks: follow HA icon color by default, with rgb fallback */\n    --badge-accent-color: var(--solar-accent-color, var(--state-icon-color, var(--primary-color)));\n    --badge-accent-rgb: var(--solar-accent-rgb, var(--rgb-primary-color));\n    /* Mix percentages for color-mix fallback-less tints */\n    /* Base gradient strength (start/end). You can override either or both. */\n    --badge-bg-mix-start: var(--solar-badge-bg-mix-start, var(--solar-badge-bg-mix, 6%));\n    --badge-bg-mix-end: var(--solar-badge-bg-mix-end, 12%);\n    --badge-border-mix: var(--solar-badge-border-mix, 12%);\n    --badge-icon-mix: var(--solar-badge-icon-mix, 12%);\n    --badge-progress-mix: var(--solar-badge-progress-mix, 18%);\n    background: var(\n      --solar-badge-bg,\n      linear-gradient(\n        180deg,\n        color-mix(in srgb, var(--badge-accent-color) var(--badge-bg-mix-start), transparent),\n        color-mix(in srgb, var(--badge-accent-color) var(--badge-bg-mix-end), transparent)\n      )\n    );\n    color: var(--primary-text-color);\n    padding: var(--solar-badge-padding, 8px 12px);\n    border-radius: var(--solar-badge-radius, 999px);\n    /* Fallback border using rgb */\n    border: 1px solid var(--solar-badge-border, rgba(var(--badge-accent-rgb), var(--badge-border-alpha)));\n    /* Prefer theme icon color via color-mix when available */\n    border-color: var(\n      --solar-badge-border,\n      color-mix(in srgb, var(--badge-accent-color) var(--badge-border-mix), transparent)\n    );\n    white-space: nowrap;\n    /* Equal width per configured max badge count */\n    --badge-count: var(--device-badge-count, var(--solar-badge-max-count, 4));\n    --badge-gap: var(--solar-badges-gap, 12px);\n    --badge-basis: calc(\n      (100% - ((var(--badge-count) - 1) * var(--badge-gap)) - var(--grid-feed-divider-width, 1px) - 300px)\n        / var(--badge-count)\n    );\n    flex: 0 0 var(--badge-basis);\n    min-width: 150px;\n    width: auto;\n    /* Do not override the min-width; honor 150px on small screens */\n    overflow: hidden;\n    cursor: pointer;\n    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);\n    transition: background-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1),\n      border-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1),\n      box-shadow 220ms cubic-bezier(0.2, 0.8, 0.2, 1),\n      transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1);\n    will-change: transform, opacity;\n    position: relative;\n  }\n\n  .badge:hover {\n    background: var(\n      --solar-badge-hover-bg,\n      color-mix(in srgb, var(--badge-accent-color) 6%, transparent)\n    );\n    border-color: var(--badge-accent-color);\n    box-shadow: 0 3px 10px rgba(var(--badge-accent-rgb), 0.12), 0 2px 4px rgba(0, 0, 0, 0.05);\n    transform: translateY(-1px);\n  }\n\n  .badge:active {\n    transform: translateY(0);\n    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);\n  }\n\n  .badge:focus-visible {\n    outline: none;\n    box-shadow: 0 0 0 3px rgba(var(--badge-accent-rgb), 0.24);\n  }\n\n  /* Enter/leave animations */\n  .badge.enter { animation: badge-in 300ms cubic-bezier(0.22, 1, 0.36, 1) both; }\n  .badge.leave { animation: badge-out 240ms cubic-bezier(0.22, 1, 0.36, 1) both; }\n\n  @keyframes badge-in {\n    0% { opacity: 0; transform: translateY(6px) scale(0.985); }\n    60% { opacity: 1; transform: translateY(0) scale(1.002); }\n    100% { opacity: 1; transform: translateY(0) scale(1); }\n  }\n\n  @keyframes badge-out {\n    0% { opacity: 1; transform: translateY(0) scale(1); }\n    100% { opacity: 0; transform: translateY(-6px) scale(0.985); }\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .badge.enter, .badge.leave { animation: none !important; }\n  }\n\n  .badge ha-icon {\n    --mdc-icon-size: var(--solar-badge-icon-inner-size, 18px);\n    display: inline-grid;\n    place-items: center;\n    width: var(--solar-badge-icon-size, 28px);\n    height: var(--solar-badge-icon-size, 28px);\n    border-radius: var(--solar-badge-icon-radius, 50%);\n    color: var(--solar-badge-icon-color, var(--badge-accent-color));\n    /* Fallback using rgb */\n    background: var(--solar-badge-icon-bg, rgba(var(--badge-accent-rgb), var(--badge-icon-alpha)));\n    /* Prefer theme icon color via color-mix */\n    background: var(\n      --solar-badge-icon-bg,\n      color-mix(in srgb, var(--badge-accent-color) var(--badge-icon-mix), transparent)\n    );\n    box-shadow: inset 0 0 0 1px rgba(var(--badge-accent-rgb), calc(var(--badge-icon-alpha) + 0.02));\n  }\n\n  .badge .name {\n    max-width: 16ch;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    min-width: 0;\n    color: var(--secondary-text-color);\n  }\n\n  .badge .value {\n    font-weight: 700;\n    justify-self: end;\n    text-align: right;\n    color: var(--primary-text-color);\n  }\n\n  .badge.grid-feed {\n    --solar-badge-bg: var(\n      --solar-grid-feed-background,\n      color-mix(in srgb, var(--card-background-color, var(--ha-card-background, #0f172a)) 82%, transparent)\n    );\n    --solar-badge-border: color-mix(in srgb, var(--primary-color) 16%, transparent);\n    --solar-badge-icon-bg: color-mix(in srgb, var(--primary-color) 10%, transparent);\n    --solar-badge-icon-color: var(--solar-grid-feed-icon-color, var(--primary-color));\n    border-radius: var(--solar-badge-radius, 999px);\n    grid-template-columns: auto auto;\n    gap: 10px;\n    justify-content: flex-start;\n    padding: 10px 16px;\n    min-width: 0;\n    flex: 0 0 auto;\n    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.16);\n    position: relative;\n    min-width: 90px;\n    justify-content: space-between;\n    /* Allow charging ring to render outside the border */\n    overflow: visible;\n  }\n\n  .badge.grid-feed::before {\n    display: none;\n  }\n\n  .badge.grid-feed .name {\n    display: none;\n  }\n\n  .badge.grid-feed .value {\n    font-size: 1rem;\n    letter-spacing: 0.01em;\n    color: var(--solar-grid-feed-value-color, var(--primary-text-color));\n    white-space: nowrap;\n  }\n\n  /* Disable older pseudo ring; we now use an SVG path that follows the pill border */\n  .badge.grid-feed.charging::after { content: none; }\n\n  /* SVG ring overlay that matches the rounded-rect outline */\n  .badge.grid-feed .grid-feed-ring {\n    position: absolute;\n    inset: -4px;\n    width: calc(100% + 8px);\n    height: calc(100% + 8px);\n    border-radius: inherit;\n    pointer-events: none;\n    overflow: visible;\n    opacity: 0.9;\n    z-index: 2;\n  }\n\n  .badge.grid-feed .grid-feed-ring .ring {\n    fill: none;\n    stroke: var(--solar-grid-feed-charge-color, #22c55e);\n    /* Prefer a subtle mix when available */\n    stroke: var(\n      --solar-grid-feed-charge-stroke,\n      color-mix(in srgb, var(--solar-grid-feed-charge-color, #22c55e) 95%, transparent)\n    );\n    stroke-linecap: round;\n    stroke-dasharray: 14 86; /* pathLength=100 -> 14% visible, 86% gap */\n    stroke-dashoffset: 0;\n    animation: grid-feed-dash 2.8s linear infinite;\n  }\n\n  .grid-feed-divider {\n    flex: 0 0 var(--grid-feed-divider-width, 1px);\n    width: var(--grid-feed-divider-width, 1px);\n    background: var(--solar-grid-feed-divider-color, var(--divider-color, rgba(0, 0, 0, 0.18)));\n    border-radius: 1px;\n    opacity: 0.75;\n    align-self: stretch;\n    position: relative;\n    z-index: 3; /* ensure it remains visible above any ring overflow */\n  }\n\n  @keyframes grid-feed-dash {\n    to { stroke-dashoffset: -100; }\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .badge.grid-feed .grid-feed-ring .ring { animation: none !important; }\n  }\n\n  /* Straight usage fill with soft tail fade */\n  .badge::before {\n    content: '';\n    position: absolute;\n    inset: 0;\n    /* Expand by tail so the solid portion ends near --badge-usage */\n    width: min(100%, calc(var(--badge-usage, 0%) + var(--solar-badge-tail, 18px)));\n    /* Tail length can be adjusted; pixels give consistent look */\n    --badge-tail: var(--solar-badge-tail, 18px);\n    background: linear-gradient(\n      90deg,\n      color-mix(in srgb, var(--badge-accent-color) var(--badge-progress-mix), transparent) 0%,\n      color-mix(in srgb, var(--badge-accent-color) var(--badge-progress-mix), transparent) calc(100% - var(--badge-tail)),\n      color-mix(in srgb, var(--badge-accent-color) 0%, transparent) 100%\n    );\n    /* Keep the left side rounded, right side straight */\n    border-top-left-radius: inherit;\n    border-bottom-left-radius: inherit;\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n    transition: width 260ms cubic-bezier(0.2, 0.8, 0.2, 1);\n    pointer-events: none;\n    z-index: 0;\n  }\n\n  /* Keep foreground content above the fill */\n  .badge > * { position: relative; z-index: 1; }\n\n  /* No extra rules needed for no-value; background-size uses 0% fallback */\n\n  /* Intensity tiers based on relative watts */\n  .badge.tier-1 { \n    --solar-badge-bg-alpha: 0.06; \n    --solar-badge-border-alpha: 0.14; \n    --solar-badge-icon-alpha: 0.14; \n    --solar-badge-progress-alpha: 0.28;\n  }\n  .badge.tier-2 { \n    --solar-badge-bg-alpha: 0.06; \n    --solar-badge-border-alpha: 0.14; \n    --solar-badge-icon-alpha: 0.14; \n    --solar-badge-progress-alpha: 0.26; \n    --solar-badge-bg-mix-start: 8%;\n    --solar-badge-bg-mix-end: 16%;\n  }\n  .badge.tier-3 { \n    --solar-badge-bg-alpha: 0.08; \n    --solar-badge-border-alpha: 0.18; \n    --solar-badge-icon-alpha: 0.18; \n    --solar-badge-progress-alpha: 0.30; \n    --solar-badge-bg-mix-start: 10%;\n    --solar-badge-bg-mix-end: 20%;\n    box-shadow: 0 2px 10px rgba(var(--badge-accent-rgb), 0.14), 0 1px 3px rgba(0, 0, 0, 0.06);\n  }\n\n  @container (max-width: 900px) {\n    .badges { \n      justify-content: space-evenly; \n    }\n  }\n\n  /* Small containers: use a horizontal divider, but keep feed badge intrinsic size */\n  @container (max-width: 700px) {\n    .grid-feed-divider {\n      flex: 0 0 100%;\n      width: 100%;\n      height: 0;\n      margin: 6px 0;\n      background: none;\n      border-top: 1px solid var(--solar-grid-feed-divider-color, var(--divider-color, rgba(0, 0, 0, 0.18)));\n      border-radius: 0;\n    }\n  }\n\n  /* Compact mode: hide device name under 500px containers */\n  @container (max-width: 500px) {\n    .badge { grid-template-columns: auto auto; min-width: 75px }\n    .badge .name { display: none; }\n  }\n"}
      </style>
      <div class="badges">
        ${a.map(s)}
        ${d?H`<div class="grid-feed-divider" aria-hidden="true"></div>`:B}
        ${o.map(s)}
      </div>
    </div>`}updated(){this._layoutRings()}_layoutRings(){(this.querySelectorAll(".badge.grid-feed.charging")||[]).forEach((e=>{const t=e.querySelector("svg.grid-feed-ring"),i=null==t?void 0:t.querySelector("path.ring");if(!t||!i)return;const n=Math.max(0,e.offsetWidth+8),r=Math.max(0,e.offsetHeight+8),a=1.5,o=1.5,s=Math.max(0,n-3),d=Math.max(0,r-3),l=Math.max(0,Math.min(d/2,s/2));t.setAttribute("viewBox",`0 0 ${n} ${r}`);const c=[`M ${a+l},1.5`,"H "+(a+s-l),`A ${l} ${l} 0 0 1 ${a+s},${o+l}`,"V "+(o+d-l),`A ${l} ${l} 0 0 1 ${a+s-l},${o+d}`,`H ${a+l}`,`A ${l} ${l} 0 0 1 1.5,${o+d-l}`,`V ${o+l}`,`A ${l} ${l} 0 0 1 ${a+l},1.5`,"Z"].join(" ");i.setAttribute("d",c),i.setAttribute("vector-effect","non-scaling-stroke"),i.setAttribute("stroke-width",String(3))}))}}),window.customCards=window.customCards||[],window.customCards.push({type:"solar-card",name:"Solar Energy Card",description:"Left panel: yield today, current consumption, title, and image.",preview:!0,documentationURL:"https://github.com/victorigualada/lovelace-solar-card"});class ut extends oe{constructor(){super(),this._onDeviceSelected=e=>{const t=e.detail&&e.detail.statId||null;t&&this._hass&&async function(e,t,i,n){try{const r=null!=n?n:await t.callWS({type:"config/entity_registry/list"});let a=i;if(!a.includes("."))return void lt(0,`/developer-tools/statistics?statistic_id=${encodeURIComponent(i)}`);const o=r.find((e=>e.entity_id===a));if(null==o?void 0:o.device_id)return void lt(0,`/config/devices/device/${o.device_id}`);const s=new CustomEvent("hass-more-info",{detail:{entityId:a},bubbles:!0,composed:!0});e.dispatchEvent(s)}catch(e){lt(0,`/developer-tools/statistics?statistic_id=${encodeURIComponent(i)}`)}}(this,this._hass,t,this._entityRegistry)},this._onMetricComponentClick=e=>{const t=e.detail&&e.detail.entityId||null;if(!t)return;const i=new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0});this.dispatchEvent(i)},this._config={type:"custom:solar-card"},this._hass=null,this._energyFlowEl=null,this._gridKwhEl=null,this._trendGraphEls=null,this._entityRegistry=null,this._deviceManager=null,this._lastLang=null}static get properties(){return{_hass:{attribute:!1},_config:{attribute:!1},_deviceBadges:{attribute:!1}}}static getConfigElement(){return document.createElement("solar-card-editor")}static buildCandidateLists(e,t,i){return it(e,t,i)}static getStubConfig(e,t,i){return function(e,t,i){const{power:n,fallback:r}=it(e,t,i);return{type:"custom:solar-card",production_entity:n[0]||r[0]||"sensor.solar_card_stub_production",current_consumption_entity:n[1]||n[0]||r[1]||r[0]||"sensor.solar_card_stub_consumption",image_url:"",grid_feed_entity:"",grid_feed_charging_entity:"",show_energy_flow:!1,show_top_devices:!1,top_devices_max:4,device_badge_intensity:!0,excluded_device_ids:[],show_solar_forecast:!1,weather_entity:"",solar_forecast_today_entity:"",show_today_metrics:!0,show_trend_graphs:!1,trend_graph_hours_to_show:24,trend_graph_entities:[],total_yield_entity:"",total_grid_consumption_entity:""}}(e,t,i)}get hass(){return this._hass}set hass(e){var t,i,n,r,a,o,s;const d=this._hass;if(this._energyFlowEl)try{this._energyFlowEl.hass=e}catch(e){}if(Array.isArray(this._trendGraphEls))for(const t of this._trendGraphEls)try{t.hass=e}catch(e){}if(this._gridKwhEl)try{this._gridKwhEl.hass=e}catch(e){}try{const n=null!==(i=(null===(t=null==e?void 0:e.locale)||void 0===t?void 0:t.language)||(null==e?void 0:e.language))&&void 0!==i?i:null;n&&n!==this._lastLang&&(this._lastLang=n)}catch(e){}const l=this._config||{},c=new Set,u=e=>{e&&c.add(e)};if(u(l.production_entity),u(l.current_consumption_entity),u(l.grid_feed_entity),u(l.grid_feed_charging_entity),u(l.total_yield_entity),u(l.total_grid_consumption_entity),u(l.weather_entity),u(l.solar_forecast_today_entity),Array.isArray(l.totals_metrics))for(const e of l.totals_metrics)e&&"object"==typeof e&&u(e.entity);if(Array.isArray(l.trend_graph_entities))for(const e of l.trend_graph_entities)u(e);let h=!d;if(d&&c.size){for(const t of c)if((null===(n=d.states)||void 0===n?void 0:n[t])!==(null===(r=e.states)||void 0===r?void 0:r[t])){h=!0;break}h||(null===(a=d.locale)||void 0===a?void 0:a.language)===(null===(o=e.locale)||void 0===o?void 0:o.language)||(h=!0)}l.show_top_devices&&(h=!0),this._hass=e,null===(s=this._deviceManager)||void 0===s||s.setHass(e),h&&this.requestUpdate()}setConfig(e){this._config=function(e){var t,i,n,r,a,o,s,d,l,c,u,h,p,_,m,g,v,y;const f=Object.assign({},e),b=null!==(t=null==e?void 0:e.yield_today_entity)&&void 0!==t?t:"";f.production_entity=null!==(n=null!==(i=e.production_entity)&&void 0!==i?i:b)&&void 0!==n?n:"",f.current_consumption_entity=null!==(r=e.current_consumption_entity)&&void 0!==r?r:"",f.image_url=null!==(a=e.image_url)&&void 0!==a?a:"",f.grid_feed_entity=null!==(o=e.grid_feed_entity)&&void 0!==o?o:"",f.grid_feed_charging_entity=null!==(s=e.grid_feed_charging_entity)&&void 0!==s?s:"",f.show_energy_flow=null!==(d=e.show_energy_flow)&&void 0!==d&&d,f.show_top_devices=null!==(l=e.show_top_devices)&&void 0!==l&&l,f.top_devices_max=Math.min(Math.max(parseInt(String(null!==(c=e.top_devices_max)&&void 0!==c?c:4),10)||4,1),8),f.device_badge_intensity=null===(u=e.device_badge_intensity)||void 0===u||u;const w=e.excluded_device_ids;if(Array.isArray(w)?f.excluded_device_ids=w.filter((e=>"string"==typeof e&&e)):f.excluded_device_ids="string"==typeof w&&w?[w]:[],f.show_solar_forecast=null!==(h=e.show_solar_forecast)&&void 0!==h&&h,f.weather_entity=null!==(p=e.weather_entity)&&void 0!==p?p:"",f.solar_forecast_today_entity=null!==(_=e.solar_forecast_today_entity)&&void 0!==_?_:"",f.show_today_metrics=null===(m=e.show_today_metrics)||void 0===m||m,f.show_trend_graphs=null===(g=e.show_trend_graphs)||void 0===g||g,f.trend_graph_entities=Array.isArray(e.trend_graph_entities)?e.trend_graph_entities:[],f.trend_graph_hours_to_show=Number(e.trend_graph_hours_to_show)||24,f.total_yield_entity=null!==(v=e.total_yield_entity)&&void 0!==v?v:"",f.total_grid_consumption_entity=null!==(y=e.total_grid_consumption_entity)&&void 0!==y?y:"",!f.production_entity||!f.current_consumption_entity)throw new Error("Solar Card: production_entity and current_consumption_entity are required.");return f}(e),this.requestUpdate()}connectedCallback(){var e;super.connectedCallback(),(null===(e=this._config)||void 0===e?void 0:e.show_top_devices)&&this._hass&&(this._deviceManager||(this._deviceManager=function(e,t){let i=e,n=!1,r=0,a=null,o=[],s={},d={},l={},c={},u={};async function h(){const e=Date.now();if(!(n||e-r<6e4)){n=!0;try{const e=await rt(i);o=Array.isArray(null==e?void 0:e.device_consumption)?e.device_consumption:[];const p=await at(i,o);s=p.devicePowerMap,d=p.statToDeviceId,l=p.deviceEntitiesMap,c=p.entityRegistryByEntityId,u=p.deviceIconById,r=Date.now(),t()}finally{n=!1,a&&clearTimeout(a),a=setTimeout((()=>{r=0,h()}),6e4)}}}return{start:function(){h()},stop:function(){a&&clearTimeout(a),a=null},refresh:h,computeTopDevicesLive:function(e,t){if(!s||!(null==o?void 0:o.length))return[];const n=[];for(const e of o){const r=e.stat_consumption,a=e.name||r,o=d[r];if(Array.isArray(t)&&t.length&&o&&t.includes(o))continue;const h=s[r]||[];let p=null;for(const e of h){const t=st(i,e);null!=t&&(null==p||t>p)&&(p=Math.max(0,t))}if(null!=p&&p>0){const e=Re(r,i,{statToDeviceId:d,deviceIconById:u,deviceEntitiesMap:l,entityRegistryByEntityId:c});n.push({id:r,name:a,watts:p,icon:e,powerText:ot(p,i)})}}return n.sort(((e,t)=>t.watts-e.watts)),n.slice(0,e)},setHass(e){i=e}}}(this._hass,(()=>this.requestUpdate()))),this._deviceManager.start())}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._deviceManager)||void 0===e||e.stop()}updated(){var e,t,i;if(null===(e=this._config)||void 0===e?void 0:e.show_energy_flow){const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.getElementById("energy-flow");(async function(e,t,i){var n,r,a;if(!t)return i;if(i&&i.parentElement===t)return i.hass=e,i;let o=null;try{const e=await(null===(n=window.loadCardHelpers)||void 0===n?void 0:n.call(window));(null==e?void 0:e.createCardElement)&&(o=e.createCardElement({type:"energy-sankey"}))}catch(e){}return o||(o=document.createElement("hui-energy-sankey-card"),null===(a=(r=o).setConfig)||void 0===a||a.call(r,{type:"energy-sankey"})),o.hass=e,o.style.setProperty("--row-size","6"),t.innerHTML="",t.appendChild(o),o})(this._hass,e,this._energyFlowEl).then((e=>{this._energyFlowEl=e}))}const n=et(this._config);if(n.length){const e=null===(i=this.shadowRoot)||void 0===i?void 0:i.getElementById("graphs-section");e&&(e.innerHTML=""),Xe({hass:this._hass,container:e,tileConfigs:n,existing:this._trendGraphEls}).then((e=>{e&&(this._trendGraphEls=e)}))}}render(){var e;const t=this._config||{},i=function(e,t){return{production:ze(e,t.production_entity),consumption:ze(e,t.current_consumption_entity),image_url:t.image_url||""}}(this._hass,t),n=function(e,t,i,n){var r,a,o,s,d,l;const c=t.total_yield_entity&&(null===(o=null===(a=null===(r=null==e?void 0:e.states)||void 0===r?void 0:r[t.total_yield_entity])||void 0===a?void 0:a.attributes)||void 0===o?void 0:o.unit_of_measurement)||"",u=t.total_grid_consumption_entity&&(null===(l=null===(d=null===(s=null==e?void 0:e.states)||void 0===s?void 0:s[t.total_grid_consumption_entity])||void 0===d?void 0:d.attributes)||void 0===l?void 0:l.unit_of_measurement)||"";let h={value:"—",unit:c};if(t.total_yield_entity){const n=i(t.total_yield_entity);h=null!=n?{value:Ce(n,e,{maximumFractionDigits:2}),unit:c}:{value:"—",unit:c}}let p={value:"—",unit:u};if(t.total_grid_consumption_entity){const i=n(t.total_grid_consumption_entity);p=null!=i?{value:Ce(i,e,{maximumFractionDigits:2}),unit:u}:{value:"—",unit:u}}return{yieldToday:h,gridToday:p,yieldEntity:t.total_yield_entity||null,gridEntity:t.total_grid_consumption_entity||null}}(this._hass,t,(e=>this._hass?Be(this._hass,e,(()=>this.requestUpdate())):null),(e=>this._hass?Be(this._hass,e,(()=>this.requestUpdate())):null)),r=Le(this._hass,t),a=nt(this._hass,t),o=t.top_devices_max||4,s=Array.isArray(t.excluded_device_ids)?t.excluded_device_ids:[],d=t.show_top_devices&&(null===(e=this._deviceManager)||void 0===e?void 0:e.computeTopDevicesLive(o,s))||[];let l=d;const c=ct(this._hass,t);if(t.show_top_devices&&c&&c.visible&&c.entity&&null!=c.rawWatts&&Number.isFinite(c.rawWatts)){const e="export"===("export"===c.direction?"export":"import")?"mdi:transmission-tower-export":"mdi:transmission-tower-import",t=c.rawWatts;l=[{id:"grid-feed",name:Se("card.grid_feed"),watts:Math.abs(t),icon:e,powerText:ot(t,this._hass),entityId:c.entity,charging:!!c.charging},...d]}const u=et(t),h={yieldToday:Se("card.yield_today"),gridToday:Se("card.grid_today")},p=!1!==t.show_today_metrics&&!(!t.total_yield_entity&&!t.total_grid_consumption_entity);return H`
      <ha-card>
        <div class="container${t.show_solar_forecast?" has-forecast":""}">
          <solar-overview
            style="display: contents"
            .hass=${this._hass}
            .production=${i.production}
            .consumption=${i.consumption}
            .productionEntity=${t.production_entity}
            .consumptionEntity=${t.current_consumption_entity}
            .imageUrl=${i.image_url}
            .productionLabel=${Se("card.production")}
            .consumptionLabel=${Se("card.consumption")}
            image-fallback
          ></solar-overview>
          <div class="metrics-panel">
            <solar-metrics
              .today=${n}
              .totals=${r}
              .labels=${h}
              .showToday=${p}
              @metric-click=${this._onMetricComponentClick}
            ></solar-metrics>
          </div>
          ${t.show_solar_forecast?H`<solar-forecast
                style="display: contents"
                .hass=${this._hass}
                .title=${a.title}
                .icon=${a.icon}
                .majorValue=${a.majorValue}
                .majorUnit=${a.majorUnit}
                .minor=${a.minor}
                .dateText=${Me(this._hass)}
                .weatherEntity=${t.weather_entity}
                .solarForecastEntity=${t.solar_forecast_today_entity}
              ></solar-forecast>`:B}
        </div>
        ${t.show_top_devices&&l.length?H`<solar-devices-row
              style="--solar-badge-max-count: ${t.top_devices_max||4}"
              .items=${l}
              .hass=${this._hass}
              .intensityEnabled=${!1!==t.device_badge_intensity}
              @device-selected=${this._onDeviceSelected}
            ></solar-devices-row>`:B}
        ${u.length?H`<div id="graphs-section" class="graphs-section"></div>`:B}
        ${t.show_energy_flow?H`<div id="energy-section" class="energy-section"><div id="energy-flow"></div></div>`:B}
      </ha-card>
    `}}ut.styles=tt,customElements.define("solar-card",ut);
