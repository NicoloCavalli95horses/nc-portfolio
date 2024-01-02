// ===================
// Global variables
// ===================
const BASE_TEXTURE = "/textures/";
const BASE_MODEL = "/models/";

export const FOV = 75;
export const SPEED = 0.03;

export const SRC = Object.freeze({
    textures: {
      wood: `${BASE_TEXTURE}wood.jpg`,
    },
    models: {
      pc: `${BASE_MODEL}pc.glb`,
      book: `${BASE_MODEL}book.glb`,
      spider: `${BASE_MODEL}spider.glb`,
      plant: `${BASE_MODEL}plant.glb`,
      pencil: `${BASE_MODEL}pencil.glb`,
      lamp: `${BASE_MODEL}lamp.glb`,
    }
})

/**
 * 
 * @param { string } class_name 
 * @param { function } callback
 * Return the function passed as parameter with a 'true' value as payload,
 * as soons as the required class is found in the DOM 
 */
export function checkDOMUpdate( {class_name, callback } ) {
  const observer = new MutationObserver(() => {
    const el = document.querySelector( class_name );
    if (el) {
      observer.disconnect();
      return callback(true);
    }
  });
  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
}


/**
 * 
 * @param { number } value 
 * @param { number } fromMin 
 * @param { number } fromMax 
 * @param { number } toMin 
 * @param { number } toMax 
 * @returns a new value mapped in the given range
 */
export function mapValue(value, fromMin, fromMax, toMin, toMax) {
  const clampedValue = Math.max(Math.min(value, fromMax), fromMin);
  const percentage = (clampedValue - fromMin) / (fromMax - fromMin);
  const mappedValue = toMin + percentage * (toMax - toMin);
  return mappedValue;
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}