import fs from 'node:fs';
import path from 'node:path';
import {Ecosystem,DAY} from '../dist/simulation.js';
import {census} from '../dist/ecology-census.js';
const [seedArg='1726312000000',daysArg='150',out='ecology-diagnostic.json',stepArg='0.1',resumeArg]=process.argv.slice(2);
const seed=Number(seedArg),days=Number(daysArg),step=Number(stepArg);
if(!Number.isSafeInteger(seed)||!Number.isInteger(days)||days<1||days>5000||![.1,.2].includes(step))throw Error('Usage: node scripts/diagnose-ecology.mjs SEED DAYS(1..5000) OUTPUT.json [STEP: 0.1|0.2] [--resume]');
fs.mkdirSync(path.dirname(path.resolve(out)),{recursive:true});
const prior=resumeArg==='--resume'?JSON.parse(fs.readFileSync(out,'utf8')):null;
const saved=prior?JSON.parse(fs.readFileSync(out+'.checkpoint.json','utf8')):undefined;
if(prior&&(prior.seed!==seed||prior.step!==step||Math.abs(saved.time-prior.days*DAY)>.01))throw Error('Checkpoint does not match the requested run');
const now=Date.now;Date.now=()=>seed;const sim=new Ecosystem(saved);Date.now=now;
const kill=sim.kill.bind(sim),causes={...prior?.rows.at(-1)?.causes};sim.kill=(c,cause)=>{const key=cause.startsWith('fue alimento')?'depredación':cause;causes[key]=(causes[key]||0)+1;return kill(c,cause);};
const rows=prior?.rows??[],start=performance.now();let extinctionDay=prior?.extinctionDay??null,previous=JSON.stringify(sim.snapshot()),checkpointed=fs.existsSync(out+'.before-collapse.json');
for(let day=(prior?.days??0)+1;day<=days;day++){
 for(let i=0;i<Math.round(DAY/step);i++)sim.step(step);
 const row={...census(sim),day,causes:{...causes}};rows.push(row);
 if(!checkpointed&&row.animals<20){fs.writeFileSync(out+'.before-collapse.json',previous);checkpointed=true;}
 if(!row.animals&&extinctionDay===null){extinctionDay=day;fs.writeFileSync(out+'.extinction.json',JSON.stringify(sim.snapshot()));}
 previous=JSON.stringify(sim.snapshot());
 if(day%10===0||day===days){const report={seed,worldSeed:sim.worldSeed,step,days:day,extinctionDay,rows,elapsedSeconds:(prior?.elapsedSeconds??0)+(performance.now()-start)/1000};fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');fs.writeFileSync(out+'.checkpoint.json',previous);console.log(JSON.stringify({seed,day,animals:row.animals,plants:row.plants,seeds:row.seedBank,bio:row.biosphere?.phase}));}
}
