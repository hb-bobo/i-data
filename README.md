# three-jump
基于three.js的跳一跳


1. three 必要
scene, camera and renderer,
```javascript
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
```

2. 添加一个3D对象的必要步骤

```javascript
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
```

3. 当看不到物体时，尝试设置相机位置(step-1)

```javascript
camera.position.set(0, 0, 25);
camera.position.z = 25;
```

4. 利用editor调整相机位置

```javascript
camera.position.set(-7.97, 16.97, 17.59);
lookAt
```

5. 利用插件调整相机(step-2)
```javascript
import OrbitControls from 'three-orbitcontrols';
var controls = new OrbitControls(camera, renderer.domElement);
```


6. loader
JSONLoader parse .js
ObjectLoader parse .json


7. 灯光

```javascript
DirectionalLigh + AmbientLight
```

8. 游戏逻辑(step-3)

9. 阴影
renderer.shadowMap.enabled = true;
airectionalLight.castShadow = true;
cube.castShadow = true;

















