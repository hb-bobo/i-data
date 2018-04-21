import { BoxBufferGeometry, MeshBasicMaterial, Mesh} from 'three';


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
    const geometry = new BoxBufferGeometry(200, 200, 200);
    const material = new MeshBasicMaterial({ color: color });
    const cube = Mesh(geometry, material);
    return cube
}
