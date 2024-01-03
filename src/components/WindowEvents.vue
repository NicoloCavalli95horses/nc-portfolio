<template>
  <div class="key"><p>{{ key }}</p></div>
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

defineProps({
  show_keys: Boolean,
})

const emit = defineEmits([
  'keydown'
]);


// ==============
// Consts
// ==============
const key = ref( undefined );
const movement = ref( undefined );


// ==============
// Functions
// ==============
function onKeyDown(ev) {
  key.value = ev.code;
  switch( key.value ) {
    case 'ArrowUp':
      movement.value = 'up';
      break;
    case 'ArrowLeft':
      movement.value = 'left';
      break;
    case 'ArrowRight':
      movement.value = 'right';
      break;
    case 'ArrowDown':
      movement.value = 'down';
      break;
  }
  emit('keydown', movement.value);
}

function onKeyUp() {
  emit('keyup');
}

// ==============
// Life cycle
// ==============
onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
})
</script>

<style lang="scss" scoped>
  .key {
    position: absolute;
    bottom: 22px;
    right: 22px;
    font-size: 22px;
    color: white;
  }
</style>