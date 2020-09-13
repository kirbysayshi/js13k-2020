!function(){"use strict";function t(t,n){return{x:t||0,y:n||0}}const n=(t,n)=>(t.x=n.x,t.y=n.y,t),e=(t,n,e)=>(t.x=n,t.y=e,t),o=(t,n,e)=>(t.x=n.x+e.x,t.y=n.y+e.y,t),c=(t,n,e)=>(t.x=n.x-e.x,t.y=n.y-e.y,t),r=(t,n)=>t.x*n.x+t.y*n.y,s=(t,n,e)=>(t.x=n.x*e,t.y=n.y*e,t),i=(t,n)=>{const e=t.x-n.x,o=t.y-n.y;return Math.sqrt(e*e+o*o)},a=t=>{const n=t.x,e=t.y;return Math.sqrt(n*n+e*e)},u=(t,n)=>{const e=n.x,o=n.y;let c=e*e+o*o;return c>0&&(c=1/Math.sqrt(c),t.x=n.x*c,t.y=n.y*c),t},h=(t,n)=>{t.t.x+=t.o.x*n*n*.001,t.t.y+=t.o.y*n*n*.001,e(t.o,0,0)},l=t(),f=t(),d=t(),p=t(),w=t(),g=t(),M=t(),v=t(),y=t(),x=t(),b=t(),m=t(),k=t(),S=t(),T=(i,h,T,O,A,L,R,C,D,I,P,N,H,E,F)=>{e(l,0,0),e(f,0,0),e(d,0,0),e(p,0,0),e(w,0,0),e(g,0,0),e(M,0,0),e(v,0,0),e(y,0,0),e(x,0,0),e(b,0,0),e(m,0,0),e(k,0,0),e(S,0,0),!H||0===H.x&&0===H.y?(c(l,i,R),u(l,l)):e(l,H.x,H.y),s(f,l,-1);const j=T+D,K=1+(O>I?O:I);c(d,i,h);const W=r(l,d);s(p,l,W),c(w,d,p),c(g,R,C);const $=r(f,g);s(M,f,$),c(v,g,M),s(b,p,(T-D)/j),s(m,M,K*D/j),o(y,b,m),o(y,y,w),s(k,p,K*T/j),s(S,M,(D-T)/j),o(x,k,S),o(x,x,v);const B=o(t(),y,x),G=t();s(G,l,r(B,l));const U=c(t(),B,G);u(U,U);let z=-r(B,U);z/=1/(T+D);const Y=Math.abs(z);if(Y>1e-4){const n=a(w),e=a(v),c=t(),r=t();s(c,U,Y<n*A?A:-n*L),s(r,U,Y<e*P?P:-e*N),o(y,y,c),o(x,x,r)}n(E,y),n(F,x)},O=t=>{const n=2*t.t.x-t.i.x,o=2*t.t.y-t.i.y;e(t.i,t.t.x,t.t.y),e(t.t,n,o)},A=t(),L=t();function R(t,n,e,o,r){c(A,n,t),c(L,o,e);const s=(-A.y*(t.x-e.x)+A.x*(t.y-e.y))/(-L.x*A.y+A.x*L.y),i=(L.x*(t.y-e.y)-L.y*(t.x-e.x))/(-L.x*A.y+A.x*L.y);return s>=0&&s<=1&&i>=0&&i<=1&&(r.x=t.x+i*A.x,r.y=t.y+i*A.y,!0)}const C=t(),D=t(),I=t(),P=t(),N=t(),H=t();const E=t(),F=t();function j(t,n,o,s){if(c(E,o,n),0===E.x&&0===E.y)throw new Error("ZeroLengthEdge");const a=((t.x-n.x)*E.x+(t.y-n.y)*E.y)/(E.x*E.x+E.y*E.y);s.u=a;const h=e(s.h,n.x+a*E.x,n.y+a*E.y);s.l=i(h,t);const l=((t,n,e)=>(t.y=e.x-n.x,t.x=n.y-e.y,u(t,t)))(s.p,n,o);c(F,t,h),s.g=r(l,F)}function K(t){return t&&"object"==typeof t&&"number"==typeof t.id}class W{constructor(t){this.M=t,this.v=W.hash(this.M),this.m=new Set}k(t){this.m.add(t)}S(t,n){const e=n.map(t=>t.T);this.M.every(t=>e.indexOf(t)>-1)&&!this.m.has(t)&&this.m.add(t)}O(t,n){const e=n.map(t=>t.T);this.M.every(t=>e.indexOf(t)>-1)&&this.m.has(t)&&this.m.delete(t)}static hash(t){return t.slice().sort().join("|")}}const $=33.3333333,B=new class{constructor(){this.A=1,this.m=new Map,this.L=new Map,this.R=new Set}C(t){const n={id:this.A++};return this.m.set(n,t),this.L.forEach(e=>e.S(n,t)),n}D(t){this.R.add(t)}I(t){return this.R.has(t)}P(){if(0===this.R.size)return;let t=!1;const n=e=>{e&&"object"==typeof e&&!K(e)&&Object.values(e).forEach(e=>{K(e)?(this.D(e),t=!0):n(e)})};this.R.forEach(t=>{if(this.R.delete(t),!this.m.has(t))return;const e=this.m.get(t);e.forEach(t=>{n(t)}),this.m.delete(t),this.L.forEach(n=>n.O(t,e))}),t&&this.P()}select(t){const n=W.hash(t);if(this.L.has(n))return this.L.get(n).m;const e=new W(t);return this.L.set(e.v,e),this.m.forEach((n,o)=>{let c=!0;for(let e=0;e<t.length;e++){const o=t[e];n.find(t=>t.T===o)||(c=!1)}c&&e.k(o)}),e.m}N(t){return this.select(t).values().next().value}data(t,n){const e=this.m.get(t);let o;for(let t=0;t<e.length;t++){const c=e[t];c.T===n&&(o=c)}return o}H(t){const n=this.N([t]);if(!n)return;return this.data(n,t)}};function G(){return B}function U(t,n,e){const o=e.getContext("2d"),c=window.devicePixelRatio||1;return e.style.width=t+"px",e.style.height=n+"px",e.width=Math.floor(t*c),e.height=Math.floor(n*c),o.scale(c,c),o.webkitImageSmoothingEnabled=!1,o.msImageSmoothingEnabled=!1,o.mozImageSmoothingEnabled=!1,o.imageSmoothingEnabled=!1,{width:t,height:n,F:e,j:o,K:c}}const z=document.querySelector.bind(document),Y=(document.querySelectorAll.bind(document),z("#r")),q=z("#c"),Z=z("#u");if(!Y||!q||!Z)throw new Error("Could not locate DOM!");function J(t,n,e,o){return t.addEventListener(n,e,o),()=>{t.removeEventListener(n,e,o)}}const Q="transparent",V="rgba(255,255,132,1)",X="rgba(255,255,132,0.5)",_="rgba(40,40,40,1)",tt=45,nt="Arial, sans-serif",et="Courier, Courier New, monospace";function ot(n=0,e=0){return t(n,e)}function ct(t){const n=G().H("vp"),e=n.W;return t/n.$*e.width}function rt(t,n){const e=G().H("vp"),{B:o}=e;return ct(t-("x"===n?o.target.x:o.target.y))}const st=t=>t/G().H("vp").W.width*100;function it(t){const e=G().H("vp");n(e.B.target,t)}function at(){const t=G().H("vp"),{j:n}=t.W;n.save(),function(t){const{j:n}=t.W,{B:e}=t;n.scale(1,-1),n.translate(-ct(e.G.x),-ct(e.G.y))}(t),n.clearRect(0,0,t.W.F.width,t.W.F.height),n.restore()}function ut(t=_){const n=G().H("vp"),{j:e}=n.W;e.fillStyle=t;const o=2*n.B.G.x,c=n.U-2*n.B.G.y;e.fillRect(rt(n.B.target.x-n.B.G.x,"x"),rt(n.B.target.y-n.B.G.y,"y"),ct(o),ct(-c))}function ht(t,n,e,c,r,s="transparent",i=nt){const a=G().H("vp"),{B:u}=a,h=ot();return h.x=u.target.x-u.G.x,h.y=u.target.y+u.G.y,o(h,h,n),lt(t,h,e,c,r,s,i)}function lt(t,n,e,o,c,r="transparent",s=nt){const i=G().H("vp"),{B:a}=i,{j:u}=i.W;u.save(),u.scale(1,-1);const{Y:h,font:l}=ft(t,o,s);let f=0,d=ct(-n.y+a.target.y);return u.font=l,t.split("\n").forEach((t,o)=>{const s=u.measureText(t).width+1,i=ct(h);0===o&&(d+=i);const a="center"===e?rt(n.x,"x")-s/2:"left"===e?rt(n.x,"x"):rt(n.x,"x")-s;"transparent"!==r&&(u.fillStyle=r,u.fillRect(a,d,s,-i)),u.fillStyle=c,u.fillText(t,a,d),d+=i,f+=i}),u.restore(),st(f)}function ft(t,n,e=nt){const o=G().H("vp"),{j:c}=o.W,r=o.height/n;c.save();const s=`${r}px/1.2 ${e}`;c.font=s;const i=c.measureText(t),a=1.2*(i.actualBoundingBoxAscent?i.actualBoundingBoxAscent+i.actualBoundingBoxDescent:r);c.restore();const u=t.split("\n");return{font:s,fontSize:r+"px",total:st(a*u.length),q:1.2,Y:st(a)}}function dt(){const t=window.innerWidth<window.innerHeight?window.innerWidth:.6*window.innerHeight,n=window.innerWidth<window.innerHeight?window.innerWidth/.6:window.innerHeight;return{T:"vp",ratio:.6,width:t,height:n,$:100,U:100/.6,W:U(t,n,q),B:{G:ot(50,50),mode:"center",target:ot(0,0)}}}function pt(){const t=dt(),n=G(),e=n.N(["vp"]);e&&n.D(e);Y.style.width=t.width+"px";const o=n=>Math.floor(n/t.$*t.W.width);t.W.j.translate(o(t.B.G.x),o(t.B.G.y)),t.W.j.scale(1,-1);const c=[t];n.C(c)}function wt(t,n,e,o){const c=n.x-e.x,r=n.y-e.y,s=Math.sin(o),i=Math.cos(o);return t.x=c*i-r*s+e.x,t.y=c*s+r*i+e.y,t}function gt(){return{l:0,g:0,u:0,h:t(),p:t()}}window.addEventListener("resize",pt);const Mt=t(),vt=t(),yt=t();function xt(t,n,e){return c(Mt,n.t,n.i),u(vt,Mt),s(yt,vt,e),o(t,yt,n.t),t}function bt(t){return Math.atan2(t.y,t.x)}const mt=new URLSearchParams(window.location.search);function kt(t,n){const{width:e,height:c}=function(t){return{width:t.$,height:Math.min(.75*t.$,.75*t.U)}}(n),r=t.width/2,i=t.height/2,a=n.B.target,u=ot(Math.cos(t.Z),Math.sin(t.Z)),h=s(ot(),u,Math.min(e/2,c/2)),l=o(ot(),a,h),f=ot(l.x,l.y-r),d=ot(l.x,l.y+r);return wt(f,f,l,t.Z),wt(d,d,l,t.Z),{x:l.x,y:l.y,angle:t.Z,J:r,V:i,X:f,p1:d}}function St(t,e,r,i){h(t,i);const{X:a,p1:u,V:l}=kt(e,r),f={_:a,tt:u},d=t,p=l,w=gt();j(d.t,f._,f.tt,w);const g=n(ot(),w.h),M=c(ot(),e.nt.t,e.nt.i),v=c(ot(),g,M),y=2+p;if(w.u>=0&&w.u<=1&&w.l<=y){const t=1,n=1e7,e=.5,r=.87,i=.87,a=ot(),u=ot();T(d.t,d.i,t,e,r,i,g,v,n,e,r,i,w.p,a,u),c(d.i,d.t,a);const h=Math.abs(y-w.l);((t,...n)=>{for(let e=0;e<n.length;e++){const c=n[e];o(c,c,t)}})(s(ot(),w.p,w.g>0?h:-h),d.t,d.i)}O(t)}const Tt=mt.get("seed"),Ot=Tt?Number(Tt):Date.now(),At=(Rt=61^(Rt=Ot)^Rt>>>16,Rt+=Rt<<3,Rt=Math.imul(Rt,668265261),Lt=(Rt^=Rt>>>15)>>>0,t=>(Lt=Lt+1831565813|0,(((t=(t=Math.imul(Lt^Lt>>>15,1|Lt))+Math.imul(t^t>>>7,61|t)^t)^t>>>14)>>>0)/2**32));var Lt,Rt;const Ct=()=>At();function Dt(){const t=G().H("vp"),{B:n,W:{j:e}}=t;e.fillStyle=_,e.fillRect(rt(n.target.x-n.G.x,"x"),rt(n.target.y+n.G.y,"y"),ct(2*n.G.x),ct(2*-n.G.y))}let It;function Pt(){const t=G().H("vp"),{B:n}=t,e=2*n.G.x,o=2*n.G.y;if(!It){const n=document.createElement("canvas"),c=n.getContext("2d");It=U(ct(2*t.B.G.x),ct(2*t.B.G.y),n);const r=.1,s=.3,i=2*t.B.G.y*8;c.fillStyle=X;let a=0;for(;a<i;){const t=Ct()*e,n=Ct()*o,i=Ct()*(s-r)+r;c.beginPath(),c.arc(ct(t),ct(n),ct(i),0,2*Math.PI,!1),c.fill(),a++}}const c=n.target.x/e,r=n.target.y/o,s=Math.floor(c),i=Math.floor(r);let a=n.target.x%e/e,u=n.target.y%o/o;a=n.target.x<0?1-Math.abs(a):a,u=n.target.y<0?1-Math.abs(u):u;const h=t.W.j;Dt(),h.drawImage(It.F,0,0,ct(e),ct(o),rt(s*e,"x"),rt(i*o,"y"),ct(e),ct(o)),a<.5&&h.drawImage(It.F,0,0,ct(e),ct(o),rt((s-1)*e,"x"),rt(i*o,"y"),ct(e),ct(o)),a>=.5&&h.drawImage(It.F,0,0,ct(e),ct(o),rt((s+1)*e,"x"),rt(i*o,"y"),ct(e),ct(o)),u<.5&&h.drawImage(It.F,0,0,ct(e),ct(o),rt(s*e,"x"),rt((i-1)*o,"y"),ct(e),ct(o)),u>=.5&&h.drawImage(It.F,0,0,ct(e),ct(o),rt(s*e,"x"),rt((i+1)*o,"y"),ct(e),ct(o)),a<.5&&u<.5&&h.drawImage(It.F,0,0,ct(e),ct(o),rt((s-1)*e,"x"),rt((i-1)*o,"y"),ct(e),ct(o)),a>=.5&&u<.5&&h.drawImage(It.F,0,0,ct(e),ct(o),rt((s+1)*e,"x"),rt((i-1)*o,"y"),ct(e),ct(o)),a<.5&&u>=.5&&h.drawImage(It.F,0,0,ct(e),ct(o),rt((s-1)*e,"x"),rt((i+1)*o,"y"),ct(e),ct(o)),a>=.5&&u>=.5&&h.drawImage(It.F,0,0,ct(e),ct(o),rt((s+1)*e,"x"),rt((i+1)*o,"y"),ct(e),ct(o))}function Nt(t,n,e,o){if(!e.et)return;const c=ot(),r=R(xt(ot(),t,n),t.i,e._,e.tt,c),s=gt();if(j(t.i,e._,e.tt,s),r&&s.g<0&&(e.et=!1,o.ot&&e.ct)){o.rt=!0}}function Ht(t,n,e){if(e.et)return;const r=ot(),i=R(xt(ot(),t,n),t.i,e._,e.tt,r),a=gt();if(j(t.i,e._,e.tt,a),i&&a.g>0){h=t,l=n,f={t:e._,i:e._,o:ot()},d={t:e.tt,i:e.tt,o:ot()},c(I,h.t,h.i),u(P,I),s(N,P,l),o(H,N,h.t),R(H,h.i,f.t,d.t,C)&&(c(D,H,C),c(h.t,h.t,D),c(h.i,h.i,D));const i=1,p=1e7,w=1,g=0,M=0,v=ot(),y=ot();T(t.t,t.i,i,w,g,M,r,r,p,w,g,M,a.p,v,y),c(t.i,t.t,v)}var h,l,f,d}function Et(t=0,e=ot(0,0)){const o=G().H("vp");return{Z:t,width:o.$/2,height:o.$/16,nt:{o:ot(),t:n(ot(),e),i:n(ot(),e)}}}function Ft(t=ot(),e=0,o=ot()){const r=G().H("vp"),i={t:n(ot(),t),i:n(ot(),t),o:ot(),width:r.$/32,height:r.$/32},a=s(ot(),o,e);return c(i.i,i.t,a),i}function jt(t){return{nt:{t:n(ot(),t),i:n(ot(),t),o:ot()},st:ot(10,10)}}function Kt(t,n){return{_:t,tt:n,et:!1,ct:!1}}function Wt(t,n,e=!1){return{_:t,tt:n,et:!0,ct:e}}function $t(t,n=!0,e=!0){const o=[];for(let n=0;n<t.length;n++){const c=n>0?t[n-1]:null,r=t[n];c&&o.push(e?Kt(r,c):Kt(c,r))}return n&&o.push(e?Kt(t[0],t[t.length-1]):Kt(t[t.length-1],t[0])),o}function Bt(t,e,o=!1){return{nt:{t:n(ot(),t),i:n(ot(),t),o:ot()},st:ot(10,10),it:n(ot(),e),at:o}}const Gt={ut:0,ht:null,state:"boot",level:-1,lt:null,ft:[],ot:null,rt:!1,dt:-1,wt:[function(){return{gt:Ft(ot(20,0),.5,ot(-1,0)),Mt:Et(Math.PI),target:jt(ot(40,0)),vt:$t([ot(-50,50),ot(50,50),ot(50,-50),ot(-50,-50)]),yt:[],xt:"Signal, meet target"}},function(){return{gt:Ft(ot(20,0),.5,ot(-1,0)),Mt:Et(Math.PI),target:jt(ot(40,-40)),vt:$t([ot(-50,50),ot(50,50),ot(50,-50),ot(-50,-50)]),yt:[],xt:"Sometimes you need to rotate"}},function(){return{gt:Ft(ot(20,0),.2,ot(-1,0)),Mt:Et(Math.PI),target:jt(ot(80,-40)),vt:$t([ot(-50,50),ot(100,50),ot(100,-50),ot(-50,-50)]),yt:[],xt:"Offscreen targets are tracked"}},function(){return{gt:Ft(ot(20,0),.2,ot(-1,0)),Mt:Et(Math.PI),target:jt(ot(80,-180)),vt:$t([ot(-50,50),ot(100,50),ot(100,-200),ot(50,-200),ot(50,-50),ot(-50,-50)]),yt:[],xt:"Down the well..."}},function(){const t=Et(Math.PI);return{gt:Ft(ot(-30,-40),.5,ot(0,1)),Mt:t,target:jt(ot(510,0)),vt:$t([ot(-50,50),ot(50,50),ot(50,5),ot(500,10),ot(500,20),ot(520,20),ot(520,-20),ot(500,-20),ot(500,-10),ot(50,-5),ot(50,-50),ot(-50,-50)]),yt:[Bt(ot(50,0),ot(1,0),!0)],xt:"Some arrows take you with"}},function(){return{gt:Ft(ot(0,-10),.5,ot(0,1)),Mt:Et(Math.PI),target:jt(ot(30,10)),vt:[Kt(ot(20,15),ot(-20,15)),Wt(ot(-20,5),ot(20,5)),...$t([ot(-50,50),ot(50,50),ot(50,-50),ot(-50,-50)])],yt:[],xt:"One way is the only way"}},function(){const t=Et();return{gt:Ft(ot(-30,-40),.5,ot(0,1)),Mt:t,target:jt(ot(30,-40)),vt:$t([ot(-50,50),ot(50,50),ot(50,-50),ot(-50,-50)]),yt:[Bt(ot(-20,10),ot(1,-1))],xt:"Arrows, they shoot"}}]};function Ut(t){const n=Gt;n.ht=n.state,n.state=t,n.ut=0}function zt(t){return t*$/1e3}function Yt(t){return t.toFixed(3)}const qt={KeyW:!1,KeyA:!1,KeyS:!1,KeyD:!1,ArrowLeft:!1,ArrowRight:!1,ShiftLeft:!1,ShiftRight:!1};function Zt(){return qt}function Jt(t,n,e,o){const c=G().H("vp"),r=c.B.target,{G:s}=c.B,a=[[ot(r.x-s.x,r.y+s.y),ot(r.x+s.x,r.y+s.y),gt()],[ot(r.x+s.x,r.y+s.y),ot(r.x+s.x,r.y-s.y),gt()],[ot(r.x+s.x,r.y-s.y),ot(r.x-s.x,r.y-s.y),gt()],[ot(r.x-s.x,r.y-s.y),ot(r.x-s.x,r.y+s.y),gt()]];for(let n=0;n<a.length;n++){const[e,o,c]=a[n];j(t,e,o,c)}const[[u,h,l],[f,d,p],[w,g,M],[v,y,x]]=a;let b,m,k;const S=ft(o,tt);if(l.g>0&&p.g>0)b=ot(p.h.x,l.h.y),m=i(b,t),k="right";else if(p.g>0&&M.g>0)b=ot(p.h.x,M.h.y+S.Y),m=i(b,t),k="right";else if(M.g>0&&x.g>0)b=ot(x.h.x,M.h.y+S.Y),m=i(b,t),k="left";else if(x.g>0&&l.g>0)b=ot(x.h.x,l.h.y),m=i(b,t),k="left";else if(l.g>0)b=ot(Math.min(Math.max(l.h.x,u.x),h.x),l.h.y),m=l.l,k="center";else if(p.g>0)b=ot(p.h.x,Math.max(Math.min(f.y,p.h.y),d.y)),m=p.l,k="right";else if(M.g>0)b=ot(Math.max(Math.min(w.x,M.h.x),g.x),M.h.y+S.Y),m=M.l,k="center";else{if(!(x.g>0))return;b=ot(x.h.x,Math.min(Math.max(v.y,x.h.y),y.y)),m=x.l,k="left"}if(m<.7*((n.x/2+n.y/2)/2))return;const T=c.W.j;T.save(),lt(o,b,k,tt,_,V),T.restore()}J(window,"keydown",t=>{qt[t.code]=!0}),J(window,"keyup",t=>{qt[t.code]=!1});function Qt(t,n){return!!((t,n,o,c,r,s,i,a,u)=>{const h=r-t,l=i/2+o/2-Math.abs(h),f=s-n,d=a/2+c/2-Math.abs(f);if(l<=0)return null;if(d<=0)return null;if(e(u.resolve,0,0),e(u.bt,0,0),e(u.kt,0,0),l<d){const n=h<0?-1:1;u.resolve.x=l*n,u.kt.x=n,u.bt.x=t+o/2*n,u.bt.y=s}else{const t=f<0?-1:1;u.resolve.y=d*t,u.kt.y=t,u.bt.x=r,u.bt.y=n+c/2*t}return u})(t.nt.t.x,t.nt.t.y,t.st.x,t.st.y,n.t.x,n.t.y,n.width,n.height,{resolve:ot(),bt:ot(),kt:ot()})}let Vt=0,Xt=[];const _t=()=>{Vt=0,Xt.length=0},tn=G(),nn=tn.C([{T:"fps",St:60}]),en=t=>{if(!mt.has("debug"))return;ht(t.H("fps").St.toFixed(2),ot(100,0),"right",tt,V)};function on(t){tn.data(nn,"fps").St=t}function cn(t){const n=G().H("vp"),e=n.W.j,{x:o,y:c}=t.nt.t,r=t.st.x/2,s=t.st.x/4,i=n.$/64,a=t.st.y/i,u=r*Math.SQRT2,h=i*Math.SQRT2/2;e.save(),e.fillStyle=V,e.strokeStyle=V;const l=bt(t.it);e.translate(rt(o,"x"),rt(c,"y")),e.rotate(l-Math.PI/2),rn(e,a,i,u,0,0-s+h,Math.PI/4),rn(e,a,i,u,0,0+s-h,-Math.PI/4),e.restore()}function rn(t,n,e,o,c,r,s){for(let i=0;i<n;i+=2){t.save(),t.translate(ct(r),ct(c+i*e)),t.rotate(s);(i<Math.floor(n/4)?t.strokeRect:t.fillRect).call(t,ct(0-o/2),ct(0),ct(o),ct(e)),t.restore()}}function sn(t,o,c){const r=c.nt.t,s=(c.st.y,c.st.x/2),i=ot(r.x,r.y+s),a=ot(r.x,r.y-s),u=bt(c.it);wt(i,i,r,u),wt(a,a,r,u);const h=ot(),l=R(o.i,o.t,i,a,h),f=gt();if(j(o.i,i,a,f),l&&f.g<0&&(n(o.t,c.nt.t),n(o.i,o.t),e(o.o,5*c.it.x,5*c.it.y),c.at)){t.ot=o}}const an="--ctrlDisplay";function un(t,n){z(":root").style.setProperty(t,n)}const hn={Tt:()=>{},Ot:()=>{}},ln={At:!1,move:t(),rotate:ot()};function fn(){const t=z("#btn-boost"),n=z("#btn-reset"),e=z("#stick-move"),o=z("#stick-move .ui-nub"),c=z("#stick-rotate"),r=z("#stick-rotate .ui-nub"),s=pn(e,o,ln.move),i=pn(c,r,ln.rotate),a=function(t,n){const e=J(t,"mouseup",t=>{t.preventDefault(),n()}),o=J(t,"touchstart",t=>{t.preventDefault()}),c=J(t,"touchend",t=>{n()});return()=>{e(),o(),c()}}(n,()=>{hn.Tt()}),u=J(t,"mousedown",()=>{ln.At=!0}),h=J(t,"mouseup",()=>{ln.At=!1}),l=J(t,"touchstart",()=>{ln.At=!0}),f=J(t,"touchend",()=>{ln.At=!1});hn.Ot=()=>{u(),h(),l(),f(),a(),s(),i()}}function dn(){un(an,"none")}function pn(n,e,o){const c=t(),r=t(),s=J(n,"touchstart",t=>{t.preventDefault();const e=t.targetTouches[0];c.x=e.screenX,c.y=e.screenY;const o=n.getBoundingClientRect();r.x=o.width,r.y=o.height}),i=J(n,"touchmove",t=>{t.preventDefault();const n=t.targetTouches[0],s=n.screenX-c.x,i=-1*(n.screenY-c.y);o.x=s/(r.x/2),o.y=i/(r.y/2),u(o,e)}),a=J(n,"touchend",t=>{t.preventDefault(),c.x=c.y=0,r.x=r.y=0,o.x=o.y=0,u(o,e)});function u(t,n){const e=(t.x+1)/2*100,o=-(t.y-1)/2*100,c=Math.max(Math.min(e,100),0),r=Math.max(Math.min(o,100),0);n.style.setProperty("--leftPct",c+"%"),n.style.setProperty("--topPct",r+"%")}return()=>{s(),i(),a(),c.x=c.y=0,r.x=r.y=0,o.x=o.y=0,u(o,e)}}function wn(){}!async function(){await async function(){}();const t=G();pt(),function(){const t=ct(G().H("vp").B.G.y),n=2*t,{fontSize:e}=ft("M",tt,nt);un("--yellowRGBA",V),un("--blackRGBA",_),un("--bodyFontSize",e),un("--ctrlPanelHeight",t+"px"),un("--ctrlPanelTop",n+"px")}();const r=[],i=[];r.push(t=>{at()});const l=t.H("vp");r.push((function(t,n){switch(Gt.state){case"boot":{Pt();let t=10;t-=lt("SIGNAL DECAY",ot(0,t),"center",20,V,Q,et),t-=5,lt("a js13k entry by\nDrew Petersen",ot(0,t),"center",tt,V),t-=20,lt("TAP OR CLICK TO START",ot(0,t),"center",tt,V,Q,et),ut();break}case"tutorial":{Dt();let t=50;const n=-45;t-=5,t-=lt(["Be the best signalmancer in the galaxy!","","Help messages from deep space colonies bounce their","way to their targets as quickly as possible."].join("\n"),ot(n,t),"left",tt,V),t-=5,t-=lt("CONTROLS (KEYBOARD)",ot(n,t),"left",tt,V,Q,et),t-=5,t-=lt(["WASD:  move","Hold any SHIFT to boost","","Arrow Left / Arrow Right: rotate the Deflector"].join("\n"),ot(n,t),"left",tt,V),t-=5,t-=lt("CONTROLS (TOUCH)",ot(n,t),"left",tt,V,Q,et),t-=5,t-=lt(["Left Stick:  move","Move stick and hold BOOST to boost","","Right Stick: rotate the Deflector"].join("\n"),ot(n,t),"left",tt,V),t-=5,t-=lt("TAP OR CLICK TO CONTINUE",ot(0,t),"center",tt,V,Q,et),ut();break}case"level":{if(!Gt.lt)break;const{target:t,Mt:n,gt:e,vt:o,yt:r}=Gt.lt;Pt(),function(t,n){const e=G().H("vp").W.j,{x:o,y:c}=t.nt.t,r=t.st.x/2,s=t.st.y/2;e.save(),e.fillStyle=V,e.translate(rt(o,"x"),rt(c,"y")),e.fillRect(0-ct(r),0-ct(s),ct(t.st.x),ct(t.st.y)),e.restore()}(t),function(t){const n=G().H("vp"),e=n.W.j,{x:o,y:c,angle:r,V:s,J:i,X:a,p1:u}=kt(t,n);e.save(),e.fillStyle=V,e.translate(rt(o,"x"),rt(c,"y")),e.rotate(Math.PI/2+r),e.fillRect(0-ct(i),0-ct(s),ct(t.width),ct(t.height)),e.restore()}(n),function(t,n){const e=G().H("vp"),o=e.W.j,{t:r,i:i,width:h,height:l}=t,f=h/2,d=l/2,p=rt(i.x+1*(r.x-i.x),"x"),w=rt(i.y+1*(r.y-i.y),"y"),g=ct(h),M=ct(l);o.save();{const t=c(ot(),r,i),n=u(t,t),a=s(n,n,10*e.$);o.lineWidth=ct(1),o.strokeStyle=X,o.setLineDash([ct(1),ct(3)]),o.beginPath(),o.moveTo(p,w),o.lineTo(p+ct(a.x),w+ct(a.y)),o.stroke(),o.setLineDash([])}{const t=f/8,n=c(ot(),r,i),e=a(n)/t,h=u(n,n);o.fillStyle="rgba(255,255,132,0.1)";const l=ot();for(let n=0;n<e;n++)s(l,h,n*t),o.fillRect(p-ct(l.x)-ct(f),w-ct(l.y)-ct(d),g,M)}o.fillStyle=V,o.fillRect(p-ct(f),w-ct(d),g,M),o.restore()}(e),function(t){for(let n=0;n<t.length;n++)cn(t[n])}(r),function(t){const{W:{j:n}}=G().H("vp");n.save(),n.strokeStyle=V,n.lineWidth=ct(1);for(let e=0;e<t.length;e++){const o=t[e];o.et?n.setLineDash([ct(1),ct(2)]):n.setLineDash([]),n.beginPath(),n.moveTo(rt(o._.x,"x"),rt(o._.y,"y")),n.lineTo(rt(o.tt.x,"x"),rt(o.tt.y,"y")),n.closePath(),n.stroke()}n.restore()}(o),ut(),function(t,n){const e=G().H("vp");if(!t.lt)return;ht(Yt(zt(t.ut)),ot(e.$/2,-1),"center",tt,V),ht(`MISSION ${t.level+1}: ${t.lt.xt.toUpperCase()}`,ot(e.B.G.x,2*-e.B.G.y),"center",tt,V,Q,et),Jt(t.lt.target.nt.t,t.lt.target.st,0,"TARGET"),Jt(t.lt.gt.t,ot(t.lt.gt.width,t.lt.gt.height),0,"SIGNAL")}(Gt);break}case"win":{Dt();const t=Yt(zt(Gt.ft[Gt.level]));let n=10;n-=lt("MISSION SUCCESS",ot(0,n),"center",20,V,Q,et),n-=5,n-=lt(t+"s",ot(0,n),"center",tt,V,Q,nt),n-=10,n-=lt("Finding the next signal in\nneed of assistance...",ot(0,n),"center",tt,V,Q,nt),ut();break}case"nextlevel":break;case"thanks":{Dt();let t=45;t-=lt("ALL SIGNALS MADE IT,\nTHANKS TO YOU!",ot(0,t),"center",tt,V,Q,et);let n=0;t-=5;for(let e=0;e<Gt.ft.length;e++){const o=Gt.ft[e];n+=o,lt(`MISSION ${e+1}:`,ot(-45,t),"left",tt,V,Q,et),t-=lt(Yt(zt(o))+"s:",ot(45,t),"right",tt,V,Q,et)}const e=Yt(zt(n));t-=5,t-=lt(`TOTAL: ${e}s`,ot(45,t),"right",tt,V,Q,et),ut(),0===Gt.ut&&(un("--thanksDisplay","block"),function(t){const n=`I prevented Signal Decay in ${t}s!`,e=new URLSearchParams;e.append("text",n),e.append("url","https://kirbysayshi.com/js13k-2020"),e.append("hashtags",["js13k"].join(",")),z("#btn-tweet").setAttribute("href","https://twitter.com/intent/tweet?"+e.toString())}(e));break}}})),i.push((t,c)=>{switch(Gt.state){case"boot":if(0===Gt.ut){dn();const n=J(t.H("vp").W.F,"click",()=>{n(),_t(),Ut("tutorial")})}break;case"tutorial":if(0===Gt.ut){dn();const n=J(t.H("vp").W.F,"click",()=>{n(),_t(),Ut("nextlevel")})}break;case"level":{if(0===Gt.ut){const t=Gt.wt[Gt.level];if(!t)return Ut("thanks");Gt.lt=t(),un(an,"flex"),fn(),i=()=>{Gt.lt=t()},hn.Tt=i}if(!Gt.lt)break;const{target:t,Mt:r,gt:s,yt:a,vt:u}=Gt.lt,f=ln,d=Zt();d.ArrowLeft&&(r.Z+=.1),d.ArrowRight&&function(t){t.Z-=.1}(r);const p=0!==f.rotate.x&&0!==f.rotate.y,w=bt(f.rotate);p&&function(t,n){t.Z=n}(r,w);const g=ot();let M=0;d.KeyW&&d.KeyD?M=Math.PI/4:d.KeyW&&d.KeyA?M=Math.PI*(3/4):d.KeyS&&d.KeyD?M=-Math.PI/4:d.KeyS&&d.KeyA?M=-Math.PI*(3/4):d.KeyW?M=Math.PI/2:d.KeyA?M=Math.PI:d.KeyS?M=-Math.PI/2:d.KeyD&&(M=0);const v=0!==f.move.x&&0!==f.move.y,y=bt(f.move),x=d.ShiftLeft||d.ShiftRight||f.At?ot(1,0):ot(.2,0);v&&(M=y);const b=wt(ot(),x,g,M);v&&e(b,b.x*Math.abs(f.move.x),b.y*Math.abs(f.move.y));if((0!==M||0===M&&d.KeyD||v)&&!Gt.ot&&function(t,n){o(t.nt.o,t.nt.o,n)}(r,b),((t,n)=>{const e=(t.i.x-t.t.x)*n,o=(t.i.y-t.t.y)*n;t.i.x=t.t.x+e,t.i.y=t.t.y+o})(r.nt,.8),h(r.nt,c),St(s,r,l,c),function(t,n,e){for(let o=0;o<e.length;o++)sn(t,n,e[o])}(Gt,s,a),function(t,n,e){for(let o=0;o<t.length;o++){const c=t[o];Nt(n,n.width/2,c,e),Ht(n,n.width/2,c)}}(u,s,Gt),O(r.nt),Gt.ot&&(n(r.nt.t,Gt.ot.t),n(r.nt.i,Gt.ot.t)),it(r.nt.t),Gt.rt){const t=Gt;t.ot=null,t.rt=!1}if(Qt(t,s)){const t=Gt;return t.ft[t.level]=t.ut,t.lt=null,t.ot=null,t.dt=-1,t.rt=!1,hn.Ot(),it(ot(0,0)),Ut("win")}break}case"win":{it(ot(0,0));const t=3e3;0===Gt.ut&&(dn(),r=()=>Ut("nextlevel"),s=t,Xt.push({id:++Vt,action:r,delay:s,Lt:0}));break}case"nextlevel":return Gt.level+=1,Ut("level");case"thanks":dn(),it(ot(0,0))}var r,s,i;Gt.ut+=1}),r.push(en);const{stop:f}=(({Rt:t,Ct:n,Dt:e,update:o,It:c=10,Pt:r=(()=>{}),Nt:s=(()=>{})})=>{const i=window.performance,a=t,u=n,h=i.now.bind(i),l=window.requestAnimationFrame.bind(window);let f=0,d=null,p=h(),w=h(),g=0,M=60;return function t(){const n=h();d=l(t),f+=n-p,p=n;let i=f-a>=0,v=Math.floor(f/u);if(v>=c)return f=0,p=h(),void r();for(;v-- >0;)f-=u,o(u);i&&e(f/a),g+=1,w+1e3<=n&&(M=.25*g+.75*M,g=0,w=n,s(M))}(),{stop:()=>{d&&cancelAnimationFrame(d)}}})({Rt:16.6666666,Ct:$,update:n=>{((t=1)=>{Xt.slice().forEach((n,e)=>{n.Lt+=t,n.Lt>=n.delay&&(Xt.splice(e,1),n.action(n.delay,n.Lt))})})(n),i.forEach(e=>e(t,n)),t.P()},Dt:n=>{r.forEach(e=>e(t,n))},Pt:wn,Nt:on})}()}();