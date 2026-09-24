import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {Ecosystem} from '../dist/simulation.js';
import {migrateCheckpoint} from './ecology-checkpoint-migration.mjs';

const previous=Date.now;Date.now=()=>1726312000000;
const sim=new Ecosystem();Date.now=previous;
const original={seed:1726312000000,step:.1,days:0,revision:'source',codeHash:'old-code',
 worldSeed:sim.worldSeed,rows:[],snapshot:sim.snapshot()};
const unchanged=JSON.stringify(original);
const input={checkpoint:original,sourceCodeHash:'old-code',currentCodeHash:'new-code',
 sourceSimClass:Ecosystem,targetSimClass:Ecosystem,revision:'target',steps:10};

const migrated=migrateCheckpoint(input);
assert.equal(migrated.codeHash,'new-code');
assert.equal(migrated.revision,'target');
assert.equal(JSON.stringify(migrated.snapshot),JSON.stringify(original.snapshot));
assert.equal(JSON.stringify(original),unchanged,'migration must preserve the original evidence');
assert.equal(migrated.migration.validatedSteps,10);
assert.equal(migrated.migration.sourceCodeHash,'old-code');
assert.match(migrated.migration.continuationDigest,/^[a-f0-9]{64}$/);

assert.throws(()=>migrateCheckpoint({...input,checkpoint:{...original,codeHash:'unrelated'}}),/source|hash/i);
class DivergentEcosystem extends Ecosystem {step(dt){super.step(dt);this.time+=.01;}}
assert.throws(()=>migrateCheckpoint({...input,targetSimClass:DivergentEcosystem}),/diverge|differ/i);
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'vespera-migration-'));
try{
 const files=fs.readdirSync(new URL('../dist/',import.meta.url)).filter(f=>f.endsWith('.js')).sort();
 const hash=crypto.createHash('sha256');for(const file of files){hash.update(file);hash.update(fs.readFileSync(new URL('../dist/'+file,import.meta.url)));}
 const output=path.join(dir,'run.json'),codeHash=hash.digest('hex');
 fs.writeFileSync(output+'.checkpoint.json',JSON.stringify({...migrated,codeHash,step:.2}));
 const run=spawnSync(process.execPath,['scripts/diagnose-ecology.mjs',String(original.seed),'2',output,'0.2','--resume'],{cwd:new URL('../',import.meta.url),encoding:'utf8'});
 assert.equal(run.status,0,run.stderr);
 assert.equal(run.stdout.trim().split('\n').length,2,'the long run must confirm each simulated day');
 assert.deepEqual(JSON.parse(fs.readFileSync(output,'utf8')).migration,migrated.migration,'reports must retain the validation evidence');
 assert.deepEqual(JSON.parse(fs.readFileSync(output+'.checkpoint.json','utf8')).migration,migrated.migration,'restarts must retain the validation evidence');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
console.log('PASS: a checkpoint migrates only after exact continuation and retains its provenance');
