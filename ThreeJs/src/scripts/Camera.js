import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";

const renderer = new THREE.WebGLRenderer();

document.body.appendChild( renderer.domElement );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 3000 );
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 100, -200);


export {camera,renderer};