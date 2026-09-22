// Read-only measurements. The diagnostic runner separately counts every death cause.
export function census(sim){
 const sum=(a,key)=>a.reduce((n,v)=>n+(v[key]||0),0);
 return {day:sim.time/160,animals:sim.creatures.length,
  bySpecies:Array.from({length:6},(_,i)=>sim.creatures.filter(c=>c.species===i).length),
  plants:sim.food.length,plantTypes:Array.from({length:5},(_,i)=>sim.food.filter(f=>f.type===i).length),
  plantBiomass:sum(sim.food,'biomass'),seedBank:sim.recovery.seeds.length,
  dormantPlants:sim.food.filter(f=>f.recovery?.dormant).length,
  nutrients:sum(sim.soil,'nutrients'),corpseBiomass:sum(sim.remains,'biomass'),
  hungry:sim.creatures.filter(c=>c.energy<25).length,
  pregnant:sim.creatures.filter(c=>c.pregnancy).length,
  byRegion:Array.from({length:4},(_,r)=>sim.creatures.filter(c=>c.region===r).length),
  births:sim.births,deaths:sim.deaths,climate:{...sim.environment.summary},
  biosphere:sim.biosphere?{...sim.biosphere.summary,massError:sim.biosphere.mass()-sim.biosphere.expectedMass()}:null};
}
