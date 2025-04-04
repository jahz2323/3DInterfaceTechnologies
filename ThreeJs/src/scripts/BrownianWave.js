import {FlatPlane} from "./Plane.js";
import * as THREE from "three";

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

const f1 = 1;
const v1 = 1;
const wavelength1 = v1 / f1;
const w1 = 2 / wavelength1;
const phase1 = v1 * 2 / wavelength1;

function animate() {
    const time = performance.now() * 0.001;

    // Parameters for Fractional Brownian Motion
    const layers = 6; // Number of layers (octaves)
    const decay = 0.42; // Amplitude decay per layer

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
            let wave1 = a_i * 3 *  Math.sin(w_i * (w1_direction * (x + z)) + time * phase1 );
            let wave2 = a_i * 3 *  Math.sin(w_i * (w1_direction * (x + z)) + time * phase1 );
            let wave3 = a_i * 0.05 *  Math.sin(w_i * (w1_direction * (x - z)) + time * phase1 * 1000);
            let wave4 = a_i * 0.05 * Math.sin(w_i * (w1_direction * (x - z)) + time * phase1  * 1000);
            let wave5 = a_i * 0.05 * Math.sin(w_i * (w1_direction * (z)) + time * phase1  * 1000);
            let wave6 = a_i * 0.05 * Math.sin(w_i * (w1_direction * (x + z)) + time * phase1  * 10000);
            y += wave1 + wave2 + wave3 + wave4 + wave5 + wave6;

            let normal1 = w_i * a_i * 3*  Math.cos(w_i * (w1_direction * (x + z)) + time * phase1 );
            let normal2 = w_i * a_i * 3  * Math.cos(w_i * (w1_direction * (x + z)) + time * phase1 );
            let normal3 = w_i * a_i * 0.05 * Math.cos(w_i * (w1_direction * (x - z)) + time * phase1 * 1000);
            let normal4 = w_i * a_i * 0.05 * Math.cos(w_i * (w1_direction * (x - z)) + time * phase1  * 1000);
            let normal5 = w_i * a_i * 0.05 * Math.cos(w_i * (w1_direction * (z)) + time * phase1  * 1000);
            let normal6 = w_i * a_i * 0.05 * Math.cos(w_i * (w1_direction * (x + z)) + time * phase1  * 10000);

            let dydx = normal1 + normal2 + normal3 + normal4 + normal5 + normal6;
            dydz = dydx;

            a_i *= decay;
            w_i *= 1.25;
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
export { brownianWave };