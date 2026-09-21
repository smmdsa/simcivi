import assert from 'node:assert/strict';
import {Ecosystem} from '../dist/simulation.js';
import {GlobeWorld} from '../dist/globe.js';
import {BiosphereVisuals,MAX_COLONIES,MAX_MICROFAUNA} from '../dist/biosphere-visuals.js';
globalThis.innerWidth=1280;globalThis.innerHeight=720;globalThis.devicePixelRatio=1;globalThis.window={addEventListener(){}};
const renderer={domElement:{style:{},addEventListener(){}},shadowMap:{},setPixelRatio(){},setSize(){},render(s,c){s.updateMatrixWorld();c.updateMatrixWorld();},info:{render:{calls:0}}};
const sim=new Ecosystem(),world=new GlobeWorld({appendChild(){}},sim,{renderer});
assert(world.biosphereVisuals instanceof BiosphereVisuals);
for(const c of sim.biosphere.cells){c.guilds[0][0].active=2;c.guilds[2][0].active=1;}
world.visible=()=>true;world.distance=12;
const snapshot=JSON.stringify(sim.snapshot());
for(let tier=0;tier<3;tier++){world.qualityTier=tier;world.biosphereVisuals.update(100);assert(world.biosphereVisuals.colonies.count>0);assert(world.biosphereVisuals.colonies.count<=MAX_COLONIES);assert(world.biosphereVisuals.fauna.count<=MAX_MICROFAUNA);}
for(const mesh of [world.biosphereVisuals.colonies,world.biosphereVisuals.fauna])for(const v of mesh.instanceMatrix.array)assert(Number.isFinite(v));
assert.equal(JSON.stringify(sim.snapshot()),snapshot);
for(const c of sim.biosphere.cells)for(const group of c.guilds)group.length=0;
world.biosphereVisuals.update(200);assert.equal(world.biosphereVisuals.colonies.count,0);assert.equal(world.biosphereVisuals.fauna.count,0);
console.log('PASS: finite bounded colonies, microfauna, empty-world rendering and observer independence.');
