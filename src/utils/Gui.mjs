// ==============
// Import
// ==============
import GUI from "lil-gui";


// ==============
// Class
// ==============
export default class Gui {
  constructor() {
    this.gui = new GUI();
  }
  add( obj ) {
    this.gui.add( obj );
  }
  unmount() {
    this.gui.hide();
  }
}