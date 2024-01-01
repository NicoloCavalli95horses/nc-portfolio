<template>
  <template v-if="is_canvas_loaded">
    <SceneBasicObject :texture_src="WOOD_TEXTURE_SRC" @load="(obj) => canvas3D.addToScene(obj)" />
    <ModelLoader :gltf_src="SPIDER_MODEL_SRC" @load="onSpiderModelLoad" />
    <ModelLoader :show_gui="true" :gltf_src="BOOK_MODEL_SRC" @load="onBookModelLoad" />
  </template>

  <Joystick @keyup="onKeyUp" @keydown="onKeyDown" />
</template>

<script setup>
// ==============
// Import
// ==============
import { 
  ref,
  onMounted,
  onUnmounted
} from "vue";

import * as THREE from "three";
import {
  SPEED,
  BOOK_MODEL_SRC,
  SPIDER_MODEL_SRC,
  WOOD_TEXTURE_SRC,
} from "../utils/globals.mjs";

import Canvas3D    from "../utils/Canvas3D.mjs";

import ModelLoader      from "@/components/ModelLoader.vue";
import Joystick         from "@/components/Joystick.vue";
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

const is_canvas_loaded = ref( false );

// ==============
// Functions
// ==============
function onBookModelLoad(ev) {
  const book_model = ev.scene;
  book_model.position.y = 0.3;
  book_model.position.z = 2.7;
  book_model.rotation.x = 1.6;
  book_model.rotation.z = 1.5;
  book_model.scale.y = 5;
  book_model.scale.x = 10;
  book_model.scale.z = 10;

  for (let i=0; i<20; i++) {
    const b = book_model.clone();
    b.position.x += (i/4);
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

function onKeyUp() {
  spider_walk_animation.stop();
  spider_default_animation.play();
}

function onKeyDown(direction) {
  spider_walk_animation.play();
  spider_default_animation.stop();
  switch (direction) {
    case "up":
      spider_model.position.z += SPEED;
      break;
    case "down":
      spider_model.position.z -= SPEED;
      break;
    case "left":
      spider_model.position.x += SPEED;
      break;
    case "right":
      spider_model.position.x -= SPEED;
      break;
  }
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
