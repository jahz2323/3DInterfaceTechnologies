import * as THREE from 'three';
import $ from "jquery";
import {plane, under_plane} from "./scripts/Plane.js"
import {light, helper, lightSphere}  from "./scripts/SunLight.js";
import {camera,renderer}   from "./scripts/CameraShader.js";
import {CreateSceneObjects} from "./scripts/SurfaceObjects.js";
import {brownianWave} from "./scripts/BrownianWave.js";
import {SkyBox} from "./scripts/SkyBox.js";

const scene = new THREE.Scene();

const objects = CreateSceneObjects();
const SkyBox_ = SkyBox();
// scene.add(plane); // sum of sines plane
// scene.add(brownianWave);
// scene.add(under_plane); // ocean floor
scene.add(light);
scene.add(helper);
scene.add(lightSphere);
scene.add(objects);
scene.add(SkyBox_);
scene.fog = new THREE.Fog( 0xe5f9ee, 0, 1000 );

const size = 100;
const divisions = 100;
// const gridHelper = new THREE.GridHelper( size, divisions );
// gridHelper.position.set( 0, -15, 0 );
// scene.add( gridHelper );

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
function animate() {

    renderer.render(scene, camera);
    // console.log("Current Camera position: ", camera.position.x, camera.position.y, camera.position.z);
    // console.log("Current Light posiiton: ", light.position.x, light.position.y, light.position.z);
    // console.log("Current Light-target position: ", light.target.position.x, light.target.position.y, light.target.position.z);
}
animate();

