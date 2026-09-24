import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {DAY} from '../dist/simulation.js';
import {migrateCheckpoint} from './ecology-checkpoint-migration.mjs';

const [baselineDir,sourceDir,outputDir,seedArg]=process.argv.slice(2);
if(!baselineDir||!sourceDir||!outputDir||path.resolve(sourceDir)===path.resolve(outputDir)){
 throw Error('Usage: node scripts/migrate-ecology-checkpoints.mjs BASELINE_DIST SOURCE_DIR OUTPUT_DIR [SEED]');
}
const manifest=JSON.parse(fs.readFileSync(new URL('../docs/verification/ecology-seeds.json',import.meta.url),'utf8'));
const seeds=seedArg?[Number(seedArg)]:manifest.seeds;
if(seeds.some(seed=>!manifest.seeds.includes(seed)))throw Error('Seed is not in the declared manifest');
const digest=directory=>{const dir=directory instanceof URL?fileURLToPath(directory):directory,hash=crypto.createHash('sha256');for(const name of fs.readdirSync(dir).filter(name=>name.endsWith('.js')).sort()){
 hash.update(name);hash.update(fs.readFileSync(path.join(dir,name)));
}return hash.digest('hex');};
const sourceCodeHash=digest(baselineDir),currentCodeHash=digest(new URL('../dist/',import.meta.url));
const {Ecosystem:sourceSimClass}=await import(pathToFileURL(path.resolve(baselineDir,'simulation.js')).href);
const {Ecosystem:targetSimClass}=await import('../dist/simulation.js');
const revision=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
fs.mkdirSync(outputDir,{recursive:true});
for(const seed of seeds){
 const filename=`${seed}.json.checkpoint.json`,destination=path.join(outputDir,filename);
 if(fs.existsSync(destination)){
  const existing=JSON.parse(fs.readFileSync(destination,'utf8'));
  if(existing.seed===seed&&existing.codeHash===currentCodeHash&&existing.days>=20){console.log(JSON.stringify({seed,days:existing.days,status:'already migrated'}));continue;}
  throw Error(`Existing checkpoint differs: ${destination}`);
 }
 const checkpoint=JSON.parse(fs.readFileSync(path.join(sourceDir,filename),'utf8'));
 if(checkpoint.seed!==seed||checkpoint.days!==20||checkpoint.step!==manifest.step)throw Error(`Unexpected checkpoint: ${filename}`);
 const migrated=migrateCheckpoint({checkpoint,sourceCodeHash,currentCodeHash,sourceSimClass,targetSimClass,
  revision,steps:Math.round(DAY/manifest.step)});
 const proof={seed,days:checkpoint.days,step:checkpoint.step,migration:migrated.migration,currentCodeHash};
 for(const [name,data] of [[destination,migrated],[path.join(outputDir,`${seed}.migration.json`),proof]]){
  fs.writeFileSync(name+'.tmp',JSON.stringify(data)+'\n');fs.renameSync(name+'.tmp',name);
 }
 console.log(JSON.stringify({seed,days:checkpoint.days,status:'validated',digest:migrated.migration.continuationDigest}));
}
