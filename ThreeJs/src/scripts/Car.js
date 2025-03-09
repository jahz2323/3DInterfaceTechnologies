import * as THREE from "three";


let car = [];
function Wheels(){
    for(let i = 1; i < 5; i++){
        const innerRadius =  3.1;
        const outerRadius = 7;
        const thetaSegments = 18;
        const geometry = new THREE.RingGeometry(
            innerRadius, outerRadius, thetaSegments );
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const wheel = new THREE.Mesh(geometry, material);
        wheel.position.set(0, 0, -i * 10);
        car.push(wheel);
    }
}

console.log(car);
Wheels();


export { car};