
import { WebGLRenderer } from 'three'
import scene from '../scene';
import camera from '../camera';
import { update } from 'es6-tween'

//动画队列
var animateRunList = [];

var renderer = new WebGLRenderer({
    antialias: true, // 抗锯齿
    alpha: true, // 透明
    powerPreference: 'high-performance', // 高性能模式
    shadowMap: {
        enabled: true,
    },

});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xCCCCCC, 1.0);


/**
 * 渲染一帧
 */
var render = function () {
    for (let i = 0; i < animateRunList.length; i++) {
        var fn = animateRunList[i];
        if (typeof fn === 'function') {
            fn();
        }
    }
}

/**
 * 实时渲染
 */
function animate() {
    requestAnimationFrame(animate);
    render();
}
animate();
// 添加在animate中要执行的操作队列
// animateRunList.push(update);
animateRunList.push(function() {
    renderer.render( scene, camera );
});

export {
    renderer,
    animate,
    animateRunList,
}
