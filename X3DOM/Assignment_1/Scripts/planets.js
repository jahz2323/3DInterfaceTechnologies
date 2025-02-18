function initalize_planets(document) {
    console.log("Creating the planets");
    planets(document);
}
/*
mercury 88days
venus 225days
earth 365days
mars 687days
jupiter 4333days
saturn 10759days
uranus 30687days
neptune 60190days
 */
function planets(document) {
    saturn(document);
    sun(document);
    earth(document);
    mars(document);
    jupiter(document);
    uranus(document);
    neptune(document);
    console.log("Creating the planets");
}
// Planets' positions and radii
let sun_radius = 1000;
let earth_radius = 150;
let mars_radius = 100;
let jupiter_radius = 400;
let saturn_radius = 350;
let uranus_radius = 150;
let neptune_radius = 100;

let sun_position = ["0 0 -5400"];
let earth_position = ["-100 1000 -3100"];
let mars_position = ["1000 -600 -3000"];
let jupiter_position = ["3000 700 -2000"];
let saturn_position = ["2000 -400 -1000"];
let uranus_position = ["-1600 0 0"];
let neptune_position = ["-10 1000 1000"];

//planet periods
let mercury_period = 88;
let venus_period = 225;
let earth_period = 365;
let mars_period = 687;
let jupiter_period = 4333;
let saturn_period = 10759;
let uranus_period = 30687;
let neptune_period = 60190;



function neptune(document) {
    let scene = document.getElementById("scene");
    let planetGroup = document.createElement("transform");
    planetGroup.setAttribute("translation", `${neptune_position}`);

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0 0 0.5");
    appearance.appendChild(material);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", `${neptune_radius}`);
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    planetGroup.appendChild(shape);
    scene.appendChild(planetGroup);
}

function uranus(document) {
    let scene = document.getElementById("scene");
    let planetGroup = document.createElement("transform");
    planetGroup.setAttribute("translation", `${uranus_position}`);

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0 0.5 0.5");
    appearance.appendChild(material);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", `${uranus_radius}`);
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    planetGroup.appendChild(shape);
    scene.appendChild(planetGroup);
}

function jupiter(document) {
    let scene = document.getElementById("scene");
    let planetGroup = document.createElement("transform");
    planetGroup.setAttribute("translation", `${jupiter_position}`);

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0.5 0.5 0.5");
    appearance.appendChild(material);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", `${jupiter_radius}`);
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    planetGroup.appendChild(shape);
    scene.appendChild(planetGroup);
}

function mars(document) {
    let scene = document.getElementById("scene");
    let planetGroup = document.createElement("transform");
    planetGroup.setAttribute("translation", `${mars_position}`);

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0.2 0 0");
    appearance.appendChild(material);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", `${mars_radius}`);
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    planetGroup.appendChild(shape);
    scene.appendChild(planetGroup);
}

function earth(document) {
    let scene = document.getElementById("scene");
    let planetGroup = document.createElement("transform");
    planetGroup.setAttribute("translation", `${earth_position}`);

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0 0 1");
    appearance.appendChild(material);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", ` ${earth_radius}`);
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    planetGroup.appendChild(shape);
    scene.appendChild(planetGroup);
}

function sun(document) {
    let scene = document.getElementById("scene");
    if (!scene) {
        console.error("Scene element not found!");
        return;
    }

    let planetGroup = document.createElement("transform");
    planetGroup.setAttribute("id", "sunGroup");
    planetGroup.setAttribute("translation", `${sun_position}`);

    let rotatingGroup = document.createElement("transform");
    rotatingGroup.setAttribute("id", "sunRotation");

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let imageTexture = document.createElement("ImageTexture");

    imageTexture.setAttribute("url", "../Textures/sun.png"); // Ensure the path is correct
    appearance.appendChild(imageTexture);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", `${sun_radius}`);
    sphere.setAttribute("solid", "false"); // Set solid="false" for proper visibility

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    rotatingGroup.appendChild(shape);
    planetGroup.appendChild(rotatingGroup);

    // Adding a PointLight to simulate sunlight
    let SunLight = document.createElement("PointLight");
    SunLight.setAttribute("location", "0 0 0");
    SunLight.setAttribute("color", "1 1 0.5");
    SunLight.setAttribute("intensity", "5"); // Stronger light
    SunLight.setAttribute("radius", "5000"); // Bigger area of effect
    SunLight.setAttribute("on", "true");
    SunLight.setAttribute("global", "true");

    planetGroup.appendChild(SunLight);
    scene.appendChild(planetGroup);

    animateSun(document);
}

function saturn(document) {
    let scene = document.getElementById("scene");
    let planetGroup = document.createElement("transform");
    planetGroup.setAttribute("translation", `${saturn_position}`);

    // Saturn's Planet Sphere
    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0 0.1 0.2"); // Dark blue
    material.setAttribute("emissiveColor", "0 0 0"); // Light grey
    appearance.appendChild(material);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", `${saturn_radius}`);
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);
    planetGroup.appendChild(shape);
    scene.appendChild(planetGroup);

    // Saturn's Rings
    let ringGroup = document.createElement("transform");
    ringGroup.setAttribute("id", "rings");
    ringGroup.setAttribute("translation", `${saturn_position}`);
    ringGroup.setAttribute("rotation", "0 0 1 1.57");

    let numPoints = 200;
    let insideRadius = 500;
    let outsideRadius = 900;

    let points = [];
    let angleStep = 360 / numPoints;

    for (let i = 0; i <= numPoints; i++) {
        let angle = i * angleStep;
        let rad = angle * (Math.PI / 180);
        let outerX = Math.cos(rad) * outsideRadius;
        let outerZ = Math.sin(rad) * outsideRadius;
        let innerX = Math.cos(rad) * insideRadius;
        let innerZ = Math.sin(rad) * insideRadius;
        points.push(`${innerX} 0 ${innerZ}`);
        points.push(`${outerX} 0 ${outerZ}`);
    }

    // Create the ring shape
    let ringShape = createShape(document, "0 0 0.5", "0 0 1", points.join(" "));
    ringGroup.appendChild(ringShape);
    scene.appendChild(ringGroup);

    // Add a PointLight to the rings
    let ringLight = document.createElement("PointLight");
    ringLight.setAttribute("rotation", "0 0 1 1.57");
    ringLight.setAttribute("location", `${saturn_position}`);
    ringLight.setAttribute("color", "0. 0.3 1"); // Soft blue glow
    ringLight.setAttribute("intensity", "5.0"); // Brightness
    ringLight.setAttribute("radius", "500"); // Spread
    ringLight.setAttribute("on", "true");

    ringGroup.appendChild(ringLight); // Attach light to rings

    rotateRings(document);
}

function rotateRings(document) {
    let rings = document.getElementById("rings");
    let angle = 0;

    function animate() {
        angle += 0.1; // Increase rotation speed
        rings.setAttribute("rotation", `0 1 0 ${angle * (Math.PI / 180)}`); // Convert to radians
        requestAnimationFrame(animate);
    }

    animate();
}

//animate planets
/*
rotation around sun orbit
mercury 88days
venus 225days
earth 365days
mars 687days
jupiter 4333days
saturn 10759days
uranus 30687days
neptune 60190days

 */
function planetOrbits(){
    let time = 0;
    function updatePos(){
        time += 0.1;
        for (let i = 0; i < Planet_Arr.length; i++) {
            let planet = Planet_Arr[i];
            let pos = planet[0];
            let radius = planet[1];
            let x = pos[0];
            let y = pos[1];
            let z = pos[2];
            let angle = time * (Math.PI / 180);
            let newX = x + radius * Math.cos(angle);
            let newY = y + radius * Math.sin(angle);
            let newZ = z;
            pos = [newX, newY, newZ];

        }
    }

}

function animateSun(document) {
    let sunRotation = document.getElementById("sunRotation");
    let angle = 0;

    function rotate() {
        angle += 0.01; // Adjust speed (increase for faster rotation)
        sunRotation.setAttribute("rotation", `0 1 0 ${angle * (Math.PI / 180)}`);
        requestAnimationFrame(rotate);
    }

    rotate();
}


function createShape(document, color, emissive, points) {
    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", color);
    material.setAttribute("emissiveColor", emissive);
    appearance.appendChild(material);

    let triangle = document.createElement("TriangleSet");
    let coordinate = document.createElement("Coordinate");
    triangle.setAttribute("solid", "false");
    coordinate.setAttribute("point", points);

    triangle.appendChild(coordinate);

    shape.appendChild(appearance);
    shape.appendChild(triangle);
    return shape;
}
export let Planet_Arr = [ [saturn_position, saturn_radius],
    [sun_position, sun_radius],
    [earth_position, earth_radius],
    [mars_position, mars_radius],
    [jupiter_position, jupiter_radius],
    [uranus_position, uranus_radius],
    [neptune_position, neptune_radius]
];
export {initalize_planets};