<template>
  <teleport to=".paper">
    <div class="wrapper" @click="show_sidebar = !show_sidebar">
      <h2>Projects</h2>
    </div>
  </teleport>

  <Sidebar v-if="show_sidebar" @close="show_sidebar = false">
    <template #title>
      <h2>Projects</h2>
    </template>
    <template #default>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti illum nesciunt praesentium consequuntur. Odit maiores fuga incidunt? Doloribus officia aut blanditiis corrupti labore in incidunt aperiam quia vitae, obcaecati quis!</p>
      <div class="projects top-24">
        <div class="project" v-for="src,name in projects" :key="src">
          <a :href="src"><p>{{ name }}</p></a>
      </div>
      </div>
    </template>
  </Sidebar>
</template>

<script setup>
// ==============
// Import
// ==============
import Sidebar from '@/components/Sidebar.vue';
import { ref } from "vue";

// ==============
// Consts
// ==============
const show_sidebar = ref( false );
const projects = {
  ['a3 project']: 'https://a3-project.netlify.app/',
  ['a* pathfinder']: 'https://a3-project.netlify.app/',
  ['fractal tree']: 'https://fractal-tree-vue.netlify.app/',
  ['ray casting'] : 'https://ray-casting.netlify.app/',
  ['three.js journey'] : 'https://threejs-learning.netlify.app/',
}

</script>

<style lang="scss" scoped>
 .wrapper {
  cursor: pointer;
 }
 .projects {
    border: 2px solid blu;
    width: 100%;
    display: grid;
    align-items: center;
    justify-items: center;
    grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
    grid-gap: 12px;
   .project a {
     display: grid;
     place-content: center;
     width: 200px;
     height: 200px;
     background-color: #222;
     border-radius: var(--radius-m);
     text-transform: uppercase;
     letter-spacing: 2px;
   }
 }
 
</style>