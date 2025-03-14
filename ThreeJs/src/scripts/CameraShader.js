import {OrbitControls} from "three/addons/controls/OrbitControls.js";

import * as THREE from "three";

const renderer = new THREE.WebGLRenderer();

document.body.appendChild( renderer.domElement );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const controls = new OrbitControls( camera, renderer.domElement );
controls.keys = {
    LEFT: "KeyA",
    RIGHT: "KeyD",
    UP: "KeyW",
    DOWN: "KeyS",
}
controls.enableDamping = true;
camera.position.z = 30;


export {camera,renderer};