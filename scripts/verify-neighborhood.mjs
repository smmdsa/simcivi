import assert from 'node:assert/strict';
import {Neighborhood} from '../dist/lifeways.js';
import {distance,xyz,PLANET_RADIUS,POLE} from '../dist/planet.js';

const points=[];
for(let i=0;i<400;i++)points.push({id:i,x:(i*71.119)% (2*Math.PI*PLANET_RADIUS)-Math.PI*PLANET_RADIUS,z:Math.sin(i*13.7)*POLE});
points.push({id:400,x:Math.PI*PLANET_RADIUS-.01,z:0},{id:401,x:-Math.PI*PLANET_RADIUS+.01,z:0});
for(const size of [4,10,12]){
 const index=new Neighborhood(points,size);
 for(const p of points.filter((_,i)=>i%7===0||i>=400))for(const radius of [1.3,6,10,28]){
  const center=xyz(p.x,p.z),expected=[];
  for(let x=Math.floor((center.x-radius)/size);x<=Math.floor((center.x+radius)/size);x++)
   for(let y=Math.floor((center.y-radius)/size);y<=Math.floor((center.y+radius)/size);y++)
    for(let z=Math.floor((center.z-radius)/size);z<=Math.floor((center.z+radius)/size);z++)
     for(const q of points){const v=xyz(q.x,q.z);if(Math.floor(v.x/size)===x&&Math.floor(v.y/size)===y&&Math.floor(v.z/size)===z&&distance(p,q)<=radius)expected.push(q.id);}
  assert.deepEqual(index.near(p,radius).map(q=>q.id),expected);
 }
}
console.log('Neighborhood matches the original search order across radii and the longitude seam.');
