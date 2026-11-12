import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import {createNightLighting} from '../night-lighting.js';

test('Night lighting retains windows, limits soft glows to lamps and follows the active district',()=>{
  const oldDocument=globalThis.document;
  // CanvasTexture only needs a drawable placeholder here; rendering is checked in Chrome.
  globalThis.document={createElement:()=>({getContext:()=>({createRadialGradient:()=>({addColorStop(){}}),fillRect(){}})})};
  try{
    const scene=new THREE.Scene(),fixtures=[
      {region:'edmonton',x:0,y:50,z:0,width:6,height:6,depth:6},
      {region:'edmonton',x:150,y:50,z:0,width:6,height:6,depth:6},
      {region:'edmonton',x:900,y:50,z:0,width:6,height:6,depth:6},
      {region:'td-room',x:5000,y:620,z:0,width:6,height:6,depth:6},
      {region:'edmonton',x:30,y:300,z:0,width:10,height:10,depth:2,glow:false,pool:false}
    ];
    const lighting=createNightLighting({THREE,scene,fixtures,boxGeometry:new THREE.BoxGeometry(1,1,1),addToDistrict:mesh=>scene.add(mesh)});
    assert.equal(lighting.stats.bulbs,5);assert.equal(lighting.stats.halos,4);assert.equal(lighting.stats.pools,4);
    const camera=new THREE.PerspectiveCamera();camera.position.set(10,50,0);
    const state={room:null,zone:'edmonton',flying:false,camera};
    lighting.update(false,state);assert(lighting.objects.every(mesh=>!mesh.visible));
    lighting.update(true,state);assert(lighting.objects.every(mesh=>mesh.visible));
    assert.deepEqual(lighting.lights.map(light=>light.position.x),[0,150]);
    const passes=lighting.stats.selectionPasses;lighting.update(true,state);assert.equal(lighting.stats.selectionPasses,passes);
    camera.position.x=880;lighting.update(true,state);assert.deepEqual(lighting.lights.map(light=>light.position.x),[900,150]);
    lighting.update(true,{...state,room:'td'});assert.equal(lighting.lights[0].position.y,597);assert.equal(lighting.lights[1].intensity,0);
    lighting.update(true,{...state,flying:true});assert(lighting.lights.every(light=>light.intensity===0));
    lighting.update(false,state);assert(lighting.objects.every(mesh=>!mesh.visible));
  }finally{globalThis.document=oldDocument;}
});
