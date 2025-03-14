import {plane, under_plane} from "./Plane.js"
import * as THREE from "three";

/**
 *  Custom objects
 *  Buoy
 *  pier
 *
 */
const createPier = () =>{
    const pier = new THREE.Group();
    const cylinderheight = 30;
    const cylinderradius = 2;
    const spacing = 30;

    const platform_positions = [
        { x: 0, y:11, z:15 },
        { x: 10, y:11, z:15 },
        { x: 20, y:11, z:15 },
        { x: 30, y:11, z:15 },
        { x: 40, y:11, z:15 },
        { x: 50, y:11, z:15 },
        { x: 60, y:11, z:15 },
    ];
    platform_positions.forEach((p,index) => {
        const platform = new THREE.BoxGeometry(35, 1, 5);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            shininess: 1

        });
        const mesh = new THREE.Mesh(platform, material);
        mesh.position.set(p.x, p.y, p.z);
        mesh.rotateY(Math.PI / 2);
        pier.add(mesh);
    })


    const positions = [
        { x: 0, y:0, z:0 },
        { x: spacing, y:0, z:0 },
        { x: 2*spacing, y:0, z:0 },
        { x: 2*spacing, y:0, z:30 },
        { x: 30, y:0, z:30} ,
        { x: 0, y: 0, z:30}
    ];

    positions.forEach((p,index ) => {
        const geometry = new THREE.CylinderGeometry(cylinderradius, cylinderradius, cylinderheight, 32);
        const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set(p.x, p.y - 5, p.z );
        pier.add(cylinder);
    });


    return pier;
}
export {createPier};