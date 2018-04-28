import { Group } from 'three';
import { Tween } from 'es6-tween';
import scene from './three/scene';
import camera from './three/camera';
import createCube from './createCube';
import createJumper from './createJumper';
import random from 'lodash.random';
import {directionalLight} from './three/scene/light';


export default class Game {
    constructor() {
        this.init();
    }

    init() {
        this.config = {
            cubeDis: isMobile ? [19, 25] : [20, 30], // 下一次方块生成的间距范围
            cubeMaxLen: 6, // 方块超出此范围删除
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
        // 分数
        this.grade = 0;
        this.createCube();
        this.createCube();
        this.createJumper();
    }
    restart() {
        this.cubes.children = [];
        this.nextCubePosition = [0, 0, 0];
        this.currentCubeIndex = 0;
        this.grade = 0;
        this.createCube();
        this.createCube();
        this.jumper.position.set(
            this.jumper.userData.initialPosition.x,
            this.jumper.userData.initialPosition.y,
            this.jumper.userData.initialPosition.z
        );
        this.jumper.rotation.set(0, 0, 0);
        this.updateCameraPosition();
    }
    end() {
        this.nextCubePosition = [0, 0, 0];
        this.currentCubeIndex = 0;
        // this.restart();
    }

    addEvent() {
        // const canvas = document.querySelector('canvas')
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

        document.documentElement.addEventListener(mouseEvents.down, (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.handleMousedown()
        }, false);
        // 监听鼠标松开的事件
        document.documentElement.addEventListener(mouseEvents.up, (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.handleMouseup()
        }, false);
    }
    createJumper() {
        const jumper = createJumper();
        this.jumperBody = jumper.getObjectByName('JumperBody');
        this.jumperHead = jumper.getObjectByName('jumperHead');
        this.jumper = jumper;
        // 产生阴影
        this.jumperBody.castShadow = true;
        this.jumperHead.castShadow = true;
        this.jumper.position.y = 3.6;


        // 记录初始状态
        this.jumper.userData.initialPosition = this.jumper.position.clone();
        this.jumperHead.userData.initialPosition = this.jumperHead.position.clone();
        this.jumperBody.userData.initialScale = this.jumperBody.scale.clone();
        this.jumperBody.userData.initialPosition = this.jumperBody.position.clone();

        scene.add(this.jumper);

    }

    /**
     * 创建方块
     */
    createCube() {
        // 0: x(前)  2:z(右)
        const direction = random(0, 1) === 0 ? 0 : 2;
        // 更新当前方向
        this.config.direction = direction;
        // 更新坐标
        // this.cubes is a Group
        const dis = !this.cubes.children.length ? 0 : random(this.config.cubeDis[0], this.config.cubeDis[1])
        this.nextCubePosition[direction] += dis;

        const cube = createCube();
        cube.position.set(...this.nextCubePosition);
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

        
        /* 判断下一个方块相对当前方块的方向来确定计算距离的坐标轴 */
        // jumper和当前方块的坐标轴距离
        const disC = jumpP[direction] - cubeCurrentP[direction];
        // jumper和下一个方块的坐标轴距离
        const disN = jumpP[direction] - cubeNextP[direction];

        // 如果大小不一样则需要两个值（目前一个就可以）
        // 如果有圆柱体则取radiusBottom
        const nextTargetDis = cubeNext.geometry.parameters.width / 2; // 当前方块的宽的一半
        const currentTargetDis = cubeNext.geometry.parameters.width / 2; // 下一个方块的宽的一半
        const jumpBodyRadiusBottom = this.jumperBody.geometry.parameters.radiusBottom; // jumper的地部半径

        //  || (disN > nextTargetDis && disN < cubeNextP[direction] + nextTargetDis)
        //  || (disN > nextTargetDis && disN < cubeNextP[direction] + nextTargetDis)
        // 落再当前
        
        if (Math.abs(disC) < currentTargetDis) {
            return 'current';
        } else if (Math.abs(disN) < nextTargetDis) {
            return 'next';
        } else if (Math.abs(disC) > currentTargetDis + jumpBodyRadiusBottom && Math.abs(disN) > nextTargetDis + jumpBodyRadiusBottom) {
            // 完美落在空地上
            return 'floor';
        } else if (Math.abs(disC) < currentTargetDis + jumpBodyRadiusBottom) {
            // 落在当前边缘上
            return 'currentEdge';
        } else if (Math.abs(disN) < nextTargetDis + jumpBodyRadiusBottom) {
            // 落在下一个边缘上
            if (disN > 0) {
                // 靠远的边缘
                return 'nextEdgeFar';
            }
            // 靠近的边缘
            return 'nextEdgeNear';
            
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
        const speedX = this.power * this.config.speedXCoe;
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
        console.log((this.power), this.jumperState)
        if (this.power > 12) {
            // 左手拇指是z，上是y, 中指是x，
            const direction = this.config.direction === 0 ? 'z' : 'x';
            new Tween(this.jumper.rotation)
                .to({
                    [direction]: (direction === 'z' ? -360 : 360) * Math.PI / 180
                }, this.power * 80)
                .on('complete', () => {
                })
                .start()
        }
    }

    async handleJumpEnd() {
        const res = this.checkJumpState();
        this.jumperState = 'jumpend';
        switch (res) {
        case 'cuerrnt':
            // 先检测是否成功落地再移动camera
            // await this.updateCameraPosition();
            // await this.updateLightPosition();
            break;
        case 'next':
            // 游标切至下一个， 并继续创建方块
            Promise.all([
                this.updateCameraPosition(),
                this.updateLightPosition()
            ]).then(() => {
                // 移除早期的方块
                if (this.cubes.children.length > this.config.cubeMaxLen) {
                    this.cubes.remove(this.cubes.children[0]);
                } else {
                    this.currentCubeIndex++;
                }
                this.createCube();
                this.grade++;
            })
            break;
        case 'floor':
            this.handleJumpFail(res);
            break;
        case 'currentEdge':
            this.handleJumpFail(res);
            break;
        case 'nextEdgeFar':
            this.handleJumpFail(res);
            break;
        case 'nextEdgeNear':
            this.handleJumpFail(res);
            break;
        }
        this.power = 0;
        
        
        

    }

    /**
     * 
     * @param {string} 落什么位置
     */
    handleJumpFail(position) {
        this.jumperState = 'fail';
        // 左手拇指是z，上是y, 中指是x， 
        // this.config.direction 0代表代表下一个方块再X方向 , 2代表下一个方块再Z方向
        // direction代表需要沿哪根轴旋转
        const direction = this.config.direction === 0 ? 'z' : 'x';
        // 右手扭动旋转轴，角度为负数的效果为顺时针
        let deg = -90;
        if (
            position === 'currentEdge' && this.config.direction === 2 ||
            position === 'nextEdgeNear' && this.config.direction === 0 ||
            position === 'nextEdgeFar' && this.config.direction === 2
        ) {
            deg = 90;
        }
        // 落到边缘才倒地
        if (position.indexOf('Edge') > -1) {
            new Tween(this.jumper.rotation)
                .to({
                    [direction]: deg * Math.PI / 180
                }, 400)
                .on('complete', () => {
                })
                .start()
        }
        new Tween(this.jumper.position)
            .to({ y: -1 }, 400)
            .on('complete', () => {
                this.onFail();
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

    /**
     * 更新灯光位置
     * @return { Promise }
     */
    updateLightPosition() {
        return new Promise((resolve) => {
            const position = this.jumper.position.clone();
            new Tween(directionalLight.position)
                .to({
                    x: position.x - 50,
                    z: position.z + 150
                }, 500)
                .start()
                .on('complete', () => {
                    resolve();
                })
        });
    }
}