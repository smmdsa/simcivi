import assert from 'node:assert/strict';
import {WorldStore} from '../dist/world-store.js';
const values=new Map(),legacy={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
const store=new WorldStore({indexedDB:null,localStorage:legacy});
assert.equal(await store.read(),undefined);await store.write({version:8,time:42});assert.equal((await store.read()).time,42);
values.set('vespera-world-v2','broken');await assert.rejects(()=>store.read());assert.equal(values.get('vespera-world-v2'),'broken');
const denied=new WorldStore({indexedDB:{open(){throw Error('denied');}},localStorage:legacy});await assert.rejects(()=>denied.read(),/denied/);
const full=new WorldStore({indexedDB:null,localStorage:{...legacy,setItem(){throw Error('quota');}}});await assert.rejects(()=>full.write({version:8}),/quota/);
// Browser accessors can themselves throw in restricted/privacy contexts.
for(const name of ['localStorage','indexedDB']){
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,name);
 try{
  Object.defineProperty(globalThis,name,{configurable:true,get(){throw Error('storage getter denied');}});
  let guarded;assert.doesNotThrow(()=>{guarded=new WorldStore(name==='localStorage'?{indexedDB:null}:{localStorage:legacy});},'Module setup must reach the caught async startup');
  await assert.rejects(()=>guarded.read(),/storage getter denied/);
 }finally{if(descriptor)Object.defineProperty(globalThis,name,descriptor);else delete globalThis[name];}
}

// Controlled browser transaction boundary: request success is not a committed save.
// Keep the backend independent of WorldStore and explicitly drive commit/abort.
const committed=new Map(),pending=[];
const db={objectStoreNames:{contains:()=>true},close(){},transaction(_name,mode){
 const tx={mode,result:undefined,write:undefined,objectStore(){return {
  get(key){const request={result:structuredClone(committed.get(key))};tx.result=request;return request;},
  put(value,key){tx.write=[key,structuredClone(value)];return {};}
 };},commit(){if(tx.write)committed.set(...tx.write);tx.oncomplete?.();},
 abort(){tx.error=Error('transaction aborted');tx.onabort?.();}};
 pending.push(tx);return tx;
}};
const indexedDB={open(){const request={result:db};queueMicrotask(()=>request.onsuccess());return request;}};
values.set('vespera-world-v2',JSON.stringify({version:7,time:12}));
const primary=new WorldStore({indexedDB,localStorage:legacy});
await primary.open();
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const oldRead=primary.read();await tick();assert.equal(pending[0].mode,'readonly');pending.shift().commit();
assert.deepEqual(await oldRead,{version:7,time:12},'An empty IDB database reads the old localStorage world');
const large={version:8,time:43,payload:'x'.repeat(6*1024*1024)};
let confirmed=false;const saving=primary.write(large).then(()=>{confirmed=true;});await tick();
assert.equal(confirmed,false,'Save must wait for transaction commit');
assert.equal(committed.size,0);large.time=99;pending.shift().commit();await saving;assert(confirmed);
const read=primary.read();await tick();pending.shift().commit();const restored=await read;
assert.equal(restored.time,43,'The stored snapshot is an isolated clone');assert.equal(restored.payload.length,6*1024*1024);
assert.equal(JSON.parse(values.get('vespera-world-v2')).version,7,'Migration preserves the legacy backup');
const failure=primary.write({version:8,time:44});const rejected=assert.rejects(()=>failure,/transaction aborted/);
await tick();pending.shift().abort();await rejected;assert.equal(committed.get('vespera-world-v2').time,43,'An aborted save preserves the last committed world');
const readFailure=primary.read();const readRejected=assert.rejects(()=>readFailure,/transaction aborted/);await tick();pending.shift().abort();await readRejected;
console.log('PASS: large IDB snapshots, commit/abort boundaries, legacy migration and explicit quota/permission/corruption errors.');
