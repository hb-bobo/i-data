import { Scene } from 'three';
import { airectionalLight, ambientLight } from './light';
import floor from './floor';

var scene = new Scene();

scene.add(airectionalLight);
scene.add(floor);
scene.add(ambientLight);


// scene.add(jumper);
export default scene
