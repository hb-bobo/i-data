import { DirectionalLight, AmbientLight } from 'three'
// 平行光
const airectionalLight = new DirectionalLight(0xffffff, 1);
airectionalLight.position.y = 100;
airectionalLight.position.z = 50;
airectionalLight.castShadow = true;

// 环境光
const ambientLight = new AmbientLight( 0xffffff, 0.3 );

export {
    airectionalLight,
    ambientLight,
}