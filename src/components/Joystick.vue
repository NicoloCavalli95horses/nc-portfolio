<template>
  <div ref="wrapper_ref" class="cursor-wrapper" @pointerdown="pointer_down = true">
    <div class="cursor" :class="{ 'active' : pointer_down }" :style="{ 'top': `${ norm.y*100 }%`,'left': `${ norm.x*100 }%`}" />
  </div>
</template>

<script setup>
// ==============
// Import
// ==============
import {
  ref,
  onMounted,
  onUnmounted,
  reactive,
} from 'vue';
import { mapValue } from '../utils/utils.mjs';


const emit = defineEmits([
  'move',
  'stop',
]);


// ==============
// Consts
// ==============
const pointer_down = ref( false );
const wrapper_ref  = ref( undefined );
const rect         = ref( undefined );
const norm         = reactive({ x: 0.5, y: 0.5 });

let timeout = undefined;


// ==============
// Functions
// ==============
function onPointerUp() {
  clearTimeout( timeout );
  pointer_down.value = false;
  norm.x = 0.5;
  norm.y = 0.5;
  emit('move', norm);
  emit('stop');
}

function onWindowPointerMove(ev){
  if ( !pointer_down.value ) { return; }
  clearTimeout( timeout );
  const x = ev.clientX;
  const y = ev.clientY;
  norm.x = mapValue(x, rect.value.x, rect.value.x + rect.value.width, 0, 1);
  norm.y = mapValue(y, rect.value.y, rect.value.y + rect.value.height, 0, 1);
  emit('move', norm );
  timeout = setTimeout( () => onWindowPointerMove(ev), 10);
}
function getBoundingClientRect() {
  rect.value = wrapper_ref.value.getBoundingClientRect();
}

// ==============
// Life cycle
// ==============
onMounted(() => {
  getBoundingClientRect();
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("touchend", onPointerUp);
  window.addEventListener("pointermove", onWindowPointerMove);
  window.addEventListener("resize", getBoundingClientRect);
})

onUnmounted(() => {
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("touchend", onPointerUp);
  window.removeEventListener("pointermove", onWindowPointerMove);
  window.removeEventListener("resize", getBoundingClientRect);
  clearTimeout( timeout );
  timeout = undefined;
})

</script>

<style lang="scss" scoped>
$base-color: var(--font-light);
$active-color: var(--secondary);
$cursor-size: 40px;
$wrapper-size: calc( $cursor-size * (1.618 * 1.5));
.cursor-wrapper {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: $wrapper-size;
  height: $wrapper-size;
  border-radius: 50%;
  border: 1px solid $base-color;
  cursor: pointer;
  touch-action: none;
  z-index: 1;
  .cursor {
    width: $cursor-size;
    height: $cursor-size;
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%) scale(1);
    background-color: $base-color;
    box-shadow: 3px 2px 12px var(--black);
    transition: background-color;
    transition-duration: var(--transition-slow);
    &.active {
      transition-duration: var(--transition-slow);
      background-color: $active-color;
    }
  }
}
</style>