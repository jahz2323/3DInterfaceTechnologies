import * as THREE from "three";
import {WebGLRenderList as vertices} from "three/src/renderers/webgl/WebGLRenderLists.js";

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
    const pier_texture = new THREE.TextureLoader().load('../src/public/textures/woodplankstex.jpg');

    // Planks for Pier
    const platform_positions = [
        {x: 20, y: 11, z: 15},
        {x: 10, y: 11, z: 15},
        {x: 0, y: 11, z: 15},
        {x: -10, y: 11, z: 15},
        {x: -20, y: 11, z: 15},
        {x: -30, y: 11, z: 15},
        {x: -40, y: 11, z: 15},
        {x: -50, y: 11, z: 15},
        {x: -60, y: 11, z: 15},
        {x: -70, y: 11, z: 15},
        {x: -80, y: 11, z: 15},
        {x: -90, y: 11, z: 15},
        {x: -100, y: 11, z: 15},
    ];

    platform_positions.forEach((p, index) => {
        const platform = new THREE.BoxGeometry(35, 1, 5);
        const material = new THREE.MeshPhongMaterial({
            color: 0x8d602e,
            shininess: 1,
            map: pier_texture,
        });
        const mesh = new THREE.Mesh(platform, material);
        mesh.position.set(p.x, p.y, p.z);
        mesh.rotateY(Math.PI / 2);
        SceneObjects.add(mesh);
    })
    // Pier Posts under the platform
    const positions = [
        {x: 20, y: 0, z: 0},
        {x: -20, y: 0, z: 0},
        {x: -60, y: 0, z: 0},
        {x: -100, y: 0, z: 0},
        {x: -20, y: 0, z: 30},
        {x: -60, y: 0, z: 30},
        {x: -100, y: 0, z: 30},
        {x: 20, y: 0, z: 30},
    ];
    positions.forEach((p, index) => {
        const geometry = new THREE.CylinderGeometry(cylinderradius, cylinderradius, cylinderheight, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x2e2207,
            map: pier_texture,
        });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set(p.x, p.y - 5, p.z);
        SceneObjects.add(cylinder);
    });
    function createCone(originx = 0, originy = 0, r, h, faces, texture) {
        let vertices = [];
        let indices = [];
        let normals = [];
        let uvs = [];

        let theta = 0;
        let angle_increase = 2 * Math.PI / faces;
        let x0 = r;
        let y0 = 0;
        let z = h;

        vertices.push(originx, originy, z);

        for (let i = 0; i <= faces; i++) {
            theta = i * angle_increase;
            let x = r * Math.cos(theta);
            let y = r * Math.sin(theta);

            vertices.push(x, y, 0);


            const slope = r / h;
            let nx = Math.cos(theta);
            let ny = Math.sin(theta);
            let nz = slope;
            normals.push(nx, ny, nz);

            uvs.push(nx, ny);

            if (i <= faces) {
                indices.push(0, i + 1, i + 2);
            }
        }
        indices.push(0, faces, 1);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);

        const material = new THREE.MeshPhongMaterial({
            map: texture,
            wireframe: false,
            shininess: 200,
            side: THREE.DoubleSide,
        });
        const cone = new THREE.Mesh(geometry, material);
        return cone;
    }
    function createCylinderGeometry(r, h, faces, texture) {
        let vertices = [];
        let indices = [];
        let normals = [];
        let uvs = [];
        let theta = 0;
        let angle_increase = (2 * Math.PI) / faces;

        // Bottom center vertex
        vertices.push(0, 0, -h / 2);
        normals.push(0, 0, -1);
        uvs.push(0.5, 0.5);

        // Top center vertex
        vertices.push(0, 0, h / 2);
        normals.push(0, 0, 1);
        uvs.push(0.5, 0.5);

        // Generate side vertices, normals, and UVs
        for (let i = 0; i <= faces; i++) {
            theta = i * angle_increase;
            let x = r * Math.cos(theta);
            let y = r * Math.sin(theta);

            vertices.push(x, y, -h / 2);
            vertices.push(x, y, h / 2);

            // Side normals (pointing outward)
            let nx = Math.cos(theta);
            let ny = Math.sin(theta);
            normals.push(nx, ny, 0);
            normals.push(nx, ny, 0);

            //UVs
            uvs.push(i / faces, 0);
            uvs.push(i / faces, 1);
        }

        // Generate indices for the sides
        for (let i = 0; i < faces; i++) {
            let bottomLeft = 2 + i * 2;
            let bottomRight = 2 + (i + 1) * 2;
            let topLeft = bottomLeft + 1;
            let topRight = bottomRight + 1;

            // Side faces (two triangles per face)
            indices.push(bottomLeft, bottomRight, topLeft);
            indices.push(bottomRight, topRight, topLeft);
        }

        // Generate indices for the bottom and top caps
        for (let i = 0; i < faces; i++) {
            let bottomCenter = 0;
            let topCenter = 1;
            let currentBottom = 2 + i * 2;
            let nextBottom = 2 + ((i + 1) % faces) * 2;
            let currentTop = currentBottom + 1;
            let nextTop = nextBottom + 1;

            // Bottom face (triangle fan)
            indices.push(bottomCenter, nextBottom, currentBottom);

            // Top face (triangle fan)
            indices.push(topCenter, currentTop, nextTop);
        }

        // Create the geometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); // Optional
        geometry.setIndex(indices);

        // Create the material
        const material = new THREE.MeshPhongMaterial({
            wireframe: false,
            map: texture,
        });

        // Create the mesh
        const cylinder = new THREE.Mesh(geometry, material);
        return cylinder;
    }
    function createHollowCylinder(r1, r2, h, faces, texture) {
        let vertices = [];
        let normals = [];
        let uvs = [];
        let theta = 0;
        let angle_increase = (2 * Math.PI) / faces;

        let x0 = r1;
        let y0 = 0;
        let xl_0 = r2;
        let yl_0 = 0;
        let z = h / 2;

        for (let i = 0; i <= faces; i++) {
            theta = i * angle_increase;
            let x1 = r1 * Math.cos(theta);
            let y1 = r1 * Math.sin(theta);

            let xl_1 = r2 * Math.cos(theta);
            let yl_1 = r2 * Math.sin(theta);

            // Calculate normals for the inner and outer walls
            const nx = Math.cos(theta);
            const ny = Math.sin(theta);
            const nz = 0;

            // Top base (inner and outer)
            vertices.push(x0, y0, z);
            vertices.push(x1, y1, z);
            vertices.push(xl_0, yl_0, z);

            normals.push(0, 0, 1);
            normals.push(0, 0, 1);
            normals.push(0, 0, 1);

            uvs.push(i / faces, 0);
            uvs.push((i + 1) / faces, 0);
            uvs.push(i / faces, 0);

            // Sides (inner wall)
            vertices.push(x1, y1, z);
            vertices.push(x0, y0, z);
            vertices.push(x0, y0, -z);

            normals.push(-nx, -ny, nz);
            normals.push(-nx, -ny, nz);
            normals.push(-nx, -ny, nz);

            uvs.push((i + 1) / faces, 0);
            uvs.push(i / faces, 0);
            uvs.push(i / faces, 1);

            vertices.push(x1, y1, z);
            vertices.push(x0, y0, -z);
            vertices.push(x1, y1, -z);

            normals.push(-nx, -ny, nz);
            normals.push(-nx, -ny, nz);
            normals.push(-nx, -ny, nz);

            uvs.push((i + 1) / faces, 0);
            uvs.push(i / faces, 1);
            uvs.push((i + 1) / faces, 1);

            // Sides (outer wall)
            vertices.push(xl_1, yl_1, z);
            vertices.push(xl_0, yl_0, z);
            vertices.push(xl_0, yl_0, -z);

            normals.push(nx, ny, nz);
            normals.push(nx, ny, nz);
            normals.push(nx, ny, nz);

            uvs.push((i + 1) / faces, 0);
            uvs.push(i / faces, 0);
            uvs.push(i / faces, 1);

            vertices.push(xl_1, yl_1, z);
            vertices.push(xl_0, yl_0, -z);
            vertices.push(xl_1, yl_1, -z);

            normals.push(nx, ny, nz);
            normals.push(nx, ny, nz);
            normals.push(nx, ny, nz);

            uvs.push((i + 1) / faces, 0);
            uvs.push(i / faces, 1);
            uvs.push((i + 1) / faces, 1);

            // Bottom base (inner and outer)
            vertices.push(x1, y1, -z);
            vertices.push(x0, y0, -z);
            vertices.push(xl_1, yl_1, -z);

            normals.push(0, 0, -1);
            normals.push(0, 0, -1);
            normals.push(0, 0, -1);

            uvs.push((i + 1) / faces, 1);
            uvs.push(i / faces, 1);
            uvs.push((i + 1) / faces, 1);

            // Update for next iteration
            x0 = x1;
            y0 = y1;
            xl_0 = xl_1;
            yl_0 = yl_1;
        }

        // Create the geometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

        // Create the material
        const material = new THREE.MeshPhongMaterial({
            wireframe: false,
            map: texture,
            shininess: 10,
        });

        // Create the mesh
        const cylinder = new THREE.Mesh(geometry, material);
        return cylinder;
    }
    function CreateBuoy() {

    }
    function LightHouseShape(texture) {
        // repeat for custom texture
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.clamp = THREE.ClampToEdgeWrapping;

        //scale down for custom texture
        texture.repeat.set(1, 1);

        const x_origin = 0;
        const y_origin = 0;
        const height = 120;
        const faces = 60;
        const angle_increase = (2 * Math.PI) / faces;
        let theta = 0;

        const vertices = [];
        const normals = [];
        const uvs = [];

        let r = 20; // Inner radius
        let r2 = 55; // Outer radius

        let x0 = r;
        let y0 = 0;
        let xl_0 = r2;
        let yl_0 = 0;

        for (let i = 1; i < faces + 1; i++) {
            theta += angle_increase;
            let x1 = r * Math.cos(theta);
            let y1 = r * Math.sin(theta);

            let xl_1 = r2 * Math.cos(theta);
            let yl_1 = r2 * Math.sin(theta);

            let z = height / 2;

            // Top base
            vertices.push(x_origin, y_origin, z);
            vertices.push(x0, y0, z);
            vertices.push(x1, y1, z);

            // Normals for top base (pointing upward)
            normals.push(0, 0, 1);
            normals.push(0, 0, 1);
            normals.push(0, 0, 1);
            //no texture
            uvs.push(0, 0);
            uvs.push(0, 0);
            uvs.push(0, 0);

            // Sides (inner walls)
            vertices.push(x1, y1, z);
            vertices.push(x0, y0, z);
            vertices.push(x0, y0, -z);

            //no texture
            uvs.push(0, 0);
            uvs.push(0, 0);
            uvs.push(0, 0);

            // Normals for inner walls (pointing outward)
            const nx = Math.cos(theta);
            const ny = Math.sin(theta);
            const nz = 0;
            normals.push(nx, ny, nz);
            normals.push(nx, ny, nz);
            normals.push(nx, ny, nz);

            vertices.push(x1, y1, z);
            vertices.push(x0, y0, -z);
            vertices.push(x1, y1, -z);

            //no texture
            uvs.push(0, 0);
            uvs.push(0, 0);
            uvs.push(0, 0);

            normals.push(nx, ny, nz);
            normals.push(nx, ny, nz);
            normals.push(nx, ny, nz);

            // Outter walls
            vertices.push(xl_1, yl_1, z);
            vertices.push(xl_0, yl_0, z);
            vertices.push(xl_0, yl_0, -z);

            uvs.push(i/faces, 1);
            uvs.push(i/faces, 0);
            uvs.push(i/faces, 0);

            // Normals for outer walls (pointing outward)
            const nxOuter = Math.cos(theta);
            const nyOuter = Math.sin(theta);
            normals.push(nxOuter, nyOuter, 0);
            normals.push(nxOuter, nyOuter, 0);
            normals.push(nxOuter, nyOuter, 0);

            vertices.push(xl_1, yl_1, z);
            vertices.push(xl_0, yl_0, -z);
            vertices.push(xl_1, yl_1, -z);

            uvs.push(i/faces, 1);
            uvs.push(i/faces, 0);
            uvs.push(i/faces, 1);

            // Normals for outer walls (pointing outward)
            normals.push(nxOuter, nyOuter, 0);
            normals.push(nxOuter, nyOuter, 0);
            normals.push(nxOuter, nyOuter, 0);

            // Bottom base
            vertices.push(x1, y1, -z);
            vertices.push(x0, y0, -z);
            vertices.push(x_origin, y_origin, -z);

            uvs.push(xl_1, 0);
            uvs.push(xl_0, 0);
            uvs.push(xl_0, 0);

            // Normals for bottom base (pointing downward)
            normals.push(0, 0, -1);
            normals.push(0, 0, -1);
            normals.push(0, 0, -1);

            x0 = x1;
            y0 = y1;

            xl_0 = xl_1;
            yl_0 = yl_1;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3)); // Add normals
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); // Add UVs
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            wireframe: false,
        });

        const lighthouse = new THREE.Mesh(geometry, material);
        lighthouse.rotateX(-Math.PI / 2);
        lighthouse.position.set(100, 80, 20);
        SceneObjects.add(lighthouse);
    }
    function createStairs() {
        /**
         *  Create Semi-Sphere
         *  @params(stacks,sectors,r)
         */
        let origin_x = 0;
        let origin_y = 0;
        const height = 2;
        let r = 50;

        const vertices = [];
        const indices = [];

        let z = 0;
        let faces = 20; // change for detail
        let angleincr = 2 * Math.PI / faces;
        let theta = 0;

        let x0 = 40;
        let y0 = 0;
        for (let j = 1; j < height; j++) {
            for (let i = 1; i < faces + 1; i++) {
                theta += angleincr;
                let x1 = r * Math.cos(theta);
                let y1 = r * Math.sin(theta);
                z += 5 * j;

                vertices.push(origin_x, z, origin_y);
                vertices.push(x1, z, y1);
                vertices.push(x0, z, y0);

                x0 = x1;
                y0 = y1;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.MeshBasicMaterial({color: 0x0000ff});
        const stars = new THREE.Mesh(geometry, material);
        stars.rotateY(Math.PI / 2);
        stars.rotateY(Math.PI / 2);
        stars.position.set(100, 20, 20);
        SceneObjects.add(stars);
    }
    function createBase() {
        const geometry = new THREE.CylinderGeometry(50, 100, 50, 12, 2);
        const base_texture = new THREE.TextureLoader().load('../src/public/textures/ConcreteTexture.jpg');
        const material = new THREE.MeshPhongMaterial({
            color: 0x5f6365,
            map: base_texture,
        });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set(100, 0, 20);
        SceneObjects.add(cylinder);
    }
    function createLightPost() {
        const texture = new THREE.TextureLoader().load('../src/public/textures/MetalTexture.jpg');
        const geometry = new THREE.CylinderGeometry(1, 1, 100, 12, 2);
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 100,
        });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set(-100, 30, 0);
        SceneObjects.add(cylinder);
    }

    /**
     * Shapes
     * 1. Floor
     * 2. walls
     * 3. Cone top
     * 4. Light source
     *
     */

        // Load textures
    const roof_texture = new THREE.TextureLoader().load('../src/public/textures/MetalTexture.jpg');
    const window_texture = new THREE.TextureLoader().load('../src/public/textures/LightHouseWindow.jpg');
    const LightHousewall_texture = new THREE.TextureLoader().load('../src/public/textures/LighthouseWalls.webp');
    const floor_texture = new THREE.TextureLoader().load('../src/public/textures/MetalTexture.jpg');
    let cone = createCone(0, 0, 80, 50, 24, roof_texture);
    let walls = createHollowCylinder(50, 40, 70, 24, window_texture);
    let centrePole = createCylinderGeometry(5, 90, 24);
    let floor = createCylinderGeometry(80, 5, 24, floor_texture);
    let LampPost = createLightPost();

    walls.position.set(100, 175, 20);
    walls.rotateX(Math.PI / 2);

    floor.position.set(100, 140, 20);
    floor.rotateX(Math.PI / 2);

    cone.position.set(100, 200, 20);
    cone.rotateX(-Math.PI / 2);

    centrePole.position.set(100, 180, 20);
    centrePole.rotateX(Math.PI / 2);

    SceneObjects.add(centrePole);
    SceneObjects.add(floor);
    SceneObjects.add(cone);
    SceneObjects.add(walls);


    LightHouseShape(LightHousewall_texture);
    createStairs();
    createBase();

    return SceneObjects;
}
export {CreateSceneObjects};