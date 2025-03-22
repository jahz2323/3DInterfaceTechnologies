import * as THREE from "three";

/**
 * Function createSkyBox
 * @Params()
 * Generate Skybox
 *
 */

const SkyBox = () => {
    const texture = new THREE.TextureLoader().load('../src/public/textures/envmaps/Sunview.webp');
    const geometry = new THREE.BoxGeometry(2000, 2000, 2000);
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide
    });
    const skybox = new THREE.Mesh(geometry, material);
    skybox.position.set(0, 600, 0);
    console.log('Material inside SkyBox:', material);
    return {skybox, material};
}
export { SkyBox };