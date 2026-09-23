import {SPECIES} from './simulation.js';
import {geography,distance} from './planet.js';

// Read-only measurements. Event counts are collected by the diagnostic runner.
export function census(sim){
 const sum=(a,key)=>a.reduce((n,v)=>n+(v[key]||0),0);
 const regions=Array.from({length:4},()=>({animals:Array(6).fill(0),hungry:Array(6).fill(0),plants:Array(5).fill(0),plantBiomass:0,seeds:0,nutrients:0}));
 const families=Array.from({length:6},()=>({energy:0,pregnant:0,ready:0,accessibleFood:0,stranded:0}));
 for(const c of sim.creatures){const f=families[c.species],r=regions[c.region];r.animals[c.species]++;f.energy+=c.energy;if(c.energy<25)r.hungry[c.species]++;if(c.pregnancy)f.pregnant++;if(sim.ready(c))f.ready++;
  const water=SPECIES[c.species].habitat==='water',predator=SPECIES[c.species].diet==='Carnívoro';
  const accessible=predator?sim.animalNeighbors.near(c,10).some(p=>sim.byId.has(p.id)&&SPECIES[p.species].habitat==='land'&&SPECIES[p.species].diet!=='Carnívoro'&&p.age>.3&&distance(c,p)<10)||sim.remains.some(p=>p.biomass>0&&SPECIES[p.species]?.habitat==='land'&&distance(c,p)<8):sim.plantNeighbors.near(c,28).some(p=>!p.recovery?.dormant&&p.growth>=.5&&p.biomass>.15&&(p.type===4)===water&&distance(c,p)<28);
  if(accessible)f.accessibleFood++;else f.stranded++;
 }
 for(const p of sim.food){const r=regions[geography(p.x,p.z).region];r.plants[p.type]++;r.plantBiomass+=p.biomass;}
 for(const p of sim.recovery.seeds)regions[geography(p.x,p.z).region].seeds++;
 for(const p of sim.soil)regions[geography(p.x,p.z).region].nutrients+=p.nutrients;
 return {day:sim.time/160,animals:sim.creatures.length,
  bySpecies:Array.from({length:6},(_,i)=>sim.creatures.filter(c=>c.species===i).length),
  plants:sim.food.length,plantTypes:Array.from({length:5},(_,i)=>sim.food.filter(f=>f.type===i).length),
  plantBiomass:sum(sim.food,'biomass'),seedBank:sim.recovery.seeds.length,
  dormantPlants:sim.food.filter(f=>f.recovery?.dormant).length,
  nutrients:sum(sim.soil,'nutrients'),corpseBiomass:sum(sim.remains,'biomass'),
  hungry:sim.creatures.filter(c=>c.energy<25).length,
  pregnant:sim.creatures.filter(c=>c.pregnancy).length,
  byRegion:Array.from({length:4},(_,r)=>sim.creatures.filter(c=>c.region===r).length),
  births:sim.births,deaths:sim.deaths,regions,families,climate:{...sim.environment.summary},
  biosphere:sim.biosphere?{...sim.biosphere.summary,massError:sim.biosphere.mass()-sim.biosphere.expectedMass()}:null};
}
