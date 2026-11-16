import{u as E,r as m,j as e}from"./index-BQ9sqtMi.js";import{C as P,u as y,O as T,S as b,A as x,V as O,a as D,L,P as B,b as W,M as p,B as M,c as j,d as F,F as R}from"./OrbitControls-7nYI2F2b.js";import{s as A}from"./particleTerrainMath-rGHIunbi.js";const z={air:0,water:1,forest:2},C={air:"#CBFF38",water:"#69D6C5",forest:"#45FF78"},v=(o,t)=>{const a=Math.sin(o*12.9898+t*78.233)*43758.5453;return a-Math.floor(a)};function _(o){const[t,a]=o==="full"?[220,164]:o==="lite"?[148,104]:[98,70],n=new Float32Array(t*a*3),r=new Float32Array(t*a),s=new Float32Array(t*a);let i=0;for(let l=0;l<a;l+=1)for(let u=0;u<t;u+=1){const d=u/(t-1)*10.7-5.35+(v(u,l)-.5)*.026,f=l/(a-1)*7.2-3.6+(v(l+47,u+71)-.5)*.026,h=A(d*1.08,f*1.08)*1.13;n[i*3]=d,n[i*3+1]=h,n[i*3+2]=f,r[i]=p.clamp((h+1.35)/4.6,0,1),s[i]=v(u+11,l+91),i+=1}const c=new M;return c.setAttribute("position",new j(n,3)),c.setAttribute("aElevation",new j(r,1)),c.setAttribute("aRandom",new j(s,1)),c.computeBoundingSphere(),c}const G=`
  attribute float aElevation;
  attribute float aRandom;
  uniform float uTime;
  uniform float uPointScale;
  uniform float uActivation;
  varying float vElevation;
  varying float vRandom;
  void main() {
    vElevation = aElevation;
    vRandom = aRandom;
    vec3 displaced = position;
    displaced.y += sin(uTime * .48 + aRandom * 20.0) * .012 * uActivation;
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = clamp(uPointScale * (.63 + aElevation * .86 + aRandom * .16) / max(1.0, -mvPosition.z), 1.0, 4.25);
  }
`,k=`
  uniform float uDomain;
  uniform float uActivation;
  uniform float uOpacity;
  varying float vElevation;
  varying float vRandom;
  void main() {
    vec2 point = gl_PointCoord - vec2(.5);
    float radius = length(point);
    if (radius > .5) discard;
    float core = smoothstep(.5, .05, radius);

    vec3 deep = vec3(.00, .18, .15);
    vec3 airLow = vec3(.05, .57, .42);
    vec3 airHigh = vec3(.80, 1.0, .22);
    vec3 waterLow = vec3(.00, .24, .34);
    vec3 waterHigh = vec3(.41, .84, .77);
    vec3 forestLow = vec3(.04, .30, .17);
    vec3 forestHigh = vec3(.27, 1.0, .47);

    vec3 airColor = mix(airLow, airHigh, smoothstep(.05, .82, vElevation));
    vec3 waterColor = mix(waterLow, waterHigh, smoothstep(.02, .88, vElevation));
    vec3 forestColor = mix(forestLow, forestHigh, smoothstep(.03, .72, vElevation));
    float airWeight = 1.0 - smoothstep(.0, 1.0, uDomain);
    float forestWeight = smoothstep(1.0, 2.0, uDomain);
    float waterWeight = max(0.0, 1.0 - airWeight - forestWeight);
    vec3 color = airColor * airWeight + waterColor * waterWeight + forestColor * forestWeight;
    color = mix(deep, color, .38 + uActivation * .62);
    float shimmer = .72 + vRandom * .34 + vElevation * .22;
    gl_FragColor = vec4(color * shimmer, core * uOpacity * (.40 + uActivation * .60));
  }
`;function N({domain:o,wakeStage:t,profile:a}){const n=m.useMemo(()=>_(a),[a]),r=z[o],s=t>=5?1:t>=1?.32+t*.12:.22,i=m.useMemo(()=>new b({uniforms:{uTime:{value:0},uDomain:{value:0},uActivation:{value:.22},uOpacity:{value:.98},uPointScale:{value:a==="full"?30:a==="lite"?25:21}},vertexShader:G,fragmentShader:k,transparent:!0,depthWrite:!1,blending:x}),[a]);return m.useEffect(()=>()=>{n.dispose(),i.dispose()},[n,i]),y((c,l)=>{a!=="reduced"&&(i.uniforms.uTime.value=c.clock.elapsedTime),i.uniforms.uDomain.value=p.damp(i.uniforms.uDomain.value,r,4.2,l),i.uniforms.uActivation.value=p.damp(i.uniforms.uActivation.value,s,3.6,l)}),e.jsx("points",{geometry:n,material:i,frustumCulled:!1})}function H(o){const t=o==="full"?1800:o==="lite"?780:360,a=new Float32Array(t*3),n=new Float32Array(t);for(let s=0;s<t;s+=1){const i=(v(s,12)-.5)*11.2,c=(v(s,44)-.5)*7.4;a[s*3]=i,a[s*3+1]=A(i*1.08,c*1.08)*1.13+.75+v(s,86)*2.15,a[s*3+2]=c,n[s]=v(s,133)}const r=new M;return r.setAttribute("position",new j(a,3)),r.setAttribute("aRandom",new j(n,1)),r}const I=`
  attribute float aRandom;
  uniform float uTime;
  uniform float uStrength;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * (.16 + aRandom * .18) + p.z) * (.18 + aRandom * .32) * uStrength;
    p.z += cos(uTime * .18 + p.x * .44) * .12 * uStrength;
    p.y += sin(uTime * .35 + aRandom * 17.0) * .07 * uStrength;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = clamp((10.0 + aRandom * 13.0) / max(1.0, -mvPosition.z), .8, 2.3);
    vAlpha = .28 + aRandom * .72;
  }
`,V=`
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(.5));
    if (d > .5) discard;
    gl_FragColor = vec4(.80, 1.0, .22, smoothstep(.5, .04, d) * vAlpha * uOpacity);
  }
`;function U({domain:o,wakeStage:t,profile:a}){const n=m.useMemo(()=>H(a),[a]),r=m.useMemo(()=>new b({uniforms:{uTime:{value:0},uOpacity:{value:0},uStrength:{value:0}},vertexShader:I,fragmentShader:V,transparent:!0,depthWrite:!1,blending:x}),[]),s=t>=2?o==="air"?.9:.2:0;return m.useEffect(()=>()=>{n.dispose(),r.dispose()},[n,r]),y((i,c)=>{a!=="reduced"&&(r.uniforms.uTime.value=i.clock.elapsedTime),r.uniforms.uOpacity.value=p.damp(r.uniforms.uOpacity.value,s,4,c),r.uniforms.uStrength.value=p.damp(r.uniforms.uStrength.value,o==="air"?1:.35,4,c)}),e.jsx("points",{geometry:n,material:r})}function $({domain:o,wakeStage:t,profile:a}){const n=m.useMemo(()=>[-1.45,.05,1.38].map((u,d)=>Array.from({length:70},(f,h)=>{const g=h/69*10.4-5.2,w=u+Math.sin(g*.65+d*1.7)*(.38+d*.08);return new O(g,A(g*1.08,w*1.08)*1.13+.08,w)})),[]),r=m.useMemo(()=>n.map(u=>new D(u)),[n]),s=m.useRef([]),i=m.useRef(null),c=t>=3?1:.001,l=t>=3?o==="water"?1:.18:0;return y((u,d)=>{i.current&&(i.current.scale.y=p.damp(i.current.scale.y,c,4.5,d)),s.current.forEach((f,h)=>{if(!f)return;const g=r[h%r.length],w=a==="reduced"?h/s.current.length:(u.clock.elapsedTime*.075+h*.19)%1;f.position.copy(g.getPoint(w));const S=f.material;S.opacity=l})}),e.jsxs("group",{ref:i,scale:[1,.001,1],children:[n.map((u,d)=>e.jsx(L,{points:u,color:d===1?"#B8FFF4":"#69D6C5",transparent:!0,opacity:t>=3?o==="water"?.96:.18:0,lineWidth:o==="water"?1.7:.7},d)),Array.from({length:a==="full"?15:9},(u,d)=>e.jsxs("mesh",{ref:f=>{s.current[d]=f},children:[e.jsx("sphereGeometry",{args:[d%3===0?.055:.035,8,8]}),e.jsx("meshBasicMaterial",{color:d%3===0?"#FAF7EF":"#69D6C5",transparent:!0,opacity:0,blending:x})]},d))]})}function X(o){const t=o==="full"?2100:o==="lite"?820:380,a=[],n=[],r=new F("#45FF78"),s=new F("#CBFF38");let i=0;for(;a.length/3<t&&i<t*8;){const l=(v(i,23)-.5)*10.3,u=(v(i,63)-.5)*6.8,d=A(l*1.08,u*1.08)*1.13,f=Math.sin(l*.82)+Math.cos(u*1.13);if(d>-.18&&f>-.15){const h=.05+v(i,97)*.28;a.push(l,d+h,u);const g=r.clone().lerp(s,v(i,141)*.44);n.push(g.r,g.g,g.b)}i+=1}const c=new M;return c.setAttribute("position",new R(a,3)),c.setAttribute("color",new R(n,3)),c}function Y({domain:o,wakeStage:t,profile:a}){const n=m.useMemo(()=>X(a),[a]),r=m.useMemo(()=>new B({size:a==="full"?.065:.075,vertexColors:!0,transparent:!0,opacity:0,depthWrite:!1,blending:x,sizeAttenuation:!0}),[a]),s=m.useRef(null),i=t>=4?o==="forest"?.96:.14:0;return m.useEffect(()=>()=>{n.dispose(),r.dispose()},[n,r]),y((c,l)=>{r.opacity=p.damp(r.opacity,i,4,l),s.current&&a!=="reduced"&&(s.current.scale.y=1+Math.sin(c.clock.elapsedTime*.45)*(o==="forest"?.025:.006))}),e.jsx("points",{ref:s,geometry:n,material:r})}function q({domain:o,wakeStage:t,profile:a}){const n=m.useRef(null),r=m.useRef(null),s=m.useRef(null),i=C[o];return m.useLayoutEffect(()=>{if(!r.current)return;const c=new W;for(let l=0;l<96;l+=1){const u=l/96*Math.PI*2;c.position.set(Math.cos(u)*5.9,-.86,Math.sin(u)*5.9),c.rotation.set(0,-u,0),c.scale.set(l%8===0?1.8:.62,1,1),c.updateMatrix(),r.current.setMatrixAt(l,c.matrix)}r.current.instanceMatrix.needsUpdate=!0},[]),y((c,l)=>{if(n.current&&a!=="reduced"&&(n.current.rotation.y+=l*(t>0&&t<5?.42:.035)),s.current){const u=a==="reduced"?.9:c.clock.elapsedTime*(t>0&&t<5?1.5:.26);s.current.position.set(Math.cos(u)*5.9,-.81,Math.sin(u)*5.9)}}),e.jsxs("group",{children:[e.jsxs("group",{ref:n,children:[e.jsxs("mesh",{rotation:[Math.PI/2,0,0],position:[0,-.86,0],children:[e.jsx("torusGeometry",{args:[5.9,.018,6,192]}),e.jsx("meshBasicMaterial",{color:i,transparent:!0,opacity:t?.72:.18,blending:x})]}),e.jsxs("mesh",{rotation:[Math.PI/2,0,0],position:[0,-.58,0],children:[e.jsx("torusGeometry",{args:[5.18,.009,5,160]}),e.jsx("meshBasicMaterial",{color:"#FAF7EF",transparent:!0,opacity:t>=5?.18:.06})]}),e.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,96],children:[e.jsx("boxGeometry",{args:[.11,.016,.012]}),e.jsx("meshBasicMaterial",{color:i,transparent:!0,opacity:t?.66:.12})]})]}),e.jsxs("mesh",{ref:s,children:[e.jsx("sphereGeometry",{args:[.055,10,10]}),e.jsx("meshBasicMaterial",{color:"#FAF7EF",transparent:!0,opacity:t?1:.25,blending:x})]})]})}function J({props:o,profile:t}){const a=m.useRef(null),n=m.useRef(null);return m.useEffect(()=>{a.current?.reset()},[o.resetViewSignal]),y((r,s)=>{if(!n.current)return;const i=t==="full"?r.pointer.x*.055:0,c=t==="full"?r.pointer.y*.035:0;n.current.rotation.z=p.damp(n.current.rotation.z,i,2.2,s),n.current.rotation.x=p.damp(n.current.rotation.x,c,2.2,s),n.current.position.y=t==="reduced"?0:Math.sin(r.clock.elapsedTime*.28)*.035}),e.jsxs(e.Fragment,{children:[e.jsx("color",{attach:"background",args:["#030705"]}),e.jsx("fog",{attach:"fog",args:["#030705",10,21]}),e.jsx("ambientLight",{intensity:.22}),e.jsx("pointLight",{position:[0,6,2],intensity:2.6,color:C[o.domain],distance:16}),e.jsx("pointLight",{position:[-5,2,-2],intensity:1.2,color:"#69D6C5",distance:12}),e.jsxs("group",{ref:n,children:[e.jsx(N,{domain:o.domain,wakeStage:o.wakeStage,profile:t}),e.jsx(U,{domain:o.domain,wakeStage:o.wakeStage,profile:t}),e.jsx($,{domain:o.domain,wakeStage:o.wakeStage,profile:t}),e.jsx(Y,{domain:o.domain,wakeStage:o.wakeStage,profile:t})]}),e.jsx(q,{domain:o.domain,wakeStage:o.wakeStage,profile:t}),e.jsx("gridHelper",{args:[18,36,"#173a2d","#09150f"],position:[0,-1.72,0]}),e.jsx(T,{ref:a,makeDefault:!0,enablePan:!1,enableDamping:!0,dampingFactor:.065,autoRotate:t==="full"&&o.wakeStage>=5,autoRotateSpeed:.22,minDistance:7.4,maxDistance:13.5,minPolarAngle:.53,maxPolarAngle:1.3,target:[0,.28,0]})]})}const K=()=>{try{const o=document.createElement("canvas");return!!(o.getContext("webgl2")||o.getContext("webgl"))}catch{return!1}};function et(o){const t=E(),[a,n]=m.useState(null),r=t==="full"?36080:t==="lite"?15392:6860;return m.useEffect(()=>n(K()),[]),e.jsxs("div",{className:`triad-eco-core triad-domain-${o.domain} motion-${t}`,role:"img","aria-label":`${o.domain==="air"?"空气":o.domain==="water"?"水环境":"森林"}主题的程序化生态概念装置。场景不是贵州真实地形或遥感影像。`,children:[a?e.jsx(P,{"aria-hidden":"true",dpr:t==="full"?[1,1.45]:1,camera:{position:[8.4,5.5,8.8],fov:39,near:.1,far:36},gl:{antialias:t==="full",alpha:!1,powerPreference:"high-performance"},children:e.jsx(J,{props:o,profile:t})}):e.jsxs("div",{className:"triad-core-fallback","aria-hidden":"true",children:[e.jsx("i",{}),e.jsx("i",{}),e.jsx("i",{}),e.jsx("span",{})]}),e.jsx("div",{className:"triad-core-grid","aria-hidden":"true"}),e.jsx("div",{className:"triad-core-vignette","aria-hidden":"true"}),e.jsxs("p",{className:"triad-core-note",children:[r.toLocaleString()," TERRAIN POINTS · PROCEDURAL ECO ART / 概念地形·非真实GIS"]})]})}export{et as TriadEcoCore};
//# sourceMappingURL=TriadEcoCore-Rv3QbGg9.js.map
