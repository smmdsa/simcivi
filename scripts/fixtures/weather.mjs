// Controlled environmental forcing for causal biology tests only; never shipped in dist.
import {climateAt} from '../../dist/planet.js';
export function forceWeather(sim,moisture,temperature){
 sim.environment.advance=(_,time)=>{sim.environment.time=time;sim.environment.revision++;};
 sim.environment.sample=(x,z,time=sim.time)=>({...climateAt(x,z,time,{moisture,temperature}),fertility:.7,rain:0,humidity:moisture/100,wind:1,windEast:1,windNorth:0});
 sim.environmentCache.clear();
}
