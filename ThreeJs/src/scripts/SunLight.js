import * as THREE from "three";
import {GUI} from "three/addons/libs/lil-gui.module.min.js"


const geometry = new THREE.SphereGeometry();
const material =  new THREE.MeshLambertMaterial({
    color: 0xAA00BB,
    shininess: 1,

})
const SunLight = new THREE.Mesh(geometry, material)
SunLight.position.set(0, 10, 0)

const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);


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

gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 5, 0.01);
gui.add(light.target.position, 'x', -100, 100);
gui.add(light.target.position, 'z', -100, 100);
gui.add(light.target.position, 'y', 0, 100);

makeXYZGUI(gui, light.position, 'position', updateLight);
makeXYZGUI(gui, light.target.position, 'target', updateLight);
function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
}
const helper = new THREE.DirectionalLightHelper(light, 'color');

let lightBox_geometry = new THREE.BoxGeometry();
let lightBox_material = new THREE.MeshPhongMaterial({
    color: 0xFFFFFF,
    wireframe: false,
    shininess: 1
});


let lightBox = new THREE.Mesh(lightBox_geometry, lightBox_material);

function updateLight() {
    light.target.updateMatrixWorld();
    helper.update();
    lightBox.position.set(light.position.x, light.position.y, light.position.z);
}
updateLight();


export {SunLight, light , helper, lightBox}

