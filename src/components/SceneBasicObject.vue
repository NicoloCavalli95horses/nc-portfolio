<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup>
// ==============
// Import
// ==============
import * as THREE from "three";
import GUI from 'lil-gui';
import { onMounted, onUnmounted } from "vue";

// ==============
// Props and emits
// ==============
const props = defineProps({
  show_gui: Boolean,
  texture_src: String,
});

const emit = defineEmits([
  'load',
]);


// ==============
// Variables
// ==============
let gui = undefined;
// const is_loading = ref( false );

const loadingManager    = new THREE.LoadingManager();
const textureLoader     = new THREE.TextureLoader(loadingManager);
const geometry          = new THREE.PlaneGeometry(20, 7);

const colorTexture      = textureLoader.load( props.texture_src );
colorTexture.colorSpace = THREE.SRGBColorSpace;


const material = new THREE.MeshStandardMaterial({
  map: colorTexture,
  roughness: 0.4,
});

const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;


// ==============
// Functions
// ==============
function addToGui() {
  gui = new GUI();
}

// function setLoadManager() {
//   loadingManager.onStart = function() {
//     // will run once at the very start
//     console.log('start loading');
//   }
//   loadingManager.onProgress = function() {
//     // will run for each texture in progress
//     console.log('progress loading');
//   }
//   loadingManager.onLoad = function() {
//     // will run once at the very end
//     console.log('loaded');
//     is_loading.value = false;
//   }
//   loadingManager.onError = function() {
//     // will run for eacth texture in case of error
//     console.error('loading error');
//   }
// }

// ==============
// Life cycle
// ==============
onMounted(() => {
  // setLoadManager();
  emit('load', plane);
  props.show_gui && addToGui();
});

onUnmounted(() => {
  props.show_gui && gui.hide();
});


</script>


