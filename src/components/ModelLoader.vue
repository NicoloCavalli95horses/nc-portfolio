<template>
  <LoadingSpinner v-if="is_loading" />
</template>

<script setup>
// ==============
// Import
// ==============
import {
  ref,
  onMounted,
  onUnmounted,
} from 'vue';

import GUI from 'lil-gui';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import LoadingSpinner from "./LoadingSpinner.vue";

// ==============
// Props and emits
// ==============
const props = defineProps({
  gltf_src: String,
  show_gui: Boolean,
});

const emit = defineEmits([
  'load',
])

// ==============
// Const
// ==============
const gltf_loader = new GLTFLoader();
const is_loading  = ref( true );
let gui = undefined;

// ==============
// Functions
// ==============
function onLoadAsset(e) {
  if ( props.show_gui ) {
    handleDebugUI(e.scene);
  }
  emit('load', e);
  is_loading.value = false;
}

function handleDebugUI( model ) {
  gui.add(model.scale, 'x').min(-5).max(5).step(0.05).name('scale x');
  gui.add(model.scale, 'y').min(-5).max(5).step(0.05).name('scale y');
  gui.add(model.scale, 'z').min(-5).max(5).step(0.05).name('scale z');

  gui.add(model.position, 'x').min(-5).max(5).step(0.05).name('position x');
  gui.add(model.position, 'y').min(-5).max(5).step(0.05).name('position y');
  gui.add(model.position, 'z').min(-5).max(5).step(0.05).name('position z');

  gui.add(model.rotation, 'x').min(-5).max(5).step(0.05).name('rotation x');
  gui.add(model.rotation, 'y').min(-5).max(5).step(0.05).name('rotation y');
  gui.add(model.rotation, 'z').min(-5).max(5).step(0.05).name('rotation z');
}

// ==============
// Life cycle
// ==============
onMounted(() => {
  gltf_loader.load( props.gltf_src, onLoadAsset);
  if ( props.show_gui ) {
    gui = new GUI();
  }
});

onUnmounted(() => {
  props.show_gui && gui.hide();
});

</script>