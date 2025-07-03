/**
 * Scene UI Controls Module
 * 
 * This module provides GUI controls for manipulating various aspects of the 3D scene:
 * - Light colors and intensities
 * - Object positions (XYZ coordinates)
 * - Fog density and color
 * - Day/night cycle
 * - Sound controls
 * - Wave parameters
 * 
 * Each function creates a specific set of controls that modify scene elements in real-time.
 */

import * as THREE from "three";
import {AmbientLight, BeaconLight, DirectionalLight, PostLight} from "./SunLight.js";
import {waves} from "./Plane.js";

/**
 * Helper class for color GUI controls
 * Converts between THREE.js Color objects and hexadecimal color strings
 * This allows the color picker to work with THREE.js Color objects
 */
class ColorGUIHelper {
    /**
     * @param {Object} object - The object containing the color property
     * @param {string} prop - The name of the color property on the object
     */
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }

    /**
     * Getter for the color value
     * Converts THREE.Color to hex string format for the color picker
     * @returns {string} - Hex color string (e.g., "#FF0000")
     */
    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }

    /**
     * Setter for the color value
     * Converts hex string from color picker to THREE.Color
     * @param {string} hexString - Hex color string (e.g., "#FF0000")
     */
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}

/**
 * Creates GUI controls for all lights in the scene
 * Allows adjusting color and intensity for each light type
 * 
 * @param {GUI} gui - The lil-gui instance to add controls to
 */
function makeLightGui(gui) {
    // Add color controls for each light type
    gui.addColor(new ColorGUIHelper(DirectionalLight, 'color'), 'value').name('DirectionalLightColor');
    gui.addColor(new ColorGUIHelper(AmbientLight, 'color'), 'value').name('AmbientLightColor');
    gui.addColor(new ColorGUIHelper(BeaconLight, 'color'), 'value').name('BeaconLightColor');
    gui.addColor(new ColorGUIHelper(PostLight, 'color'), 'value').name('PostLightColor');

    // Add intensity sliders for each light type with appropriate ranges
    gui.add(DirectionalLight, 'intensity', 0, 5, 0.001).name('Sun Intensity');
    gui.add(AmbientLight, 'intensity', 1, 5, 0.001).name('Ambient Intensity');
    gui.add(BeaconLight, 'intensity', 5, 20000, 0.1).name('Beacon Intensity');
    gui.add(PostLight, 'intensity', 5, 20000, 0.1).name('Post Light Intensity');
}

/**
 * Creates GUI controls for adjusting XYZ coordinates of a vector3 object
 * 
 * @param {GUI} gui - The lil-gui instance to add controls to
 * @param {THREE.Vector3} vector3 - The Vector3 object to control
 * @param {string} name - Name for the folder containing these controls
 * @param {Function} onChangeFn - Callback function to execute when values change
 */
function makeXYZGUI(gui, vector3, name, onChangeFn) {
    // Create a folder to group the X, Y, Z controls
    const folder = gui.addFolder(name);

    // Add sliders for each coordinate with a wide range
    folder.add(vector3, 'x', -1000, 1000).onChange(onChangeFn).name('X Position');
    folder.add(vector3, 'y', -1000, 1000).onChange(onChangeFn).name('Y Position');
    folder.add(vector3, 'z', -1000, 1000).onChange(onChangeFn).name('Z Position');

    // Open the folder by default
    folder.open();
}

/**
 * Creates GUI controls for adjusting fog properties in the scene
 * 
 * @param {THREE.Scene} scene - The scene containing the fog
 * @param {GUI} gui - The lil-gui instance to add controls to
 * @param {THREE.Fog} fog - The fog object to control
 */
function makeFogGUI(scene, gui, fog) {
    // Create a folder for fog controls
    const folder = gui.addFolder("Fog Controls");

    // Add color control for fog
    folder.addColor(new ColorGUIHelper(fog, 'color'), 'value').name('Fog Color');

    // Add near distance control (where fog starts)
    folder.add(fog, 'near', 0.001, 1000).onChange((value) => {
        fog.near = value;
        scene.fog.near = value; // Update scene fog
    }).name('Fog Start Distance');

    // Add far distance control (where fog is fully opaque)
    folder.add(fog, 'far', 1000, 3000).onChange((value) => {
        fog.far = value;
        scene.fog.far = value; // Update scene fog
    }).name('Fog End Distance');

    // Open the folder by default
    folder.open();
}

/**
 * Creates GUI controls for toggling between day and night environments
 * Changes the skybox texture based on selection
 * 
 * @param {GUI} gui - The lil-gui instance to add controls to
 * @param {THREE.Material} material - The skybox material to modify
 */
function makeDayAndNight(gui, material) {
    // Create an object to hold the toggle state
    const dn = {day: true};

    // Create a folder for day/night controls
    const folder = gui.addFolder('Day and Night');

    // Load day and night textures
    const daytexture = new THREE.TextureLoader().load('../src/public/textures/envmaps/Sunview.webp');
    const nighttexture = new THREE.TextureLoader().load('../src/public/textures/envmaps/Oceanview.webp');

    // Add toggle control
    folder.add(dn, 'day').onChange((value) => {
        // Switch texture based on toggle state
        if (value) {
            material.map = daytexture;  // Day texture
        } else {
            material.map = nighttexture; // Night texture
        }
        // Notify material that it needs to update
        material.needsUpdate = true;
    }).name('Daytime');

    // Open the folder by default
    folder.open();
}

/**
 * Creates GUI controls for audio playback
 * 
 * @param {GUI} gui - The lil-gui instance to add controls to
 * @param {HTMLAudioElement} sound - The audio element to control
 */
function makeSoundsGui(gui, sound) {
    // Create a folder for sound controls
    const folder = gui.addFolder('Sound Controls');

    // Add volume slider (0-100%)
    folder.add(sound, 'volume', 0, 1, 0.01).name('Volume');

    // Add playback control buttons
    folder.add(sound, 'play').name('Play Sound');
    folder.add(sound, 'pause').name('Pause Sound');
    folder.add(sound, 'stop').name('Stop Sound');

    // Open the folder by default
    folder.open();
}

/**
 * Updates derived wave parameters when wave properties are changed via GUI
 * Recalculates wave number and angular frequency for each wave
 */
function updateWaveParameters() {
    waves.forEach((wave) => {
        // Wave number (k) - spatial frequency (radians per unit distance)
        wave.k = (2 * Math.PI) / wave.wavelength;

        // Angular frequency (ω) - temporal frequency (radians per second)
        wave.omega = wave.k * wave.speed;
    });
    // Note: The wave animation automatically uses these updated parameters
};

/**
 * Creates GUI controls for adjusting wave parameters and switching between wave types
 * 
 * @param {THREE.Scene} scene - The scene containing the waves
 * @param {GUI} gui - The lil-gui instance to add controls to
 * @param {THREE.Mesh} plane - The regular wave plane mesh
 * @param {THREE.Mesh} brownianWave - The alternative Brownian motion wave mesh
 */
function makeWavesGui(scene, gui, plane, brownianWave) {
    // Create a folder for wave controls
    const folder = gui.addFolder('Wave Settings');

    // Create toggle for switching between wave types
    const dn = {Brownian_Waves: true};

    // Add the regular wave plane to the scene initially
    scene.add(plane);

    // Create controls for each individual wave component
    // Each wave has amplitude, wavelength, speed, and direction parameters
    waves.forEach((wave, index) => {
        // Create a subfolder for each wave
        const waveFolder = folder.addFolder(`Wave ${index + 1}`);

        // Add sliders for basic wave properties
        waveFolder.add(wave, 'amplitude', 0, 10, 0.01)
            .onChange(updateWaveParameters)
            .name('Wave Height');

        waveFolder.add(wave, 'wavelength', 0.1, 100, 0.1)
            .onChange(updateWaveParameters)
            .name('Wave Length');

        waveFolder.add(wave, 'speed', 0, 20, 0.1)
            .onChange(updateWaveParameters)
            .name('Wave Speed');

        // Create a subfolder for direction controls
        const directionFolder = waveFolder.addFolder('Wave Direction');

        // Add X and Y direction controls
        // These are normalized to maintain a unit vector
        directionFolder.add(wave.direction, 'x', -1, 1, 0.01).onChange(() => {
            wave.direction.normalize(); // Keep it a unit vector
            updateWaveParameters();
        }).name('X Direction');

        directionFolder.add(wave.direction, 'y', -1, 1, 0.01).onChange(() => {
            wave.direction.normalize(); // Keep it a unit vector
            updateWaveParameters();
        }).name('Y Direction');

        // Open the direction subfolder by default
        directionFolder.open();

        // Open the wave subfolder by default
        waveFolder.open();
    });

    // Add toggle to switch between regular waves and Brownian motion waves
    folder.add(dn, 'Brownian_Waves').onChange((value) => {
        if (value) {
            // Switch to Brownian motion waves
            scene.remove(plane);
            scene.add(brownianWave);
        } else {
            // Switch to regular sine waves
            scene.add(plane);
            scene.remove(brownianWave);
        }
    }).name('Use Brownian Waves');

    // Open the main folder by default
    folder.open();
}

/**
 * Export all GUI creation functions for use in other modules
 */
export {
    makeLightGui,     // Light color and intensity controls
    makeXYZGUI,       // Position controls for objects
    makeFogGUI,       // Fog density and color controls
    makeDayAndNight,  // Day/night cycle toggle
    makeSoundsGui,    // Audio controls
    makeWavesGui      // Wave parameter controls
}
