// This class is strongly inspired by the work of tamani-coding: https://github.com/tamani-coding/threejs-character-controls-example
// ==============
// Import
// ==============
import * as THREE from "three";

// ==============
// Class
// ==============
export default class CharacterController {
  constructor(
    model,
    mixer,
    animationMap,
    orbitControls,
    currentAction,
    camera
  ) {
    this.toggleRun = false;
    this.model = model;
    this.mixer = mixer;
    this.animationMap = animationMap;
    this.currentAction = currentAction;
    this.orbitControls = orbitControls;
    this.camera = camera;

    this.animationMap.forEach((value, key) => {
      if (key == currentAction) {
        value.play();
      }
    });

    this.walkDirection = new THREE.Vector3();
    this.rotateAngle = new THREE.Vector3(0, 1, 0);
    this.rotateQuarternion = new THREE.Quaternion();
    this.cameraTarget = new THREE.Vector3();
    this.velocity = 100;
  }

  update(deltaT = 1, keyPressed) {
    let newAction = undefined;
    newAction = keyPressed ? "spider.walk" : "spider.default";

    if (this.currentAction != newAction) {
      const toStop = this.animationMap.get(this.currentAction);
      const toPlay = this.animationMap.get(newAction);
      toStop.stop();
      toPlay.play();
      this.currentAction = newAction;
    }

    if (this.currentAction == "spider.walk") {
      const angleYCameraDirection = Math.atan2(
        this.camera.position.x - this.model.position.x,
        this.camera.position.z - this.model.position.z
      );
      // diagonal movement angle offset
      const directionOffset = this.directionOffset(keyPressed);
      // rotate model
      this.rotateQuarternion.setFromAxisAngle(
        this.rotateAngle,
        angleYCameraDirection + directionOffset
      );
      this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2);
      // calculate direction
      this.camera.getWorldDirection(this.walkDirection);
      this.walkDirection.y = 0;
      this.walkDirection.normalize();
      this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);
      // move model and camera
      const moveX = -this.walkDirection.x * this.velocity * deltaT;
      const moveZ = -this.walkDirection.z * this.velocity * deltaT;
      this.model.position.x += moveX;
      this.model.position.z += moveZ;
      this.updateCamera(moveX, moveZ);
    }
    this.mixer.update(deltaT);
  }
  updateCamera(moveX, moveZ) {
    this.camera.position.x += moveX;
    this.camera.position.z += moveZ;
    this.cameraTarget.x = this.model.position.x;
    this.cameraTarget.y = this.model.position.y + 1;
    this.cameraTarget.z = this.model.position.z;
    this.orbitControls.target = this.cameraTarget;
  }

  directionOffset(key) {
    let directionOffset = 0;

    switch (key) {
      case 'down':
        if (key == "right") {
          directionOffset = Math.PI / 4;
        } else if (key == "left") {
          directionOffset = -Math.PI / 4;
        }
        break;
      case 'up':
        if (key == "right") {
          directionOffset = Math.PI / 4 + Math.PI / 2;
        } else if (key == "left") {
          directionOffset = -Math.PI / 4 - Math.PI / 2;
        } else {
          directionOffset = Math.PI;
        }
        break;
      case 'right':
        directionOffset = Math.PI / 2;
        break;
      case 'left':
        directionOffset = -Math.PI / 2;
        break;
    }

    return directionOffset;
  }
}
