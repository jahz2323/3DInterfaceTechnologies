import {FlatPlane} from "./Plane.js";
import * as THREE from "three";
import {camera} from "./CameraShader.js";
import {DirectionalLight} from "./SunLight.js";
import $ from "jquery";
const light = DirectionalLight;
let geometry = FlatPlane.geometry.clone();
let material = FlatPlane.material.clone();

const posAttribute = geometry.getAttribute('position');
const normAttribute = geometry.getAttribute('normal');

//get random direciton>?
function randomDirection() {
    return Math.random() > 0.5 ? 1 : -1;
}
let randomDirections = [];
for (let i = 0; i < posAttribute.count; i++) {
    randomDirections.push(randomDirection());
}

let brownianWave = new THREE.Mesh(geometry, material);
brownianWave.position.set(0, 0, 0);

const f1 = .5;
const v1 = 0.05;
const wavelength1 = v1 / f1;
const w1 = 2 / wavelength1;
const phase1 = v1 * 2 / wavelength1;

function animate() {
    const time = performance.now() * 0.001;

    // Parameters for Fractional Brownian Motion
    const layers = 30; // Number of layers (octaves)
    const decay = 0.76; // Amplitude decay per layer

    for (let i = 0; i < posAttribute.count; i++) {
        let x = posAttribute.getX(i);
        let z = posAttribute.getZ(i);
        let y = 0; // Reset Y for each vertex
        let dydx = 0;
        let dydz = 0;

        // Initialize amplitude and frequency
        let a_i = 1;
        let w_i = 1;

        let w1_direction = randomDirections[i];

        // Sum multiple layers of noise
        for (let layer = 0; layer < layers; layer++) {
            let wave1 = a_i * Math.sin(w_i * (w1_direction * (x + z)) + time * phase1 );
            let wave2 = a_i *  Math.sin(w_i * (w1_direction * (x + z)) + time * phase1 );
            let wave3 = a_i * 0.1 *  Math.sin(w_i * (w1_direction * (x - z)) + time * phase1 * 10);
            let wave4 = a_i * 0.01 * Math.sin(w_i * (w1_direction * (x - z)) + time * phase1  * 1000);
            let wave5 = a_i * 0.001 * Math.sin(w_i * (w1_direction * (x - z)) + time * phase1  * 1000);
            y += wave1 + wave2 + wave3 + wave4 + wave5;

            let normal1 = w_i * a_i * Math.cos(w_i * (w1_direction * (x + z)) + time * phase1 );
            let normal2 = w_i * a_i * Math.cos(w_i * (w1_direction * (x + z)) + time * phase1 );
            let normal3 = w_i * a_i * 0.1 * Math.cos(w_i * (w1_direction * (x - z)) + time * phase1 * 10);
            let normal4 = w_i * a_i * 0.01 * Math.cos(w_i * (w1_direction * (x - z)) + time * phase1  * 1000);
            let normal5 = w_i * a_i * 0.001 * Math.cos(w_i * (w1_direction * (x - z)) + time * phase1  * 1000);

            let dydx = normal1 + normal2 + normal3 + normal4 + normal5;
            dydz = dydx;

            a_i *= decay;
            w_i *= 1.2;
        }
        posAttribute.setY(i, y);

        // Calculate normals
        let Tangent = new THREE.Vector3(1, dydx, 0);
        let T_normalized = Tangent.normalize();
        let Binormal = new THREE.Vector3(0, dydz, -1);
        let B_normalized = Binormal.normalize();
        let Normal = T_normalized.clone().cross(B_normalized);
        Normal.normalize();

        // Update normal attribute
        normAttribute.setXYZ(i, Normal.x, Normal.y, Normal.z);
    }

    // Mark attributes as needing update
    posAttribute.needsUpdate = true;
    normAttribute.needsUpdate = true;

    // Request next frame
    requestAnimationFrame(animate);
}

animate();

$(document).ready(function () {
    // console.log(posAttribute);
});

export { brownianWave };