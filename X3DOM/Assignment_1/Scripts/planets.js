


function initalize_planets(document) {
    console.log("Creating the planets");
    planets(document);
}

function planets(document){
    saturn(document);
    sun(document);
    earth(document);
    mars(document);
    console.log("Creating the planets");
}

let saturn_position = ["50 10 -400"];
let sun_position = ["0 00 -2500"];
let earth_position = ["0 0 200"];
let mars_position = ["0 0 -600"];


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
    sphere.setAttribute("radius", "5");
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
    sphere.setAttribute("radius", "5");
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
    sphere.setAttribute("radius", "100");
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
    sphere.setAttribute("radius", "25");
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
    let insideRadius = 50;
    let outsideRadius = 70;

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

export { initalize_planets };