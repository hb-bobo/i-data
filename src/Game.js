import { Group } from 'three';
import { Tween } from 'es6-tween';
import scene from './three/scene';
import camera from './three/camera';
import createCube from './createCube';
import createJumper from './createJumper';
import random from 'lodash.random';



export default class Game {
    constructor() {
        this.init();
    }

    init() {
        this.config = {
            cubeDis: isMobile ? [14 , 20] : [20, 30], // 间距
            cubeMaxLen: 6, // 超出此范围删除
            direction: 0, // 方向(0 | 2)， 默认是x方向
            speedXCoe: 0.35, // 系数 speed = speedCoe * power
            speedYCoe: 0.3, // 系数 speed = speedCoe * power
            gravity: 0.1, // 重力衰减系数
        }
        this.nextCubePosition = [0, 0, 0], // 坐标
        this.jumper = null;
        this.jumperHead = null;
        this.jumperBody = null
        // 方块容器
        this.cubes = new Group();
        this.cubes.name = 'cubes';

        this.currentCubeIndex = 0;
        scene.add(this.cubes);
        this.addEvent();
    }

    start() {
        // 蓄力值
        this.power = 0;
        // jumper所在的方块
        this.currentCubeIndex = 0;
        this.createCube();
        this.createCube();
        this.createJumper();
    }
    restart() {
        this.cubes.children = [];
        this.nextCubePosition = [0, 0, 0];
        this.currentCubeIndex = 0;
        this.createCube();
        this.createCube();
        this.jumper.position.set(
            this.jumper.userData.initialPosition.x,
            this.jumper.userData.initialPosition.y,
            this.jumper.userData.initialPosition.z
        );
        this.jumper.rotation.set(0, 0, 0);
        this.updateCameraPosition();
        console.log(scene)
    }
    end() {
        this.nextCubePosition  = [0, 0, 0];
        this.currentCubeIndex = 0;
        // this.restart();
    }

    addEvent() {
        const canvas = document.querySelector('canvas')
        const mouseEvents = isMobile ?
            {
                down: 'touchstart',
                up: 'touchend',
            }
            :
            {
                down: 'mousedown',
                up: 'mouseup',
            };

        canvas.addEventListener(mouseEvents.down, () => {
            this.handleMousedown()
        })
        // 监听鼠标松开的事件
        canvas.addEventListener(mouseEvents.up, () => {
            this.handleMouseup()
        })
    }
    createJumper() {
        const jumper = createJumper();
        jumper.then((j) => {
            this.jumperBody = j.getObjectByName('JumperBody');
            this.jumperHead = j.getObjectByName('jumperHead');
            this.jumper = j;
            // 产生阴影
            this.jumperBody.castShadow = true;
            this.jumperHead.castShadow = true;
            this.jumper.position.y = 3.6;


            // 记录初始状态
            this.jumper.userData.initialPosition = this.jumper.position.clone();
            this.jumperHead.userData.initialPosition = this.jumperHead.position.clone();
            this.jumperBody.userData.initialScale = this.jumperBody.scale.clone();
            this.jumperBody.userData.initialPosition = this.jumperBody.position.clone();

            scene.add(j);
        })
    }

    /**
     * 创建方块
     */
    createCube() {
        // 0: x(前)  2:z(右)
        const direction = random(0, 1) === 0 ? 0 : 2;
        // 更新当前方向
        this.config.direction = direction;
        console.log(direction)
        // 更新坐标
        // this.cubes is a Group
        const dis = !this.cubes.children.length ? 0 : random(this.config.cubeDis[0], this.config.cubeDis[1])
        this.nextCubePosition [direction] += dis;

        const cube = createCube();
        cube.position.set(...this.nextCubePosition );
        this.cubes.add(cube);
    }

    /**
     * 检测跳跃状态
     */
    checkJumpState() {
        if (this.cubes.children.length < 2) {
            return;
        }
        const direction = this.config.direction === 0 ? 'x' : 'z';
        // 当前方块
        const cubeCurrent = this.cubes.children[this.currentCubeIndex];
        // 下一个方块
        const cubeNext = this.cubes.children[this.currentCubeIndex + 1];

        // jumper 的位置
        const jumpP = {
            x: this.jumper.position.x,
            z: this.jumper.position.z
        }
        // 当前方块的位置
        const cubeCurrentP = {
            x: cubeCurrent.position.x,
            z: cubeCurrent.position.z
        }
        // 下一个方块的位置
        const cubeNextP = {
            x: this.cubes.children[this.cubes.children.length - 1].position.x,
            z: this.cubes.children[this.cubes.children.length - 1].position.z
        }

        let disC;  // jumper和当前方块的坐标轴距离
        let disN;  // jumper和下一个方块的坐标轴距离
        // 判断下一个方块相对当前方块的方向来确定计算距离的坐标轴
        if (direction === 'x') {
            disC = Math.abs(jumpP.x - cubeCurrentP.x);
            disN = Math.abs(jumpP.x - cubeNextP.x);
        } else {
            disC = Math.abs(jumpP.z - cubeCurrentP.z);
            disN = Math.abs(jumpP.z - cubeNextP.z);
        }
        // 如果大小不一样则需要两个值（目前一个就可以）
        const nextTargetDis = cubeNext.geometry.parameters.width / 2; // 当前方块的宽的一半
        const currentTargetDis = cubeNext.geometry.parameters.width / 2; // 下一个方块的宽的一半
        const jumpBodyRadiusBottom = this.jumperBody.geometry.parameters.radiusBottom; // jumper的地部半径


        // 落再当前
        if (disC < currentTargetDis) {
            return 'current';
        } else if (disN < nextTargetDis) {
            return 'next';
        } else if (disC > currentTargetDis + jumpBodyRadiusBottom && disN > nextTargetDis + jumpBodyRadiusBottom) {
            // 完美落在空地上
            return 'floor';
        } else if (disC <= currentTargetDis + jumpBodyRadiusBottom) {
            // 落在当前边缘上
            return 'currentEdge';
        } else if (disN <= nextTargetDis + jumpBodyRadiusBottom) {
            // 落在下一个边缘上
            return 'nextEdge';
        }
    }

    handleMousedown() {
        if (this.jumperState === 'jumping') {
            return;
        }
        this.mouseState = 'down';

        const scale = () => {
            if (this.mouseState === 'up') {
                return;
            }
            if (this.jumperBody.scale.y > 0.6) {
                this.jumperBody.scale.y -= 0.01;
                // 头同步下移，不然就分离了
                this.jumperBody.position.y -= 0.02;
                this.jumperHead.position.y -= 0.04;
            }

            this.power += 0.1;
            requestAnimationFrame(scale);
        }
        scale();
    }

    handleMouseup() {
        this.mouseState = 'up';
        // 设置状态， 避免狂点
        this.jumperState = 'jumping';
        // 头同步恢复，不然就分离了

        new Tween(this.jumperBody.position)
            .to(this.jumperBody.userData.initialPosition, 10)
            .start();

        new Tween(this.jumperBody.scale)
            .to(this.jumperBody.userData.initialScale, 10)
            .start();

        new Tween(this.jumperHead.position)
            .to(this.jumperHead.userData.initialPosition, 10)
            .on('complete', () => {
                this.hanldleJumpStart();
            })
            .start()
    }

    hanldleJumpStart() {
        const direction = this.config.direction === 0 ? 'x' : 'z';
        let speedY = this.power * this.config.speedYCoe;
        let speedX = this.power * this.config.speedXCoe;
        // this.cubes is a Group
        const jump = () => {
            speedY -= this.config.gravity;
            this.jumper.position.y += speedY;
            this.jumper.position[direction] += speedX;

            if (this.jumper.position.y <= this.jumper.userData.initialPosition.y) {
                this.handleJumpEnd();
                return;
            }
            requestAnimationFrame(jump);
        }
        jump();
    }

    async handleJumpEnd() {
        const res = this.checkJumpState();

        switch (res) {
        case 'cuerrnt':
            // 先检测是否成功落地再移动camera
            await this.updateCameraPosition();
            break;
        case 'next':
            // 先检测是否成功落地再移动camera
            await this.updateCameraPosition();
            // 游标切至下一个， 并继续创建方块
            this.currentCubeIndex++;
            this.createCube();
            break;
        case 'floor':
            this.handleJumpFail(res);
            break;
        case 'currentEdge':
            this.handleJumpFail(res);
            break;
        case 'nextEdge':
            this.handleJumpFail(res);
            break;
        }
        this.power = 0;
        this.jumperState = 'jumpend';


    }

    /**
     * 
     * @param {'floor' | 'currentEdge' | 'nextEdge'} 落什么位置
     */
    handleJumpFail(position) {
        // 左手拇指是z，上是y, 中指是x，
        const direction = this.config.direction === 0 ? 'z' : 'x';
        // 落到边缘才倒地
        if (position === 'currentEdge' || position === 'nextEdge') {
            new Tween(this.jumper.rotation)
                .to({ 
                    [direction]: (position === 'currentEdge' ? 90 : -90) * Math.PI / 180 
                }, 400)
                .on('complete', () => {
                })
                .start()
        }
        new Tween(this.jumper.position)
            .to({ y: -1 }, 400)
            .on('complete', () => {
                if (window.confirm('重新开始')) {
                    this.restart();
                }
            })
            .start()

    }
    /**
     * 更新相机位置
     * @return { Promise }
     */
    updateCameraPosition() {
        return new Promise((resolve) => {
            const position = this.jumper.position.clone();
            new Tween(camera.position)
                .to({
                    x: position.x - 29.97,
                    z: position.z + 27.59
                }, 500)
                .start()
                .on('complete', () => {
                    resolve();
                })
        });
    }
}