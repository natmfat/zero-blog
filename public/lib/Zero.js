var y=Object.defineProperty;var _=(o,t)=>{for(var e in t)y(o,e,{get:t[e],enumerable:!0})};var u=class{static _getAttributes(t){return[...t.attributes].map(e=>e.name)}static _getNodeType(t){return t.nodeType===3?"text":t.nodeType===8?"comment":t.nodeType===11?"fragment":t.tagName.toLowerCase()}static _getNodeContent(t){return t.childNodes&&t.childNodes.length>0?null:t.textContent}static update(t,e){if(this._getNodeType(t)==="text"||this._getNodeType(e)==="text")return;let i=[...new Set([...u._getAttributes(t),...u._getAttributes(e)])],r=(s,n)=>{s.startsWith("on")?e[s.toLowerCase()]=n:e.setAttributeNS(null,s,n)},c=s=>{s.startsWith("on")?e[s.toLowerCase()]=()=>{}:e.removeAttribute(s)};for(let s of i){let n=t.getAttribute(s),h=e.getAttribute(s);!h||h!==n?r(s,n):n||c(s)}}static diff(t,e){let i=[...e.childNodes],r=[...t.childNodes],c=i.length-r.length;if(c>0)for(;c>0;c--)i[i.length-c].remove();r.forEach((s,n)=>{if(!i[n]){e.appendChild(s);return}if(this._getNodeType(s)!==this._getNodeType(i[n])){i[n].replaceWith(s);return}this._getNodeType(s)!=="comment"&&u.update(s,i[n]);let h=this._getNodeContent(s);if(h&&h!==this._getNodeContent(i[n])&&(i[n].textContent=h),i[n].childNodes.length>0&&s.childNodes.length<1){i[n].innerHTML="";return}if(i[n].childNodes.length<1&&s.childNodes.length>0){let m=document.createDocumentFragment();this.diff(s,m),i[n].appendChild(m);return}s.childNodes.length>0&&this.diff(s,i[n])})}};var g={};_(g,{$:()=>N,$$:()=>b,isFunction:()=>d,jsh:()=>l});var p=o=>{if(o.startsWith("_"))return o.substring(1);let t="";for(let e of o){let i=e.toLowerCase();t+=i===e?e:`-${i}`}return t.toLowerCase()},C=(o,t={},e=[])=>{let i=o==="fragment",r=["svg","path"].includes(o),c=i?document.createDocumentFragment():r?document.createElementNS(t.xmlns||"http://www.w3.org/2000/svg",o):document.createElement(o);if(!i)for(let[n,h]of Object.entries(t))n==="style"&&h.toString()==="[object Object]"?Object.assign(c.style,h):n==="__innerHTML"?c.innerHTML=h:n.startsWith("on")?c[n.toLowerCase()]=h:c.setAttribute(p(n),h);let s=e.flat(1/0).filter(n=>n);for(let n of s)typeof n=="string"?c.appendChild(document.createTextNode(n)):c.appendChild(n);return c},l=new Proxy({},{get:(o,t)=>(e,...i)=>C(p(t),e,i)}),N=(o,t)=>o&&t?o.querySelector(t):document.body.querySelector(o),b=(o,t)=>[...o&&t?o.querySelectorAll(t):document.body.querySelectorAll(o)],d=o=>o&&typeof o=="function";var a=class{subscriptions=[];initialState={};state={};reducer=null;constructor(t={},e=()=>{}){this.initialState=t,this.state=this.createStore(this.initialState),this.reducer=e}dispatch(t){let e=this.reducer(this.state,t);Object.assign(this.state,e)}getState(){return this.state}setState(t){Object.assign(this.state,d(t)?t(this.state):t)}addSubscription(t){this.subscriptions.push(t)}getEventListeners(t){return this.eventListeners.filter(e=>e.name===t).map(e=>e.cb)}createStore(t){let e={set:(r,c,s)=>(r[c]=i(s),this.subscriptions.forEach(n=>n()),!0)},i=(r={})=>{let c=["[object Object]","[object Array]"].includes(r.toString());if(r instanceof a)return r;if(c){if(Array.isArray(r))for(let s=0;s<r.length;s++)r[s]=i(r[s]);else for(let[s,n]of Object.entries(r))r[s]=i(n);return new Proxy(r,e)}return r};return i(t)}};var f=class extends HTMLElement{props={};store={};_debounce=null;_mounted=!1;constructor(){super(),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(l.div()))}static define(t,e){customElements.define(t,e)}render(){}style(){}mount(){}unmount(){}_listenStore(t){if(t instanceof a)return t.addSubscription(()=>{this._updateDOM()}),t;for(let[e,i]of Object.entries(t))t[e]=this._listenStore(i);return t}connectedCallback(){this._debounce&&cancelAnimationFrame(this._debounce),this._debounce=requestAnimationFrame(()=>{this._mounted||(this._internalMount(),d(this.mount)&&this.mount())})}disconnectedCallback(){d(this.unmount)&&this.unmount()}_internalMount(){this._createProps(),this._listenStore(this.store),this._updateDOM(!0),this._trackMutations(),this._mounted=!0}_trackMutations(){new MutationObserver(()=>{this._createProps(),this._updateDOM()}).observe(this,{attributes:!0,childList:!0,subtree:!0})}_createProps(){let t={};for(let e of this.getAttributeNames())t[e]=this.getAttribute(e);t.children=[...this.childNodes],this.props=t}_updateDOM(t){let e=this.render();if(this._updateStyles(),t){e&&this.shadowRoot.firstChild.appendChild(e);return}if(e){let i=u._getNodeType(e)==="fragment";u.diff(i?l.div({},[...e.childNodes]):l.div({},e),this.shadowRoot.firstChild)}else this.shadowRoot.firstChild.innerHTML=""}_updateStyles(){let t=d(this.style)?this.style():this.style;!this._styleElement&&t&&(this._styleElement=document.createElement("style"),this.shadowRoot.appendChild(this._styleElement)),t&&t!==this._styleElement.textContent&&(this._styleElement.textContent=t)}};export{a as ZeroStore,g as ZeroUtils,f as default};