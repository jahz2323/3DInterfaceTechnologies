import * as THREE from "three";

/**
 *  Custom objects
 *  Buoy
 *  pier
 *  LightHouse
 *  Island
 */
const CreateSceneObjects = () => {
    const SceneObjects = new THREE.Group();
    const cylinderheight = 30;
    const cylinderradius = 2;
    const spacing = 30;

    const platform_positions = [
        {x: 0, y: 11, z: 15},
        {x: 10, y: 11, z: 15},
        {x: 20, y: 11, z: 15},
        {x: 30, y: 11, z: 15},
        {x: 40, y: 11, z: 15},
        {x: 50, y: 11, z: 15},
        {x: 60, y: 11, z: 15},
    ];
    platform_positions.forEach((p, index) => {
        const platform = new THREE.BoxGeometry(35, 1, 5);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            shininess: 1

        });
        const mesh = new THREE.Mesh(platform, material);
        mesh.position.set(p.x, p.y, p.z);
        mesh.rotateY(Math.PI / 2);
        SceneObjects.add(mesh);
    })


    const positions = [
        {x: 0, y: 0, z: 0},
        {x: spacing, y: 0, z: 0},
        {x: 2 * spacing, y: 0, z: 0},
        {x: 2 * spacing, y: 0, z: 30},
        {x: 30, y: 0, z: 30},
        {x: 0, y: 0, z: 30}
    ];

    positions.forEach((p, index) => {
        const geometry = new THREE.CylinderGeometry(cylinderradius, cylinderradius, cylinderheight, 32);
        const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set(p.x, p.y - 5, p.z);
        SceneObjects.add(cylinder);
    });
    // Create buoy - custom geo torus?
    // Create Lighthouse - Cyclinder, cone and light source
    // Create Island - Customgeo

    function CreateBuoy() {

    }


    function CreateLighthouse() {
        const x_origin = 0;
        const y_origin = 0;
        const height = 120;
        const faces = 6;
        const angle_increase = 2 * Math.PI / faces;
        let theta = 0;
        let indices = [];
        let vertices = [];
        let normals = [];

        let r = 20;

        let x0 = r;
        let y0 = 0;

        for (let i = 1; i < faces + 1; i++) {
            theta += angle_increase;
            let x1 = r * Math.cos(theta *= i);
            let y1 = r * Math.sin(theta *= i);
            let z = height / 2;
            //top base
            vertices.push(x_origin, y_origin, z);
            vertices.push(x0, y0, z);
            vertices.push(x1, y1, z);
            //sides
            vertices.push(x1, y1, z);
            vertices.push(x0, y0, z);
            vertices.push(x0, y0, -z);

            vertices.push(x1, y1, z);
            vertices.push(x0, y0, -z);
            vertices.push(x1, y1, -z);

            //bottom base
            vertices.push(x1, y1, -z);
            vertices.push(x0, y0, -z);
            vertices.push(x_origin, y_origin, -z);

            x0 = x1;
            y0 = y1;

        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const lighthouse = new THREE.Mesh(geometry, material);
        lighthouse.rotateX(-Math.PI / 2);
        lighthouse.position.set(100, 80, 20);
        SceneObjects.add(lighthouse);
        let islandbase = createLightHouseBase();
        islandbase.position.set(100, 0, 20);
        SceneObjects.add(islandbase)

        function createLightHouseBase() {
            /**
             *  Create Semi-Sphere
             *  @params(stacks,sectors,r)
             */
            let sectors = 50;
            let stacks = 50;
            let r = 30;
            let vertices = [];

            let x, y, z, xy;
            let sectorStep = 2 * Math.PI / sectors;
            let stackStep = Math.PI / stacks;

            let stackAngle;
            let sectorAngle;

            for (let i = 0; i <= stacks; i++) {
                stackAngle = Math.PI / 2 - i * stackStep;
                xy = r * Math.cos(stackAngle);
                z = r * Math.sin(stackAngle);

                for(let j =0; j<= sectors; j++){
                    sectorAngle = j * sectorStep;

                    //vertex positions
                    x = xy * Math.cos(sectorAngle);
                    y = xy * Math.sin(sectorAngle);
                    vertices.push(x, y, z);
                }
            }
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
            const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
            return new THREE.Mesh(geometry, material);
        }
    }


    function CreateIsland() {

    }

    CreateLighthouse();
    return SceneObjects;
}


export {CreateSceneObjects};