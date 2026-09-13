import assert from 'node:assert/strict';
import {NotificationQueue} from '../dist/notifications.js';
// Deterministic clock + DOM stand-in, testing queue identity, capacity and expiration independently of rendering.
class Node{constructor(doc){this.ownerDocument=doc;this.children=[];this.classList={add:c=>this.fade=c};}append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}remove(){this.parent.children.splice(this.parent.children.indexOf(this),1);}addEventListener(){}}
const doc={createElement:()=>new Node(doc)},root=new Node(doc),jobs=[];let now=0;const timers={setTimeout:(fn,dt)=>jobs.push({at:now+dt,fn})};function tick(t){while(true){jobs.sort((a,b)=>a.at-b.at);if(!jobs.length||jobs[0].at>t)break;const j=jobs.shift();now=j.at;j.fn();}now=t;}
const q=new NotificationQueue(root,{timers});for(let i=0;i<25;i++)q.push({text:'Aviso '+i});assert.equal(q.active.size,10);assert.equal(q.pending.length,15);const first=root.children[0];tick(999);assert.equal(root.children[0],first);assert.equal(first.fade,undefined);tick(1000);assert.equal(first.fade,'leaving');assert.equal(q.active.size,10);tick(1160);assert(!q.active.has(first));assert.equal(q.active.size,10);assert.equal(q.pending.length,5);tick(4000);assert.equal(q.active.size,0);assert.equal(root.children.length,0);
console.log('PASS: stable notifications, FIFO, ten visible, 1000ms dwell and 160ms fade');
