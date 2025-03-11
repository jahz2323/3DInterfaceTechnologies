import * as THREE from "three";
import scene from "three/addons/offscreen/scene.js";
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

const gridSize = 100;
let spaceing = 0.5;

const vertices =[];
for(let i = -50; i < gridSize - 50; i++){
    for(let j = -50; j < gridSize -50; j++){
        vertices.push(i*spaceing,j*spaceing,0);
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
geometry.setIndex(indices);
geometry.rotateX(-Math.PI / 2);

const material = new THREE.MeshBasicMaterial({color: 0x0000AA,
    wireframe: true ,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(geometry, material);


//create sum of signs
const a1 = 0.5;
const f1 = 1;
const v1 = 2;
const w1 = 2 * Math.PI * f1;
const wavelength1 = v1 /f1;
const phase1 = v1 * wavelength1;

const a2 = 1;
const f2 = 1;
const v2 = 2;
const w2 = 2 * Math.PI * f2;
const wavelength2 = v2 /f2;
const phase2 = v2 * wavelength2;

const a3 = 0.2;
const f3 = .4;
const v3 = 0.3;
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

function animate(){
    const time = performance.now() * 0.001;


    // for(let i = 0; i < posAttribute.count; i++){
    //     let x  = a1 * Math.sin( w1 * time + phase1 * i);
    //     let y = a1 * Math.sin( w1 * time + phase1 * i);
    //     let z = a1 * Math.sin( w1 * time + phase1 * i);
    //     posAttribute.setXYZ(i,x,y,i * 0.5);
    // }
    /**
     *  indices
     *  a b d
     *  b c d
     *
     *
     */
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i); // Get the x-coordinate of the vertex
        const z = posAttribute.getZ(i); // Get the z-coordinate of the vertex

        // Calculate the y-displacement using a sine wave
        const y = a1 * Math.sin(f1 * (x + z - v1 * time)) + a2 * Math.sin(f2 * (x - z + v2 * time))
        + a3 * Math.sin(f3 * (x + z + v3 * time))
        + a4 * Math.sin(f4 * (x - z - v4 * time))
        ;

        // Update the y-position of the vertex
        posAttribute.setY(i, y);
        // calculate the normals
        const dy = y * Math.cos()
    }


    posAttribute.needsUpdate = true;
    requestAnimationFrame(animate);
}
animate();
$(document).ready(function(){
    console.log(posAttribute);
})



export { plane};