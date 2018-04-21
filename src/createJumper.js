import { ObjectLoader } from 'three';

let jumper = null;

/**
 * @return {PromiseLike}
 */
const createJumper = function () {
    return new Promise(function (resolve) {
        if (jumper !== null) {
            resolve(jumper);
            return;
        }
        import('ROOT/model/jumper.json').then(function (res) {
            jumper = ObjectLoader.prototype.parse(res);
            jumper.castShadow = true;
             
            resolve(jumper);
        });
    })
}
export default createJumper;
