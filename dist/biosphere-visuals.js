import * as THREE from './vendor/three.module.js';
import {move,clamp} from './planet.js';
export const MAX_COLONIES=256,MAX_MICROFAUNA=256;
const active=group=>group.reduce((n,q)=>n+q.active,0);
// Magnified aggregate indicators: a dot is not a simulated individual animal.
export class BiosphereVisuals {
 constructor(world){
  this.world=world;
  const mesh=(count,paint)=>{
   const m=new THREE.InstancedMesh(new THREE.SphereGeometry(1,6,4),new THREE.MeshStandardMaterial({color:paint,roughness:.9}),count);
   m.count=0;m.frustumCulled=false;m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
   m.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(count*3),3);world.scene.add(m);return m;
  };
  this.colonies=mesh(MAX_COLONIES,'#73bb83');this.fauna=mesh(MAX_MICROFAUNA,'#ecd4a1');
 }
 update(time){
  const w=this.world,b=w.sim.biosphere,limit=w.qualityTier===2?96:MAX_COLONIES;let colonies=0,fauna=0;
  if(b)for(let i=0;i<b.cells.length;i++){
   const site=w.sim.environment.geo[i],c=b.cells[i],mass=active(c.guilds[0]),consumers=active(c.guilds[2]);
   const h=site.water?Math.max(.06,w.sim.groundHeight(site.x,site.z)+.08):w.sim.groundHeight(site.x,site.z)+.05;
   if(!w.visible(site.x,site.z,h+1))continue;
   if(mass>=.3&&colonies<limit){const r=clamp(Math.sqrt(mass)*.55,.18,1.3);
    w.place(this.colonies,colonies++,site.x,site.z,h,r,.04+r*.04,r*.7,site.water?'#66c1b2':'#8cc06b',i*2.4);
   }
   if(consumers>.03&&fauna<MAX_MICROFAUNA&&w.distance<55&&w.qualityTier<2){
    const count=Math.min(3,Math.ceil(consumers*4));
    for(let j=0;j<count&&fauna<MAX_MICROFAUNA;j++){
     const angle=time*.4+i*2.4+j*2.1,p=move(site.x,site.z,Math.sin(angle)*.55,Math.cos(angle)*.55);
     w.place(this.fauna,fauna++,p.x,p.z,h+.14,.07,.045,.13,site.water?'#b2e6ec':'#ddbc87',angle);
    }
   }
  }
  w.finish(this.colonies,colonies);w.finish(this.fauna,fauna);
 }
 dispose(){for(const mesh of [this.colonies,this.fauna]){this.world.scene.remove(mesh);mesh.geometry.dispose();mesh.material.dispose();mesh.dispose();}}
}
