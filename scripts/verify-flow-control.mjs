import assert from 'node:assert/strict';
import {Worker} from 'node:worker_threads';

const worker=new Worker(new URL('./fixtures/worker-node.mjs',import.meta.url));
const messages=[];
worker.on('message',m=>messages.push(m));
const until=async check=>{for(let i=0;i<100;i++){const found=messages.find(check);if(found)return found;await new Promise(resolve=>setTimeout(resolve,20));}throw Error('Timed out waiting for worker state');};
try{
 worker.postMessage({type:'init'});
 const ready=await until(m=>m.type==='ready');
 assert.equal(typeof ready.sequence,'number');
 await new Promise(resolve=>setTimeout(resolve,350));
 assert.equal(messages.filter(m=>m.type==='state').length,0,'unread states must not queue');
 worker.postMessage({type:'ack',sequence:ready.sequence});
 const next=await until(m=>m.type==='state');
 assert(next.state.time>=ready.state.time);
 console.log('PASS: slow visual consumers receive the latest state without a growing queue');
}finally{await worker.terminate();}
