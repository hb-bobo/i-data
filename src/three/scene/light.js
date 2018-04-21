import { PointLight, } from 'three'
// 点光源
const pointLight = new PointLight(0xffffff, 1, 200);
pointLight.position.y = 60;
export {
    pointLight,
}