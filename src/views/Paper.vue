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
      <div class="projects top-24">
        <div class="project" v-for="(val, key) in projects" :key="key">
          <a :href="key">
            <h3>{{ val.title }}</h3>
            <p>{{ val.description }}</p>
          </a>
        </div>
      </div>
    </template>
  </Sidebar>
</template>

<script setup>
// ==============
// Import
// ==============
import Sidebar from "@/components/Sidebar.vue";
import { ref } from "vue";

// ==============
// Consts
// ==============
const show_sidebar = ref(false);
const projects = {
  ["https://a3-project.netlify.app/"]: {
    title: "a3 project",
    description: "Image recognition through webcam for web accessibility",
  },
  ["https://apathfinder.netlify.app/"]: {
    title: "a* pathfinder",
    description: "Interactive visualization of the algorithm",
  },
  ["https://fractal-tree-vue.netlify.app/"]: {
    title: "fractal tree",
    description: "Interactive experiment with recursive components in Vue.js",
  },
  ["https://ray-casting.netlify.app/"]: {
    title: "ray casting",
    description: "Interactive visualization of the algorithm",
  },
  ["https://threejs-learning.netlify.app/"]: {
    title: "three.js journey",
    description: "Documentation of learning the three.js library",
  },
};
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 12px;
  overflow-y: auto;
  height: calc(100% - 66px);
  margin-bottom: 66px;
  .project a {
    display: grid;
    place-content: center;
    width: calc(240px - 44px);
    height: calc(200px - 44px);
    background-color: #222;
    border-radius: var(--radius-m);
    text-align: center;
    padding: 22px;
    box-shadow: 1px 2px 4px #111;
    &:last-of-type {
      margin-bottom: 12px;
    }
    h3 {
      font-size: 22px;
      text-transform: uppercase;
      letter-spacing: 2px;
      height: 55px;
    }
    p {
      font-size: 14px;
      padding-top: 12px;
    }
  }
}

</style>
