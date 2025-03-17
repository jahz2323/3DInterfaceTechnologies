import * as THREE from "three";

/**
 * Function createSkyBox
 * @Params()
 * Generate Skybox
 *
 */

const SkyBox = () => {
    const texture = new THREE.TextureLoader().load('../src/public/textures/qwantani_noon_2k.png');
    const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const skybox = new THREE.Mesh(geometry, material);
    return skybox;
}
export { SkyBox };