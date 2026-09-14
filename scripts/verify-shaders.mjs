import * as THREE from '../dist/vendor/three.module.js';
import {Ecosystem} from '../dist/simulation.js';
import {GlobeWorld} from '../dist/globe.js';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
globalThis.innerWidth=1280;globalThis.innerHeight=720;globalThis.devicePixelRatio=1;globalThis.window={addEventListener(){}};
const renderer={domElement:{style:{},addEventListener(){}},shadowMap:{},setPixelRatio(){},getPixelRatio(){return 1;},setSize(){},render(){}};
const world=new GlobeWorld({appendChild(){}},new Ecosystem(),{renderer});
const common=`precision highp float;precision highp int;
uniform mat4 viewMatrix;uniform vec3 cameraPosition;uniform bool isOrthographic;
#define NUM_DIR_LIGHTS 1
#define NUM_POINT_LIGHTS 0
#define NUM_SPOT_LIGHTS 0
#define NUM_SPOT_LIGHT_MAPS 0
#define NUM_SPOT_LIGHT_COORDS 0
#define NUM_RECT_AREA_LIGHTS 0
#define NUM_HEMI_LIGHTS 1
#define NUM_DIR_LIGHT_SHADOWS 0
#define NUM_POINT_LIGHT_SHADOWS 0
#define NUM_SPOT_LIGHT_SHADOWS 0
#define NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS 0
#define NUM_CLIPPING_PLANES 0
#define UNION_CLIPPING_PLANES 0
`;
const vertex=`#version 300 es
#define attribute in
#define varying out
#define texture2D texture
${common}
uniform mat4 modelMatrix;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;uniform mat3 normalMatrix;
attribute vec3 position;attribute vec3 normal;attribute vec2 uv;
`;
const fragment=`#version 300 es
#define varying in
#define gl_FragColor pc_fragColor
#define gl_FragDepthEXT gl_FragDepth
#define texture2D texture
#define textureCube texture
${common}
layout(location=0) out highp vec4 pc_fragColor;
#define TONE_MAPPING
${THREE.ShaderChunk.tonemapping_pars_fragment}
vec3 toneMapping(vec3 color){return ACESFilmicToneMapping(color);}
${THREE.ShaderChunk.colorspace_pars_fragment}
vec4 linearToOutputTexel(vec4 value){return sRGBTransferOETF(value);}
`;
const expand=s=>s.replace(/#include <([\w_]+)>/g,(_,name)=>{if(!THREE.ShaderChunk[name])throw Error('Missing shader chunk '+name);return expand(THREE.ShaderChunk[name]);});
const shaders=[];
for(const [name,mesh]of [['ocean',world.ocean],['clouds',world.effects.clouds],['atmosphere',world.halo],['corona',world.effects.corona],['stars',world.effects.stars],['ground',world.land],['vegetation',world.foodMesh]]){
 const m=mesh.material,stock=m.isMeshStandardMaterial;let s=stock?{vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader,uniforms:{}}:{vertexShader:m.vertexShader,fragmentShader:m.fragmentShader};if(stock)m.onBeforeCompile(s);
 let v='',f='';if(name==='ground'){v='#define USE_COLOR\nattribute vec3 color;\n';f='#define USE_COLOR\n';}if(name==='vegetation'){v='#define USE_INSTANCING\n#define USE_INSTANCING_COLOR\nattribute mat4 instanceMatrix;\nattribute vec3 instanceColor;\n';f='#define USE_INSTANCING_COLOR\n';}
 shaders.push({name,vertex:vertex+v+expand(s.vertexShader),fragment:fragment+f+expand(s.fragmentShader)});
}
world.distance=world.desiredDistance=125;world.focus={x:48,z:12};world.render(.016);world.scene.updateMatrixWorld(true);
const meshes=[['ocean',world.ocean],['ground',world.land],['stars',world.effects.stars],['corona',world.effects.corona],['clouds',world.effects.clouds],['atmosphere',world.halo]];
const sun=world.sun.position.clone().normalize().transformDirection(world.camera.matrixWorldInverse),hemi=new THREE.Vector3(0,1,0).transformDirection(world.camera.matrixWorldInverse);
const draw=meshes.map(([name,m])=>{const mv=new THREE.Matrix4().multiplyMatrices(world.camera.matrixWorldInverse,m.matrixWorld),uniforms={projectionMatrix:world.camera.projectionMatrix.toArray(),modelMatrix:m.matrixWorld.toArray(),modelViewMatrix:mv.toArray(),normalMatrix:new THREE.Matrix3().getNormalMatrix(mv).toArray(),viewMatrix:world.camera.matrixWorldInverse.toArray(),cameraPosition:world.camera.position.toArray(),toneMappingExposure:1.15,isOrthographic:0,diffuse:[1,1,1],emissive:[0,0,0],opacity:1,roughness:.93,metalness:0,ambientLightColor:[0,0,0],'directionalLights[0].direction':sun.toArray(),'directionalLights[0].color':world.sun.color.clone().multiplyScalar(world.sun.intensity).toArray(),'hemisphereLights[0].direction':hemi.toArray(),'hemisphereLights[0].skyColor':[.2,.28,.27],'hemisphereLights[0].groundColor':[.03,.05,.07]};for(const [key,u]of Object.entries(m.material.uniforms||{}))uniforms[key]=u.value?.toArray?u.value.toArray():u.value;return{name,attributes:Object.fromEntries(Object.entries(m.geometry.attributes).map(([key,a])=>[key,{size:a.itemSize,data:Array.from(a.array)}])),indices:m.geometry.index?Array.from(m.geometry.index.array):null,points:m.isPoints||false,transparent:m.material.transparent,side:m.material.side,additive:m.material.blending===THREE.AdditiveBlending,uniforms};});
fs.writeFileSync('/tmp/vespera-draw.json',JSON.stringify(draw));
const path='/tmp/vespera-shaders.json';fs.writeFileSync(path,JSON.stringify(shaders));const result=spawnSync('python',['scripts/compile-shaders.py',path],{cwd:new URL('..',import.meta.url),encoding:'utf8'});if(result.status!==0){process.stderr.write(result.stdout+result.stderr);process.exit(result.status||1);}process.stdout.write(result.stdout);
