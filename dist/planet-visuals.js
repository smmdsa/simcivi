import * as THREE from './vendor/three.module.js';
import {coordinates,geography,PLANET_RADIUS as R,clamp,xyz,move,terrain} from './planet.js';
import {ENV_WIDTH,ENV_HEIGHT} from './environment.js';
import {TIERS} from './render-budget.js';
// A few surface passes, without screen-space blur or full-screen postprocessing chains.
export const noiseGLSL=`
float hash3(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash3(i),hash3(i+vec3(1,0,0)),f.x),mix(hash3(i+vec3(0,1,0)),hash3(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash3(i+vec3(0,0,1)),hash3(i+vec3(1,0,1)),f.x),mix(hash3(i+vec3(0,1,1)),hash3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float cloudsAt(vec3 p,float time){p*=8.;p+=vec3(time*.005,0.,-time*.003);return noise3(p)*.58+noise3(p*2.03)*.28+noise3(p*4.07)*.14;}
`;
export const surfaceVertex=`varying vec3 vP;varying float vDepth;attribute float basinDepth;void main(){vec4 p=modelMatrix*vec4(position,1.);vP=p.xyz;vDepth=basinDepth;gl_Position=projectionMatrix*viewMatrix*p;}`;
const surfaceFragmentHeader=`uniform vec3 uSun;uniform float uTime;uniform float uWet;uniform float uDetail;uniform sampler2D uWeather;varying vec3 vP;varying float vDepth;${noiseGLSL}`;
export const oceanFragment=surfaceFragmentHeader+`
void main(){vec3 radial=normalize(vP),view=normalize(cameraPosition-vP);float incidence=dot(radial,uSun),day=smoothstep(-.14,.3,incidence);
vec3 ripple=vec3(sin(vP.z*3.+uTime*.7),sin(vP.x*2.7-uTime*.6),cos(vP.y*3.2+uTime*.5));vec3 n=normalize(radial+ripple*.017*uDetail);
float shallow=1.-smoothstep(.015,.62,vDepth);vec3 sea=mix(vec3(.009,.065,.105),vec3(.055,.34,.32),shallow);
float fresnel=pow(1.-max(0.,dot(n,view)),4.);float glint=pow(max(0.,dot(reflect(-uSun,n),view)),150.)*max(0.,incidence);
float foam=(1.-smoothstep(.008,.075,vDepth))*smoothstep(.65,.9,noise3(vP*2.+uTime*.05))*uDetail;
vec3 rgb=sea*(.12+max(0.,incidence)*1.6)+vec3(.11,.27,.34)*fresnel*day+vec3(1.,.84,.48)*glint*1.5;
rgb+=vec3(.10,.18,.16)*foam*day;rgb+=vec3(.005,.025,.05)*(1.-day);gl_FragColor=vec4(rgb,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;
export const cloudFragment=surfaceFragmentHeader+`
void main(){vec3 n=normalize(vP);float sun=dot(n,uSun),density=cloudsAt(n,uTime),localCloud=texture2D(uWeather,vec2(atan(n.x,n.z)/6.2831853+.5,n.y*.5+.5)).r,threshold=mix(.78,.43,localCloud),cloud=smoothstep(threshold,threshold+.12,density);
float edge=smoothstep(threshold,threshold+.04,density)*(1.-smoothstep(threshold+.04,threshold+.12,density));
vec3 tint=mix(vec3(.07,.14,.22),vec3(.85,.88,.76),smoothstep(-.2,.6,sun));tint=mix(tint,vec3(1.,.46,.21),exp(-abs(sun)*9.)*.6);
float grazing=pow(1.-abs(dot(n,normalize(cameraPosition-vP))),2.);float alpha=cloud*(.22+.18*localCloud)*uDetail;
gl_FragColor=vec4(tint+edge*vec3(.12,.09,.04)*max(sun,0.),alpha*pow(max(0.,1.-grazing),3.));
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;
export const atmosphereFragment=surfaceFragmentHeader+`
void main(){vec3 n=normalize(vP),v=normalize(cameraPosition-vP);float sun=dot(n,uSun),rim=pow(1.-abs(dot(n,v)),3.2),twilight=exp(-abs(sun)*6.);
vec3 tint=mix(vec3(.06,.2,.46),vec3(.2,.62,.83),smoothstep(-.35,.6,sun));tint=mix(tint,vec3(1.,.38,.10),twilight*.72);
gl_FragColor=vec4(tint,rim*(.16+.43*smoothstep(-.5,.3,sun)));
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;
function meshMaterial(uniforms,fragment,options={}){return new THREE.ShaderMaterial({uniforms,vertexShader:surfaceVertex,fragmentShader:fragment,...options});}
function addDepth(geo){const p=geo.attributes.position,depth=new Float32Array(p.count),v=new THREE.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const q=coordinates(v);depth[i]=Math.max(0,-geography(q.x,q.z).height);}geo.setAttribute('basinDepth',new THREE.BufferAttribute(depth,1));}
export class PlanetVisuals {
 constructor(world){this.world=world;this.uniforms={uSun:{value:new THREE.Vector3(0,0,1)},uTime:{value:0},uWet:{value:.5},uDetail:{value:1}};
  addDepth(world.ocean.geometry);world.ocean.material.dispose();world.ocean.material=meshMaterial(this.uniforms,oceanFragment);
  const cloudGeometry=new THREE.SphereGeometry(R+4.2,96,64);addDepth(cloudGeometry);this.clouds=new THREE.Mesh(cloudGeometry,meshMaterial({...this.uniforms,uDetail:{value:1}},cloudFragment,{transparent:true,depthWrite:false}));this.clouds.renderOrder=3;world.scene.add(this.clouds);
  world.halo.geometry.dispose();world.halo.material.dispose();world.halo.geometry=new THREE.SphereGeometry(R+1.5,96,64);addDepth(world.halo.geometry);world.halo.material=meshMaterial(this.uniforms,atmosphereFragment,{transparent:true,depthWrite:false,side:THREE.BackSide});world.halo.renderOrder=4;
  this.corona=new THREE.Mesh(new THREE.PlaneGeometry(18,18),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{},vertexShader:'varying vec2 uv0;void main(){uv0=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 uv0;void main(){float r=length(uv0-.5)*2.;float glow=pow(max(0.,1.-r),4.);gl_FragColor=vec4(1.,.58,.2,glow*.65);}'}));world.scene.add(this.corona);world.sunOrb.scale.setScalar(.7);
  this.weatherBytes=new Uint8Array(ENV_WIDTH*ENV_HEIGHT*4);this.weatherTexture=new THREE.DataTexture(this.weatherBytes,ENV_WIDTH,ENV_HEIGHT);this.weatherTexture.magFilter=this.weatherTexture.minFilter=THREE.LinearFilter;this.weatherTexture.wrapS=THREE.RepeatWrapping;this.uniforms.uWeather={value:this.weatherTexture};this.clouds.material.uniforms.uWeather=this.uniforms.uWeather;
  const rainGeometry=new THREE.BufferGeometry();rainGeometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(160*6),3));this.rainLines=new THREE.LineSegments(rainGeometry,new THREE.LineBasicMaterial({color:'#b1d9e1',transparent:true,opacity:.32,depthWrite:false}));this.rainLines.frustumCulled=false;world.scene.add(this.rainLines);
  this.installGround();this.installVegetation();this.installStars();
 }
 installGround(){const u=this.uniforms;this.world.land.material.onBeforeCompile=s=>{Object.assign(s.uniforms,u);s.vertexShader='varying vec3 vSurface;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSurface=normalize(position);');s.fragmentShader='varying vec3 vSurface;uniform vec3 uSun;uniform float uTime;uniform float uWet;uniform float uDetail;uniform sampler2D uWeather;\n'+noiseGLSL+s.fragmentShader;
   s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
float grain=uDetail>.5?noise3(vSurface*230.):.5;float broad=noise3(vSurface*32.);diffuseColor.rgb*=.88+.13*broad+.08*grain*uDetail;
float snow=smoothstep(.75,.94,abs(vSurface.y));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.68,.78,.75),snow*.7);
float weatherCloud=texture2D(uWeather,vec2(atan(vSurface.x,vSurface.z)/6.2831853+.5,vSurface.y*.5+.5)).r;
float shade=(uDetail>.5?smoothstep(.54,.69,cloudsAt(vSurface,uTime)):0.)*max(0.,dot(vSurface,uSun))*weatherCloud*uDetail;
diffuseColor.rgb*=1.-shade*.18;`);
  };this.world.land.material.customProgramCacheKey=()=> 'vespera-ground-1';this.world.land.material.needsUpdate=true;
 }
 installVegetation(){const mesh=this.world.foodMesh,u=this.uniforms;this.world.bioGlow=new Float32Array(15000);mesh.geometry.setAttribute('bioGlow',new THREE.InstancedBufferAttribute(this.world.bioGlow,1));
  mesh.material.onBeforeCompile=s=>{s.uniforms.uSun=u.uSun;s.vertexShader='attribute float bioGlow;uniform vec3 uSun;varying float vGlow;\n'+s.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
vec3 vesperaInstance=(modelMatrix*instanceMatrix*vec4(position,1.)).xyz;vGlow=bioGlow*(1.-smoothstep(-.15,.2,dot(normalize(vesperaInstance),uSun)));`);s.fragmentShader='varying float vGlow;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=vec3(.55,.8,.28)*vGlow;');};mesh.material.customProgramCacheKey=()=> 'vespera-nectar-1';mesh.material.needsUpdate=true;
 }
 installStars(){for(const o of [...this.world.scene.children])if(o.isPoints){this.world.scene.remove(o);o.geometry.dispose();o.material.dispose();}const positions=[],sizes=[],colors=[];let seed=81329;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<1300;i++){const y=rand()*2-1,a=rand()*Math.PI*2,r=Math.sqrt(1-y*y);positions.push(Math.sin(a)*r*300,y*300,Math.cos(a)*r*300);sizes.push(.7+rand()*1.2);const warm=rand();colors.push(.62+warm*.3,.7+warm*.12,.93-warm*.22);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('starSize',new THREE.Float32BufferAttribute(sizes,1));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));this.stars=new THREE.Points(g,new THREE.ShaderMaterial({uniforms:{uOpacity:{value:.7},uPixelRatio:{value:1}},vertexShader:'attribute float starSize;attribute vec3 color;varying vec3 tint;uniform float uPixelRatio;void main(){tint=color;gl_PointSize=starSize*uPixelRatio;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 tint;uniform float uOpacity;void main(){float r=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(tint,(1.-smoothstep(.25,1.,r))*uOpacity);}',transparent:true,depthWrite:false}));this.world.scene.add(this.stars);}
 update(sun,time){const w=this.world,environment=w.sim.environment;
  if(environment&&this.weatherRevision!==environment.revision){this.weatherRevision=environment.revision;environment.cells.forEach((c,i)=>{this.weatherBytes[i*4]=Math.round(clamp(c.cloud/.12,0,1)*255);this.weatherBytes[i*4+1]=0;this.weatherBytes[i*4+2]=0;this.weatherBytes[i*4+3]=255;});this.weatherTexture.needsUpdate=true;}
  const weather=environment?.sample(w.focus.x,w.focus.z),raining=weather?.rain>.008;this.rainLines.visible=!!raining&&w.distance<38&&w.qualityTier<2;
  if(this.rainLines.visible){const a=this.rainLines.geometry.attributes.position.array,count=Math.min(w.qualityTier===0?160:80,Math.ceil(weather.rain*1500));this.rainLines.geometry.setDrawRange(0,count*2);for(let i=0;i<count;i++){const p=move(w.focus.x,w.focus.z,Math.sin(i*2.399)*Math.sqrt(i/160)*7,Math.cos(i*2.399)*Math.sqrt(i/160)*7),h=terrain(p.x,p.z)+.4+((i*.618-time*2)%5+5)%5,start=xyz(p.x,p.z,h),endPoint=move(p.x,p.z,weather.windEast*.025,weather.windNorth*.025),end=xyz(endPoint.x,endPoint.z,h-.35);a.set([start.x,start.y,start.z,end.x,end.y,end.z],i*6);}this.rainLines.geometry.attributes.position.needsUpdate=true;}
  this.uniforms.uSun.value.set(sun.x,sun.y,sun.z);this.uniforms.uTime.value=time;this.uniforms.uWet.value=clamp(w.sim.climate.moisture/100+(w.sim.rain>0?.25:0),0,1);this.uniforms.uDetail.value=w.qualityTier===2?0:1;
  this.clouds.visible=w.qualityTier<2&&w.distance>18.5;this.clouds.material.uniforms.uDetail.value=TIERS[w.qualityTier].clouds*clamp((w.distance-18)/35,0,1);this.corona.position.copy(w.sunOrb.position);this.corona.quaternion.copy(w.camera.quaternion);this.stars.material.uniforms.uOpacity.value=clamp(w.distance/100,.15,.75);this.stars.material.uniforms.uPixelRatio.value=w.renderer.getPixelRatio?.()||1;
 }
}
