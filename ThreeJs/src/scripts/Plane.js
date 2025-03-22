import * as THREE from "three";
import $ from "jquery";
import {camera} from "./CameraShader.js";
import {DirectionalLight, BeaconLight} from "./SunLight.js";


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
for (let i = -50; i < gridSize - 50; i++) {
    for (let j = -50; j < gridSize - 50; j++) {
        vertices.push(i * spaceing, j * spaceing, 0);
        normals.push(0, 1, 0);
    }
}

const indices = [];
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

let FlatPlane = plane; // for debugging purposes


//create sum of signs
/*
    Explain

 */
const a1 = 1.5;
const f1 = 0.1;
const v1 = 3;
const wavelength1 = v1 / f1;
const w1 = 2 / wavelength1;
const phase1 = v1 * 2 / wavelength1;

const a2 = 1.3;
const f2 = 0.1;
const v2 = 1000;
const wavelength2 = v2 / f2;
const w2 = 2 / wavelength2;
const phase2 = v2 * 2 / wavelength2;

const a3 = 5;
const f3 = 0.4;
const v3 = 10;
const wavelength3 = v3 / f3;
const w3 = 2 / wavelength3;
const phase3 = v3 * 2 / wavelength3;

const a4 = 0.1
const f4 = 1;
const v4 = 10;
const wavelength4 = v4 / f4;
const w4 = 2 / wavelength4;
const phase4 = v4 * 2 / wavelength4;

const a5 = 0.01;
const f5 = 2;
const v5 = 10;
const wavelength5 = v5 / v5;
const w5 = 2 / wavelength5;
const phase5 = v5 * 2 / wavelength5;


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
        //     a1 * Math.sin(w1 * (x - z) + time * phase1)
        //     + a2 * Math.sin(w2 * (x + z) + time * phase2)
        //     + a3 * Math.sin(w3 * (x + z) + time * phase3)
        //     + a4 * Math.sin(w5 * (-x) + time * phase5)
        //     + a5 * Math.sin(w5 * (z) + time * phase5)
        // ;
        y =
            a1 * Math.exp(Math.sin(w1 * (x - z) + time * phase1)) +
            a2 * Math.exp(Math.sin(w2 * (x + z) + time * phase2)) +
            a3 * Math.exp(Math.sin(w3 * (x + z) + time * phase3)) +
            a4 * Math.exp(Math.sin(w4 * (-x) + time * phase4)) +
            a5 * Math.exp(Math.sin(w5 * (z) + time * phase5))
        ;

        // let dydx =
        //     w1 * a1 * Math.cos(w1 * (x - z) + time * phase1) +
        //     w2 * a2 * Math.cos(w2 * (x + z) + time * phase2) +
        //     w3 * a3 * Math.cos(w3 * (x + z) + time * phase3) +
        //     w4 * a4 * Math.sin(w4 * (-x) + time * phase4) +
        //     w5 * a5 * Math.sin(w5 * (z) + time * phase5)

        let dydx =
            w1 * a1 * Math.exp(Math.sin(w1 * (x - z) + time * phase1)) * Math.cos(w1 * (x - z) + time * phase1) +
            w2 * a2 * Math.exp(Math.sin(w2 * (x + z) + time * phase2)) * Math.cos(w2 * (x + z) + time * phase2) +
            w3 * a3 * Math.exp(Math.sin(w3 * (x + z) + time * phase3)) * Math.cos(w3 * (x + z) + time * phase3) +
            w4 * a4 * Math.exp(Math.sin(w4 * (-x) + time * phase4)) * Math.cos(w4 * (-x) + time * phase4) +
            w5 * a5 * Math.exp(Math.sin(w5 * (z) + time * phase5)) * Math.cos(w5 * (z) + time * phase5)
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


export {plane, under_plane, FlatPlane};