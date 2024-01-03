<template>
  <template v-if="is_canvas_loaded">
    <SceneBasicObject :texture_src="SRC.textures.wood" @load="onPlaneLoad" />
    <ModelLoader :gltf_src="SRC.models.spider" @load="onSpiderModelLoad" />
    <ModelLoader :gltf_src="SRC.models.book" @load="onBookModelLoad" />
    <ModelLoader :gltf_src="SRC.models.pc" @load="onPcModelLoad" />
    <ModelLoader :gltf_src="SRC.models.lamp" @load="onLampModelLoad" />
    <ModelLoader :gltf_src="SRC.models.paper" @load="onPaperModelLoad" />
  </template>
  
  <!-- Overlays -->
  <ArrowsJoystick @keydown="onKeyDown" @keyup="onKeyUp" />
  <WindowEvents @keydown="onKeyDown" @keyup="onKeyUp" />
  <LaptopScreen v-if="is_pc_model_loaded" />
  <Paper v-if="is_paper_loaded" />
</template>

<script setup>
// ==============
// Import
// ==============
import { 
  ref,
  onMounted,
  onUnmounted,
} from "vue";

import * as THREE from "three";
import {
  SRC,
  randInt,
  checkDOMUpdate,
} from "../utils/utils.mjs";

import Canvas3D            from "../utils/Canvas3D.mjs";
import CharacterController from "../utils/CharacterController.mjs";

import Paper            from "./Paper.vue";
import LaptopScreen     from "./LaptopScreen.vue";
import ArrowsJoystick   from "@/components/ArrowsJoystick.vue";
import WindowEvents     from "@/components/WindowEvents.vue";
import ModelLoader      from "@/components/ModelLoader.vue";
import SceneBasicObject from "@/components/SceneBasicObject.vue";

// ==============
// Variables
// ==============
let canvas3D                 = undefined;
let mixer                    = undefined;
let animation_frame          = undefined;
let spider_model             = undefined;
let spider_controller        = undefined;
let clock                    = new THREE.Clock();

const is_canvas_loaded   = ref( false );
const is_pc_model_loaded = ref( false );
const is_paper_loaded    = ref( false );
const current_action     = ref( 'spider.default' );
const key_pressed        = ref( undefined );

// ==============
// Functions
// ==============
function onKeyUp() {
  key_pressed.value = undefined;
  current_action.value = 'spider.default';
}


function onPlaneLoad(obj) {
  obj.receiveShadow = true;
  canvas3D.addToScene(obj);
}


function onKeyDown(ev) {
  current_action.value = 'spider.walk';
  key_pressed.value = ev;
}


function onLampModelLoad(ev) {
  const lamp_model = ev.scene;
  lamp_model.scale.x = 0.4;
  lamp_model.scale.y = 0.4;
  lamp_model.scale.z = 0.4;
  lamp_model.position.x = 3.15;
  lamp_model.position.z = 1.95;
  lamp_model.position.y = 0.2;
  canvas3D.addToScene( lamp_model );
}


function onPaperModelLoad(ev) {
  const DOM_CLASS = 'paper'
  const paper_model = ev.scene;
  paper_model.scale.x = -0.05;
  paper_model.scale.y = 0.03;
  paper_model.scale.z = -0.1;
  paper_model.position.y = -0.48;
  paper_model.position.z = -1.75;
  paper_model.rotation.y = -0.3;
  for (let i=0; i<3; i++) {
    const p = paper_model.clone();
    p.position.x = randInt(-1.5, 1.5);
    p.rotation.y = randInt(-0.5, 0.5);
    p.position.y += i* 0.01;
    canvas3D.addToScene( p );
  }
  const updated_paper_model = canvas3D.addHTMLOverlay( paper_model, DOM_CLASS, {x:-1,y:2.3,z:0} );
  canvas3D.addToScene( updated_paper_model );

  checkDOMUpdate({
    class_name:`.${DOM_CLASS}`,
    callback: (val) => is_paper_loaded.value = val
  });
}


function onPcModelLoad(ev){
  const DOM_CLASS = 'pc_screen';
  const pc_model = ev.scene;
  pc_model.position.x = 0.7;
  pc_model.position.y = -1.15;
  pc_model.position.z = 3.2;
  const updated_pc_model = canvas3D.addHTMLOverlay( pc_model, DOM_CLASS, {x:-1,y:2.3,z:0} );
  canvas3D.addToScene( updated_pc_model );

  checkDOMUpdate({
    class_name:`.${DOM_CLASS}`,
    callback: (val) => is_pc_model_loaded.value = val
  });
}


function onBookModelLoad(ev) {
  const book_model = ev.scene;
  book_model.position.x = 5;
  book_model.position.y = 0.3;
  book_model.position.z = 2.7;
  book_model.rotation.x = 1.6;
  book_model.rotation.z = 1.5;
  book_model.scale.y = 5;
  book_model.scale.x = 10;
  book_model.scale.z = 10;

  for (let i=0; i<20; i++) {
    const b = book_model.clone();
    b.scale.y = randInt(2, 10);
    b.position.x += i/4;
    canvas3D.addToScene( b );
  }
  canvas3D.addToScene( book_model );
}


function onSpiderModelLoad(ev) {
  spider_model = ev.scene;
  const spider_animation = ev.animations;
  const animation_map = new Map();
  spider_model.castShadow = true;
  spider_model.position.y = -0.5;
  mixer = new THREE.AnimationMixer(spider_model);
  spider_animation.forEach(a => {
    animation_map.set(a.name, mixer.clipAction(a))
  });
  const orbit_controls = canvas3D.getOrbitControls();
  const camera = canvas3D.getCamera();
  spider_controller = new CharacterController(spider_model, mixer, animation_map, orbit_controls, current_action.value, camera);
  canvas3D.addToScene(spider_model);
}


function initLoop() {
  mixer && mixer.update(clock.getDelta());
  if ( spider_model ) {
    canvas3D.lookAt(spider_model.position);
  }
  if ( spider_controller ) {
    spider_controller.update( clock.getDelta(), key_pressed.value);
  }
  canvas3D.update();
  animation_frame = window.requestAnimationFrame(initLoop);
}

// ==============
// Life cycle
// ==============
onMounted(() => {
  canvas3D = new Canvas3D();
  canvas3D.init();
  canvas3D.addDirectionalLight();
  is_canvas_loaded.value = true;
  initLoop();
});

onUnmounted(() => {
  cancelAnimationFrame(animation_frame);
  canvas3D.unmount();
});

</script>