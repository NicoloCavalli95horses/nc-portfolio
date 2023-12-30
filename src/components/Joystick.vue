<template>
  <div class="keys">
    <div />
    <div class="key" :class="{ 'active' : pointer_down == 'up' }" @pointerup="onKeyup" @pointerdown="move('up')">↑</div>
    <div />
    <div class="key" :class="{ 'active' : pointer_down == 'left' }" @pointerup="onKeyup" @pointerdown="move('left')">←</div>
    <div />
    <div class="key" :class="{ 'active' : pointer_down == 'right' }" @pointerup="onKeyup" @pointerdown="move('right')">→</div>
    <div />
    <div class="key" :class="{ 'active' : pointer_down == 'down' }" @pointerup="onKeyup" @pointerdown="move('down')">↓</div>
    <div />
  </div>
</template>

<script setup>
// ==============
// Import
// ==============
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue';


const emit = defineEmits([
  'keyup',
  'keydown',
]);


// ==============
// Consts
// ==============
const pointer_down = ref( false );
let timeout = undefined;


// ==============
// Functions
// ==============
function onKeyup() {
  clearTimeout( timeout );
  timeout = undefined;
  pointer_down.value = undefined;
  emit('keyup');
}

function move(direction) {
  pointer_down.value = direction;
  switch (direction) {
    case 'up':
      emit('keydown', 'up');
      break;
    case 'down':
      emit('keydown', 'down');
      break;
    case 'left':
      emit('keydown', 'left');
      break;
    case 'right':
      emit('keydown', 'right');
      break;
  }
  timeout = setTimeout(() => move(direction), 100);
}


// ==============
// Life cycle
// ==============
onMounted(() => {
  window.addEventListener("keyup", onKeyup);
})

onUnmounted(() => {
  window.removeEventListener("keyup", onKeyup);
  clearTimeout( timeout );
  timeout = undefined;
})

</script>

<style lang="scss" scoped>
.keys {
  position: fixed;
  bottom: 22px;
  right: 22px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  .key {
    display: grid;
    place-content: center;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 1px solid #eee;
    transition-duration: 400ms;
    color: #eee;
    &.active {
      background-color: #eee;
      color: #222;
      transition-duration: 400ms;
      transform: scale(0.9);
    }
  }
}</style>