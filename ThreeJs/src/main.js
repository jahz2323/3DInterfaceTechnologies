import * as THREE from 'three';
import {GUI} from "three/addons/libs/lil-gui.module.min.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
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

import {camera} from "./scripts/Camera.js";
import {CreateSceneObjects} from "./scripts/SurfaceObjects.js";
import {SkyBox} from "./scripts/SkyBox.js";
import {brownianWave} from "./scripts/BrownianWave.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {StereoEffect} from "three/addons/effects/StereoEffect.js";

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild( renderer.domElement );

// Initialize StereoEffect WITH the renderer
const effect = new StereoEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight); // Set initial size

const scene = new THREE.Scene();
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const objects = CreateSceneObjects();
const {skybox, material} = SkyBox();

//setup controls
const controls = new OrbitControls(camera, renderer.domElement);

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

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

function animate() {
    stats.update();
    controls.update(); // Update controls every frame

    BeaconLight.target.position.x = Math.cos(Date.now() * 0.001) * 300;
    BeaconLight.target.position.z = Math.sin(Date.now() * 0.001) * 300;
    beaconHelper.update();
    postHelper.update();

    // Render the scene with the stereo effect
    effect.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
});