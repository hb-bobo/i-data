import { PlaneBufferGeometry, Mesh, MeshPhongMaterial, Math } from 'three';

var planeGeo = new PlaneBufferGeometry( window.innerWidth * 2,window.innerHeight * 2 );
var floor = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0xCCCCCC } ) );

floor.rotation.x = -90 * Math.DEG2RAD;
floor.position.y = -4;
floor.receiveShadow = true;  
// Math.DEG2RAD = Math.PI / 180

export default floor;
