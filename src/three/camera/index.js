import { PerspectiveCamera, Vector3 } from 'three';
// import {Tween} from 'es6-tween';

var camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000000)
camera.position.set(0, 150, 0);
// export var cameraPosition = new Tween(camera.position);
// console.log(camera)
export default camera;