import { renderer } from './three';
import Game from './Game';

const root = document.getElementById('root');
root.appendChild(renderer.domElement);


// 禁止移动端长按弹出菜单
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

const game = new Game();

game.start();