<template>
  <div class="main-sidebar">
    <div class="close-btn" @click="emit('close')">
      <svg><use href="#arrow-left"></use></svg>
    </div>
    <div class="title">
      <slot name="title" />
    </div>
    <slot />
  </div>
</template>

<script setup>
// ==============
// Import
// ==============

// ==============
// Props and emits
// ==============
const emit = defineEmits(['close']);

// ==============
// Consts
// ==============

// ==============
// Functions
// ==============
</script>

<style lang="scss" scoped>
 .main-sidebar {
  position: fixed;
  top: 0;
  width: calc( 80% - 44px);
  height: calc(100vh - 44px);
  left: -100%;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.7);
  animation: grow 800ms ease-in-out forwards;
  padding: 22px;
  .close-btn {
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translate(-50%, -50%);
    background-color: #222;
    display: grid;
    place-content: center;
    cursor: pointer;
    svg {
      width: 50px;
      height: 50px;
    }
  }
 }

 @keyframes grow {
  from {
    left: -100%;
  }  
  to {
    left: 0;
  }
 }
</style>