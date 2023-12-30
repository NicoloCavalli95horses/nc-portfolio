// ==============================
// Import
// ==============================
import { createApp } from "vue";
import "./assets/main.css";

import App from "./App.vue";
import router from './router';
import Icons from "./components/Icons.vue";

// ==============================
// Consts
// ==============================
const app = createApp(App);
app.use( router );
app.component("Icons", Icons);
app.mount("#app");
