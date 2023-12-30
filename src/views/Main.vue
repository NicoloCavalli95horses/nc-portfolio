<template>
  <Joystick @keyup="onKeyUp" @keydown="onKeyDown" />
  <Loader :gltf_src="SPIDER_MODEL_SRC" @load="onSpiderModelLoad" />
</template>

<script setup>
// ==============
// Import
// ==============
import { 
  onMounted,
  onUnmounted
} from "vue";

import * as THREE from "three";
import {
  SPEED,
  SPIDER_MODEL_SRC,
} from "../utils/globals.mjs";

import Canvas3D from "../utils/Canvas3D.mjs";
import Gui from "../utils/Gui.mjs";

import Loader   from "../components/Loader.vue";
import Joystick from "../components/Joystick.vue";

// ==============
// Variables
// ==============
let gui                      = undefined;
let canvas3D                 = undefined;
let mixer                    = undefined;
let animation_frame          = undefined;
let model                    = undefined;
let spider_default_animation = undefined;
let spider_walk_animation    = undefined;
let clock                    = new THREE.Clock();


// ==============
// Functions
// ==============
function onSpiderModelLoad(ev) {
  model = ev.scene;
  model.position.y = -0.5;
  model.position.z = -0.5;
  mixer = new THREE.AnimationMixer(model);
  spider_walk_animation = mixer.clipAction(ev.animations.find((a) => a.name == "spider.walk"));
  spider_default_animation = mixer.clipAction(ev.animations.find((a) => a.name == "spider.default"));
  spider_default_animation.play();
  canvas3D.addToScene(model);
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
      model.position.z += SPEED;
      break;
    case "down":
      model.position.z -= SPEED;
      break;
    case "left":
      model.position.x += SPEED;
      break;
    case "right":
      model.position.x -= SPEED;
      break;
  }
}


function initLoop() {
  mixer && mixer.update(clock.getDelta());
  canvas3D.update();
  animation_frame = window.requestAnimationFrame(initLoop);
}

// ==============
// Life cycle
// ==============
onMounted(() => {
  canvas3D = new Canvas3D();
  canvas3D.init();
  canvas3D.addPlane();
  canvas3D.addDirectionalLight();
  gui = new Gui();
  initLoop();
});

onUnmounted(() => {
  cancelAnimationFrame(animation_frame);
  gui.unmount();
  canvas3D.unmount();
});

</script>
