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
} from 'vue';

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import LoadingSpinner from "./LoadingSpinner.vue";

// ==============
// Props and emits
// ==============
const props = defineProps({
  gltf_src: String,
});

const emit = defineEmits([
  'load',
])

// ==============
// Const
// ==============
const gltf_loader = new GLTFLoader();
const is_loading  = ref( true );

// ==============
// Functions
// ==============
function onLoadAsset(e) {
 emit('load', e);
 is_loading.value = false;
}

// ==============
// Life cycle
// ==============
onMounted(() => {
  gltf_loader.load( props.gltf_src, onLoadAsset);
});

</script>