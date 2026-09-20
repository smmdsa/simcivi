import {clamp,distance,geography} from './planet.js';
const FIELDS=['surface','groundwater','snow','sediment','flow','flood'];
export class Hydrology {
 constructor(sim,saved){this.sim=sim;const n=sim.environment.cells.length;this.revision=saved?.revision??0;this.noticeAt=saved?.noticeAt??0;this.totals={infiltrated:0,melted:0,discharged:0,eroded:0,deposited:0,floods:0,...saved?.totals};for(const key of FIELDS)this[key]=saved?.[key]?.length===n?[...saved[key]]:Array(n).fill(0);this.downstream=saved?.downstream?[...saved.downstream]:[];this.spill=saved?.spill?[...saved.spill]:[];this.basinIds=saved?.basinIds?[...saved.basinIds]:[];this.basins=saved?.basins??[];this.delta=new Float64Array(n);this.siltDelta=new Float64Array(n);if(!this.downstream.length)this.route();}
 snapshot(){return Object.fromEntries(['revision','noticeAt','totals',...FIELDS,'downstream','spill','basinIds','basins'].map(k=>[k,this[k]]));}
 accept(s){for(const key of Object.keys(s))this[key]=s[key];}
 route(){const geo=this.sim.environment.geo,n=geo.length,heights=geo.map((g,i)=>this.sim.geology.cellHeight(i));this.heights=heights;this.downstream=geo.map((g,i)=>{let low=i;for(const j of g.neighbors)if(heights[j]<heights[low]-1e-8)low=j;return g.water?i:low;});this.spill=geo.map((g,i)=>g.neighbors.filter(j=>j!==i).reduce((a,j)=>heights[j]<heights[a]?j:a,g.neighbors.find(j=>j!==i)));
  this.basinIds=Array(n).fill(-1);for(let i=0;i<n;i++){let j=i;const path=[];while(this.basinIds[j]<0&&this.downstream[j]!==j){path.push(j);j=this.downstream[j];}const root=this.basinIds[j]>=0?this.basinIds[j]:j;this.basinIds[j]=root;for(const k of path)this.basinIds[k]=root;}
 }
 precipitation(i,amount,temperature){if(temperature<0)this.snow[i]+=amount;else if(this.sim.environment.geo[i].water)this.sim.environment.cells[i].ocean+=amount;else this.surface[i]+=amount;}
 evaporate(i,potential){const c=this.sim.environment.cells[i],ocean=this.sim.environment.geo[i].water;if(ocean){const n=Math.min(c.ocean,potential);c.ocean-=n;return n;}const surface=Math.min(this.surface[i],potential);this.surface[i]-=surface;const soil=Math.min(c.soil,potential-surface);c.soil-=soil;return surface+soil;}
 advance(dt,time){const env=this.sim.environment,geo=env.geo,cells=env.cells;this.route();this.delta.fill(0);this.siltDelta.fill(0);this.revision++;
  for(let i=0;i<cells.length;i++){const c=cells[i],g=geo[i];const melt=Math.min(this.snow[i],Math.max(0,c.temperature)*.0007*dt);this.snow[i]-=melt;this.totals.melted+=melt;if(g.water)c.ocean+=melt;else this.surface[i]+=melt;
   if(g.water){this.flow[i]=0;this.flood[i]=0;continue;}
   const infiltrate=Math.min(this.surface[i],Math.max(0,1-c.soil),dt*(.006+.015*g.moisture+.012*c.cover));this.surface[i]-=infiltrate;c.soil+=infiltrate;this.totals.infiltrated+=infiltrate;
   const percolate=Math.min(c.soil,Math.max(0,c.soil-.45)*dt*.0025);c.soil-=percolate;this.groundwater[i]+=percolate;
   const spring=Math.min(this.groundwater[i],this.groundwater[i]*dt*.003);this.groundwater[i]-=spring;this.surface[i]+=spring;
   const overflow=Math.max(0,c.soil-1);c.soil-=overflow;this.surface[i]+=overflow;
   let to=this.downstream[i];if(to===i){const spill=this.spill[i];if(this.heights[i]+this.surface[i]*.6>this.heights[spill])to=spill;}
   let amount=0;if(to!==i){const head=Math.max(0,this.heights[i]+this.surface[i]*.6-this.heights[to]-this.surface[to]*.6);amount=Math.min(this.surface[i]*.35,head*dt*.045);this.surface[i]-=amount;this.delta[to]+=amount;this.totals.discharged+=amount;
    const silt=Math.min(this.sediment[i],this.sediment[i]*amount/Math.max(.000001,this.surface[i]+amount));this.sediment[i]-=silt;this.siltDelta[to]+=silt;
    const rock=this.sim.geology.cells[i],erosion=Math.min(dt*.0005,amount*head*.006*(1-c.cover*.8),Math.max(0,(rock.erosion+.35)/.02));rock.erosion-=erosion*.02;this.sediment[i]+=erosion;this.totals.eroded+=erosion;
   }this.flow[i]=this.flow[i]*.8+amount/dt*.2;
  }
  for(let i=0;i<cells.length;i++){if(geo[i].water)cells[i].ocean+=this.delta[i];else this.surface[i]+=this.delta[i];this.sediment[i]+=this.siltDelta[i];const settled=this.sediment[i]*(1-Math.exp(-dt*(geo[i].water?.12:.035)/(1+this.flow[i]*40)));this.sediment[i]-=settled;this.sim.geology.cells[i].erosion+=settled*.02;this.totals.deposited+=settled;const was=this.flood[i];this.flood[i]=geo[i].water?0:Math.max(0,this.surface[i]-.20)*.6;if(was<=.12&&this.flood[i]>.12)this.totals.floods++;}
  const groups=new Map();for(let i=0;i<cells.length;i++)if(!geo[i].water){const id=this.basinIds[i];if(!groups.has(id))groups.set(id,{id,cells:0,flow:0,water:0,snow:0,flood:0,x:geo[id].x,z:geo[id].z,outlet:geo[id].river?'Río':geo[id].water?'Mar':'Depresión interior'});const b=groups.get(id);b.cells++;if(this.downstream[i]===id&&i!==id)b.flow+=this.flow[i];b.water+=this.surface[i]+this.groundwater[i];b.snow+=this.snow[i];b.flood=Math.max(b.flood,this.flood[i]);}this.basins=[...groups.values()].sort((a,b)=>b.cells-a.cells||a.id-b.id);
  if(time>this.noticeAt){const i=this.flood.indexOf(Math.max(...this.flood));if(this.flood[i]>.16){this.noticeAt=time+80;this.sim.log('La cuenca '+this.basinIds[i]+' se desborda: el agua ocupa terrenos bajos.','≈','flood',null,geo[i]);}}
 }
 floodAt(x,z){const i=this.sim.environment.index(x,z),f=this.flood[i];return f?f*Math.max(0,1-distance({x,z},this.sim.environment.geo[i])/6):0;}
 sample(x,z){const env=this.sim.environment,i=env.index(x,z),g=env.geo[i],d=distance({x,z},g),falloff=Math.max(0,1-d/6),base=geography(x,z);return{basin:this.basinIds[i],flow:this.flow[i],groundwater:this.groundwater[i],snow:this.snow[i],flood:this.flood[i]*falloff,riverDepth:base.river?clamp(.06+this.flow[i]*12+this.surface[i]*.12,0,1.4):0};}
 exposure(){const sim=this.sim;for(const c of sim.creatures){const h={flood:this.floodAt(c.x,c.z)};if(c.species===5)continue;const tolerance=.16+(c.dna.traits.webbing??.3)*.45+(c.dna.traits.legs??1)*.05,risk=Math.max(0,h.flood-tolerance);if(risk>0){c.health-=Math.min(6,risk*5);c.environmentCause='murió en una inundación';sim.geology.evacuate(c,'Buscando terreno alto');}}
  for(const p of sim.food){const h={flood:this.floodAt(p.x,p.z)};if(p.type!==4&&h.flood>.2){const amount=Math.min(p.biomass,(h.flood-.2)*.02);p.biomass-=amount;p.growth=Math.max(0,p.growth-.002*h.flood);sim.deposit(p.x,p.z,amount,'Vegetación inundada');}}
  for(const b of sim.culture.blocks){const h={flood:this.floodAt(b.x,b.z)};if(h.flood>.18)b.health-=h.flood*.008;}
 }
}
