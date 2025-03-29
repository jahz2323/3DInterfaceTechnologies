import * as THREE from "three";
import {AmbientLight, BeaconLight, DirectionalLight, PostLight} from "./SunLight.js";
import {
    amplitude_collection,
    frequency_collection,
    velocity_collection,
    phase_collection,
    wavelength_collection,
    w_collection
} from "./Plane.js";


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
    gui.add(BeaconLight, 'intensity', 5, 10000, 0.001);
    gui.add(PostLight, 'intensity', 5, 5000, 0.001);
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -1000, 1000).onChange(onChangeFn);
    folder.add(vector3, 'y', -1000, 1000).onChange(onChangeFn);
    folder.add(vector3, 'z', -1000, 1000).onChange(onChangeFn);
    folder.open();
}

function makeFogGUI(scene, gui, fog, renderer) {
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

function updatewave() {
    for (let i = 1; i <= 5; i++) {
        wavelength_collection[`wavelength${i}`] =
            velocity_collection[`v${i}`] / frequency_collection[`f${i}`];
        w_collection[`w${i}`] = 2 / wavelength_collection[`wavelength${i}`];
        phase_collection[`phase${i}`] =
            velocity_collection[`v${i}`] * 2 / wavelength_collection[`wavelength${i}`];
    }
}

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
    const addWaveControls = (collection, name, min, max, step) => {
        const subfolder = folder.addFolder(name);
        for (const key in collection) {
            subfolder.add(collection, key, min, max, step).name(key).onChange(() => {
                // Update the corresponding plane property (if needed)
                plane[key] = collection[key];
                updatewave();
            });
        }
        subfolder.open();
    };

    // Add controls for each collection
    addWaveControls(amplitude_collection, 'Amplitudes', 0, 10, 0.01);
    addWaveControls(frequency_collection, 'Frequencies', 0, 10, 0.001);
    addWaveControls(velocity_collection, 'Velocities', 0, 10, 0.001);

    folder.add(dn, 'Brownian_Waves').onChange((value) => {
        if (value) {
            scene.remove(plane);
            scene.add(brownianWave);
        } else {
            scene.add(plane);
            scene.remove(brownianWave);
        }
    });

    folder.open();;
}

export {
    makeLightGui,
    makeXYZGUI,
    makeFogGUI,
    makeDayAndNight,
    makeSoundsGui,
    makeWavesGui
}