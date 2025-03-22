import * as THREE from "three";
import {GUI} from "three/addons/libs/lil-gui.module.min.js"

const scene = new THREE.Scene();
const color = 0x433274;
const ambColor = 0x242424;
const intensity = 1;
const DirectionalLight = new THREE.DirectionalLight(color, intensity);
const AmbientLight = new THREE.AmbientLight(ambColor, intensity);
const BeaconLight= new THREE.SpotLight(0xffff00, 500, 800, Math.PI / 24, 0.5);
BeaconLight.position.set(120, 200, 0); // Position at the top of the lighthouse
BeaconLight.target.position.set(200, 0, -200); // Point the light at a target
BeaconLight.castShadow = true; // Enable shadows
BeaconLight.shadow.mapSize.width = 1024; // Shadow resolution
BeaconLight.shadow.mapSize.height = 1024;

const PostLight = new THREE.SpotLight(0xf2ea7b, 500, 100);
PostLight.position.set(-100, 90, 0);
PostLight.target.position.set(-100, 0, 0);
PostLight.castShadow = true; // Enable shadows
PostLight.shadow.mapSize.width = 1024; // Shadow resolution
PostLight.shadow.mapSize.height = 1024;


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

const gui = new GUI();
gui.addColor(new ColorGUIHelper(DirectionalLight, 'color'), 'value').name('DirectionalLightColor');
gui.addColor(new ColorGUIHelper(AmbientLight, 'color'), 'value').name('AmbientLightColor');
gui.addColor(new ColorGUIHelper(BeaconLight, 'color'), 'value').name('BeaconLightColor');
gui.addColor(new ColorGUIHelper(PostLight, 'color'), 'value').name('PostLightColor');
gui.add(DirectionalLight, 'intensity', 0, 5, 0.001);
gui.add(AmbientLight, 'intensity', 1, 5, 0.001);
gui.add(BeaconLight, 'intensity', 5, 10000, 0.001);
gui.add(PostLight, 'intensity', 5, 5000, 0.001);

const helper = new THREE.DirectionalLightHelper(DirectionalLight, 'color');
let SceneFog = new THREE.Fog(0xAAAAAA, 300, 2500);
scene.fog = SceneFog;

function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -1000, 1000).onChange(onChangeFn);
    folder.add(vector3, 'y', -1000, 1000).onChange(onChangeFn);
    folder.add(vector3, 'z', -1000, 1000).onChange(onChangeFn);
    folder.open();
}
function makeFogGUI(gui, fog, name) {
    const folder = gui.addFolder(name);
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
function updateLight() {
    DirectionalLight.target.updateMatrixWorld();
    BeaconLight.target.updateMatrixWorld();
    PostLight.target.updateMatrixWorld();
    helper.update();
}
DirectionalLight.position.set(100, 600, 20);
updateLight();
const backgroundsound = new Audio('../src/public/media/oceanwaves.mp3');
makeSoundsGui(gui,backgroundsound );
makeXYZGUI(gui, DirectionalLight.target.position, 'target', updateLight);
makeFogGUI(gui, SceneFog, 'fog');


export {DirectionalLight, AmbientLight, BeaconLight, PostLight, helper, SceneFog, gui, makeDayAndNight}

