import * as THREE from 'three';
import {GUI} from "three/addons/libs/lil-gui.module.min.js";
import {
    plane,
    under_plane

} from "./scripts/Plane.js"
import {
    DirectionalLight,
    AmbientLight,
    BeaconLight,
    PostLight,
    helper,
    updateLight,
} from "./scripts/SunLight.js";
import {
    makeFogGUI,
    makeDayAndNight,
    makeLightGui,
    makeWavesGui,
    makeXYZGUI,
    makeSoundsGui,
} from "./scripts/SceneUI.js";

import {camera, renderer} from "./scripts/Camera.js";
import {CreateSceneObjects} from "./scripts/SurfaceObjects.js";
import {SkyBox} from "./scripts/SkyBox.js";
import {brownianWave} from "./scripts/BrownianWave.js";
const scene = new THREE.Scene();

const objects = CreateSceneObjects();
const {skybox, material} = SkyBox();


// scene.add(plane); // sum of sines plane
// scene.add(brownianWave);
scene.add(under_plane); // ocean floor
scene.add(DirectionalLight);
scene.add(AmbientLight);

scene.add(BeaconLight);
scene.add(PostLight);

scene.add(helper);
scene.add(objects);
scene.add(skybox);


// BeaconLight helper
const beaconHelper = new THREE.SpotLightHelper(BeaconLight);
scene.add(beaconHelper);

// PostLight helper
const postHelper = new THREE.SpotLightHelper(PostLight);
scene.add(postHelper);

let SceneFog = new THREE.Fog(0xAAAAAA, 300, 2500);
scene.fog = SceneFog;
const backgroundsound = new Audio('../src/public/media/oceanwaves.mp3');
/**
  set up the GUIs

 */
const gui = new GUI();
makeSoundsGui(gui, backgroundsound);
makeXYZGUI(gui, DirectionalLight.target.position, 'target', updateLight);
makeFogGUI(scene, gui, SceneFog, renderer);
makeDayAndNight(gui, material);
makeWavesGui(scene, gui, plane, brownianWave);
makeLightGui(gui);


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
    BeaconLight.target.position.z = Math.sin(Date.now() * 0.001) * 300;
    // beaconTargetHelper.position.copy(BeaconLight.target.position);
    renderer.render(scene, camera);
    // Update helpers
    beaconHelper.update();
    postHelper.update();
    // PrintWaveParameters();
    // console.log("Current Camera position: ", camera.position.x, camera.position.y, camera.position.z);
    // console.log("Current Light posiiton: ", light.position.x, light.position.y, light.position.z);
    // console.log("Current Light-target position: ", light.target.position.x, light.target.position.y, light.target.position.z);
}


animate();

