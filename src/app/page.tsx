"use client";
import {useEffect,useRef,useState} from "react";

type Cat={name:string;personality:string;fur:string;shadow:string;cream:string;eyes:string;accent:string;item:"bow"|"scarf"|"flower"|"hat";pitch:[number,number];length:[number,number];double:number;purr:number;rumble:number};
const cats:Cat[]=[
{name:"Mochi",personality:"the daydreamer",fur:"#f2c4bd",shadow:"#d99595",cream:"#ffe7d8",eyes:"#56444e",accent:"#d98298",item:"bow",pitch:[610,770],length:[.42,.68],double:.12,purr:.48,rumble:118},
{name:"Pippin",personality:"the chatterbox",fur:"#e5e0d7",shadow:"#beb5b2",cream:"#fff7e8",eyes:"#52666d",accent:"#9dc7bd",item:"scarf",pitch:[760,980],length:[.22,.36],double:.72,purr:.18,rumble:142},
{name:"Peaches",personality:"the sunbeam",fur:"#efbd7a",shadow:"#ce8758",cream:"#ffe5a8",eyes:"#63463d",accent:"#e9a755",item:"flower",pitch:[560,850],length:[.28,.53],double:.4,purr:.34,rumble:132},
{name:"Biscuit",personality:"the cozy one",fur:"#b8a2c9",shadow:"#8c749f",cream:"#e4d5ed",eyes:"#50465a",accent:"#d9a7bf",item:"hat",pitch:[360,510],length:[.52,.82],double:.1,purr:.72,rumble:104}];
const notes:[number,number][]=[[659,.48],[784,.48],[880,.7],[784,.48],[659,.48],[587,.68],[523,.48],[587,.82]];
const between=(a:number,b:number)=>a+Math.random()*(b-a);

function tone(ctx:AudioContext,hz:number,duration:number){
 const t=ctx.currentTime,o=ctx.createOscillator(),high=ctx.createOscillator(),f=ctx.createBiquadFilter(),g=ctx.createGain();
 o.type="triangle";high.type="sine";f.type="lowpass";f.frequency.setValueAtTime(1900,t);
 o.frequency.setValueAtTime(hz,t);o.frequency.exponentialRampToValueAtTime(hz*1.5,t+duration*.25);o.frequency.exponentialRampToValueAtTime(hz*.8,t+duration);
 high.frequency.setValueAtTime(hz*2,t);high.frequency.exponentialRampToValueAtTime(hz*2.8,t+duration*.25);high.frequency.exponentialRampToValueAtTime(hz*1.55,t+duration);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.04,t+.04);g.gain.exponentialRampToValueAtTime(.0001,t+duration+.04);
 o.connect(f);high.connect(f);f.connect(g);g.connect(ctx.destination);o.start(t);high.start(t);o.stop(t+duration+.05);high.stop(t+duration+.05);
}
function purrTone(ctx:AudioContext,hz:number,duration:number){
 const t=ctx.currentTime,o=ctx.createOscillator(),f=ctx.createBiquadFilter(),g=ctx.createGain();
 o.type="triangle";o.frequency.setValueAtTime(hz,t);o.frequency.linearRampToValueAtTime(hz*.94,t+duration);f.type="lowpass";f.frequency.setValueAtTime(480,t);g.gain.setValueAtTime(.0001,t);
 for(let i=0;i+.05<duration;i+=.055){const p=t+i;g.gain.setValueAtTime(.003,p);g.gain.linearRampToValueAtTime(.018,p+.025);g.gain.linearRampToValueAtTime(.004,p+.05);}
 g.gain.linearRampToValueAtTime(.0001,t+duration);o.connect(f);f.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+duration+.04);
}
function flute(ctx:AudioContext,bus:GainNode,hz:number,len:number,at:number){
 const o=ctx.createOscillator(),breath=ctx.createOscillator(),v=ctx.createOscillator(),vg=ctx.createGain(),bg=ctx.createGain(),f=ctx.createBiquadFilter(),g=ctx.createGain();
 o.type="sine";breath.type="sine";v.type="sine";o.frequency.setValueAtTime(hz,at);breath.frequency.setValueAtTime(hz*2,at);v.frequency.setValueAtTime(5.1,at);vg.gain.setValueAtTime(2,at);f.type="lowpass";f.frequency.setValueAtTime(2300,at);bg.gain.setValueAtTime(.08,at);
 g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(.012,at+.1);g.gain.setValueAtTime(.012,at+len*.72);g.gain.exponentialRampToValueAtTime(.0001,at+len);
 v.connect(vg);vg.connect(o.frequency);o.connect(f);breath.connect(bg);bg.connect(f);f.connect(g);g.connect(bus);o.start(at);breath.start(at);v.start(at);o.stop(at+len+.03);breath.stop(at+len+.03);v.stop(at+len+.03);
}
function Kitty({cat,soft}:{cat:Cat;soft:boolean}){
 return <svg className="kitty" viewBox="0 0 300 300" aria-hidden="true">
  <ellipse cx="150" cy="259" rx="85" ry="11" fill="#ae9183" opacity=".24"/>
  <g className="tail"><path d="M214 212h22v18h-12v18h-18v-18h8z" fill={cat.shadow}/><path d="M214 212h16v18h-12v12h-8v-12h4z" fill={cat.fur}/></g>
  <path d="M75 207v-20h12v-18h24v-10h78v10h24v18h12v34h-12v19H87v-19H75z" fill={cat.shadow}/>
  <path d="M81 205v-18h12v-14h24v-8h66v8h24v14h12v30h-12v18H93v-18H81z" fill={cat.fur}/>
  <rect x="108" y="218" width="30" height="17" fill={cat.cream}/><rect x="162" y="218" width="30" height="17" fill={cat.cream}/>
  <path d="M78 114V78h12V60h18V48h24v12h12v12h24V60h12V48h24v12h18v18h12v90h-12v18h-18v12H96v-12H78v-18H66v-42h12z" fill={cat.shadow}/>
  <path d="M84 114V84h12V66h18V54h12v18h18v12h24V72h18V54h12v12h18v18h12v84h-12v18h-18v12h-72v-12H96v-18H84v-42z" fill={cat.fur}/>
  <rect x="108" y="78" width="24" height="6" fill={cat.cream} opacity=".75"/><rect x="96" y="90" width="6" height="18" fill={cat.cream} opacity=".65"/>
  {cat.item==="bow"&&<g><path d="M108 72 90 54v24l18 8 12-8 18 8V62l-18 10z" fill={cat.accent}/><rect x="108" y="68" width="12" height="12" fill={cat.shadow}/></g>}
  {cat.item==="scarf"&&<g><path d="M84 184h132v12H84zM180 190h18v30h-12v-6h-6z" fill={cat.accent}/><rect x="102" y="184" width="72" height="6" fill={cat.cream}/></g>}
  {cat.item==="flower"&&<g><rect x="186" y="54" width="12" height="12" fill={cat.accent}/><rect x="198" y="66" width="12" height="12" fill={cat.accent}/><rect x="174" y="66" width="12" height="12" fill={cat.accent}/><rect x="186" y="78" width="12" height="12" fill={cat.accent}/><rect x="186" y="66" width="12" height="12" fill="#ffe7a3"/></g>}
  {cat.item==="hat"&&<g><path d="M96 84 120 54h60l24 30v6H96z" fill={cat.accent}/><rect x="90" y="84" width="120" height="12" fill={cat.shadow}/><rect x="132" y="66" width="36" height="6" fill={cat.cream}/></g>}
  <g className={soft?"open-eyes hidden":"open-eyes"}><rect x="108" y="132" width="12" height="18" fill={cat.eyes}/><rect x="180" y="132" width="12" height="18" fill={cat.eyes}/><rect x="108" y="132" width="6" height="6" fill="#fffaf3"/><rect x="180" y="132" width="6" height="6" fill="#fffaf3"/></g>
  <g className={soft?"closed-eyes":"closed-eyes hidden"}><path d="M102 144h6v6h12v-6h6v6h-6v6h-12v-6h-6zM174 144h6v6h12v-6h6v6h-6v6h-12v-6h-6z" fill={cat.eyes}/></g>
  <rect x="96" y="162" width="18" height="6" fill="#e995a3" opacity=".45"/><rect x="186" y="162" width="18" height="6" fill="#e995a3" opacity=".45"/>
  <rect x="138" y="156" width="12" height="6" fill={cat.cream}/><rect x="150" y="156" width="12" height="6" fill={cat.cream}/><path d="M144 156h12v6h-6v6h-6z" fill="#d4798e"/>
  <path className={soft?"mouth-open hidden":"mouth-open"} d="M150 168v6h-6v6h-6v-6h6v-6zM150 174h6v-6h6v6h-6v6h6v6h-6v-6h-6z" fill={cat.eyes}/>
  <path className={soft?"mouth-curl":"mouth-curl hidden"} d="M144 168h12v6h-6v6h-6zM138 180h6v6h-6zM156 180h6v6h-6z" fill={cat.eyes}/>
 </svg>;
}

export default function Home(){
 const [idx,setIdx]=useState(0),[left,setLeft]=useState(15),[soft,setSoft]=useState(false),[sound,setSound]=useState(false);
 const ctx=useRef<AudioContext|null>(null),music=useRef<GainNode|null>(null),loop=useRef<number|undefined>(undefined),soundRef=useRef(false),idxRef=useRef(0),last=useRef(0),cat=cats[idx],progress=(15-left)/15*100;
 function choose(i:number){const n=(i+cats.length)%cats.length;idxRef.current=n;setIdx(n);setLeft(15);setSoft(false);}
 useEffect(()=>{const end=Date.now()+15000;const ticks=window.setInterval(()=>setLeft(Math.max(0,Math.ceil((end-Date.now())/1000))),250);const rotate=window.setTimeout(()=>{const n=(idxRef.current+1)%cats.length;idxRef.current=n;setIdx(n);setLeft(15);setSoft(false);},15000);return()=>{window.clearInterval(ticks);window.clearTimeout(rotate);};},[idx]);
 useEffect(()=>()=>{if(loop.current!==undefined)window.clearTimeout(loop.current);void ctx.current?.close();},[]);
 function hello(){const a=ctx.current,t=a?.currentTime??0;if(!soundRef.current||!a||a.state!=="running"||t-last.current<.5)return;last.current=t;const n=idxRef.current,v=cats[n],hz=between(...v.pitch),len=between(...v.length);tone(a,hz,len);const doubled=Math.random()<v.double;if(doubled)window.setTimeout(()=>{if(soundRef.current&&idxRef.current===n)tone(a,hz*between(1.08,1.2),len*.72);},Math.max(120,len*420));if(Math.random()<v.purr)window.setTimeout(()=>{if(soundRef.current&&idxRef.current===n)purrTone(a,v.rumble,between(.7,1.05));},Math.max(320,len*(doubled?900:650)));}
 async function toggleSound(){if(soundRef.current){soundRef.current=false;setSound(false);if(loop.current!==undefined)window.clearTimeout(loop.current);if(music.current&&ctx.current){const t=ctx.current.currentTime;music.current.gain.cancelScheduledValues(t);music.current.gain.setTargetAtTime(.0001,t,.16);}return;}const C=window.AudioContext||(window as Window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!C)return;const a=ctx.current??new C();ctx.current=a;try{await a.resume();}catch{return;}if(a.state!=="running")return;soundRef.current=true;setSound(true);if(!music.current){music.current=a.createGain();music.current.connect(a.destination);}const b=music.current,t=a.currentTime;b.gain.cancelScheduledValues(t);b.gain.setValueAtTime(.0001,t);b.gain.exponentialRampToValueAtTime(.5,t+.8);const phrase=()=>{if(!soundRef.current||!music.current)return;let offset=0;for(const [hz,d]of notes){flute(a,music.current,hz,d,a.currentTime+.08+offset);offset+=d+.09;}loop.current=window.setTimeout(phrase,(offset+1.2)*1000);};phrase();}
 return <main className="page-shell">
  <header className="header"><a className="brand" href="#" aria-label="Little Nuzzle home"><span>✿</span> little nuzzle</a><div className="tag"><i/> a tiny pocket of calm</div></header>
  <section className="welcome"><p className="eyebrow">a little garden of friends</p><h1>Meet your <span>newest</span> little love.</h1><p>A tiny pixel pal is here to keep you company.<br/>Come say hello and see what happens.</p></section>
  <section className="card" aria-label="Meet the pixel kittens"><div className="scene"><div className="sky" aria-hidden="true"><i className="sun"/><i className="cloud c1"/><i className="cloud c2"/><b>✦</b><em>✧</em><small>✦</small></div><div className="ground" aria-hidden="true"><span>✿</span><span>✿</span></div>
   <button className={"cat-button"+(soft?" soft":"")} aria-label={"Nuzzle "+cat.name+", "+cat.personality} onPointerEnter={()=>{setSoft(true);hello();}} onFocus={()=>{setSoft(true);hello();}} onPointerLeave={()=>setSoft(false)} onBlur={()=>setSoft(false)} onPointerDown={()=>setSoft(true)} onPointerUp={()=>setSoft(false)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")setSoft(true);}} onKeyUp={()=>setSoft(false)}><span className="glow"/><Kitty cat={cat} soft={soft}/></button>
   <div className="caption" aria-live="polite"><b>{cat.name}</b><span>·</span>{cat.personality}</div><div className="tip">hover to nuzzle</div></div>
   <div className="card-footer"><div className="message"><span>♡</span>{cat.name==="Pippin"?"A bright little chirp":cat.name==="Biscuit"?"A sleepy little mrrp":cat.name==="Peaches"?"A happy little hello":"A soft little hello"}</div><div className="timer"><div><span>your next friend</span><span>{left}s</span></div><div className="track"><i style={{width:String(progress)+"%"}}/></div></div></div>
  </section>
  <nav className="controls" aria-label="Choose a kitten"><button className="arrow" aria-label="Previous kitten" onClick={()=>choose(idx-1)}>←</button><div className="dots">{cats.map((c,i)=><button key={c.name} className={i===idx?"dot active":"dot"} aria-label={"Meet "+c.name} aria-pressed={i===idx} onClick={()=>choose(i)}><span/></button>)}</div><button className="arrow" aria-label="Next kitten" onClick={()=>choose(idx+1)}>→</button></nav>
  <div className="sound-area"><button className={"sound-button"+(sound?" on":"")} aria-pressed={sound} onClick={toggleSound}><span>{sound?"♫":"♪"}</span>{sound?"Sounds on · click to hush":"Turn on the sounds"}</button><p aria-live="polite">{sound?"A soft flute tune and each kitten’s own hello.":"A gentle flute tune and tiny meows, whenever you like."}</p></div>
  <footer>made for a softer moment <span>✦</span></footer>
 </main>;
}
