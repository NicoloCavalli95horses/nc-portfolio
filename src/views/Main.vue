<template>
  <template v-if="is_canvas_loaded">
    <SceneBasicObject :texture_src="SRC.textures.wood" @load="(obj) => canvas3D.addToScene(obj)" />
    <ModelLoader :gltf_src="SRC.models.spider" @load="onSpiderModelLoad" />
    <ModelLoader :gltf_src="SRC.models.book" @load="onBookModelLoad" />
    <ModelLoader :gltf_src="SRC.models.pc" @load="onPcModelLoad" />
    <ModelLoader :gltf_src="SRC.models.lamp" @load="onLampModelLoad" />
  </template>
  
  <Joystick @stop="onStopAnimation" @move="onMoveAnimation" />
  <LaptopScreen v-if="is_pc_model_loaded" />
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
  // checkDOMUpdate,
} from "../utils/utils.mjs";

import Canvas3D    from "../utils/Canvas3D.mjs";

import LaptopScreen     from "./LaptopScreen.vue";
import Joystick         from "@/components/Joystick.vue";
import ModelLoader      from "@/components/ModelLoader.vue";
import SceneBasicObject from "@/components/SceneBasicObject.vue";

// ==============
// Variables
// ==============
let canvas3D                 = undefined;
let mixer                    = undefined;
let animation_frame          = undefined;
let spider_model             = undefined;
let spider_default_animation = undefined;
let spider_walk_animation    = undefined;
let clock                    = new THREE.Clock();

const is_canvas_loaded   = ref( false );
const is_pc_model_loaded = ref( false );

// ==============
// Functions
// ==============
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

function onPcModelLoad(ev){
  const DOM_CLASS = 'pc_screen';
  const pc_model = ev.scene;
  pc_model.position.x = 0.7;
  pc_model.position.y = -1.15;
  pc_model.position.z = 3.2;
  const updated_pc_model = canvas3D.addHTMLOverlay( pc_model, DOM_CLASS, {x:-1,y:2.3,z:0} );
  canvas3D.addToScene( updated_pc_model );
  // add html over the model
  // checkDOMUpdate({
  //   class_name:`.${DOM_CLASS}`,
  //   callback: (val) => is_pc_model_loaded.value = val
  // });
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
  spider_model.position.y = -0.5;
  mixer = new THREE.AnimationMixer(spider_model);
  spider_walk_animation = mixer.clipAction(ev.animations.find((a) => a.name == "spider.walk"));
  spider_default_animation = mixer.clipAction(ev.animations.find((a) => a.name == "spider.default"));
  spider_default_animation.play();
  canvas3D.addToScene(spider_model);
}

function onStopAnimation() {
  spider_walk_animation.stop();
  spider_default_animation.play();
}

function onMoveAnimation(dir) {
  spider_walk_animation.play();
  spider_default_animation.stop();
  spider_model.position.x -= (dir.x - 0.5) * 0.01;
  spider_model.position.z -= (dir.y - 0.5) * 0.01;
}

function initLoop() {
  mixer && mixer.update(clock.getDelta());
  if ( spider_model ) {
    canvas3D.lookAt(spider_model.position);
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
../utils/utils.mjs