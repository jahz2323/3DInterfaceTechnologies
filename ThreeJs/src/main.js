import * as THREE from 'three';
import $ from "jquery";
import {plane, under_plane} from "./scripts/Plane.js"
import {spheretest,light, helper, lightSphere}  from "./scripts/SunLight.js";
import {camera,renderer}   from "./scripts/CameraShader.js";
import {createPier} from "./scripts/SurfaceObjects.js";

const scene = new THREE.Scene();


const pier = createPier();
scene.add(plane);
scene.add(under_plane);
scene.add(spheretest);
scene.add(light);
scene.add(helper);
scene.add(lightSphere);
scene.add(pier);

const size = 100;
const divisions = 100;
const gridHelper = new THREE.GridHelper( size, divisions );
gridHelper.position.set( 0, -15, 0 );
scene.add( gridHelper );

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
function animate() {
    // plane[0].rotation.x += 0.01;
    // plane[0].rotation.y += 0.01;


    renderer.render(scene, camera);
    // console.log("Current Camera position: ", camera.position.x, camera.position.y, camera.position.z);
    // console.log("Current Light posiiton: ", light.position.x, light.position.y, light.position.z);
    // console.log("Current Light-target position: ", light.target.position.x, light.target.position.y, light.target.position.z);
}
animate();

