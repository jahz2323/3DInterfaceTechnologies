import * as THREE from "three";

/**
 *  Function createPlane
 *  @Params()
 *  Generate 2d Planemesh
 *
 *  update the vertice positions using sum of sines
 *
 *  Calculate lighting normals - lambertian diffuse
 *
 */

const gridSize = 200;
let spaceing = 5;

const uvScaling = 0.1; // Scale UVs to fit the grid size
const vertices = [];
const normals = [];
let uvs = [];
// 2d Plane mesh of size gridSize x gridSize
for (let i = -50; i < gridSize - 50; i++) {
    for (let j = -50; j < gridSize - 50; j++) {
        vertices.push(i * spaceing, 0, j * spaceing);
        normals.push(0, 1, 0);

        const plane_width = gridSize * spaceing;
        const plane_height = gridSize * spaceing;

        const normalizedU = (i * spaceing + 50) / plane_width;
        const normalizedV = (j * spaceing + 50) / plane_height;
        uvs.push(normalizedU * uvScaling, normalizedV * uvScaling);
    }
}

const indices = [];
// indexed geometry
for (let i = 0; i < gridSize - 1; i++) {
    for (let j = 0; j < gridSize - 1; j++) {
        const a = i * gridSize + j;
        const b = i * gridSize + j + 1;
        const c = (i + 1) * gridSize + j;
        const d = (i + 1) * gridSize + j + 1;
        const e = i * gridSize + j;
        indices.push(a, b, c);
        indices.push(b, d, c);
    }
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
geometry.setIndex(indices);
// geometry.rotateX(-Math.PI / 2);

const geometry2 = new THREE.BufferGeometry();
geometry2.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry2.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
geometry2.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
geometry2.setIndex(indices);
// geometry2.rotateX(-Math.PI / 2);

const cubemap_path = [
    '../src/public/textures/envmaps/Oceanview.webp',
    '../src/public/textures/envmaps/Oceanview.webp',
    '../src/public/textures/envmaps/Oceanview.webp',
    '../src/public/textures/envmaps/Oceanview.webp',
    '../src/public/textures/envmaps/Oceanview.webp',
    '../src/public/textures/envmaps/Oceanview.webp',
    '../src/public/textures/envmaps/Oceanview.webp',
]

const cubemap = new THREE.CubeTextureLoader();
let envMap = cubemap.load(cubemap_path);

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256, { // 256 or 512 is common, higher is better quality but more costly
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
} );


const OceanFloor = new THREE.TextureLoader().load('../src/public/textures/oceanfloor.png');
const OceanFloorMap = new THREE.MeshPhongMaterial({
    map: OceanFloor,
    wireframe: true,
    side: THREE.DoubleSide,
    shininess: 20,
    flatShading: false,
})
const texture = new THREE.TextureLoader().load('../src/public/textures/water2.jpg')
let texture_map = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
    wireframe: false,
    specular: new THREE.Color(1, 1, 1),
    flatShading: false,
    envMap: envMap,
    shininess: 90,
    transparent: false,
    opacity: 0.5,
    reflectivity : 0.5,
})

const cubeCamera = new THREE.CubeCamera( 1, 100000, cubeRenderTarget ); // near, far, renderTarget

let under_plane = new THREE.Mesh(geometry2, OceanFloorMap);
under_plane.position.set(0, -20, 0)
let plane = new THREE.Mesh(geometry, texture_map);
plane.position.set(0, -10, 0);
cubeCamera.position.copy(plane.position);

const FlatPlane = plane;
export {FlatPlane};

const posAttribute = geometry.getAttribute('position');
const normAttribute = geometry.getAttribute('normal');
const seaBedPos = geometry2.getAttribute('position');
const seaBedNorm = geometry2.getAttribute('normal');

function specular(camera, light, Normal) {
    // H_vec = View_vec + Lightsrc_vec
    // Specular = H_vec.clone().dot(Normal)
    const View_vec = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z).clone().normalize();
    const Light_vec = new THREE.Vector3(light.position.x, light.position.y, light.position.z).clone().normalize();
    const H_vec = View_vec.add(Light_vec).normalize();
    // const Light_vec = light.position.clone().normalize();
    // const H_vec = View_vec.clone().add(Light_vec).normalize();
    // const specular =  H_vec.clone().dot(Normal).normalize();
    // console.log(specular);
    return H_vec.dot(Normal);
}
// Copy initial position of the plane
const initialPositions = new Float32Array(posAttribute.array.length);
posAttribute.array.forEach((val, index) => {
    initialPositions[index] = val;
});

export const waves = [
    { amplitude: 1.5, wavelength: 20, direction: new THREE.Vector2(1, 1).normalize(), speed: 3 },
    { amplitude: 1.3, wavelength: 10, direction: new THREE.Vector2(-1, 0.5).normalize(), speed: 10 },
    { amplitude: 5, wavelength: 40, direction: new THREE.Vector2(0, 1).normalize(), speed: 10 },
    { amplitude: 0.1, wavelength: 5, direction: new THREE.Vector2(1, 0).normalize(), speed: 10 },
    { amplitude: 0.01, wavelength: 2, direction: new THREE.Vector2(-0.5, -1).normalize(), speed: 10 }
];
waves.forEach(wave => {
    wave.k = (2 * Math.PI) / wave.wavelength; // Wave number (k = 2pi / lambda)
    wave.omega = wave.k * wave.speed; // Angular frequency (omega = k * v)
});

function animate() {
    const time = performance.now() * 1e-3; // Convert to seconds

    for (let i = 0; i < posAttribute.count; i++) {
        const x0 = initialPositions[i * 3];
        const y0 = initialPositions[i * 3 + 1];
        const z0 = initialPositions[i * 3 + 2];

        let displacedY = y0;
        let total_dydx = 0;
        let total_dydz = 0;
        waves.forEach(wave => {
            const dot_product = wave.direction.x * x0 + wave.direction.y * z0;
            const phase = dot_product * wave.k - wave.omega * time ;

            const waveHeight = wave.amplitude * Math.sin(phase);
            displacedY += waveHeight;

            const cosPhase = Math.cos(phase);
            total_dydx = wave.amplitude * wave.k * wave.direction.x * cosPhase;
            total_dydz = wave.amplitude * wave.k * wave.direction.y * cosPhase;
        })
        posAttribute.setY(i, displacedY);

        let TangentX = new THREE.Vector3(1, total_dydx, 0);
        let TangentZ = new THREE.Vector3(0, total_dydz, 1);

        let Normal = TangentX.clone().cross(TangentZ).normalize();

        if(Normal.y < 0){
            Normal.y = -Normal.y;
        }
        normAttribute.setXYZ(i, Normal.x, Normal.y, Normal.z);
        seaBedNorm.setXYZ(i, Normal.x, Normal.y, Normal.z);
    }
    posAttribute.needsUpdate = true;
    normAttribute.needsUpdate = true;
    seaBedNorm.needsUpdate = true;

    requestAnimationFrame(animate);
}
//
animate();



export {plane, under_plane, cubeCamera};