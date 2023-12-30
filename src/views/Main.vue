<template>
  <canvas ref="canvas_ref" />
  <Joystick @keyup="onKeyUp" @keydown="onMove" />
  <LoadingSpinner v-if="is_loading" />
</template>

<script setup>
// ==============
// Import
// ==============
import { 
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted
} from "vue";

// import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FOV, SPEED } from "../utils/globals.mjs";

import Joystick       from "../components/Joystick.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";

// ==============
// Variables
// ==============
const canvas_ref = ref(undefined);
const sizes = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
});
const is_loading = ref(true);
const aspect_ratio = computed(() => sizes.width / sizes.height);
const spider_model_url = "/models/spider.glb";
const assetLoader = new GLTFLoader();
// const gui = new GUI();

let mixer = undefined;
let animation_frame = undefined;
let model = undefined;
let spider_default_animation = undefined;
let spider_walk_animation = undefined;
let renderer = null;
let controls;

const scene = new THREE.Scene();
let clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera(FOV, aspect_ratio.value);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;

scene.add(directionalLight);

// plane
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
scene.add(plane);

// ==============
// Functions
// ==============
function onLoadAsset(ev) {
  is_loading.value = false;
  model = ev.scene;
  model.position.y = -0.5;
  model.position.z = -0.5;
  mixer = new THREE.AnimationMixer(model);
  spider_walk_animation = mixer.clipAction(
    ev.animations.find((a) => a.name == "spider.walk")
  );
  spider_default_animation = mixer.clipAction(
    ev.animations.find((a) => a.name == "spider.default")
  );
  spider_default_animation.play();
  scene.add(model);
}

function updateScene() {
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  controls.update();
  renderer.render(scene, camera);
}

function gameLoop() {
  updateScene();
  animation_frame = window.requestAnimationFrame(gameLoop);
}

function onResize() {
  console.log(camera.position);
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = aspect_ratio.value;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onKeyUp() {
  spider_walk_animation.stop();
  spider_default_animation.play();
}

function onMove(direction) {
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

// ==============
// Life cycle
// ==============
onMounted(() => {
  window.addEventListener("resize", onResize);
  assetLoader.load(spider_model_url, onLoadAsset);
  renderer = new THREE.WebGLRenderer({ canvas: canvas_ref.value });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  camera.position.z = -2;
  camera.position.y = 2;
  camera.position.x = 0;

  controls = new OrbitControls(camera, canvas_ref.value);
  controls.enableDamping = true;
  gameLoop();
});

onUnmounted(() => {
  cancelAnimationFrame(animation_frame);
  window.removeEventListener("resize", onResize);
  // gui.hide();
});
</script>

<style lang="scss" scoped></style>
