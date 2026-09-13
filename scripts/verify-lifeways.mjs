import assert from 'node:assert/strict';
import {Ecosystem} from '../dist/simulation.js';
import {Neighborhood} from '../dist/lifeways.js';
import {Documentary,sphericalBlend} from '../dist/documentary.js';
import {HALF,POLE,distance,move} from '../dist/planet.js';
const s=new Ecosystem(),l=s.lifeways,m=s.creatures[0],father=s.creatures[1],p=s.point(0,0);Object.assign(m,p,{age:8,energy:99,stage:null,state:'Explorando'});m.mind.job=null;
// Learned practice drives action preference; parental and neighbor copying retain provenance.
l.practice(m,'gather',.6,2);const child=s.create(0,p,m,father);l.born(child,m,father);assert(child.mind.knowledge.length);assert.equal(child.mind.knowledge[0].founder,m.id);assert(l.bias(child,'gather')>0);const neighbor=s.create(0,p);l.copy(m,neighbor);assert.equal(neighbor.mind.knowledge[0].id,m.mind.knowledge[0].id);l.census();assert(l.traditions.some(t=>t.holders===3));
const record=m.mind.knowledge[0];m.mind.knowledge=[];child.mind.knowledge=[];neighbor.mind.knowledge=[];l.census();assert(l.lost.some(t=>t.id===record.id));
m.mind.knowledge=[{...record,strength:.10001}];l.tick(2);assert(!m.mind.knowledge.length);assert(l.totals.forgotten>0);
// Actual care conserves energy and has a spatial arrival requirement.
Object.assign(child,move(p.x,p.z,3,0),{energy:40});m.social.intent={kind:'care',id:child.id,until:s.time+10};const total=m.energy+child.energy;l.guide(m);assert.equal(m.energy+child.energy,total);assert.equal(l.totals.care,0);Object.assign(child,p);l.guide(m);assert.equal(m.energy+child.energy,total);assert(child.energy>40);assert.equal(l.totals.care,1);assert.equal(m.state,'Cuidando');l.guide(m);assert.equal(m.state,'Cuidando');assert.equal(l.totals.care,1);
// An alarm must not erase its fleeing destination when canceling a social action.
m.state='Huyendo';m.target={...p,kind:'escape'};l.guide(m);assert.equal(m.target.kind,'escape');
// Floral contact: no self-pollination; cross pollen required for local offspring.
s.food=[];const a=s.addFood(p,1,1),b=s.addFood(move(p.x,p.z,.2,0),1,1);assert.equal(a.type,1);assert.equal(b.type,1);l.ensurePlant(a);l.ensurePlant(b);l.visit(m,a);assert(!a.pollinated);l.visit(m,a);assert(!a.pollinated);l.visit(m,b);assert(b.pollinated);assert.equal(l.totals.pollinations,1);assert(m.ecology.pollen);
const genes={...b.genes},desc=l.germinate(p,1,genes,b.id);assert(desc);assert.equal(desc.parentPlant,b.id);assert.equal(desc.genes.generation,genes.generation+1);assert.notDeepEqual(desc.genes,genes);assert.equal(l.germinate(s.point(5),1,genes),null);
const unpollinated=s.addFood(p,1,1);const seedCount=m.ecology.seeds.length;l.consume(m,unpollinated);assert.equal(m.ecology.seeds.length,seedCount);
// Seed transport requires time AND separation, with inherited plant traits.
l.consume(m,b);const carried=m.ecology.seeds.at(-1);carried.at=0;Object.assign(m,move(p.x,p.z,4,0));l.tick(2);assert(l.totals.dispersed>0);assert(m.ecology.dispersed>0);assert.equal(m.ecology.seeds.length,0);
const fern=s.addFood(p,1,2);l.index();Object.assign(child,p);assert(l.shelter(child)>0);s.food=s.food.filter(f=>f!==fern);l.index();assert.equal(l.shelter(child),0);
// Spherical spatial lookup and camera routes cross the seam/poles without jumping.
for(const pair of [[{x:HALF-.1,z:0},{x:-HALF+.1,z:0}],[{x:0,z:POLE-.1},{x:HALF-.1,z:POLE-.1}]]){assert.equal(new Neighborhood(pair).near(pair[0],1).length,2);const mid=sphericalBlend(...pair,.5);assert(distance(pair[0],mid)<.2);}
assert(Number.isFinite(sphericalBlend({x:0,z:0},{x:HALF,z:0},.5).x));
const director=new Documentary(),world={focus:{x:0,z:0},desiredDistance:108,envClock:0};s.log('Encuentro observado','♡','social',m.id);const before=JSON.stringify(s.snapshot());for(let i=0;i<120;i++)director.update(.1,s,world);assert(director.shot);assert.equal(JSON.stringify(s.snapshot()),before);assert(Number.isFinite(world.focus.x+world.focus.z+world.desiredDistance));const first=director.shot;director.update(.1,s,world);assert.equal(director.shot,first);director.interrupt();const frozen={...world.focus};for(let i=0;i<50;i++)director.update(.1,s,world);assert.deepEqual(world.focus,frozen);director.toggle();assert(!director.enabled);director.update(.1,s,world);assert.deepEqual(world.focus,frozen);director.toggle();director.update(.1,s,world,{following:true});assert.equal(director.status,'Siguiendo tu selección');
// Old format without the new systems migrates, and live/restored continuations match.
const legacy=structuredClone(s.snapshot());delete legacy.lifeways;for(const c of legacy.creatures){delete c.social;delete c.ecology;delete c.mind.knowledge;}const migrated=new Ecosystem(legacy);assert(migrated.creatures.every(c=>c.social&&c.ecology));
const fresh=new Ecosystem();for(let i=0;i<41;i++)fresh.step(.1);const restored=new Ecosystem(fresh.snapshot());for(let i=0;i<70;i++){fresh.step(.1);restored.step(.1);}assert.deepEqual(fresh.snapshot(),restored.snapshot());
console.log('Lifeways: inherited/perishable practices, conservative care, pollination, seed genomes, vegetation refuge, spherical indexing, documentary independence/manual control and deterministic save continuation passed.');
