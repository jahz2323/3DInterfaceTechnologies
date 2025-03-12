import * as THREE from 'three';
import $ from "jquery";
import {plane} from "./scripts/Plane.js"
import {SunLight,light, helper, lightBox}  from "./scripts/SunLight.js";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );


scene.add(plane);
scene.add(SunLight);
scene.add(light);
scene.add(helper);
scene.add(lightBox);

camera.position.z = 5;

const size = 100;
const divisions = 100;

const gridHelper = new THREE.GridHelper( size, divisions );
// scene.add( gridHelper );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;

function animate() {
    // plane[0].rotation.x += 0.01;
    // plane[0].rotation.y += 0.01;
    renderer.render( scene, camera );

}
animate();