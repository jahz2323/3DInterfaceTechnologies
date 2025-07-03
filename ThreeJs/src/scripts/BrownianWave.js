/**
 * Brownian Wave Generator
 * 
 * This module creates an alternative ocean surface using Fractional Brownian Motion (FBM) principles:
 * - Uses multiple layers (octaves) of sine waves with different frequencies
 * - Each layer has progressively higher frequency and lower amplitude
 * - Random direction factors create more chaotic, natural-looking waves
 * - Results in a more turbulent, choppy water appearance compared to regular sine waves
 * 
 * Fractional Brownian Motion is a technique often used in procedural generation
 * to create natural-looking terrain, clouds, and in this case, turbulent water.
 */

import {FlatPlane} from "./Plane.js";
import * as THREE from "three";

// Clone the geometry and material from the regular wave plane
// This ensures we have the same grid structure and visual properties
let geometry = FlatPlane.geometry.clone();
let material = FlatPlane.material.clone();

// Get references to position and normal attributes for animation
const posAttribute = geometry.getAttribute('position');
const normAttribute = geometry.getAttribute('normal');

/**
 * Generate a random direction factor (1 or -1)
 * This adds randomness to wave directions for more natural appearance
 * @returns {number} Random direction factor (1 or -1)
 */
function randomDirection() {
    return Math.random() > 0.5 ? 1 : -1;
}

// Create an array of random directions for each vertex
// Each vertex will have its own random direction factor
let randomDirections = [];
for (let i = 0; i < posAttribute.count; i++) {
    randomDirections.push(randomDirection());
}

// Create the Brownian wave mesh using the cloned geometry and material
let brownianWave = new THREE.Mesh(geometry, material);
brownianWave.position.set(0, 0, 0);  // Position at origin

// Base wave parameters
const f1 = 1;                    // Base frequency
const v1 = 1;                    // Base velocity
const wavelength1 = v1 / f1;     // Base wavelength
const w1 = 2 / wavelength1;      // Base angular frequency
const phase1 = v1 * 2 / wavelength1;  // Base phase speed

/**
 * Animation function for Brownian waves
 * Implements Fractional Brownian Motion (FBM) by summing multiple layers of sine waves
 * with increasing frequencies and decreasing amplitudes
 */
function animate() {
    // Get current time in seconds for wave animation
    const time = performance.now() * 0.001;

    // Parameters for Fractional Brownian Motion
    const layers = 6;       // Number of layers (octaves) to sum
    const decay = 0.42;     // Amplitude decay factor between layers (persistence)

    // Process each vertex in the mesh
    for (let i = 0; i < posAttribute.count; i++) {
        // Get the current position of this vertex
        let x = posAttribute.getX(i);
        let z = posAttribute.getZ(i);
        let y = 0;          // Reset Y for each vertex before applying waves

        // Variables for normal calculation (surface derivatives)
        let dydx = 0;
        let dydz = 0;

        // Initialize amplitude and frequency for the first layer
        let a_i = 1;        // Initial amplitude
        let w_i = 1;        // Initial frequency

        // Get the random direction factor for this vertex
        let w1_direction = randomDirections[i];

        // Sum multiple layers (octaves) of noise
        for (let layer = 0; layer < layers; layer++) {
            // Calculate six different wave components with different parameters
            // These create complex interference patterns for more natural water

            // Large primary waves (main water movement)
            let wave1 = a_i * 3 * Math.sin(w_i * (w1_direction * (x + z)) + time * phase1);
            let wave2 = a_i * 3 * Math.sin(w_i * (w1_direction * (x + z)) + time * phase1);

            // Small high-frequency ripples (different direction)
            let wave3 = a_i * 0.05 * Math.sin(w_i * (w1_direction * (x - z)) + time * phase1 * 1000);
            let wave4 = a_i * 0.05 * Math.sin(w_i * (w1_direction * (x - z)) + time * phase1 * 1000);

            // Additional detail waves
            let wave5 = a_i * 0.05 * Math.sin(w_i * (w1_direction * (z)) + time * phase1 * 1000);
            let wave6 = a_i * 0.05 * Math.sin(w_i * (w1_direction * (x + z)) + time * phase1 * 10000);

            // Sum all wave components for this layer
            y += wave1 + wave2 + wave3 + wave4 + wave5 + wave6;

            // Calculate derivatives for normal calculation using cosine functions
            // Each derivative corresponds to a wave component above
            let normal1 = w_i * a_i * 3 * Math.cos(w_i * (w1_direction * (x + z)) + time * phase1);
            let normal2 = w_i * a_i * 3 * Math.cos(w_i * (w1_direction * (x + z)) + time * phase1);
            let normal3 = w_i * a_i * 0.05 * Math.cos(w_i * (w1_direction * (x - z)) + time * phase1 * 1000);
            let normal4 = w_i * a_i * 0.05 * Math.cos(w_i * (w1_direction * (x - z)) + time * phase1 * 1000);
            let normal5 = w_i * a_i * 0.05 * Math.cos(w_i * (w1_direction * (z)) + time * phase1 * 1000);
            let normal6 = w_i * a_i * 0.05 * Math.cos(w_i * (w1_direction * (x + z)) + time * phase1 * 10000);

            // Sum derivatives for this layer
            dydx = normal1 + normal2 + normal3 + normal4 + normal5 + normal6;
            dydz = dydx;  // Using same value for both derivatives creates symmetric waves

            // Prepare for next layer:
            // - Reduce amplitude by decay factor
            // - Increase frequency
            a_i *= decay;    // Amplitude decreases with each layer
            w_i *= 1.25;     // Frequency increases with each layer (lacunarity)
        }

        // Update the vertex height with the combined displacement
        posAttribute.setY(i, y);

        // Calculate surface normal using partial derivatives
        // Create tangent vectors along x and z directions
        let Tangent = new THREE.Vector3(1, dydx, 0);
        let T_normalized = Tangent.normalize();

        // Create binormal vector (perpendicular to tangent)
        let Binormal = new THREE.Vector3(0, dydz, -1);
        let B_normalized = Binormal.normalize();

        // Calculate normal as cross product of tangent and binormal
        let Normal = T_normalized.clone().cross(B_normalized);
        Normal.normalize();

        // Update normal attribute for this vertex
        normAttribute.setXYZ(i, Normal.x, Normal.y, Normal.z);
    }

    // Mark attributes as needing update for the renderer
    posAttribute.needsUpdate = true;
    normAttribute.needsUpdate = true;

    // Request next animation frame
    requestAnimationFrame(animate);
}

// Start the animation loop
animate();

// Export the brownian wave mesh for use in other modules
export { brownianWave };
