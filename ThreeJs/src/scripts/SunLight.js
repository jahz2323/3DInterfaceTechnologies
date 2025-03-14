import * as THREE from "three";
import {GUI} from "three/addons/libs/lil-gui.module.min.js"

const geometry = new THREE.SphereGeometry();
const material =  new THREE.MeshPhongMaterial({
    color: 0xAA00BB,
    shininess: 1,

})

const texture_water = new THREE.TextureLoader().load('../src/public/textures/water.jpg')
const texture_map = new THREE.MeshPhongMaterial({map: texture_water})
const spheretest = new THREE.Mesh(geometry,texture_map )
spheretest.position.set(0, 10, 0)

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


makeXYZGUI(gui, light.position, 'position', updateLight);
makeXYZGUI(gui, light.target.position, 'target', updateLight);
function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -50, 50).onChange(onChangeFn);
    folder.add(vector3, 'y', -50, 50).onChange(onChangeFn);
    folder.add(vector3, 'z', -50, 50).onChange(onChangeFn);
    folder.open();
}
const helper = new THREE.DirectionalLightHelper(light, 'color');

// Sun Geometry --
let lightSphere_geometry = new THREE.SphereGeometry(4);
const texture_sun = new THREE.TextureLoader().load('../src/public/textures/sun.png')
let lightSphere_material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: false,
    map: texture_sun,
});


let lightSphere = new THREE.Mesh(lightSphere_geometry, lightSphere_material);

function updateLight() {
    light.target.updateMatrixWorld();
    helper.update();
    lightSphere.position.set(light.position.x, light.position.y, light.position.z);
}
updateLight();


export {spheretest, light , helper, lightSphere}

