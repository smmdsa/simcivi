import assert from 'node:assert/strict';
import {Biosphere,microFitness,growthRate,MAX_VARIANTS} from '../dist/biosphere.js';
const near=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
function fixture(){
 const s={time:0,worldSeed:713,creatures:[],food:[],log(){},valid:()=>true};
 const geo=Array.from({length:4},(_,i)=>({x:i*2,z:0,water:i>=2,region:0,neighbors:[i^1]}));
 s.conditions={temperature:22,moisture:.8,light:1};
 s.environment={geo,index:x=>Math.max(0,Math.min(3,Math.round(x/2))),sample:()=>({...s.conditions})};
 s.biosphere=new Biosphere(s);return s;
}
function run(s,seconds){for(let i=0;i<seconds;i++){s.time++;s.biosphere.tick(1);}}
function erase(s){for(const c of s.biosphere.cells)for(const group of c.guilds){for(const q of group)c.mineral+=q.active+q.dormant;group.length=0;}s.biosphere.summarize();}
const s=fixture(),b=s.biosphere,initial=b.mass();run(s,600);near(b.mass(),initial);assert(b.totals.produced>0);assert(b.totals.decomposed>0);assert(b.totals.consumed>0);assert(b.totals.mutations>0);
for(let i=1;i<1000;i++){
 const prey=[{active:i/1234567}],available=prey[0].active;
 assert.equal(b.consume(prey,1),available);assert(prey[0].active>=0,'Full consumption cannot leave negative roundoff that corrupts future saves');
}
for(const c of b.cells)for(const group of c.guilds){assert(group.length<=MAX_VARIANTS);for(const q of group)assert(Number.isFinite(q.active+q.dormant)&&q.active>=0&&q.dormant>=0);}
const sterile=fixture();erase(sterile);run(sterile,4000);assert.equal(sterile.biosphere.summary.living,0);near(sterile.biosphere.mass(),sterile.biosphere.expectedMass());
const dark=fixture();dark.conditions.light=0;run(dark,500);assert.equal(dark.biosphere.totals.produced,0);
const depleted=fixture();for(const c of depleted.biosphere.cells){c.mineral=0;c.detritus=0;c.guilds[1]=[];c.guilds[2]=[];}depleted.biosphere.advance(1);assert.equal(depleted.biosphere.totals.produced,0);
const latent=fixture();for(const c of latent.biosphere.cells)for(const group of c.guilds)for(const q of group){q.dormant+=q.active;q.active=0;}
latent.conditions.moisture=0;run(latent,800);const reserve=latent.biosphere.summary.dormant;assert(reserve>0);latent.conditions.moisture=.8;run(latent,1000);assert(latent.biosphere.summary.active>0);assert(latent.biosphere.totals.woken>0);near(latent.biosphere.mass(),latent.biosphere.expectedMass());
const narrow={optimum:22,breadth:12,drought:.1},broad={...narrow,breadth:25};
assert(growthRate(narrow)>growthRate(broad));assert(microFitness(broad,{temperature:40,moisture:1})>microFitness(narrow,{temperature:40,moisture:1}));
const cold={...narrow,optimum:8},warm={...narrow,optimum:30};assert(microFitness(cold,{temperature:8,moisture:1})>microFitness(warm,{temperature:8,moisture:1}));
const inherited=b.cells.flatMap(c=>c.guilds.flat()).filter(q=>q.parent!==null);assert(inherited.length);assert(inherited.every(q=>q.generation>1&&q.root>0));
const restored=fixture();restored.time=s.time;restored.biosphere=new Biosphere(restored,JSON.parse(JSON.stringify(b.snapshot())));run(s,300);run(restored,300);assert.deepEqual(b.snapshot(),restored.biosphere.snapshot());
assert.throws(()=>new Biosphere(s,{cells:[]}),/biosfera/i);
for(const corrupt of [saved=>saved.clock=1e20,saved=>saved.clock=1,saved=>delete saved.summary,
 saved=>saved.summary.guildActive=null,saved=>saved.summary.sites=[{cell:9999}],saved=>saved.summary.phase=null]){
 const invalid=structuredClone(b.snapshot());corrupt(invalid);
 assert.throws(()=>new Biosphere(s,invalid),/biosfera/i,'Reject damaged save before starting the worker');
}
const saved=JSON.parse(JSON.stringify(sterile.biosphere.snapshot()));const empty=fixture();empty.biosphere=new Biosphere(empty,saved);assert.equal(empty.biosphere.summary.living,0);
// Repeated stress uses actual reserves; killing every cohort makes sterility persistent.
const cycling=fixture();for(let cycle=0;cycle<4;cycle++){cycling.conditions={temperature:48,moisture:.01,light:1};run(cycling,160*12);cycling.conditions={temperature:22,moisture:.8,light:1};run(cycling,160*45);assert(cycling.biosphere.summary.living>0);near(cycling.biosphere.mass(),cycling.biosphere.expectedMass());}
erase(cycling);run(cycling,160*20);assert.equal(cycling.biosphere.summary.living,0);
console.log('PASS: finite trophic transfers, dormancy, sterility, mutation costs, inheritance, bounds, 228-day repeated crises and deterministic persistence.');
// Equal competitors under identical resources: environment selects among inherited variants.
const selected=fixture();selected.environment.geo=[{x:0,z:0,water:true,region:0,neighbors:[]}];
selected.biosphere.cells=[{mineral:4,detritus:0,guilds:[[
 {id:1,root:1,parent:null,generation:1,born:0,genes:cold,active:.2,dormant:.1,reproduced:0},
 {id:2,root:2,parent:null,generation:1,born:0,genes:warm,active:.2,dormant:.1,reproduced:0}
],[],[]]}];selected.biosphere.nextId=3;selected.biosphere.initialMass=selected.biosphere.mass();
selected.conditions={temperature:8,moisture:1,light:1};run(selected,800);
const descendants=selected.biosphere.cells[0].guilds[0],coldBiomass=descendants.filter(q=>q.root===1).reduce((n,q)=>n+q.active+q.dormant,0),warmBiomass=descendants.filter(q=>q.root===2).reduce((n,q)=>n+q.active+q.dormant,0);
assert(coldBiomass>warmBiomass*2);near(selected.biosphere.mass(),selected.biosphere.expectedMass());
const drought=fixture(),wet=fixture();drought.conditions.temperature=48;wet.conditions.temperature=8;
for(const f of [drought,wet])for(const c of f.biosphere.cells)for(const group of c.guilds)group[0].reproduced=1;
for(let i=0;i<30;i++){drought.biosphere.diversify();wet.biosphere.diversify();}
assert.deepEqual(drought.biosphere.cells,wet.biosphere.cells,'Mutation draws do not read the environment');
console.log('PASS: differential descendant survival and mutations independent of the selection environment.');
