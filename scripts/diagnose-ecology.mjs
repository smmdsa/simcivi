import fs from 'node:fs';
import path from 'node:path';
import {Ecosystem,DAY} from '../dist/simulation.js';
import {census} from '../dist/ecology-census.js';
const [seedArg='1726312000000',daysArg='150',out='ecology-diagnostic.json']=process.argv.slice(2);
const seed=Number(seedArg),days=Number(daysArg);
if(!Number.isSafeInteger(seed)||!Number.isInteger(days)||days<1||days>5000)throw Error('Usage: node scripts/diagnose-ecology.mjs SEED DAYS(1..5000) OUTPUT.json');
fs.mkdirSync(path.dirname(path.resolve(out)),{recursive:true});
const now=Date.now;Date.now=()=>seed;const sim=new Ecosystem();Date.now=now;
const kill=sim.kill.bind(sim),causes={};sim.kill=(c,cause)=>{const key=cause.startsWith('fue alimento')?'depredación':cause;causes[key]=(causes[key]||0)+1;return kill(c,cause);};
const rows=[],start=performance.now();let extinctionDay=null,previous=JSON.stringify(sim.snapshot()),checkpointed=false;
for(let day=1;day<=days;day++){
 for(let i=0;i<DAY*10;i++)sim.step(.1);
 const row={...census(sim),day,causes:{...causes}};rows.push(row);
 if(!checkpointed&&row.animals<20){fs.writeFileSync(out+'.before-collapse.json',previous);checkpointed=true;}
 if(!row.animals&&extinctionDay===null){extinctionDay=day;fs.writeFileSync(out+'.extinction.json',JSON.stringify(sim.snapshot()));}
 previous=JSON.stringify(sim.snapshot());
 if(day%10===0||day===days){const report={seed,worldSeed:sim.worldSeed,days:day,extinctionDay,rows,elapsedSeconds:(performance.now()-start)/1000};fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');fs.writeFileSync(out+'.checkpoint.json',previous);console.log(JSON.stringify({seed,day,animals:row.animals,plants:row.plants,seeds:row.seedBank,bio:row.biosphere?.phase}));}
}
