import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { PMREMGenerator} from "three";
import {renderer} from "./Camera.js";

/**
 * Function createSkyBox
 * @Params()
 * Generate Skybox
 * - CubeMap env map
 */
// const loadHDRTexture = (path, renderer) => {
//     return new Promise((resolve, reject) => {
//         new RGBELoader()
//             .setDataType(THREE.UnsignedByteType)
//             .load(path, (texture) => {
//                 const pmremGenerator = new PMREMGenerator(renderer); // Pass the renderer here
//                 const envMap = pmremGenerator.fromEquirectangular(texture).texture;
//                 pmremGenerator.dispose();
//                 resolve(envMap);
//             }, undefined, reject);
//     });
// };
//
// const SkyBox = async (renderer) => {
//     const envMap = await loadHDRTexture('../src/public/textures/envmaps/moonless_golf_2k.hdr', renderer);
//     const box = new THREE.BoxGeometry(2000, 2000, 2000);
//     const material = new THREE.MeshPhongMaterial({
//         envMap: envMap,
//         side: THREE.BackSide,
//     });
//     const skybox = new THREE.Mesh(box, material);
//     skybox.position.set(0, 500, 0);
//     return { skybox, material };
// };

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