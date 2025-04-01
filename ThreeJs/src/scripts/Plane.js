import * as THREE from "three";
import $ from "jquery";

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

const gridSize = 110;
let spaceing = 15;

const vertices = [];
const normals = [];
// 2d Plane mesh of size gridSize x gridSize
for (let i = -50; i < gridSize - 50; i++) {
    for (let j = -50; j < gridSize - 50; j++) {
        vertices.push(i * spaceing, j * spaceing, 0);
        normals.push(0, 1, 0);
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
        indices.push(a, d, b);
        indices.push(c, d, e);
    }
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
geometry.setIndex(indices);
geometry.rotateX(-Math.PI / 2);

const geometry2 = new THREE.BufferGeometry();
geometry2.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry2.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
geometry2.setIndex(indices);
geometry2.rotateX(-Math.PI / 2);

const OceanFloor = new THREE.TextureLoader().load('../src/public/textures/oceanfloor.png');
const OceanFloorMap = new THREE.MeshPhongMaterial({
    map: OceanFloor,
    wireframe: false,
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
    envMap: null,
    shininess: 20,
})

let under_plane = new THREE.Mesh(geometry2, OceanFloorMap);
under_plane.position.set(0, -20, 0)
let plane = new THREE.Mesh(geometry, texture_map);
plane.position.set(0, -10, 0);

const FlatPlane = plane;
export {FlatPlane};

const amplitude_collection = {};
const frequency_collection = {};
const velocity_collection = {};
const phase_collection = {};
const wavelength_collection = {};
const w_collection = {};

//Wave 1
amplitude_collection.a1 = 1.5;
frequency_collection.f1 = 0.1;
velocity_collection.v1 = 3;
wavelength_collection.wavelength1 = velocity_collection.v1 / frequency_collection.f1;
phase_collection.phase1 = velocity_collection.v1 * 2 / wavelength_collection.wavelength1;
w_collection.w1 = 2 / wavelength_collection.wavelength1;

//Wave 2
amplitude_collection.a2 = 1.3;
frequency_collection.f2 = 0.1;
velocity_collection.v2 = 10;
wavelength_collection.wavelength2 = velocity_collection.v2 / frequency_collection.f2;
phase_collection.phase2 = velocity_collection.v2 * 2 / wavelength_collection.wavelength2;
w_collection.w2 = 2 / wavelength_collection.wavelength2;

//Wave 3
amplitude_collection.a3 = 5;
frequency_collection.f3 = 0.4;
velocity_collection.v3 = 10;
wavelength_collection.wavelength3 = velocity_collection.v3 / frequency_collection.f3;
phase_collection.phase3 = velocity_collection.v3 * 2 / wavelength_collection.wavelength3;
w_collection.w3 = 2 / wavelength_collection.wavelength3;

//Wave 4
amplitude_collection.a4 = 0.1;
frequency_collection.f4 = 1;
velocity_collection.v4 = 10;
wavelength_collection.wavelength4 = velocity_collection.v4 / frequency_collection.f4;
phase_collection.phase4 = velocity_collection.v4 * 2 / wavelength_collection.wavelength4;
w_collection.w4 = 2 / wavelength_collection.wavelength4;

//Wave 5
amplitude_collection.a5 = 0.01;
frequency_collection.f5 = 2;
velocity_collection.v5 = 10;
wavelength_collection.wavelength5 = velocity_collection.v5 / frequency_collection.f5;
phase_collection.phase5 = velocity_collection.v5 * 2 / wavelength_collection.wavelength5;
w_collection.w5 = 2 / wavelength_collection.wavelength5;


export{amplitude_collection, frequency_collection, velocity_collection, phase_collection, wavelength_collection, w_collection}
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

function animate() {
    const time = performance.now() * 0.001;

    for (let i = 0; i < posAttribute.count; i++) {
        let x = posAttribute.getX(i);
        let z = posAttribute.getZ(i);
        let y = posAttribute.getY(i);

        // Calculate the y-displacement using a sine wave
        // - Optimised gerstner waves using exponent of sin

        // y =
        //     a1 * Math.sin(w1 * (x - z) + time * phase_collection.phase1)
        //     + a2 * Math.sin(w2 * (x + z) + time * phase_collection.phase2)
        //     + a3 * Math.sin(w3 * (x + z) + time * phase_collection.phase3)
        //     + a4 * Math.sin(w5 * (-x) + time * phase5)
        //     + a5 * Math.sin(w5 * (z) + time * phase5)
        // ;
        y =
            amplitude_collection.a1 * Math.exp(Math.sin(w_collection.w1 * (x - z) + time * phase_collection.phase1)) +
            amplitude_collection.a2 * Math.exp(Math.sin(w_collection.w2 * (x + z) + time * phase_collection.phase2)) +
            amplitude_collection.a3 * Math.exp(Math.sin(w_collection.w3 * (x + z) + time * phase_collection.phase3)) +
            amplitude_collection.a4 * Math.exp(Math.sin(w_collection.w4 * (-x) + time * phase_collection.phase4)) +
            amplitude_collection.a5 * Math.exp(Math.sin(w_collection.w5 * (z) + time * phase_collection.phase5))
        ;

        // let dydx =
        //     w1 * amplitude_collection.a1 * Math.cos(w1 * (x - z) + time * phase_collection.phase1) +
        //     w2 * amplitude_collection.a2 * Math.cos(w2 * (x + z) + time * phase_collection.phase2) +
        //     w3 * amplitude_collection.a3 * Math.cos(w3 * (x + z) + time * phase_collection.phase3) +
        //     w4 * amplitude_collection.a4 * Math.sin(w4 * (-x) + time * phase_collection.phase4) +
        //     w5 * amplitude_collection.a5 * Math.sin(w5 * (z) + time * phase_collection.phase5)

        let dydx =
            w_collection.w1 * amplitude_collection.a1 * Math.exp(Math.sin(w_collection.w1 * (x - z) + time * phase_collection.phase1)) * Math.cos(w_collection.w1 * (x - z) + time * phase_collection.phase1) +
            w_collection.w2 * amplitude_collection.a2 * Math.exp(Math.sin(w_collection.w2 * (x + z) + time * phase_collection.phase2)) * Math.cos(w_collection.w2 * (x + z) + time * phase_collection.phase2) +
            w_collection.w3 * amplitude_collection.a3 * Math.exp(Math.sin(w_collection.w3 * (x + z) + time * phase_collection.phase3)) * Math.cos(w_collection.w3 * (x + z) + time * phase_collection.phase3) +
            w_collection.w4 * amplitude_collection.a4 * Math.exp(Math.sin(w_collection.w4 * (-x) + time * phase_collection.phase4)) *    Math.cos(w_collection.w4 * (-x) + time * phase_collection.phase4) +
            w_collection.w5 * amplitude_collection.a5 * Math.exp(Math.sin(w_collection.w5 * (z) + time * phase_collection.phase5)) *     Math.cos(w_collection.w5 * (z) + time * phase_collection.phase5)
        ;
        let dydz = dydx


        posAttribute.setY(i, y);

        let Tangent = new THREE.Vector3(1, dydx, 0);
        let T_normalized = Tangent.normalize()
        let Binormal = new THREE.Vector3(0, dydz, -1);
        let B_normalized = Binormal.normalize()
        // N = T x B
        let Normal = T_normalized.clone().cross(B_normalized);
        Normal.normalize();
        // N . L = cos(theta)
        normAttribute.setXYZ(i, Normal.x, Normal.y, Normal.z);
        seaBedNorm.setXYZ(i, Normal.x, Normal.y, Normal.z);
    }
    posAttribute.needsUpdate = true;
    normAttribute.needsUpdate = true;
    seaBedNorm.needsUpdate = true;
    requestAnimationFrame(animate);
}

animate();
$(document).ready(function () {
    // console.log(posAttribute);
});


export {plane, under_plane};