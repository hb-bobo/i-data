import { CylinderBufferGeometry, MeshBasicMaterial, Mesh } from 'three';


/**
 * @interface Option {
 *  color: number,
 * }
 * @param {option} Option 
 * @return {THREE.Object3D}
 */
export default function (
    {
        color = 0xFFFFFF
    } = {}
) {
    // radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float
    const geometry = new CylinderBufferGeometry(5, 5, 20, 32);
    const material = new MeshBasicMaterial({ color: color });
    const cylinder = Mesh(geometry, material);
    return cylinder;
}
