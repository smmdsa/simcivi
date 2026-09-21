import {clamp,distance} from './planet.js';
import {hash} from './genetics.js';

export const MAX_VARIANTS=3,MAX_BIO_CELLS=512;
export const GUILDS=['Productores','Descomponedores','Microconsumidores'];
const EPS=1e-10;
const total=q=>q.active+q.dormant;
const sum=(group,field='active')=>group.reduce((n,q)=>n+q[field],0);
export function microFitness(genes,e){
 const thermal=clamp(1-(Math.abs(e.temperature-genes.optimum)/genes.breadth)**2,0,1);
 const water=clamp(e.moisture/Math.max(.025,.24*(1-genes.drought)),0,1);
 return thermal*water;
}
export const growthRate=genes=>.009/(1+genes.breadth/24+genes.drought*.7);

// Nutrient-equivalent quotas; sunlight supplies energy, never material.
export class Biosphere {
 constructor(sim,saved){
  this.sim=sim;
  if(saved!==undefined){this.validate(saved);this.accept(structuredClone(saved));return;}
  this.clock=0;this.age=0;this.rng=hash(sim.worldSeed^0x62a93);this.nextId=1;this.noticeAt=0;
  this.totals={produced:0,decomposed:0,consumed:0,mutations:0,dispersed:0,woken:0,slept:0,imported:0,exported:0};
  this.cells=sim.environment.geo.map(()=>({mineral:4,detritus:1,guilds:[0,1,2].map(guild=>{
   const id=this.nextId++;
   return [{id,root:id,parent:null,generation:1,born:sim.time,
    genes:{optimum:14+this.random()*16,breadth:12+this.random()*10,drought:.2+this.random()*.5},
    active:[.08,.04,.01][guild],dormant:[.06,.04,.025][guild],reproduced:0}];
  })}));
  this.initialMass=this.mass();this.summarize();
 }
 random(){let x=this.rng|0;x^=x<<13;x^=x>>>17;x^=x<<5;this.rng=x>>>0||738159;return this.rng/4294967296;}
 validate(s){
  const finite=v=>Number.isFinite(v)&&v>=0;
  const integer=(v,lo,hi)=>Number.isSafeInteger(v)&&v>=lo&&v<=hi;
  const summary=v=>v&&['Sin reservas microscópicas','Reservas latentes','Colonias y red trófica','Colonización microscópica'].includes(v.phase)&&
   ['living','active','dormant','minerals','detritus'].every(k=>finite(v[k]))&&
   ['guildActive','guildDormant'].every(k=>Array.isArray(v[k])&&v[k].length===3&&v[k].every(finite))&&
   integer(v.colonies,0,MAX_BIO_CELLS)&&integer(v.cohorts,0,MAX_BIO_CELLS*3*MAX_VARIANTS)&&integer(v.generation,1,Number.MAX_SAFE_INTEGER)&&
   Array.isArray(v.sites)&&v.sites.length<=12&&v.sites.every(p=>p&&integer(p.cell,0,this.sim.environment.geo.length-1)&&
    finite(p.mass)&&Number.isFinite(p.x)&&Number.isFinite(p.z)&&integer(p.region,0,3)&&typeof p.water==='boolean');
  const cohort=q=>q&&Number.isSafeInteger(q.id)&&q.id>0&&Number.isSafeInteger(q.root)&&q.root>0&&
   (q.parent===null||Number.isSafeInteger(q.parent)&&q.parent>0)&&Number.isSafeInteger(q.generation)&&q.generation>0&&
   ['active','dormant','born','reproduced'].every(k=>finite(q[k]))&&q.genes&&
   Number.isFinite(q.genes.optimum)&&q.genes.optimum>=-10&&q.genes.optimum<=45&&
   q.genes.breadth>=8&&q.genes.breadth<=30&&q.genes.drought>=0&&q.genes.drought<=1;
  if(!s||!Array.isArray(s.cells)||s.cells.length!==this.sim.environment.geo.length||s.cells.length>MAX_BIO_CELLS||
   !['clock','age','initialMass','noticeAt'].every(k=>finite(s[k]))||s.clock>=1||!summary(s.summary)||!Number.isSafeInteger(s.nextId)||s.nextId<1||
   !Number.isSafeInteger(s.rng)||!s.totals||!['produced','decomposed','consumed','mutations','dispersed','woken','slept','imported','exported'].every(k=>finite(s.totals[k]))||
   !s.cells.every(c=>finite(c.mineral)&&finite(c.detritus)&&Array.isArray(c.guilds)&&c.guilds.length===3&&
    c.guilds.every(group=>Array.isArray(group)&&group.length<=MAX_VARIANTS&&group.every(cohort))))
   throw Error('El guardado de la biosfera está incompleto o dañado.');
 }
 snapshot(){return {clock:this.clock,age:this.age,rng:this.rng,nextId:this.nextId,noticeAt:this.noticeAt,
  initialMass:this.initialMass,totals:this.totals,cells:this.cells,summary:this.summary};}
 accept(s){for(const key of ['clock','age','rng','nextId','noticeAt','initialMass','totals','cells','summary'])this[key]=s[key];}
 mass(){return this.cells.reduce((n,c)=>n+c.mineral+c.detritus+c.guilds.reduce((v,g)=>v+g.reduce((m,q)=>m+total(q),0),0),0);}
 expectedMass(){return this.initialMass+this.totals.imported-this.totals.exported;}
 tick(dt){this.clock+=dt;while(this.clock+1e-9>=1){this.clock-=1;if(this.clock<0)this.clock=0;this.advance(1);}}
 advance(dt){
  this.age+=dt;
  for(let i=0;i<this.cells.length;i++){
   const cell=this.cells[i],site=this.sim.environment.geo[i],e=this.sim.environment.sample(site.x,site.z),
    heat=this.sim.geology?.heat(site.x,site.z)||0;
   for(let guild=0;guild<3;guild++){
    const group=cell.guilds[guild];
    for(const q of group){
     const fitness=microFitness(q.genes,e),food=guild===0?cell.mineral:guild===1?cell.detritus:sum(cell.guilds[site.water?0:1]);
     const favorable=fitness>.12&&food>.002;
     if(favorable){const wake=q.dormant*(1-Math.exp(-dt*.006));q.dormant-=wake;q.active+=wake;this.totals.woken+=wake;}
     else{const sleep=q.active*(1-Math.exp(-dt*.025));q.active-=sleep;q.dormant+=sleep;this.totals.slept+=sleep;}
     const demand=q.active*growthRate(q.genes)*fitness*dt;
     let intake=0,gain=0;
     if(guild===0){intake=Math.min(cell.mineral,demand*clamp(e.light,0,1));cell.mineral-=intake;gain=intake;this.totals.produced+=gain;}
     if(guild===1){intake=Math.min(cell.detritus,demand*1.6);cell.detritus-=intake;gain=intake*.35;cell.mineral+=intake-gain;this.totals.decomposed+=intake;}
     if(guild===2){intake=this.consume(cell.guilds[site.water?0:1],demand*2);gain=intake*.28;cell.detritus+=intake-gain;this.totals.consumed+=intake;}
     q.active+=gain*.96;q.dormant+=gain*.04;q.reproduced+=gain;
     const extreme=Math.max(0,e.temperature-48,-25-e.temperature)*.001+heat*.06;
     const activeLoss=q.active*(1-Math.exp(-dt*(.00012+(1-fitness)*.0015+extreme)));
     const dormantLoss=q.dormant*(1-Math.exp(-dt*(.000001+extreme*.12)));
     q.active-=activeLoss;q.dormant-=dormantLoss;cell.detritus+=activeLoss+dormantLoss;
    }
    // Extinct cohorts release their remaining quota; no silent material deletion at the cap.
    for(let j=group.length-1;j>=0;j--)if(total(group[j])<EPS){cell.mineral+=total(group[j]);group.splice(j,1);}
   }
  }
  if(Math.floor(this.age/dt)%80===0)this.diversify();
  if(Math.floor(this.age/dt)%20===0)this.disperse();
  this.fertilize();
  if(Math.floor(this.age/dt)%8===0)this.summarize();
 }
 consume(group,requested){const available=sum(group),amount=Math.min(requested,available);if(available>0){const remaining=Math.max(0,1-amount/available);for(const q of group)q.active*=remaining;}return amount;}
 diversify(){
  for(const cell of this.cells)for(const group of cell.guilds){
   if(group.length>=MAX_VARIANTS||!group.length||this.random()>.28)continue;
   const parent=group[Math.floor(this.random()*group.length)];
   if(parent.active<.025||parent.reproduced<.025)continue;
   const amount=parent.active*.1,genes={...parent.genes},keys=['optimum','breadth','drought'],key=keys[Math.floor(this.random()*3)];
   const bounds={optimum:[-10,45,5],breadth:[8,30,4],drought:[0,1,.18]},[lo,hi,span]=bounds[key];
   genes[key]=clamp(genes[key]+(this.random()-.5)*span,lo,hi);
   parent.active-=amount;parent.reproduced=0;
   group.push({id:this.nextId++,root:parent.root,parent:parent.id,generation:parent.generation+1,
    born:this.sim.time,genes,active:amount*.8,dormant:amount*.2,reproduced:0});this.totals.mutations++;
  }
 }
 disperse(){
  // Stage transfers before applying them: new arrivals cannot move twice in one sweep.
  const transfers=[];
  for(let i=0;i<this.cells.length;i++){
   const geo=this.sim.environment.geo[i],neighbors=geo.neighbors.filter(j=>j!==i&&this.sim.environment.geo[j].water===geo.water);
   if(!neighbors.length)continue;
   for(let guild=0;guild<3;guild++){
    const group=this.cells[i].guilds[guild];if(!group.length)continue;
    const q=group[Math.floor(this.random()*group.length)],to=neighbors[Math.floor(this.random()*neighbors.length)];
    if(q.active>.02)transfers.push({q,to,guild,amount:q.active*.015});
   }
  }
  for(const {q,to,guild,amount} of transfers){
   const group=this.cells[to].guilds[guild];let target=group.find(v=>v.id===q.id);
   if(!target){if(group.length>=MAX_VARIANTS)continue;target={...q,genes:{...q.genes},active:0,dormant:0,reproduced:0};group.push(target);}
   q.active-=amount;target.dormant+=amount;this.totals.dispersed+=amount;
  }
 }
 addDetritus(x,z,amount){if(!(amount>0&&Number.isFinite(amount)))return;this.cells[this.sim.environment.index(x,z)].detritus+=amount;this.totals.imported+=amount;}
 fertilize(){
  for(const f of this.sim.food){
   if(f.recovery?.dormant||f.growth>=.9)continue;
   const c=this.cells[this.sim.environment.index(f.x,f.z)];
   // Existing roots take a bounded share, leaving microbial producers a local reserve.
   const amount=Math.min(Math.max(0,c.mineral-.3),.002*(1-f.growth));
   c.mineral-=amount;this.totals.exported+=amount;f.biomass+=amount;f.soilFed+=amount;f.growth=clamp(f.growth+amount*.08,0,1);
  }
 }
 forage(creature){
  const water=creature.species===5;let best=null,bestDistance=14;
  const origin=this.sim.environment.index(creature.x,creature.z),near=new Set([origin,...this.sim.environment.geo[origin].neighbors]);
  for(const i of near){
   const g=this.sim.environment.geo[i];if(g.water!==water||sum(this.cells[i].guilds[0])<.3)continue;
   const d=distance(creature,g);if(d<bestDistance&&this.sim.valid(g.x,g.z,creature.species,creature)){
    bestDistance=d;best={x:g.x,z:g.z,kind:'biofilm',cell:i};
   }
  }
  return best;
 }
 graze(creature,index){
  const site=this.sim.environment.geo[index];if(!site||site.water!==(creature.species===5)||distance(creature,site)>1.5)return 0;
  const c=this.cells[index],available=sum(c.guilds[0]),amount=this.consume(c.guilds[0],Math.min(.3,Math.max(0,available-.04)));
  c.detritus+=amount*.3;this.totals.exported+=amount*.7;return amount*65;
 }
 summarize(){
  const active=[0,0,0],dormant=[0,0,0];let colonies=0,cohorts=0,generation=1,minerals=0,detritus=0;const sites=[];
  for(let i=0;i<this.cells.length;i++){
   const c=this.cells[i];minerals+=c.mineral;detritus+=c.detritus;
   for(let g=0;g<3;g++)for(const q of c.guilds[g]){active[g]+=q.active;dormant[g]+=q.dormant;cohorts++;generation=Math.max(generation,q.generation);}
   const mass=sum(c.guilds[0]);if(mass>=.3){colonies++;sites.push({cell:i,mass,...this.sim.environment.geo[i]});}
  }
  const live=active.reduce((a,b)=>a+b,0)+dormant.reduce((a,b)=>a+b,0),a=active.reduce((a,b)=>a+b,0);
  const phase=live<EPS?'Sin reservas microscópicas':a<.01?'Reservas latentes':colonies?'Colonias y red trófica':'Colonización microscópica';
  const old=this.summary?.phase;
  this.summary={phase,living:live,active:a,dormant:dormant.reduce((a,b)=>a+b,0),guildActive:active,guildDormant:dormant,
   colonies,cohorts,generation,minerals,detritus,sites:sites.sort((a,b)=>b.mass-a.mass).slice(0,12).map(({cell,mass,x,z,region,water})=>({cell,mass,x,z,region,water}))};
  if(old&&old!==phase&&this.sim.time>=this.noticeAt){this.noticeAt=this.sim.time+160;const p=this.summary.sites[0];this.sim.log('Biosfera: '+phase.toLowerCase()+'.','❧','recovery',null,p);}
 }
}
