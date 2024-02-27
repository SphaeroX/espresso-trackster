import{p as L,i as K,c as s,r as Z,a as C,g as ae,s as w,o as oe,b as le,d as E,f as fe,e as ye,h as ge,j as he,k as ne,l as be,w as H,m as U,u as Se,n as _e,t as Q,q as _,v as se,x as Ve,y as X,z as Y,A as N,B as Ie,C as xe,D as we,E as Te,F as Be}from"./index-9c498dc0.js";import{u as Ae,m as Le,a as ue,b as j,V as ee,c as Pe,d as Re,e as $e,f as re,g as ke}from"./VIcon-6a3f5f04.js";const O=Symbol.for("vuetify:layout"),ie=Symbol.for("vuetify:layout-item"),te=1e3,ze=L({overlaps:{type:Array,default:()=>[]},fullHeight:Boolean},"layout"),Ce=L({name:{type:String},order:{type:[Number,String],default:0},absolute:Boolean},"layout-item");function Me(){const e=K(O);if(!e)throw new Error("[Vuetify] Could not find injected layout");return{getLayoutItem:e.getLayoutItem,mainRect:e.mainRect,mainStyles:e.mainStyles}}function Ee(e){const l=K(O);if(!l)throw new Error("[Vuetify] Could not find injected layout");const a=e.id??`layout-item-${ye()}`,n=ae("useLayoutItem");le(ie,{id:a});const o=w(!1);ge(()=>o.value=!0),he(()=>o.value=!1);const{layoutItemStyles:t,layoutItemScrimStyles:u}=l.register(n,{...e,active:s(()=>o.value?!1:e.active.value),id:a});return ne(()=>l.unregister(a)),{layoutItemStyles:t,layoutRect:l.layoutRect,layoutItemScrimStyles:u}}const He=(e,l,a,n)=>{let o={top:0,left:0,right:0,bottom:0};const t=[{id:"",layer:{...o}}];for(const u of e){const v=l.get(u),f=a.get(u),g=n.get(u);if(!v||!f||!g)continue;const p={...o,[v.value]:parseInt(o[v.value],10)+(g.value?parseInt(f.value,10):0)};t.push({id:u,layer:p}),o=p}return t};function Ne(e){const l=K(O,null),a=s(()=>l?l.rootZIndex.value-100:te),n=Z([]),o=C(new Map),t=C(new Map),u=C(new Map),v=C(new Map),f=C(new Map),{resizeRef:g,contentRect:p}=Ae(),P=s(()=>{const i=new Map,b=e.overlaps??[];for(const r of b.filter(y=>y.includes(":"))){const[y,d]=r.split(":");if(!n.value.includes(y)||!n.value.includes(d))continue;const I=o.get(y),B=o.get(d),$=t.get(y),k=t.get(d);!I||!B||!$||!k||(i.set(d,{position:I.value,amount:parseInt($.value,10)}),i.set(y,{position:B.value,amount:-parseInt(k.value,10)}))}return i}),h=s(()=>{const i=[...new Set([...u.values()].map(r=>r.value))].sort((r,y)=>r-y),b=[];for(const r of i){const y=n.value.filter(d=>{var I;return((I=u.get(d))==null?void 0:I.value)===r});b.push(...y)}return He(b,o,t,v)}),m=s(()=>!Array.from(f.values()).some(i=>i.value)),S=s(()=>h.value[h.value.length-1].layer),A=s(()=>({"--v-layout-left":E(S.value.left),"--v-layout-right":E(S.value.right),"--v-layout-top":E(S.value.top),"--v-layout-bottom":E(S.value.bottom),...m.value?void 0:{transition:"none"}})),T=s(()=>h.value.slice(1).map((i,b)=>{let{id:r}=i;const{layer:y}=h.value[b],d=t.get(r),I=o.get(r);return{id:r,...y,size:Number(d.value),position:I.value}})),c=i=>T.value.find(b=>b.id===i),x=ae("createLayout"),R=w(!1);oe(()=>{R.value=!0}),le(O,{register:(i,b)=>{let{id:r,order:y,position:d,layoutSize:I,elementSize:B,active:$,disableTransitions:k,absolute:ve}=b;u.set(r,y),o.set(r,d),t.set(r,I),v.set(r,$),k&&f.set(r,k);const W=fe(ie,x==null?void 0:x.vnode).indexOf(i);W>-1?n.value.splice(W,0,r):n.value.push(r);const G=s(()=>T.value.findIndex(z=>z.id===r)),D=s(()=>a.value+h.value.length*2-G.value*2),de=s(()=>{const z=d.value==="left"||d.value==="right",q=d.value==="right",me=d.value==="bottom",J={[d.value]:0,zIndex:D.value,transform:`translate${z?"X":"Y"}(${($.value?0:-110)*(q||me?-1:1)}%)`,position:ve.value||a.value!==te?"absolute":"fixed",...m.value?void 0:{transition:"none"}};if(!R.value)return J;const V=T.value[G.value];if(!V)throw new Error(`[Vuetify] Could not find layout item "${r}"`);const F=P.value.get(r);return F&&(V[F.position]+=F.amount),{...J,height:z?`calc(100% - ${V.top}px - ${V.bottom}px)`:B.value?`${B.value}px`:void 0,left:q?void 0:`${V.left}px`,right:q?`${V.right}px`:void 0,top:d.value!=="bottom"?`${V.top}px`:void 0,bottom:d.value!=="top"?`${V.bottom}px`:void 0,width:z?B.value?`${B.value}px`:void 0:`calc(100% - ${V.left}px - ${V.right}px)`}}),pe=s(()=>({zIndex:D.value-1}));return{layoutItemStyles:de,layoutItemScrimStyles:pe,zIndex:D}},unregister:i=>{u.delete(i),o.delete(i),t.delete(i),v.delete(i),f.delete(i),n.value=n.value.filter(b=>b!==i)},mainRect:S,mainStyles:A,getLayoutItem:c,items:T,layoutRect:p,rootZIndex:a});const M=s(()=>["v-layout",{"v-layout--full-height":e.fullHeight}]),ce=s(()=>({zIndex:l?a.value:void 0,position:l?"relative":void 0,overflow:l?"hidden":void 0}));return{layoutClasses:M,layoutStyles:ce,getLayoutItem:c,items:T,layoutRect:p,layoutRef:g}}const Oe=L({scrollTarget:{type:String},scrollThreshold:{type:[String,Number],default:300}},"scroll");function Ue(e){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{canScroll:a}=l;let n=0;const o=Z(null),t=w(0),u=w(0),v=w(0),f=w(!1),g=w(!1),p=s(()=>Number(e.scrollThreshold)),P=s(()=>be((p.value-t.value)/p.value||0)),h=()=>{const m=o.value;!m||a&&!a.value||(n=t.value,t.value="window"in m?m.pageYOffset:m.scrollTop,g.value=t.value<n,v.value=Math.abs(t.value-p.value))};return H(g,()=>{u.value=u.value||t.value}),H(f,()=>{u.value=0}),oe(()=>{H(()=>e.scrollTarget,m=>{var A;const S=m?document.querySelector(m):window;S&&S!==o.value&&((A=o.value)==null||A.removeEventListener("scroll",h),o.value=S,o.value.addEventListener("scroll",h,{passive:!0}))},{immediate:!0})}),ne(()=>{var m;(m=o.value)==null||m.removeEventListener("scroll",h)}),a&&H(a,h,{immediate:!0}),{scrollThreshold:p,currentScroll:t,currentThreshold:v,isScrollActive:f,scrollRatio:P,isScrollingUp:g,savedScroll:u}}const je=L({scrollBehavior:String,modelValue:{type:Boolean,default:!0},location:{type:String,default:"top",validator:e=>["top","bottom"].includes(e)},...Le(),...Ce(),...Oe(),height:{type:[Number,String],default:64}},"VAppBar"),De=U()({name:"VAppBar",props:je(),emits:{"update:modelValue":e=>!0},setup(e,l){let{slots:a}=l;const n=Z(),o=Se(e,"modelValue"),t=s(()=>{var x;const c=new Set(((x=e.scrollBehavior)==null?void 0:x.split(" "))??[]);return{hide:c.has("hide"),inverted:c.has("inverted"),collapse:c.has("collapse"),elevate:c.has("elevate"),fadeImage:c.has("fade-image")}}),u=s(()=>{const c=t.value;return c.hide||c.inverted||c.collapse||c.elevate||c.fadeImage||!o.value}),{currentScroll:v,scrollThreshold:f,isScrollingUp:g,scrollRatio:p}=Ue(e,{canScroll:u}),P=s(()=>e.collapse||t.value.collapse&&(t.value.inverted?p.value>0:p.value===0)),h=s(()=>e.flat||t.value.elevate&&(t.value.inverted?v.value>0:v.value===0)),m=s(()=>t.value.fadeImage?t.value.inverted?1-p.value:p.value:void 0),S=s(()=>{var R,M;if(t.value.hide&&t.value.inverted)return 0;const c=((R=n.value)==null?void 0:R.contentHeight)??0,x=((M=n.value)==null?void 0:M.extensionHeight)??0;return c+x});_e(s(()=>!!e.scrollBehavior),()=>{Ve(()=>{t.value.hide?t.value.inverted?o.value=v.value>f.value:o.value=g.value||v.value<f.value:o.value=!0})});const{ssrBootStyles:A}=ue(),{layoutItemStyles:T}=Ee({id:e.name,order:s(()=>parseInt(e.order,10)),position:Q(e,"location"),layoutSize:S,elementSize:w(void 0),active:o,absolute:Q(e,"absolute")});return j(()=>{const c=ee.filterProps(e);return _(ee,se({ref:n,class:["v-app-bar",{"v-app-bar--bottom":e.location==="bottom"},e.class],style:[{...T.value,"--v-toolbar-image-opacity":m.value,height:void 0,...A.value},e.style]},c,{collapse:P.value,flat:h.value}),a)}),{}}}),qe=U()({name:"VAppBarTitle",props:Pe(),setup(e,l){let{slots:a}=l;return j(()=>_(Re,se(e,{class:"v-app-bar-title"}),a)),{}}}),Fe={__name:"AppBar",setup(e){return(l,a)=>(X(),Y(De,{flat:""},{default:N(()=>[_(qe,null,{default:N(()=>[_($e,{icon:"mdi-coffee-maker"}),Ie(" Espresso Trackster ")]),_:1})]),_:1}))}};const Ke=L({scrollable:Boolean,...re(),...ke({tag:"main"})},"VMain"),Ze=U()({name:"VMain",props:Ke(),setup(e,l){let{slots:a}=l;const{mainStyles:n}=Me(),{ssrBootStyles:o}=ue();return j(()=>_(e.tag,{class:["v-main",{"v-main--scrollable":e.scrollable},e.class],style:[n.value,o.value,e.style]},{default:()=>{var t,u;return[e.scrollable?_("div",{class:"v-main__scroller"},[(t=a.default)==null?void 0:t.call(a)]):(u=a.default)==null?void 0:u.call(a)]}})),{}}}),Xe={__name:"View",setup(e){return(l,a)=>{const n=xe("router-view");return X(),Y(Ze,null,{default:N(()=>[_(n)]),_:1})}}};const Ye=L({...re(),...ze({fullHeight:!0}),...we()},"VApp"),We=U()({name:"VApp",props:Ye(),setup(e,l){let{slots:a}=l;const n=Te(e),{layoutClasses:o,getLayoutItem:t,items:u,layoutRef:v}=Ne(e),{rtlClasses:f}=Be();return j(()=>{var g;return _("div",{ref:v,class:["v-application",n.themeClasses.value,o.value,f.value,e.class],style:[e.style]},[_("div",{class:"v-application__wrap"},[(g=a.default)==null?void 0:g.call(a)])])}),{getLayoutItem:t,items:u,theme:n}}}),et={__name:"Default",setup(e){return(l,a)=>(X(),Y(We,null,{default:N(()=>[_(Fe),_(Xe)]),_:1}))}};export{et as default};
