import crypto from 'node:crypto';

export function migrateCheckpoint({checkpoint,sourceCodeHash,currentCodeHash,sourceSimClass,targetSimClass,revision,steps}){
 if(checkpoint.codeHash!==sourceCodeHash)throw Error('Checkpoint source code hash differs from the baseline');
 if(!Number.isSafeInteger(checkpoint.seed)||!Number.isInteger(checkpoint.days)||checkpoint.days<0||
    ![.1,.2].includes(checkpoint.step)||Math.abs(checkpoint.snapshot.time-checkpoint.days*160)>.01||
    checkpoint.rows.length!==checkpoint.days||!Number.isInteger(steps)||steps<1)throw Error('Invalid checkpoint or comparison length');
 const baseline=new sourceSimClass(checkpoint.snapshot),current=new targetSimClass(checkpoint.snapshot);
 for(let i=0;i<steps;i++){baseline.step(checkpoint.step);current.step(checkpoint.step);}
 const left=JSON.stringify(baseline.snapshot()),right=JSON.stringify(current.snapshot());
 if(left!==right)throw Error(`Ecological continuations diverge at seed ${checkpoint.seed} after ${steps} steps`);
 return {...checkpoint,revision,codeHash:currentCodeHash,
  migration:{sourceRevision:checkpoint.revision,sourceCodeHash,validatedSteps:steps,
   continuationDigest:crypto.createHash('sha256').update(left).digest('hex')}};
}
