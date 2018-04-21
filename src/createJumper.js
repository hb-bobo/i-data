import { SphereBufferGeometry, MeshBasicMaterial, Mesh, Group } from 'three';


/**
 * @interface Option {
 *  color: number,
 * }
 * @param {option} Option 
 */
export default function (
    {
        color = 0xFFFFFF
    } = {}
) {
    const group = new Group();
    const geometry = new SphereBufferGeometry(5, 5, 20, 32);
    const material = new MeshBasicMaterial({ color: color });
    const sphere = new Mesh(geometry, material);
    group.add(sphere);
    return cylinder;
}
