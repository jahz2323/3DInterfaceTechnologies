import * as THREE from 'three';
import $ from "jquery";
import {plane, under_plane} from "./scripts/Plane.js"
import {
    DirectionalLight,
    AmbientLight,
    BeaconLight,
    PostLight,
    helper,
    SceneFog,
    gui,
    makeDayAndNight
} from "./scripts/SunLight.js";
import {camera, renderer} from "./scripts/CameraShader.js";
import {CreateSceneObjects} from "./scripts/SurfaceObjects.js";
import {brownianWave} from "./scripts/BrownianWave.js";
import {SkyBox} from "./scripts/SkyBox.js";

const scene = new THREE.Scene();

const objects = CreateSceneObjects();
const {skybox, material} = SkyBox();

// scene.add(plane); // sum of sines plane
scene.add(brownianWave);
scene.add(under_plane); // ocean floor
scene.add(DirectionalLight);
scene.add(AmbientLight);

scene.add(BeaconLight);
scene.add(PostLight);

scene.add(helper);
scene.add(objects);
scene.add(skybox);


const beaconTargetHelper = new THREE.Mesh(
    new THREE.SphereGeometry(40, 16, 16),
    new THREE.MeshBasicMaterial({color: 0xffff00})
);
scene.add(beaconTargetHelper);
const postTargetHelper = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 16),
    new THREE.MeshBasicMaterial({color: 0xff0000})
);
postTargetHelper.position.copy(PostLight.target.position);
scene.add(postTargetHelper);

// BeaconLight helper
const beaconHelper = new THREE.SpotLightHelper(BeaconLight);
scene.add(beaconHelper);

// PostLight helper
const postHelper = new THREE.SpotLightHelper(PostLight);
scene.add(postHelper);

scene.fog = SceneFog;
makeDayAndNight(gui, material);

const size = 100;
const divisions = 100;
// const gridHelper = new THREE.GridHelper( size, divisions );
// gridHelper.position.set( 0, -15, 0 );
// scene.add( gridHelper );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

function animate() {
    BeaconLight.target.position.x = Math.cos(Date.now() * 0.001) * 300;
    BeaconLight.target.position.z = Math.sin(Date.now() * 0.001) * 400;
    beaconTargetHelper.position.copy(BeaconLight.target.position);
    renderer.render(scene, camera);
    // Update helpers
    beaconHelper.update();
    postHelper.update();
    // console.log("Current Camera position: ", camera.position.x, camera.position.y, camera.position.z);
    // console.log("Current Light posiiton: ", light.position.x, light.position.y, light.position.z);
    // console.log("Current Light-target position: ", light.target.position.x, light.target.position.y, light.target.position.z);
}

animate();

