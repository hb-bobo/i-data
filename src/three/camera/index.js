import { PerspectiveCamera, OrthographicCamera } from 'three';
// import {Tween} from 'es6-tween';

// var camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000)
var n = isMobile ? 18 : 30;
var camera = new OrthographicCamera(
    window.innerWidth / -n,
    window.innerWidth / n,
    window.innerHeight / n,
    window.innerHeight / -n,
    0.1, 4000
);

camera.position.set(-29.97, 28.97, 27.59);
camera.lookAt(0, 0, 0)
// export var cameraPosition = new Tween(camera.position);

export default camera;