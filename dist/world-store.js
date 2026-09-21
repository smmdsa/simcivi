const KEY='vespera-world-v2';
// Atomic IndexedDB writes keep growing worlds out of the small localStorage quota.
export class WorldStore {
 constructor(options={}){
  this.options=options;this.database=null;
 }
 // Access may throw: defer browser getters until the caller's async error boundary.
 get indexedDB(){return 'indexedDB' in this.options?this.options.indexedDB:globalThis.indexedDB;}
 get legacy(){return 'localStorage' in this.options?this.options.localStorage:globalThis.localStorage;}
 open(){
  if(!this.indexedDB)return Promise.resolve(null);
  if(!this.database)this.database=new Promise((resolve,reject)=>{
   const request=this.indexedDB.open('vespera-worlds',1);let blocked=false;
   request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('worlds'))request.result.createObjectStore('worlds');};
   request.onerror=()=>reject(request.error||Error('No se pudo abrir el guardado.'));
   request.onblocked=()=>{blocked=true;reject(Error('Cerrá las otras pestañas de Véspera para abrir el guardado.'));};
   request.onsuccess=()=>{const db=request.result;if(blocked){db.close();return;}db.onversionchange=()=>db.close();resolve(db);};
  });
  return this.database;
 }
 async read(){
  const db=await this.open();let saved;
  if(db)saved=await new Promise((resolve,reject)=>{
   const tx=db.transaction('worlds','readonly'),request=tx.objectStore('worlds').get(KEY);
   tx.oncomplete=()=>resolve(request.result);
   tx.onerror=tx.onabort=()=>reject(tx.error||Error('No se pudo leer la partida.'));
  });
  if(saved!==undefined)return saved;
  const raw=this.legacy?.getItem(KEY);return raw?JSON.parse(raw):undefined;
 }
 async write(snapshot){
  const db=await this.open();
  if(!db){if(!this.legacy)throw Error('El navegador no ofrece almacenamiento.');this.legacy.setItem(KEY,JSON.stringify(snapshot));return;}
  await new Promise((resolve,reject)=>{
   const tx=db.transaction('worlds','readwrite');
   tx.oncomplete=resolve;tx.onerror=tx.onabort=()=>reject(tx.error||Error('No se pudo guardar la partida.'));
   tx.objectStore('worlds').put(snapshot,KEY);
  });
 }
}
