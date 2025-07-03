import * as THREE from "three";
import {AmbientLight, BeaconLight, DirectionalLight, PostLight} from "./SunLight.js";
import {waves} from "./Plane.js";

class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object
        this.prop = prop
    }

    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }

    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}

function makeLightGui(gui) {
    gui.addColor(new ColorGUIHelper(DirectionalLight, 'color'), 'value').name('DirectionalLightColor');
    gui.addColor(new ColorGUIHelper(AmbientLight, 'color'), 'value').name('AmbientLightColor');
    gui.addColor(new ColorGUIHelper(BeaconLight, 'color'), 'value').name('BeaconLightColor');
    gui.addColor(new ColorGUIHelper(PostLight, 'color'), 'value').name('PostLightColor');
    gui.add(DirectionalLight, 'intensity', 0, 5, 0.001);
    gui.add(AmbientLight, 'intensity', 1, 5, 0.001);
    gui.add(BeaconLight, 'intensity', 5, 20000, 0.1);
    gui.add(PostLight, 'intensity', 5, 20000, 0.1);
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -1000, 1000).onChange(onChangeFn);
    folder.add(vector3, 'y', -1000, 1000).onChange(onChangeFn);
    folder.add(vector3, 'z', -1000, 1000).onChange(onChangeFn);
    folder.open();
}

function makeFogGUI(scene, gui, fog) {
    const folder = gui.addFolder("fog");
    //add color control
    folder.addColor(new ColorGUIHelper(fog, 'color'), 'value').name('color');
    // Add near and far controls
    folder.add(fog, 'near', 0.001, 1000).onChange((value) => {
        fog.near = value;
        scene.fog.near = value; // Update scene fog
    });
    folder.add(fog, 'far', 1000, 3000).onChange((value) => {
        fog.far = value;
        scene.fog.far = value; // Update scene fog
    });
    folder.open();
}

function makeDayAndNight(gui, material) {
    const dn = {day: true};
    const folder = gui.addFolder('Day and Night');
    const daytexture = new THREE.TextureLoader().load('../src/public/textures/envmaps/Sunview.webp');
    const nighttexture = new THREE.TextureLoader().load('../src/public/textures/envmaps/Oceanview.webp');

    folder.add(dn, 'day').onChange((value) => {
        if (value) {
            material.map = daytexture;
        } else {
            material.map = nighttexture;
        }
        material.needsUpdate = true;
    });
    folder.open();
}

function makeSoundsGui(gui, sound) {
    const folder = gui.addFolder('Sounds');
    folder.add(sound, 'volume', 0, 1, 0.01);
    folder.add(sound, 'play');
    folder.add(sound, 'pause');
    folder.add(sound, 'stop');
    folder.open();
}


function updateWaveParameters() {
    waves.forEach((wave) => {
        wave.k = (2 * Math.PI) / wave.wavelength; // Wave number (k = 2pi / lambda)
        wave.omega = wave.k * wave.speed;// Angular frequency (omega = k * v)
    });
    // Update the plane geometry to reflect the new wave parameters
};

function makeWavesGui(scene, gui, plane, brownianWave) {
    const folder = gui.addFolder('Wave settings');
    const dn = {Brownian_Waves: true};
    scene.add(plane);

    /**
     * Wave controls
     IDEA - use collections to store the values of the waves
     - amplitude_collection
     - frequency_collection
     - velocity_collection
     - phase_collection
     Modify the values of the waves using the GUI, for each item in collection by the index

     */
    waves.forEach((wave, index) => {
        const waveFolder = folder.addFolder(`Wave ${index + 1}`);

        waveFolder.add(wave, 'amplitude', 0, 10, 0.01).onChange(updateWaveParameters);
        waveFolder.add(wave, 'wavelength', 0.1, 100, 0.1).onChange(updateWaveParameters);
        waveFolder.add(wave, 'speed', 0, 20, 0.1).onChange(updateWaveParameters);

        // Add controls for direction if you want to modify them via GUI
        // This is more complex as direction is a Vector2, not a simple number
        const directionFolder = waveFolder.addFolder('Direction');
        directionFolder.add(wave.direction, 'x', -1, 1, 0.01).onChange(() => {
            wave.direction.normalize(); // Keep it a unit vector
            updateWaveParameters();
        });
        directionFolder.add(wave.direction, 'y', -1, 1, 0.01).onChange(() => {
            wave.direction.normalize(); // Keep it a unit vector
            updateWaveParameters();
        });
        directionFolder.open();

        waveFolder.open();
    });

    folder.add(dn, 'Brownian_Waves').onChange((value) => {
        if (value) {
            scene.remove(plane);
            scene.add(brownianWave);
        } else {
            scene.add(plane);
            scene.remove(brownianWave);
        }
    });

    folder.open();
}

export {
    makeLightGui,
    makeXYZGUI,
    makeFogGUI,
    makeDayAndNight,
    makeSoundsGui,
    makeWavesGui
}