import * as THREE from "three";

/**
 * Ocean Surface Generator
 * 
 * This module creates and animates a realistic ocean surface using:
 * - A grid-based mesh with dynamic vertex positions
 * - Sum of sines wave animation for realistic water movement
 * - Dynamic normal calculation for proper light reflection
 * - Environment mapping for realistic water appearance
 * - Specular highlights based on light and camera position
 * 
 * The ocean is represented by two meshes:
 * 1. A water surface with animated waves and reflections
 * 2. An ocean floor visible beneath the water
 */

// Grid configuration for the ocean surface
const gridSize = 200;     // Number of vertices in each dimension
let spaceing = 5;         // Distance between vertices (affects ocean size)

// UV mapping configuration for textures
const uvScaling = 0.1;    // Scale UVs to fit the grid size (controls texture tiling)

// Arrays to store mesh data
const vertices = [];      // Will store x,y,z coordinates for each vertex
const normals = [];       // Will store normal vectors for lighting calculations
let uvs = [];             // Will store texture coordinates

// Generate the grid vertices, normals, and texture coordinates
// The grid is centered around the origin and extends based on gridSize and spacing
for (let i = -50; i < gridSize - 50; i++) {
    for (let j = -50; j < gridSize - 50; j++) {
        // Add vertex position (x, y, z) - initially flat (y=0)
        vertices.push(i * spaceing, 0, j * spaceing);

        // Add initial normal (pointing straight up)
        normals.push(0, 1, 0);

        // Calculate texture coordinates (UVs) for proper texture mapping
        const plane_width = gridSize * spaceing;
        const plane_height = gridSize * spaceing;

        // Normalize coordinates to 0-1 range and apply scaling
        const normalizedU = (i * spaceing + 50) / plane_width;
        const normalizedV = (j * spaceing + 50) / plane_height;
        uvs.push(normalizedU * uvScaling, normalizedV * uvScaling);
    }
}

// Create triangle indices for the grid
// This defines how vertices connect to form triangles
const indices = [];
// Generate indexed triangles for efficient rendering
for (let i = 0; i < gridSize - 1; i++) {
    for (let j = 0; j < gridSize - 1; j++) {
        // Calculate vertex indices for current grid cell
        const a = i * gridSize + j;           // Top-left vertex
        const b = i * gridSize + j + 1;       // Top-right vertex
        const c = (i + 1) * gridSize + j;     // Bottom-left vertex
        const d = (i + 1) * gridSize + j + 1; // Bottom-right vertex

        // Create two triangles for each grid cell (a,b,c) and (b,d,c)
        indices.push(a, b, c);  // First triangle
        indices.push(b, d, c);  // Second triangle
    }
}

// Create the water surface geometry using the generated vertices, normals, UVs, and indices
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));  // Set vertex positions
geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));     // Set normal vectors
geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));             // Set texture coordinates
geometry.setIndex(indices);                                                        // Set triangle indices
// geometry.rotateX(-Math.PI / 2);  // Uncomment to rotate the plane if needed

// Create a second geometry for the ocean floor (using the same vertex data)
const geometry2 = new THREE.BufferGeometry();
geometry2.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry2.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
geometry2.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
geometry2.setIndex(indices);
// geometry2.rotateX(-Math.PI / 2);

// Environment mapping for water reflections
// Define paths to the cubemap textures (same image used for all 6 faces in this case)
const cubemap_path = [
    '../src/public/textures/envmaps/Oceanview.webp',  // positive x
    '../src/public/textures/envmaps/Oceanview.webp',  // negative x
    '../src/public/textures/envmaps/Oceanview.webp',  // positive y
    '../src/public/textures/envmaps/Oceanview.webp',  // negative y
    '../src/public/textures/envmaps/Oceanview.webp',  // positive z
    '../src/public/textures/envmaps/Oceanview.webp',  // negative z
]

// Load the cubemap for static environment reflections
const cubemap = new THREE.CubeTextureLoader();
let envMap = cubemap.load(cubemap_path);

// Create a cube render target for dynamic environment mapping
// This will capture the scene from the water's perspective for realistic reflections
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, { // 256 or 512 is common, higher is better quality but more costly
    format: THREE.RGBFormat,
    generateMipmaps: true,                     // Generate mipmaps for better performance at different distances
    minFilter: THREE.LinearMipmapLinearFilter  // High-quality filtering for smooth reflections
});

// Load texture for the ocean floor
const OceanFloor = new THREE.TextureLoader().load('../src/public/textures/oceanfloor.png');

// Create material for the ocean floor
const OceanFloorMap = new THREE.MeshPhongMaterial({
    map: OceanFloor,                // Apply the ocean floor texture
    wireframe: true,                // Show as wireframe for visibility through water
    side: THREE.DoubleSide,         // Render both sides of the geometry
    shininess: 20,                  // Low shininess for a more diffuse appearance
    flatShading: false,             // Smooth shading for better appearance
});

// Load texture for the water surface
const texture = new THREE.TextureLoader().load('../src/public/textures/water2.jpg');

// Create material for the water surface with realistic properties
let texture_map = new THREE.MeshPhongMaterial({
    map: texture,                   // Base water texture
    side: THREE.DoubleSide,         // Render both sides
    wireframe: false,               // Solid surface (not wireframe)
    specular: new THREE.Color(1, 1, 1),  // White specular highlights
    flatShading: false,             // Smooth shading for water
    envMap: envMap,                 // Apply environment map for reflections
    shininess: 90,                  // High shininess for water-like reflections
    transparent: false,             // Not transparent in this implementation
    opacity: 0.5,                   // Partial opacity (only used if transparent is true)
    reflectivity: 0.5,              // Medium reflectivity for realistic water
});

// Create a cube camera for dynamic environment mapping (reflections)
// Parameters: near clipping plane, far clipping plane, render target
const cubeCamera = new THREE.CubeCamera(1, 100000, cubeRenderTarget);

// Create the ocean floor mesh using the second geometry and ocean floor material
let under_plane = new THREE.Mesh(geometry2, OceanFloorMap);
under_plane.position.set(0, -20, 0);  // Position the ocean floor 20 units below origin

// Create the water surface mesh using the main geometry and water material
let plane = new THREE.Mesh(geometry, texture_map);
plane.position.set(0, -10, 0);  // Position the water surface 10 units below origin

// Position the cube camera at the same location as the water surface
// This ensures reflections are captured from the water's perspective
cubeCamera.position.copy(plane.position);

// Export a reference to the flat plane for use in other modules
const FlatPlane = plane;
export {FlatPlane};

// Get references to the position and normal attributes for animation
const posAttribute = geometry.getAttribute('position');      // Water surface positions
const normAttribute = geometry.getAttribute('normal');       // Water surface normals
const seaBedPos = geometry2.getAttribute('position');        // Ocean floor positions
const seaBedNorm = geometry2.getAttribute('normal');         // Ocean floor normals

/**
 * Calculate specular reflection based on the Blinn-Phong reflection model
 * 
 * @param {THREE.Camera} camera - The scene camera
 * @param {THREE.Light} light - The light source
 * @param {THREE.Vector3} Normal - The surface normal at the point
 * @returns {number} - The specular reflection intensity
 */
function specular(camera, light, Normal) {
    // Calculate the view vector (from surface point to camera)
    const View_vec = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z).clone().normalize();

    // Calculate the light vector (from surface point to light)
    const Light_vec = new THREE.Vector3(light.position.x, light.position.y, light.position.z).clone().normalize();

    // Calculate the half vector (H) between view and light vectors
    // This is the core of the Blinn-Phong model
    const H_vec = View_vec.add(Light_vec).normalize();

    // Return the dot product of the half vector and normal
    // This represents the specular reflection intensity
    return H_vec.dot(Normal);
}

// Store the initial positions of all vertices for wave animation reference
const initialPositions = new Float32Array(posAttribute.array.length);
posAttribute.array.forEach((val, index) => {
    initialPositions[index] = val;
});

/**
 * Wave parameters for the ocean surface
 * Each wave has:
 * - amplitude: Height of the wave
 * - wavelength: Distance between wave peaks
 * - direction: Vector2 indicating wave travel direction
 * - speed: How fast the wave travels
 */
export const waves = [
    // Large primary wave
    { amplitude: 1.5, wavelength: 20, direction: new THREE.Vector2(1, 1).normalize(), speed: 3 },
    // Medium counter wave
    { amplitude: 1.3, wavelength: 10, direction: new THREE.Vector2(-1, 0.5).normalize(), speed: 10 },
    // Large slow wave for overall movement
    { amplitude: 5, wavelength: 40, direction: new THREE.Vector2(0, 1).normalize(), speed: 10 },
    // Small ripple in one direction
    { amplitude: 0.1, wavelength: 5, direction: new THREE.Vector2(1, 0).normalize(), speed: 10 },
    // Tiny high-frequency ripple
    { amplitude: 0.01, wavelength: 2, direction: new THREE.Vector2(-0.5, -1).normalize(), speed: 10 }
];

// Calculate derived wave properties for each wave
waves.forEach(wave => {
    // Wave number (k) - spatial frequency (radians per unit distance)
    wave.k = (2 * Math.PI) / wave.wavelength;

    // Angular frequency (ω) - temporal frequency (radians per second)
    wave.omega = wave.k * wave.speed;
});

/**
 * Animation function for the ocean waves
 * Uses the sum of sines method to create realistic water movement:
 * 1. For each vertex, calculate displacement based on multiple overlapping waves
 * 2. Calculate surface normals for proper lighting
 * 3. Update both water surface and ocean floor normals
 */
function animate() {
    // Get current time in seconds for wave animation
    const time = performance.now() * 1e-3; // Convert milliseconds to seconds

    // Process each vertex in the water surface
    for (let i = 0; i < posAttribute.count; i++) {
        // Get the original (flat) position of this vertex
        const x0 = initialPositions[i * 3];     // x coordinate
        const y0 = initialPositions[i * 3 + 1]; // y coordinate (height)
        const z0 = initialPositions[i * 3 + 2]; // z coordinate

        // Initialize displacement and derivatives for normal calculation
        let displacedY = y0;           // Start with original height
        let total_dydx = 0;            // Derivative of height with respect to x (for normal calculation)
        let total_dydz = 0;            // Derivative of height with respect to z (for normal calculation)

        // Apply each wave's contribution to this vertex
        waves.forEach(wave => {
            // Calculate dot product of position and direction for directional waves
            const dot_product = wave.direction.x * x0 + wave.direction.y * z0;

            // Calculate the phase of the wave at this position and time
            // phase = k(x·d) - ωt where d is direction, x is position, and t is time
            const phase = dot_product * wave.k - wave.omega * time;

            // Calculate height contribution from this wave using sine function
            const waveHeight = wave.amplitude * Math.sin(phase);
            displacedY += waveHeight;

            // Calculate derivatives for normal calculation using cosine function
            // These represent the slope of the water surface at this point
            const cosPhase = Math.cos(phase);
            total_dydx = wave.amplitude * wave.k * wave.direction.x * cosPhase;
            total_dydz = wave.amplitude * wave.k * wave.direction.y * cosPhase;
        });

        // Update the vertex height with the combined wave displacement
        posAttribute.setY(i, displacedY);

        // Calculate surface normal using partial derivatives
        // Create tangent vectors along x and z directions
        let TangentX = new THREE.Vector3(1, total_dydx, 0);
        let TangentZ = new THREE.Vector3(0, total_dydz, 1);

        // Calculate normal as cross product of tangent vectors
        let Normal = TangentX.clone().cross(TangentZ).normalize();

        // Ensure normal points upward (for consistent lighting)
        if(Normal.y < 0){
            Normal.y = -Normal.y;
        }

        // Update normals for both water surface and ocean floor
        normAttribute.setXYZ(i, Normal.x, Normal.y, Normal.z);
        seaBedNorm.setXYZ(i, Normal.x, Normal.y, Normal.z);
    }

    // Mark attributes as needing update for the renderer
    posAttribute.needsUpdate = true;
    normAttribute.needsUpdate = true;
    seaBedNorm.needsUpdate = true;

    // Request next animation frame
    requestAnimationFrame(animate);
}

// Start the animation loop
animate();



export {plane, under_plane, cubeCamera};
