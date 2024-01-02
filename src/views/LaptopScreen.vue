<template>
  <teleport to=".pc_screen">
    <div class="wrapper">
      <h2>test</h2>
    </div>
  </teleport>
</template>

<script setup>
</script>


<style lang="scss" scoped>
.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background-color: red;
  color: white;
}
</style>