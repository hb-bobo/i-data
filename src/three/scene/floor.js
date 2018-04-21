import { PlaneBufferGeometry, Mesh, MeshPhongMaterial } from 'three';

var planeGeo = new PlaneBufferGeometry( 100.1, 100.1 );
var floor = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0xffffff } ) );

export default floor;
