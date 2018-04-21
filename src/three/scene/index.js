import { Scene } from 'three'
import { pointLight } from './light'
import floor from './floor';
var scene = new Scene();

scene.add(pointLight);
scene.add(floor);
export default scene
