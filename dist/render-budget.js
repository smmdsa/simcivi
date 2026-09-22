export const DRAW_LIMITS={cells:23000,bones:4096,animals:4096};
export const TIERS=[
 {name:'Cinemática',cells:23000,plants:12000,dpr:1.5,pixels:3200000,environment:.18,clouds:1},
 {name:'Equilibrada',cells:15000,plants:8000,dpr:1.15,pixels:2100000,environment:.24,clouds:.65},
 {name:'Fluida',cells:9500,plants:4500,dpr:.85,pixels:1300000,environment:.32,clouds:0}
];
export function pixelRatio(width,height,dpr,tier){const t=TIERS[tier];return Math.min(dpr,t.dpr,Math.sqrt(t.pixels/Math.max(1,width*height)));}
export function lodLevel(pixels,previous=2,quality=0){if(quality===0&&pixels>(previous===0?36:46))return 0;if(pixels>(previous<2?11:15))return 1;return 2;}
export class FrameBudget {
 constructor(){this.samples=[];this.clock=0;this.cooldown=0;this.p95=0;this.p99=0;this.fps=0;}
 add(milliseconds,dt,tier,automatic=true){if(!Number.isFinite(milliseconds)||milliseconds<=0)return tier;this.samples.push(milliseconds);if(this.samples.length>180)this.samples.shift();this.clock+=dt;this.cooldown+=dt;if(this.clock<2||this.samples.length<30)return tier;this.clock=0;const a=[...this.samples].sort((x,y)=>x-y);this.p95=a[Math.floor(a.length*.95)];this.p99=a[Math.floor(a.length*.99)];this.fps=1000/(a.reduce((s,n)=>s+n,0)/a.length);if(!automatic)return tier;
 if(this.cooldown>6&&(this.p95>21||this.fps<53)&&tier<2){this.cooldown=0;this.samples=[];return tier+1;}
 if(this.cooldown>35&&this.p95<17.4&&this.fps>58.5&&tier>0){this.cooldown=0;this.samples=[];return tier-1;}return tier;
 }
 reset(){this.samples=[];this.clock=0;this.cooldown=0;}
}
export class GpuTimer {
 constructor(renderer){this.gl=renderer.getContext?.();this.ext=this.gl?.getExtension('EXT_disjoint_timer_query_webgl2');this.pending=[];this.active=null;this.ms=null;}
 begin(){if(!this.ext)return;const gl=this.gl,e=this.ext;if(gl.getParameter(e.GPU_DISJOINT_EXT)){for(const q of this.pending)gl.deleteQuery(q);this.pending=[];this.ms=null;return;}
 while(this.pending.length&&gl.getQueryParameter(this.pending[0],gl.QUERY_RESULT_AVAILABLE)){const q=this.pending.shift(),ms=gl.getQueryParameter(q,gl.QUERY_RESULT)/1e6;if(Number.isFinite(ms))this.ms=ms;gl.deleteQuery(q);}
 if(this.pending.length>=4)return;this.active=gl.createQuery();if(this.active)gl.beginQuery(e.TIME_ELAPSED_EXT,this.active);
 }
 end(){if(!this.active)return;this.gl.endQuery(this.ext.TIME_ELAPSED_EXT);this.pending.push(this.active);this.active=null;}
 dispose(){if(this.active)this.end();for(const q of this.pending)this.gl.deleteQuery(q);this.pending=[];}
}
