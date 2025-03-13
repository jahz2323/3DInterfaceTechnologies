import * as THREE from "three";
import scene from "three/addons/offscreen/scene.js";
import $ from "jquery";
import {SunLight, light } from "./SunLight.js";
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

const gridSize = 100;
let spaceing = 0.5;

const vertices =[];
const normals = [];
for(let i = -50; i < gridSize - 50; i++){
    for(let j = -50; j < gridSize -50; j++){
        vertices.push(i*spaceing,j*spaceing,0);
        normals.push(0,1,0);
    }
}

const indices = [];
for(let i = 0; i < gridSize-1; i++){
    for(let j = 0; j < gridSize-1; j++){
    const a = i * gridSize + j;
    const b = i * gridSize + j + 1;
    const c = (i + 1) * gridSize + j;
    const d = (i + 1) * gridSize + j + 1;
    const e = i * gridSize + j;
    indices.push(a,b,d);
    indices.push(c,d,e);
    }
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
geometry.setIndex(indices);
geometry.rotateX(-Math.PI / 2);

const material = new THREE.MeshPhongMaterial({color: 0x0000AA,
    wireframe: false ,
    side: THREE.DoubleSide,
    shininess: 20,
});

let under_plane = new THREE.Mesh(geometry, material);
under_plane.position.set(0,-15,0)

const texture = new THREE.TextureLoader().load('../src/public/water.jpg')
const texture_map = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
    shininess: 20,
    wireframe: true
})



let plane = new THREE.Mesh(geometry, texture_map);


//create sum of signs
const a1 = 0.5;
const f1 = 1;
const v1 = 2;
const w1 = 2 * Math.PI * f1;
const wavelength1 = v1 /f1;
const phase1 = v1 * wavelength1;

const a2 = 0.4;
const f2 = 1;
const v2 = 2;
const w2 = 2 * Math.PI * f2;
const wavelength2 = v2 /f2;
const phase2 = v2 * wavelength2;

const a3 = 0.1;
const f3 = 1;
const v3 = 3;
const w3 = 2 * Math.PI * f3;
const wavelength3 = v3 /f3;
const phase3 = v3 * wavelength3;

const a4 = 0.5;
const f4 = 1;
const v4 = .1;
const w4 = 2 * Math.PI * f4;
const wavelength4 = v4 /f4;
const phase4 = v4 * wavelength4;



const posAttribute = geometry.getAttribute('position');
const normAttribute = geometry.getAttribute('normal')

function animate(){
    const time = performance.now() * 0.001;

    for (let i = 0; i < posAttribute.count; i++) {
        let x = posAttribute.getX(i); // Get the x-coordinate of the vertex
        let z = posAttribute.getZ(i); // Get the z-coordinate of the vertex
        let y = posAttribute.getY(i);

        // Calculate the y-displacement using a sine wave
        y = a1 * Math.sin(f1 * (x - z + v1 * time))
            + a2 * Math.sin(f2 * (x - z + v2 * time))
            + a3 * Math.sin(f3 * (x - z + v3 * time))
            + a4 * Math.sin(f4 * (x - z + v4 * time))
        ;

        // Gerstner waves TODO - After directional waves and lighting finished
        let Q1 = 1 / wavelength1 * a1;
        let Q2 = 1 / wavelength1 * a2;
        let Q3 = 1 / wavelength1 * a3;
        // y = Q1*a1 * Math.cos( (x + z) * w1 * + v1* phase1*time)
        // + Q2*a2 * Math.cos((x-z) * w2 * + v2* phase2*time)
        // + Q3*a3 * Math.cos((x+z) * w3 * + v3* phase3*time)


       let dydx = a1*f1*Math.cos(f1*(x+z+v1*time))
        +  a2*f2*Math.cos(f2*(x-z+v2*time))
        + a3*f3*Math.cos(f3*(x+z+v3*time))
        + a4*f4*Math.cos(f4*(x-z + v4*time))
        let dydz = a1 * f1 * Math.cos(f1 * (x + z + v1 * time))
            - a2 * f2 * Math.cos(f2 * (x - z + v2 * time))
            + a3 * f3 * Math.cos(f3 * (x + z + v3 * time))
            - a4 * f4 * Math.cos(f4 * (x - z + v4 * time));

        // Update the y-position of the vertex
        posAttribute.setY(i, y);

        let Tangent = new THREE.Vector3(1,dydx,0);
        let T_normalized =  Tangent.normalize()
        let Binormal = new THREE.Vector3(0,dydz,1);
        let B_normalized =  Binormal.normalize()
        // N = T x B
        let Normal= T_normalized.clone().cross(B_normalized);
        Normal.normalize();
        // N . L = cos(theta)
        normAttribute.setXYZ(i,-Normal.x,-Normal.y, -Normal.z);
    }
    posAttribute.needsUpdate = true;
    normAttribute.needsUpdate = true;
    requestAnimationFrame(animate);
}
animate();
$(document).ready(function(){
    console.log(posAttribute);
});




export { plane, under_plane};