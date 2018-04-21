import { BoxBufferGeometry, MeshStandardMaterial, Mesh} from 'three';


/**
 * @interface Option {
 *  color: number,
 * }
 * @param {option} Option
 * @return {THREE.Object3D}
 */
export default function (
    {
        color = 0xFFFFFF,

    } = {}
) {
    const geometry = new BoxBufferGeometry(10, 5, 10);
    // const geometry = new BoxBufferGeometry(200, 200, 200); 太大
    
    const material = new MeshStandardMaterial({ color: color });
    // MeshBasicMaterial材质不反光？ MeshStandardMaterial
    const cube = new Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true; 

    return cube
}
