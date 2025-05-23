
import * as THREE from "three";
const color = 0xfcc5ad;
const ambColor = 0x0c695e;
const intensity = 1;
const DirectionalLight = new THREE.DirectionalLight(color, intensity);
const AmbientLight = new THREE.AmbientLight(ambColor, intensity);
const BeaconLight = new THREE.SpotLight(0xffff00, 500, 800, Math.PI / 24, 1);

BeaconLight.position.set(100, 200, 20); // Position at the top of the lighthouse
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

const helper = new THREE.DirectionalLightHelper(DirectionalLight, 'color');

//
function updateLight() {
    DirectionalLight.target.updateMatrixWorld();
    BeaconLight.target.updateMatrixWorld();
    PostLight.target.updateMatrixWorld();
    helper.update();
}

DirectionalLight.position.set(100, 600, 20);
updateLight();
export {updateLight};
export {DirectionalLight, AmbientLight, BeaconLight, PostLight, helper}

