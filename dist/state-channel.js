// Ordered worker transport. The authoritative simulation and saved snapshots stay complete.
export class StateEncoder {
 constructor(){this.dna=new Map();this.genes=new Map();this.lastDeaths=-1;}
 encode(source,full=false){
  if(full){this.dna.clear();this.genes.clear();}
  const state={...source},ids=new Set();
  for(const key of ['creatures','remains','archive']){
   if(key==='archive'&&!full&&source.deaths===this.lastDeaths){delete state.archive;for(const c of source.archive)ids.add(c.id);continue;}
   state[key]=source[key].map(c=>{ids.add(c.id);const revision=c.dna?c.dna.seed+':'+c.dna.revision:null;
    if(!full&&revision&&this.dna.get(c.id)===revision){const {dna,...record}=c;return record;}
    if(revision)this.dna.set(c.id,revision);return c;});
  }
  const foodIds=new Set();state.food=source.food.map(f=>{foodIds.add(f.id);if(!full&&this.genes.get(f.id)===f.genes){const {genes,...record}=f;return record;}this.genes.set(f.id,f.genes);return f;});
  for(const id of this.dna.keys())if(!ids.has(id))this.dna.delete(id);
  for(const id of this.genes.keys())if(!foodIds.has(id))this.genes.delete(id);
  this.lastDeaths=source.deaths;return{state,encoding:full?'full':'delta'};
 }
}
export class StateDecoder {
 constructor(){this.dna=new Map();this.genes=new Map();this.archive=[];this.ready=false;}
 decode({state,encoding='full'}){
  if(encoding==='full'){this.dna.clear();this.genes.clear();this.archive=[];this.ready=true;}
  if(!this.ready)throw Error('Se necesita un estado completo para sincronizar la vista.');
  const out={...state},ids=new Set();
  for(const key of ['creatures','remains','archive']){
   if(key==='archive'&&!state.archive){out.archive=this.archive;for(const c of this.archive)ids.add(c.id);continue;}
   out[key]=state[key].map(c=>{ids.add(c.id);if(c.dna)this.dna.set(c.id,c.dna);const dna=c.dna||this.dna.get(c.id);if(!dna&&key!=='remains')throw Error('Falta el genoma de una criatura.');return dna?{...c,dna}:c;});
  }
  this.archive=out.archive;const foodIds=new Set();out.food=state.food.map(f=>{foodIds.add(f.id);if(f.genes)this.genes.set(f.id,f.genes);const genes=f.genes||this.genes.get(f.id);if(!genes)throw Error('Falta la herencia de una planta.');return{...f,genes};});
  for(const id of this.dna.keys())if(!ids.has(id))this.dna.delete(id);
  for(const id of this.genes.keys())if(!foodIds.has(id))this.genes.delete(id);
  return out;
 }
}
