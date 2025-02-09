


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

let saturn_position = ["-50 200 -100"];
let sun_position = ["-200 -250 400"];
let earth_position = ["-100 0 0"];
let mars_position = ["-150 0 0"];


function mars(document) {
    let scene = document.getElementById("scene");
    let planetGroup = document.createElement("transform");
    planetGroup.setAttribute("translation", `${mars_position}`);

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "1 0 0");
    material.setAttribute("emissiveColor", "0 .1 0");
    appearance.appendChild(material);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", "10");
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
    material.setAttribute("emissiveColor", "0 .1 0");
    appearance.appendChild(material);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", "10");
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    planetGroup.appendChild(shape);
    scene.appendChild(planetGroup);
}

function sun(document) {
    let scene = document.getElementById("scene");
    let planetGroup = document.createElement("transform");
    planetGroup.setAttribute("translation", `${sun_position}`);

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "1 0 0");
    material.setAttribute("emissiveColor", "1 .1 0");
    appearance.appendChild(material);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", "100");
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    planetGroup.appendChild(shape);

    let SunLight = document.createElement("PointLight");
    SunLight.setAttribute("location", `${sun_position}`);
    SunLight.setAttribute("color", "1 1 1");
    SunLight.setAttribute("intensity", "1");
    SunLight.setAttribute("radius", "1000");
    SunLight.setAttribute("on", "true");
    SunLight.setAttribute("global", "true");

    planetGroup.appendChild(SunLight);

    scene.appendChild(planetGroup);
}

function saturn(document) {
    let scene = document.getElementById("scene");
    let planetGroup = document.createElement("transform");
    planetGroup.setAttribute("translation", `${saturn_position}`);

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "1 1 1");
    material.setAttribute("emissiveColor", "0 .1 0");
    appearance.appendChild(material);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", "50");
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    planetGroup.appendChild(shape);
    scene.appendChild(planetGroup);

    scene = document.getElementById("scene");
    let ringGroup = document.createElement("transform");
    ringGroup.setAttribute("id", "rings");
    ringGroup.setAttribute("translation", `${saturn_position}`);
    ringGroup.setAttribute("rotation", "1 0 0 1.57");

    let numPoints = 200; // Number of segments in the ring
    let insideRadius = 90;
    let outsideRadius = 120;
    let centerPoint = "0 0 0"; // Central anchor

    let points = [];
    let back_points = [];
    let angleStep = 360 / numPoints;

    for (let i = 0; i <= numPoints; i++) {
        let angle = i * angleStep;
        let rad = angle * (Math.PI / 180); // Convert to radians

        let outerX = Math.cos(rad) * outsideRadius;
        let outerY = Math.sin(rad) * outsideRadius;
        let innerX = Math.cos(rad) * insideRadius;
        let innerY = Math.sin(rad) * insideRadius;

        points.push(`${outerX} ${outerY} 0`);
        points.push(`${innerX} ${innerY} 0`);
        //backface
        back_points.push(`${innerX} ${innerY} 0`);
        back_points.push(`${outerX} ${outerY} 0`);

    }

    // Create shape using a single triangle fan
    ringGroup.appendChild(createShape(document, "0.8 0.8 0.5", "0.2 0.2 0.1", points.join(" ")));
    ringGroup.appendChild(createShape(document, "0.8 0.4 0.5", "0.2 0.2 0.1", back_points.join(" ")));
    scene.appendChild(ringGroup);

    rotateRings(document);
}

function rotateRings(document) {
    let rings = document.getElementById("rings");
    let angle = 0;

    function animate() {
        angle += 5; // Increase rotation speed
        rings.setAttribute("rotation", `0 0 1 ${-angle * (Math.PI / 180)}`); // Convert to radians
        requestAnimationFrame(animate);
    }

    animate();
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