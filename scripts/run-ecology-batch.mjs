import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const manifest=JSON.parse(fs.readFileSync(new URL('../docs/verification/ecology-seeds.json',import.meta.url),'utf8'));
const directory=path.resolve(process.argv[2]??'docs/verification/ecology-v4.7.1');
fs.mkdirSync(directory,{recursive:true});
for(const seed of manifest.seeds){
 const output=path.join(directory,`${seed}.json`),resume=fs.existsSync(output+'.checkpoint.json');
 const args=['scripts/diagnose-ecology.mjs',String(seed),String(manifest.days),output,String(manifest.step),...(resume?['--resume']:[])];
 const result=spawnSync(process.execPath,args,{stdio:'inherit'});
 if(result.status!==0)process.exit(result.status??1);
}
