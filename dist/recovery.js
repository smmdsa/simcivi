import {clamp,geography,normalize,move,distance,CONTINENTS} from './planet.js';
import {Neighborhood,plantGenome} from './lifeways.js';

export const MAX_SEEDS=1200,SEED_BUDGET=80;
const WATER_NEED=[.17,.23,.24,.23,.12];
const stateNames={active:'Activo',seeking:'Buscando un microrefugio',dormant:'En letargo'};
export {stateNames as RECOVERY_STATES};

// Bounded reserves and local stress responses, never an extinction-triggered respawn.
export class Recovery {
 constructor(sim,saved){
  this.sim=sim;this.seeds=saved?.seeds??[];this.nextId=saved?.nextId??1;this.clock=saved?.clock??0;this.cursor=saved?.cursor??0;this.noticeAt=saved?.noticeAt??{};this.regions=saved?.regions??[];this.refuges=saved?.refuges??[];
  this.totals={stored:0,sprouted:0,expired:0,plantSleeps:0,plantWakes:0,animalSleeps:0,animalWakes:0,windMoved:0,...saved?.totals};
  for(const c of sim.creatures)this.ensure(c);for(const f of sim.food)this.ensurePlant(f);
  if(!saved){ // One migration pass: existing fertile plants pay for their local reserves.
   const sources=sim.food.filter(f=>f.growth>.65&&(f.type!==1||f.pollinated)).slice(0,160);
   for(const f of sources)if(f.biomass>.2){const a=sim.random()*Math.PI*2,p=move(f.x,f.z,Math.sin(a)*1.3,Math.cos(a)*1.3);if(this.store(p,f.type,sim.lifeways.seedGenes(f),f.id)){f.biomass-=.12;f.pollinated=false;}}
   this.census();
  }
 }
 ensure(c){c.recovery??={mode:'active',stress:0,calm:0,until:0,since:0,refuge:null,protection:0,sleeps:0,wakes:0};return c.recovery;}
 ensurePlant(f){f.recovery??={dormant:false,stress:0,calm:0,since:0};return f.recovery;}
 snapshot(){return{seeds:this.seeds,nextId:this.nextId,clock:this.clock,cursor:this.cursor,noticeAt:this.noticeAt,regions:this.regions,refuges:this.refuges,totals:this.totals};}
 notice(key,text,p,entity=null){if(this.sim.time<(this.noticeAt[key]??0))return;this.noticeAt[key]=this.sim.time+45;this.sim.log(text,'❧','recovery',entity,p);}
 micro(p,env=this.sim.local(p),habitat=this.sim.culture.habitat(p.x,p.z),cover=0){
  const river=env.land?Math.max(0,1-env.riverDistance/4)*.28:0;
  const protection=clamp((env.water?.4:river)+habitat.insulation*.3+habitat.windbreak*.2+cover*.25,0,.7);
  return{temperature:env.temperature+(21-env.temperature)*protection,moisture:clamp(env.moisture+river*.55+habitat.moisture,0,1),light:env.light,protection};
 }
 suitable(type,e){return e.moisture>=WATER_NEED[type]&&e.temperature>5&&e.temperature<36;}
 site(p,type){const geo=geography(p.x,p.z);return (type===4)===geo.water;}
 store(p,type,genes,parent){
  if(this.seeds.length>=MAX_SEEDS||!this.site(p,type))return null;
  const pos=normalize(p.x,p.z),id=this.nextId++,seed=this.sim.random()*100;
  const item={id,...pos,type,seed,genes:plantGenome(seed,genes,()=>this.sim.random()),parentPlant:parent??null,born:this.sim.time,checkedAt:this.sim.time,viability:1,ready:0,dormant:true};
  this.seeds.push(item);this.totals.stored++;return item;
 }
 propagate(p,type,genes,parent){
  if(!this.site(p,type))return null;const e=this.micro(p);
  if(this.suitable(type,e)&&this.sim.food.length<this.sim.foodCapacity){const f=this.sim.addFood(p,.03,type);if(!f)return null;f.genes=plantGenome(f.seed,genes,()=>this.sim.random());f.parentPlant=parent??null;this.sim.lifeways.totals.germinated++;return f;}
  return this.store(p,type,genes,parent);
 }
 processSeeds(){
  const sim=this.sim,count=Math.min(SEED_BUDGET,this.seeds.length);let born=0;
  for(let i=0;i<count&&this.seeds.length;i++){
   this.cursor%=this.seeds.length;const s=this.seeds[this.cursor],dt=sim.time-s.checkedAt;s.checkedAt=sim.time;
   const e=this.micro(s);s.viability-=dt*(1/(900+900*s.genes.dispersal))*(1-e.protection*.5)*(e.temperature>38?2:1);
   const good=this.suitable(s.type,e);s.ready=good?Math.min(24,s.ready+Math.min(dt,6)):0;
   if(s.viability<=0){sim.deposit(s.x,s.z,.12,'Semilla agotada');this.seeds.splice(this.cursor,1);this.totals.expired++;continue;}
   if(good&&s.ready>=12&&sim.food.length<sim.foodCapacity&&born<16){
    const f=sim.addFood(s,.03,s.type);if(f){f.genes={...s.genes};f.seed=s.seed;f.parentPlant=s.parentPlant;f.reserveOrigin=s.id;this.seeds.splice(this.cursor,1);this.totals.sprouted++;sim.lifeways.totals.germinated++;born++;this.notice('sprout','Semillas que aguardaban bajo el suelo vuelven a brotar.',f);continue;}
   }
   this.cursor++;
  }
 }
 plant(f,env,habitat,dt){
  const r=this.ensurePlant(f),e=this.micro(f,env,habitat),good=this.suitable(f.type,e);
  r.stress=good?Math.max(0,r.stress-dt*2):r.stress+dt;r.calm=good?r.calm+dt:0;
  if(!r.dormant&&r.stress>=12&&f.growth>.12){r.dormant=true;r.since=this.sim.time;r.calm=0;this.totals.plantSleeps++;this.notice('plant-sleep','La vegetación repliega su crecimiento para conservar reservas.',f);}
  if(r.dormant&&r.calm>=20){r.dormant=false;r.stress=0;this.totals.plantWakes++;this.notice('plant-wake','Las raíces supervivientes reanudan su crecimiento.',f);}
  if(r.dormant){const loss=Math.min(f.biomass,dt*.0008);f.biomass-=loss;f.growth=Math.max(.03,f.growth-dt*.00012);}
  return{...e,dormant:r.dormant,exhausted:r.dormant&&(this.sim.time-r.since>600+f.genes.dispersal*600||f.biomass<.05)};
 }
 wake(c,reason='las condiciones mejoran'){
  const r=this.ensure(c);if(r.mode!=='dormant')return;r.mode='active';r.stress=r.calm=0;r.until=this.sim.time+20;r.wakes++;this.totals.animalWakes++;c.target=null;c.think=0;c.state='Despertando';this.notice('wake',c.name+' despierta: '+reason+'.',c,c.id);
 }
 sleep(c){
  const r=this.ensure(c);if(c.stage||c.pregnancy||r.mode==='dormant')return;r.mode='dormant';r.since=this.sim.time;r.calm=0;r.sleeps++;this.totals.animalSleeps++;c.mind.job=null;c.social.intent=null;c.target=null;c.state='En letargo';c.speed=c.vx=c.vz=0;this.notice('sleep',c.name+' reduce su actividad y entra en letargo.',c,c.id);
 }
 seek(c,plants,current){
  let best=null,score=current.protection;for(let i=0;i<10;i++){const a=i*2.399963+c.id,p=move(c.x,c.z,Math.sin(a)*(2+i*.6),Math.cos(a)*(2+i*.6));if(!this.sim.valid(p.x,p.z,c.species,c)||this.sim.culture.blocked(p.x,p.z))continue;const cover=Math.min(.6,plants.near(p,2).filter(f=>!f.recovery.dormant&&f.growth>.5).length*.1),e=this.micro(p,undefined,undefined,cover),value=e.protection-Math.abs(e.temperature-21)*.009+e.moisture*.1;if(value>score+.04){score=value;best=p;}}
  if(best){const r=c.recovery;r.mode='seeking';r.refuge=best;r.until=this.sim.time+18;c.mind.job=null;c.social.intent=null;c.state='Buscando un microrefugio';c.target={...best,kind:'refuge'};c.think=2;}
 }
 guide(c){
  const r=this.ensure(c);if(r.mode!=='seeking')return false;
  if(c.stage||c.pregnancy||c.state==='Huyendo'||this.sim.time>r.until){r.mode='active';r.refuge=null;r.until=this.sim.time+12;return false;}
  if(distance(c,r.refuge)<1.1){this.sleep(c);return true;}
  c.target={...r.refuge,kind:'refuge'};c.state='Buscando un microrefugio';c.think=2;return true;
 }
 tick(dt){
  this.clock+=dt;if(this.clock<2)return;const elapsed=this.clock;this.clock=0;const sim=this.sim,plants=new Neighborhood(sim.food),animals=new Neighborhood(sim.creatures);let searches=0;this.processSeeds();
  for(const c of sim.creatures){const r=this.ensure(c),near=plants.near(c,5),edible=near.filter(f=>!f.recovery.dormant&&f.growth>.5&&(f.type===4)===(c.species===5)).length,e=this.micro(c,undefined,undefined,c.ecology?.cover||0),bad=e.temperature<8||e.temperature>34||(c.species!==5&&e.moisture<.16)||(edible===0&&c.species!==3&&c.energy<58);
   r.protection=e.protection;r.stress=bad?r.stress+elapsed:Math.max(0,r.stress-elapsed*2);r.calm=bad?0:r.calm+elapsed;
   if(r.mode==='dormant'){
    const predator=c.species!==3&&animals.near(c,5).some(p=>p.species===3&&p.energy<52);
    if(predator||c.energy<18||sim.time-r.since>140+c.dna.traits.insulation*160||(r.calm>=16&&(edible>0||c.species===3))){this.wake(c,predator?'se aproxima un depredador':c.energy<18?'necesita alimentarse':r.calm>=16?'el entorno vuelve a ser favorable':'debe salir a buscar alimento');}
   }else if(r.mode==='active'&&r.stress>=12&&sim.time>=r.until&&!c.stage&&!c.pregnancy&&c.age>.4&&c.energy>22&&c.state!=='Huyendo'){
    if(e.protection>.18||r.stress>36)this.sleep(c);else if(searches++<6){this.seek(c,plants,e);if(r.mode==='active')this.sleep(c);}
   }
  }
  this.census();
 }
 census(){
  const rows=CONTINENTS.map((c,i)=>({region:i,seeds:0,active:0,dormant:0,sleeping:0,animals:0,phase:'Estable',crises:this.regions[i]?.crises||0,recoveries:this.regions[i]?.recoveries||0,previous:this.regions[i]?.phase||'Estable',stressed:this.regions[i]?.stressed||false,recoverUntil:this.regions[i]?.recoverUntil||0}));
  for(const s of this.seeds)rows[geography(s.x,s.z).region].seeds++;
  const refuges=[],counts=[0,0,0,0];for(const f of this.sim.food){const row=rows[geography(f.x,f.z).region];row[f.recovery?.dormant?'dormant':'active']++;if(f.growth>.5&&!f.recovery?.dormant){const e=this.micro(f);if(e.protection>.18&&counts[row.region]<12&&!refuges.some(r=>distance(r,f)<5)){refuges.push({x:f.x,z:f.z,region:row.region,protection:e.protection});counts[row.region]++;}}}
  for(const c of this.sim.creatures){const row=rows[c.region??0];row.animals++;if(c.recovery?.mode==='dormant')row.sleeping++;}
  for(const row of rows){const stress=row.dormant>row.active*.35&&row.dormant>3||row.sleeping>row.animals*.3&&row.sleeping>2;
   row.phase=row.active===0&&row.dormant===0?(row.seeds?'Vida latente':'Sin reserva vegetal'):stress?'Resistiendo':(row.stressed&&row.active>10||row.recoverUntil>this.sim.time)?'Rebrotando':'Estable';
   if((stress||row.active===0)&&!row.stressed){row.crises++;row.stressed=true;}
   if(row.phase==='Rebrotando'&&row.previous!=='Rebrotando'){row.recoveries++;row.recoverUntil=this.sim.time+60;row.stressed=false;this.notice('region-'+row.region,CONTINENTS[row.region].name+' muestra nuevos signos de recuperación.',CONTINENTS[row.region]);}
   if(row.phase==='Rebrotando'&&row.previous==='Rebrotando')row.stressed=false;
   delete row.previous;
  }
  this.regions=rows;this.refuges=refuges;
 }
 wind(){let moved=0;for(const s of this.seeds.slice(0,9)){const e=this.sim.local(s);if((e.wind||0)<.25)continue;const scale=Math.min(4,e.wind)/e.wind,p=move(s.x,s.z,e.windEast*scale,e.windNorth*scale);if(this.site(p,s.type)){Object.assign(s,p);s.ready=0;moved++;}}this.totals.windMoved+=moved;return moved;}
}
