<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup>
// ==============
// Import
// ==============
import * as THREE from "three";
import Gui from 'lil-gui';
import { onMounted, onUnmounted } from "vue";

// ==============
// Props and emits
// ==============
const props = defineProps({
  show_gui: Boolean,
});

const emit = defineEmits([
  'load',
]);


// ==============
// Variables
// ==============
let gui = undefined;

const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide }); 
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const cube = new THREE.Mesh( boxGeometry, material );

cube.scale.x = 0.1;
cube.scale.y = 1;
cube.scale.z = 1;
cube.position.z = 1.5;


// ==============
// Functions
// ==============
function addToGui() {
  gui = new Gui();
  gui.add( cube.scale, 'x').min(-2).max(2).step(0.1).name('x size');
  gui.add( cube.scale, 'y').min(-2).max(2).step(0.1).name('y size');
  gui.add( cube.scale, 'z').min(-2).max(2).step(0.1).name('z size');
  gui.add( cube.position, 'x').min(-2).max(2).step(0.1).name('x pos');
  gui.add( cube.position, 'y').min(-2).max(2).step(0.1).name('y pos');
  gui.add( cube.position, 'z').min(-2).max(2).step(0.1).name('z pos');
}


// ==============
// Life cycle
// ==============
onMounted(() => {
  emit('load', cube);
  props.show_gui && addToGui();
});

onUnmounted(() => {
  gui.hide();
});


</script>


