// ==============
// Import
// ==============
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// ==============
// Class
// ==============
export default class Canvas3D {
  constructor() {
    window.Canvas3D = this; // global access to class
    this.renderer = undefined;
    this.canvas_element = undefined;
    this.scene = undefined;
    this.camera = undefined;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect_ratio = this.width / this.height;
    this.controls = undefined;
    this.fov = 75;
    this.css2DRenderer = undefined;
  }
  /**
   * Initialize canvas object
   */
  init() {
    this.createCanvasElement();
    this.initCamera();
    this.initScene();
    this.initControls();
    this.createRenderer();
    this.initCSSRenderer();
    this.handleWindowResize();
  }
  handleWindowResize() {
    // bind onResize to the current instance
    window.addEventListener('resize', this.onResize.bind(this));
  }
  onResize = () => {
    // update sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.aspect_ratio = this.width / this.height;

    // update camera
    if (this.camera) {
      this.camera.aspect = this.aspect_ratio;
      this.camera.updateProjectionMatrix();
    }
    // update renderer
    if (this.renderer) {
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    // update css2Drenderer
    if ( this.css2DRenderer ){
      this.css2DRenderer.setSize(this.width, this.height);
    }
  };
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect_ratio);
    this.camera.position.z = -2;
    this.camera.position.y = 2;
    this.camera.position.x = 0;
  }
  initCSSRenderer() {
    this.css2DRenderer = new CSS2DRenderer();
    this.css2DRenderer.setSize(window.innerWidth, window.innerHeight);
    this.css2DRenderer.domElement.className = 'overlay';
    const app = document.querySelector('#app');
    app.appendChild(this.css2DRenderer.domElement);
  }
  initScene() {
    this.scene = new THREE.Scene();
  }
  addHTMLOverlay(mesh, class_name, position) {
    const el = document.createElement('div');
    el.className = class_name;
    const objectCSS = new CSS2DObject(el);
    objectCSS.position.set(position.x, position.y, position.z);
    mesh.add(objectCSS);
    return mesh;
  }
  initControls() {
    this.controls = new OrbitControls(this.camera, this.canvas_element);
    this.controls.enableDamping = true;
  }
  createCanvasElement() {
    this.canvas_element = document.createElement("canvas");
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    document.body.appendChild(this.canvas_element);
    this.setCanvasStyle();
  }
  setCanvasStyle() {
    Object.assign(this.canvas_element.style, {
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: -1,
    });
  }
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas_element, alpha: false });
    this.renderer.setSize(this.canvas_element.width, this.canvas_element.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
  }
  addToScene(object) {
    this.scene.add(object);
  }
  addDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, -1);
    directionalLight.castShadow = true;
    this.addToScene(directionalLight);
  }
  /**
   * This function is called in the main loop
   */
  update() {
    this.renderer.render(this.scene, this.camera);
    this.css2DRenderer.render(this.scene, this.camera);
    this.controls.update();
  }
  lookAt( object ) {
    this.camera.lookAt( object );
  }
  unmount() {
    // Remove the resize event listener
    window.removeEventListener("resize", this.onResize);
    // Dispose of Three.js objects to free up resources
    if (this.controls) {
      this.controls.dispose();
    }
    // Dispose of renderer
    if (this.renderer) {
      this.renderer.dispose();
    }
    // Dispose of scene and its children
    if (this.scene) {
      this.disposeScene(this.scene);
    }
    // Optionally, you may want to remove the canvas element from the DOM
    if (this.canvas_element && this.canvas_element.parentNode) {
      this.canvas_element.parentNode.removeChild(this.canvas_element);
    }
  }
  // Helper function to recursively dispose of Three.js scene and its children
  disposeScene(scene) {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry.dispose();
        obj.material.dispose();
      } else if (obj.isLight) {
        // Dispose of lights
      }
      // Recursively dispose of children
      if (obj.children.length > 0) {
        this.disposeScene(obj);
      }
    });
  }
}
