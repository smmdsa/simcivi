import {PLANET_RADIUS as R,HALF,POLE,YEAR,clamp,wrap,normal,geography,move,sunDirection,SOLAR_DAY,CONTINENTS} from './planet.js';
// Equal-area atmospheric cells. Water quantities are model units, not Earth millimetres.
export const ENV_WIDTH=32,ENV_HEIGHT=16,ENV_STEP=1;
const N=ENV_WIDTH*ENV_HEIGHT;
export function seasonAt(z,time){const q=Math.floor(((time/YEAR)%1+1)%1*4);return(z>=0?['Primavera','Verano','Otoño','Invierno']:['Otoño','Invierno','Primavera','Verano'])[q];}
export function saturation(t){return .30*Math.exp(.043*(t-15));}
export function thermalTarget(g,light,cloud,cover=0){return 14-12*g.latitude-g.height*1.1+28*light*(1-.38*cloud)-cover*1.1+cloud*1.2;}
export class Environment {
 constructor(sim,saved){this.sim=sim;this.time=saved?.time??sim.time;this.siteCache=new Map();this.clock=saved?.clock??0;this.revision=saved?.revision??0;this.noticeAt=saved?.noticeAt??0;this.windClock=saved?.windClock??0;this.totals={evaporated:0,precipitated:0,runoff:0,...saved?.totals};
  this.geo=Array.from({length:N},(_,i)=>{const row=Math.floor(i/ENV_WIDTH),col=i%ENV_WIDTH,x=(col+.5)/ENV_WIDTH*2*HALF-HALF,z=Math.asin((row+.5)/ENV_HEIGHT*2-1)*R,g=geography(x,z),n=normal(x,z);let sea=0;for(let k=0;k<8;k++){const p=move(x,z,Math.sin(k*Math.PI/4)*6,Math.cos(k*Math.PI/4)*6);if(!geography(p.x,p.z).land)sea++;}return{...g,x,z,n,sea:g.water?1:sea/8,neighbors:[row*ENV_WIDTH+(col+1)%ENV_WIDTH,row*ENV_WIDTH+(col+ENV_WIDTH-1)%ENV_WIDTH,Math.min(ENV_HEIGHT-1,row+1)*ENV_WIDTH+col,Math.max(0,row-1)*ENV_WIDTH+col]};});
  const valid=saved?.cells?.length===N&&saved.cells.every(c=>['temperature','soil','vapor','cloud','ocean','rain','east','north'].every(k=>Number.isFinite(c[k])));
  this.cells=valid?saved.cells.map(c=>({...c})):this.geo.map(g=>{const temperature=thermalTarget(g,.32,.2);return{temperature,soil:g.water?.9:clamp(g.moisture,.25,.85),vapor:saturation(temperature)*(.74+.12*Math.sin(g.x*.05+sim.worldSeed%31)),cloud:.025,ocean:g.water?200:0,rain:0,east:0,north:0,pressure:1013,cover:0,nutrients:0};});
  this.sunlight=new Float64Array(N);this.heat=new Float64Array(N);this.vaporDelta=new Float64Array(N);this.cloudDelta=new Float64Array(N);this.waterDelta=new Float64Array(N);this.summary=saved?.summary??{};this.summarize();
 }
 index(x,z){const col=Math.floor((wrap(x)+HALF)/(2*HALF)*ENV_WIDTH)%ENV_WIDTH,row=clamp(Math.floor((Math.sin(clamp(z,-POLE,POLE)/R)+1)*.5*ENV_HEIGHT),0,ENV_HEIGHT-1);return row*ENV_WIDTH+col;}
 snapshot(){return{time:this.time,clock:this.clock,revision:this.revision,noticeAt:this.noticeAt,windClock:this.windClock,totals:this.totals,cells:this.cells,summary:this.summary};}
 accept(saved){if(!saved)return;this.time=saved.time;this.clock=saved.clock;this.revision=saved.revision;this.noticeAt=saved.noticeAt;this.windClock=saved.windClock;this.totals=saved.totals;this.cells=saved.cells;this.summary=saved.summary;}
 // Bilinear sampling in longitude and sin(latitude); the longitude seam wraps.
 sample(x,z,time=this.sim.time){
  const key=x+','+z;let site=this.siteCache.get(key);
  if(!site){const u=(wrap(x)+HALF)/(2*HALF)*ENV_WIDTH-.5,v=clamp((Math.sin(clamp(z,-POLE,POLE)/R)+1)*.5*ENV_HEIGHT-.5,0,ENV_HEIGHT-1),a=Math.floor(u),b=Math.floor(v),fx=u-a,fy=v-b;site={g:geography(x,z),n:normal(x,z),indices:[],weights:[]};for(let j=0;j<2;j++)for(let k=0;k<2;k++){site.indices.push(Math.min(ENV_HEIGHT-1,b+j)*ENV_WIDTH+((a+k)%ENV_WIDTH+ENV_WIDTH)%ENV_WIDTH);site.weights.push((k?fx:1-fx)*(j?fy:1-fy));}if(this.siteCache.size>=8192)this.siteCache.clear();this.siteCache.set(key,site);}
  let temperature=0,soil=0,vapor=0,condensate=0,rain=0,east=0,north=0,pressure=0,cover=0,nutrients=0;
  for(let i=0;i<4;i++){const c=this.cells[site.indices[i]],w=site.weights[i];temperature+=c.temperature*w;soil+=c.soil*w;vapor+=c.vapor*w;condensate+=c.cloud*w;rain+=c.rain*w;east+=c.east*w;north+=c.north*w;pressure+=c.pressure*w;cover+=c.cover*w;nutrients+=c.nutrients*w;}
  if(this.solarTime!==time){this.solarTime=time;this.solar=sunDirection(time);}const g=site.g,n=site.n,sun=this.solar,incidence=n.x*sun.x+n.y*sun.y+n.z*sun.z,humidity=clamp(vapor/saturation(temperature),0,1),moisture=g.water?Math.max(.6,soil):clamp(soil+(g.riverDistance<2?.08:0),0,1),cloud=clamp(condensate/.12,0,1),light=clamp(incidence*1.35,0,1)*(1-cloud*.38),fertility=clamp(.30+.4*g.moisture+nutrients/(35+nutrients)*.3,0,1);
  return{...g,temperature,moisture,humidity,cloud,rain,windEast:east,windNorth:north,wind:Math.hypot(east,north),pressure,cover,fertility,light,incidence,daylight:incidence>0,phase:incidence>.18?'Día':incidence>-.13?'Crepúsculo':'Noche',localHour:((time/SOLAR_DAY*24-x/HALF*12+12)%24+24)%24,season:seasonAt(z,time),weather:rain>.008?'Lluvia':moisture<.20?'Sequía':temperature<8?'Frío':temperature>32?'Calor':cloud>.5?'Nublado':'Calma'};
 }

 tick(dt){this.clock+=dt;if(this.clock+1e-9<ENV_STEP)return;this.clock-=ENV_STEP;this.advance(ENV_STEP,this.sim.time);}
 advance(dt,time){this.time=time;const {cells,geo}=this,sun=sunDirection(time);this.revision++;
  for(const c of cells){c.cover=0;c.nutrients=0;}
  for(const p of this.sim.food){if(!p.recovery?.dormant)cells[this.index(p.x,p.z)].cover+=p.growth*.045;}
  for(const p of this.sim.soil)cells[this.index(p.x,p.z)].nutrients+=p.nutrients;
  for(let i=0;i<N;i++){const c=cells[i],g=geo[i],cloud=clamp(c.cloud/.12,0,1);c.cover=clamp(c.cover,0,1);this.sunlight[i]=clamp((g.n.x*sun.x+g.n.y*sun.y+g.n.z*sun.z)*1.35,0,1);const target=thermalTarget(g,this.sunlight[i],cloud,c.cover),inertia=14+g.sea*90+c.soil*8;
   this.heat[i]=c.temperature+(target-c.temperature)*(1-Math.exp(-dt/inertia));
   c.pressure=1013-(c.temperature-(18-12*g.latitude))*.85;
  }
  this.vaporDelta.fill(0);this.cloudDelta.fill(0);this.waterDelta.fill(0);
  for(let i=0;i<N;i++){const c=cells[i],g=geo[i],[east,west,north,south]=g.neighbors;
   const dx=(cells[west].pressure-cells[east].pressure)*.65,dz=(cells[south].pressure-cells[north].pressure)*.65,rotation=Math.sin(g.z/R)*.55;
   c.east+=(clamp(dx-rotation*dz,-8,8)-c.east)*Math.min(1,dt*.15);c.north+=(clamp(dz+rotation*dx,-8,8)-c.north)*Math.min(1,dt*.15);
   for(const [component,to]of [[c.east,c.east>=0?east:west],[c.north,c.north>=0?north:south]]){const fraction=Math.min(.06,Math.abs(component)*dt*.009);const vapor=c.vapor*fraction,cloud=c.cloud*fraction;this.vaporDelta[i]-=vapor;this.vaporDelta[to]+=vapor;this.cloudDelta[i]-=cloud;this.cloudDelta[to]+=cloud;}
  }
  for(let i=0;i<N;i++){const c=cells[i],g=geo[i];c.temperature=this.heat[i];c.vapor+=this.vaporDelta[i];c.cloud+=this.cloudDelta[i];
   const humidity=clamp(c.vapor/saturation(c.temperature),0,1),wind=Math.hypot(c.east,c.north),potential=dt*.0017*(.3+this.sunlight[i])*(1+Math.max(0,c.temperature-12)*.04)*(1-humidity*.65)*(1+wind*.07)*(1+c.cover*.3),available=g.water?c.ocean:c.soil,evap=Math.min(available,potential);
   if(g.water)c.ocean-=evap;else c.soil-=evap;c.vapor+=evap;c.temperature-=evap*14;this.totals.evaporated+=evap;
   const condensate=Math.max(0,c.vapor-saturation(c.temperature))*(1-Math.exp(-dt*.4));c.vapor-=condensate;c.cloud+=condensate;c.temperature+=condensate*4;
   const dryCloud=Math.min(c.cloud,Math.max(0,saturation(c.temperature)-c.vapor)*.02*dt);c.cloud-=dryCloud;c.vapor+=dryCloud;
   const rain=Math.min(c.cloud,Math.max(0,c.cloud-.009)*dt*.16);c.cloud-=rain;c.rain=rain/dt*10;this.totals.precipitated+=rain;
   if(g.water)c.ocean+=rain;else c.soil+=rain;
   const overflow=Math.max(0,c.soil-1),drain=Math.min(c.soil,dt*.00013*Math.max(0,c.soil-.35)),flow=overflow+drain;let to=i;for(const j of g.neighbors)if(geo[j].height<geo[to].height)to=j;
   if(!g.water&&to!==i&&flow>0){c.soil-=flow;this.waterDelta[to]+=flow;this.totals.runoff+=flow;}
  }
  for(let i=0;i<N;i++){if(geo[i].water)cells[i].ocean+=this.waterDelta[i];else cells[i].soil+=this.waterDelta[i];}
  this.summarize();this.windClock+=dt;if(this.windClock>=30){this.windClock=0;this.sim.recovery?.wind();}
  if(time>=this.noticeAt){this.noticeAt=time+45;const wet=cells.reduce((best,c,i)=>c.rain>cells[best].rain?i:best,0);if(cells[wet].rain>.035){const g=geo[wet];this.sim.log('La condensación trae lluvia a '+CONTINENTS[g.region].name+'.','☂','weather',null,g);}}
 }
 summarize(){let temperature=0,humidity=0,moisture=0,cloud=0,rain=0,fertility=0;for(let i=0;i<N;i++){const c=this.cells[i];fertility+=.30+.4*this.geo[i].moisture+c.nutrients/(35+c.nutrients)*.3;temperature+=c.temperature;humidity+=clamp(c.vapor/saturation(c.temperature),0,1);moisture+=clamp(c.soil,0,1);cloud+=clamp(c.cloud/.12,0,1);rain+=c.rain;}this.summary={temperature:temperature/N,humidity:humidity/N,moisture:moisture/N,cloud:cloud/N,rain:rain/N,fertility:fertility/N};this.sim.climate={temperature:this.summary.temperature,moisture:this.summary.moisture*100,fertility:this.summary.fertility*100};this.sim.rain=this.summary.rain;this.sim.weather=this.summary.rain>.008?'Lluvia':'Calma';}
}
