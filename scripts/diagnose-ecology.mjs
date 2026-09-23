import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {Ecosystem,DAY} from '../dist/simulation.js';
import {census} from '../dist/ecology-census.js';

const [seedArg='1726312000000',daysArg='150',out='ecology-diagnostic.json',stepArg='0.1',resumeArg]=process.argv.slice(2);
const seed=Number(seedArg),days=Number(daysArg),step=Number(stepArg);
if(!Number.isSafeInteger(seed)||!Number.isInteger(days)||days<1||days>5000||![.1,.2].includes(step)||resumeArg&&resumeArg!=='--resume')throw Error('Usage: node scripts/diagnose-ecology.mjs SEED DAYS(1..5000) OUTPUT.json [0.1|0.2] [--resume]');
const root=new URL('../dist/',import.meta.url),checkpoint=out+'.checkpoint.json';
const files=fs.readdirSync(root).filter(name=>name.endsWith('.js')).sort();
const hash=crypto.createHash('sha256');for(const name of files){hash.update(name);hash.update(fs.readFileSync(new URL(name,root)));}
const codeHash=hash.digest('hex');
const revision=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
fs.mkdirSync(path.dirname(path.resolve(out)),{recursive:true});
const prior=resumeArg==='--resume'?JSON.parse(fs.readFileSync(checkpoint,'utf8')):null;
if(prior&&(prior.seed!==seed||prior.step!==step||prior.codeHash!==codeHash||prior.days>days||Math.abs(prior.snapshot.time-prior.days*DAY)>.01))throw Error('Checkpoint differs from the requested seed, step, code, or day');
const now=Date.now;Date.now=()=>seed;const sim=new Ecosystem(prior?.snapshot);Date.now=now;
let causes=prior?.causes??{},deathsByFamily=prior?.deathsByFamily??Array.from({length:6},()=>({}));
let birthsByFamily=prior?.birthsByFamily??Array(6).fill(0);
const kill=sim.kill.bind(sim);sim.kill=(c,cause)=>{const key=cause.startsWith('fue alimento')?'depredación':cause;causes[key]=(causes[key]||0)+1;deathsByFamily[c.species][key]=(deathsByFamily[c.species][key]||0)+1;return kill(c,cause);};
const birth=sim.giveBirth.bind(sim);sim.giveBirth=c=>{const before=sim.births;birth(c);if(sim.births>before)birthsByFamily[c.species]++;};
const rows=prior?.rows??[],started=performance.now();let extinctionDay=prior?.extinctionDay??null;
const save=(filename,data)=>{const tmp=filename+'.tmp';fs.writeFileSync(tmp,JSON.stringify(data)+'\n');fs.renameSync(tmp,filename);};
for(let day=(prior?.days??0)+1;day<=days;day++){
 const before=JSON.stringify(sim.snapshot());
 for(let i=0;i<Math.round(DAY/step);i++)sim.step(step);
 const row={...census(sim),day,causes:{...causes},birthsByFamily:[...birthsByFamily],deathsByFamily:deathsByFamily.map(x=>({...x})),migrations:sim.migrations};rows.push(row);
 if(row.animals<20&&(day===1||rows.at(-2).animals>=20)){save(out+`.day-${day}-before.json`,JSON.parse(before));save(out+`.day-${day}-after.json`,sim.snapshot());}
 if(!row.animals&&extinctionDay===null){extinctionDay=day;save(out+`.day-${day}-extinction.json`,sim.snapshot());}
 if(day%10===0||day===days){
  const elapsedSeconds=(prior?.elapsedSeconds??0)+(performance.now()-started)/1000;
  const common={seed,worldSeed:sim.worldSeed,step,days:day,revision,codeHash,extinctionDay,rows,elapsedSeconds};
  save(checkpoint,{...common,causes,deathsByFamily,birthsByFamily,snapshot:sim.snapshot()});
  save(out,common);
  console.log(JSON.stringify({seed,day,animals:row.animals,bySpecies:row.bySpecies,plants:row.plants,seeds:row.seedBank,elapsedSeconds:Math.round(elapsedSeconds)}));
 }
}
