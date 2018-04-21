import { Group, Object3D } from 'three';
import scene from './three/scene';
import createCube from './createCube';
import createJumper from './createJumper';

export default class Game {
    constructor() {
        this.init();
    }

    init() {
        this.cubes = new Group();
        this.cubes.name = 'cubes';
        scene.add(this.cubes);
        this.config = {
            cubeDis: [20, 30], // 间距
            cubePosition: [0, 0, 0], // 坐标
            cubeMaxLen: 6, // 超出此范围删除
        }
    }

    createJumper() {
        const jumper = createJumper();
        jumper.then(function (j) {
            j.position.y = 3.5;
            scene.add(j);
        })
    }

    /**
     * 创建方块
     */
    createCube() {
        const cube = createCube();
        cube.position.set(...this.config.cubePosition);
        this.cubes.add(cube);
        this.config.cubePosition[0] += this.config.cubeDis[0]
    }

    start() {
        this.createCube();
        this.createCube();
        this.createJumper();
    }
}