/**
 * Main entry point for the 3D ocean scene application
 * This file sets up the ThreeJS environment, including:
 * - Scene, camera, and renderer initialization
 * - Lighting setup
 * - GUI controls for scene manipulation
 * - Animation loop
 * - Event handling
 */

// Import ThreeJS core library and utilities
import * as THREE from 'three';
import {GUI} from "three/addons/libs/lil-gui.module.min.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

// Import ocean plane components (water surface and ocean floor)
import {
    plane,
    under_plane,
    cubeCamera
} from "./scripts/Plane.js"

// Import lighting components for the scene
import {
    DirectionalLight,  // Main directional sunlight
    AmbientLight,      // Overall ambient lighting
    BeaconLight,       // Rotating spotlight (lighthouse effect)
    PostLight,         // Static spotlight
    helper,            // Light helper for visualization
    updateLight,       // Function to update light properties
} from "./scripts/SunLight.js";

// Import GUI creation functions for different scene aspects
import {
    makeFogGUI,        // Controls for fog density and color
    makeDayAndNight,   // Day/night cycle controls
    makeLightGui,      // Light property controls
    makeWavesGui,      // Wave animation controls
    makeXYZGUI,        // Position controls for objects
    makeSoundsGui,     // Audio controls
} from "./scripts/SceneUI.js";

// Import other scene components
import {camera} from "./scripts/Camera.js";                    // Camera setup
import {CreateSceneObjects} from "./scripts/SurfaceObjects.js"; // Surface objects (boats, etc.)
import {SkyBox} from "./scripts/SkyBox.js";                    // Sky environment
import {brownianWave} from "./scripts/BrownianWave.js";        // Alternative wave animation
import Stats from "three/examples/jsm/libs/stats.module.js";   // Performance monitoring
import {StereoEffect} from "three/addons/effects/StereoEffect.js"; // Stereoscopic 3D effect

// Initialize the WebGL renderer with device pixel ratio for sharp rendering
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Initialize StereoEffect for stereoscopic 3D rendering (VR-like experience)
const effect = new StereoEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight); // Set initial size based on window dimensions

// Create the main 3D scene that will contain all objects
const scene = new THREE.Scene();

// Initialize performance monitoring stats panel (FPS counter)
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// Create and add surface objects (boats, buoys, etc.) to the scene
const objects = CreateSceneObjects();

// Create skybox for environment background
const {skybox, material} = SkyBox();

// Setup orbit controls to allow camera rotation, panning, and zooming with mouse/touch
const controls = new OrbitControls(camera, renderer.domElement);

// Commented out alternative ocean surfaces - can be uncommented to switch between different water effects
// scene.add(plane);        // Sum of sines wave pattern for ocean surface
// scene.add(brownianWave); // Brownian motion based wave pattern
// scene.add(under_plane);  // Ocean floor mesh

// Add lighting to the scene
scene.add(DirectionalLight); // Main directional light (sun)
scene.add(AmbientLight);     // Ambient light for overall scene illumination
scene.add(BeaconLight);      // Rotating spotlight (lighthouse effect)
scene.add(PostLight);        // Static spotlight
scene.add(helper);           // Light helper for visualization
scene.add(objects);          // Add all surface objects (boats, buoys, etc.)
// scene.add(skybox);        // Skybox can be enabled for environment background

// Add visual helpers to see spotlight positions and directions
// BeaconLight helper - visualizes the rotating spotlight cone
const beaconHelper = new THREE.SpotLightHelper(BeaconLight);
scene.add(beaconHelper);

// PostLight helper - visualizes the static spotlight cone
const postHelper = new THREE.SpotLightHelper(PostLight);
scene.add(postHelper);

// Add fog to the scene for depth and atmosphere
let SceneFog = new THREE.Fog(0xAAAAAA, 300, 2500); // Color, near distance, far distance
scene.fog = SceneFog;

// Add background ocean wave sound for immersion
const backgroundsound = new Audio('../src/public/media/oceanwaves.mp3');
/**
 * Set up the GUI controls for interactive scene manipulation
 * These controls allow users to adjust various aspects of the scene in real-time
 */
const gui = new GUI();
makeSoundsGui(gui, backgroundsound);                                    // Audio controls for ocean sounds
makeXYZGUI(gui, DirectionalLight.target.position, 'target', updateLight); // Position controls for directional light
makeFogGUI(scene, gui, SceneFog, renderer);                             // Fog density and color controls
makeDayAndNight(gui, material);                                         // Day/night cycle toggle
makeWavesGui(scene, gui, plane, brownianWave);                          // Wave animation parameters
makeLightGui(gui);                                                      // Light color and intensity controls

// Configure renderer for shadow mapping
renderer.shadowMap.enabled = true;                        // Enable shadow rendering
renderer.shadowMap.type = THREE.PCFSoftShadowMap;         // Use soft shadows for more realistic effect
renderer.setSize(window.innerWidth, window.innerHeight);  // Set renderer size to match window
renderer.setAnimationLoop(animate);                       // Start the animation loop

/**
 * Main animation loop function - called every frame
 * Handles updates to scene elements, controls, and rendering
 */
function animate() {
    // Update performance stats (FPS counter)
    stats.update();

    // Update orbit controls to respond to user input
    controls.update();

    // Animate the BeaconLight target position in a circular motion (lighthouse effect)
    // This creates a rotating spotlight effect with a period of about 6.28 seconds
    BeaconLight.target.position.x = Math.cos(Date.now() * 0.001) * 300; // Circular motion along X axis
    BeaconLight.target.position.z = Math.sin(Date.now() * 0.001) * 300; // Circular motion along Z axis

    // Update the visual helpers for the spotlights
    beaconHelper.update();
    postHelper.update();

    // Render the scene with stereoscopic 3D effect
    effect.render(scene, camera);

    // Environment mapping for water reflections:
    // 1. Hide the water plane temporarily
    plane.visible = false;
    // 2. Update the cube camera (captures the scene for reflections)
    cubeCamera.update(renderer, scene);
    // 3. Show the water plane again with updated reflections
    plane.visible = true;
}

/**
 * Window resize event handler
 * Ensures the scene adjusts properly when the browser window is resized
 */
window.addEventListener("resize", () => {
    // Update camera aspect ratio to match new window dimensions
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Resize renderer and stereo effect to match new window dimensions
    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
});
