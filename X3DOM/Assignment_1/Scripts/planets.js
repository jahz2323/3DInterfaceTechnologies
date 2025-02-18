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
export function createPlanets(){
    saturn(document);
    sun(document);
    earth(document);
    mars(document);
    jupiter(document);
    uranus(document);
    neptune(document);
}

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
let neptune_position = ["-100 500 -100"];

//planet periods
let mercury_period = 88;
let venus_period = 225;
let earth_period = 365;
let mars_period = 687;
let jupiter_period = 4333;
let saturn_period = 10759;
let uranus_period = 30687;
let neptune_period = 60190;

let planetGroup = document.createElement("group")
planetGroup.setAttribute("id", "planetGroup");

function neptune(document) {
    let scene = document.getElementById("scene");
    let planet = document.createElement("transform");
    planet.setAttribute("id", "neptune");
    planet.setAttribute("translation", `${neptune_position}`);

    let rotating = document.createElement("transform");
    rotating.setAttribute("id", "neptuneRotation");

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let ImageTexture = document.createElement("ImageTexture");
    ImageTexture.setAttribute("url", "../Assignment_1/Textures/neptune.jpg");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0 0 0.5");
    appearance.appendChild(material);
    appearance.appendChild(ImageTexture);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", `${neptune_radius}`);
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    rotating.appendChild(shape);
    planet.appendChild(rotating);

    planetGroup.appendChild(planet);
    scene.appendChild(planetGroup);
}

function uranus(document) {
    let scene = document.getElementById("scene");
    let planet = document.createElement("transform");

    planet.setAttribute("id", "uranus");
    planet.setAttribute("translation", `${uranus_position}`);

    let rotating = document.createElement("transform");
    rotating.setAttribute("id", "uranusRotation");

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");

    let ImageTexture = document.createElement("ImageTexture");
    ImageTexture.setAttribute("url", "../Assignment_1/Textures/uranus.jpeg");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0 0.5 0.5");
    appearance.appendChild(material);
    appearance.appendChild(ImageTexture);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", `${uranus_radius}`);
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    rotating.appendChild(shape);
    planet.appendChild(rotating);

    planetGroup.appendChild(planet);
    scene.appendChild(planetGroup);
}

function jupiter(document) {
    let scene = document.getElementById("scene");
    let planet = document.createElement("transform");

    planet.setAttribute("id", "jupiter");
    planet.setAttribute("translation", `${jupiter_position}`);

    let rotating = document.createElement("transform");
    rotating.setAttribute("id", "jupiterRotation");

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let ImageTexture = document.createElement("ImageTexture");
    ImageTexture.setAttribute("url", "../Assignment_1/Textures/jupiter.jpeg");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0.5 0.5 0.5");
    appearance.appendChild(material);
    appearance.appendChild(ImageTexture);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", `${jupiter_radius}`);
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    rotating.appendChild(shape);
    planet.appendChild(rotating);

    planetGroup.appendChild(planet);
    scene.appendChild(planetGroup);
}

function mars(document) {
    let scene = document.getElementById("scene");
    let planet = document.createElement("transform");

    planet.setAttribute("id" , "mars");
    planet.setAttribute("translation", `${mars_position}`);

    let rotating = document.createElement("transform");
    rotating.setAttribute("id", "marsRotation");

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let ImageTexture = document.createElement("ImageTexture");
    ImageTexture.setAttribute("url", "../Assignment_1/Textures/mars.jpeg");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0.2 0 0");
    appearance.appendChild(material);
    appearance.appendChild(ImageTexture);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", `${mars_radius}`);
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    rotating.append(shape);
    planet.appendChild(rotating);

    planetGroup.appendChild(planet);
    scene.appendChild(planetGroup);
}

function earth(document) {
    let scene = document.getElementById("scene");
    let planet = document.createElement("transform");

    planet.setAttribute("id", "earth");
    planet.setAttribute("translation", `${earth_position}`);

    let rotating = document.createElement("transform");
    rotating.setAttribute("id", "earthRotation");

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");

    let ImageTexture = document.createElement("ImageTexture");
    ImageTexture.setAttribute("url", "../Assignment_1/Textures/earth.jpeg");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0 0 1");
    appearance.appendChild(material);
    appearance.appendChild(ImageTexture);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", ` ${earth_radius}`);
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    rotating.appendChild(shape);
    planet.appendChild(rotating);

    planetGroup.appendChild(planet);
    scene.appendChild(planetGroup);
}

function sun(document) {
    let scene = document.getElementById("scene");
    if (!scene) {
        console.error("Scene element not found!");
        return;
    }

    let planet = document.createElement("transform");
    planet.setAttribute("id", "sun");
    planet.setAttribute("translation", `${sun_position}`);

    let rotating = document.createElement("transform");
    rotating.setAttribute("id", "sunRotation");

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let imageTexture = document.createElement("ImageTexture");

    imageTexture.setAttribute("url", "../Assignment_1/Textures/sun.png"); // Ensure the path is correct
    appearance.appendChild(imageTexture);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", `${sun_radius}`);
    sphere.setAttribute("solid", "false"); // Set solid="false" for proper visibility

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    rotating.appendChild(shape);
    planet.appendChild(rotating);

    // Adding a PointLight to simulate sunlight
    let SunLight = document.createElement("PointLight");
    SunLight.setAttribute("location", "0 0 0");
    SunLight.setAttribute("color", "1 1 0.5");
    SunLight.setAttribute("intensity", "5"); // Stronger light
    SunLight.setAttribute("radius", "5000"); // Bigger area of effect
    SunLight.setAttribute("on", "true");
    SunLight.setAttribute("global", "true");

    planet.appendChild(SunLight);
    planetGroup.appendChild(planet);
    scene.appendChild(planetGroup);

}

function saturn(document) {
    let scene = document.getElementById("scene");
    let planet = document.createElement("transform");
    planet.setAttribute("id", "saturn");
    planet.setAttribute("translation", `${saturn_position}`);

    //rotating
    let rotating = document.createElement("transform");
    rotating.setAttribute("id", "saturnRotation");

    // Saturn's Planet Sphere
    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");

    let ImageTexture = document.createElement("ImageTexture");
    ImageTexture.setAttribute("url", "../Assignment_1/Textures/saturn.jpeg");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0 0.1 0.2"); // Dark blue
    material.setAttribute("emissiveColor", "0 0 0"); // Light grey
    appearance.appendChild(material);
    appearance.appendChild(ImageTexture);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", `${saturn_radius}`);
    sphere.setAttribute("solid", "true");

    shape.appendChild(appearance);
    shape.appendChild(sphere);

    rotating.appendChild(shape);
    planet.appendChild(rotating);

    planetGroup.appendChild(planet);
    scene.appendChild(planetGroup);

    // Saturn's Rings
    let ring = document.createElement("transform");
    ring.setAttribute("id", "rings");
    ring.setAttribute("translation", `${saturn_position}`);
    ring.setAttribute("rotation", "0 0 1 1.57");

    //first ring
    let numPoints = 200;
    let insideRadius_1 = 500;
    let outsideRadius_1 = 800;

    //second ring
    let insideRadius_2 = 900;
    let outsideRadius_2 = 1000;

    // array to store the points
    let points_1 = [];
    let points_2 = [];
    let angleStep = 360 / numPoints; //angular spacing between points

    //calculate points for inner and outer rings using the angle
    // and the radius of the rings
    //
    for (let i = 0; i <= numPoints; i++) {
        let angle = i * angleStep; // Calculate the angle for the current point
        let rad = angle * (Math.PI / 180);

        // Calculate the X and Z coordinates for the inner and outer points
        /*
        The X and Z coordinates are calculated using the formula:
        X = R * cos(angle)
        Y = 0
        Z = R * sin(angle)

        calculate points along circumference of the rings
         */
        let outerX = Math.cos(rad) * outsideRadius_1;
        let outerZ = Math.sin(rad) * outsideRadius_1;
        let innerX = Math.cos(rad) * insideRadius_1;
        let innerZ = Math.sin(rad) * insideRadius_1;

        let outerX_2 = Math.cos(rad) * outsideRadius_2;
        let outerZ_2 = Math.sin(rad) * outsideRadius_2;
        let innerX_2 = Math.cos(rad) * insideRadius_2;
        let innerZ_2 = Math.sin(rad) * insideRadius_2;

        //add to the points array
        points_1.push(`${innerX} 0 ${innerZ}`);
        points_1.push(`${outerX} 0 ${outerZ}`);

        points_2.push(`${innerX_2} 0 ${innerZ_2}`);
        points_2.push(`${outerX_2} 0 ${outerZ_2}`);
    }

    // Create the ring shape
    let ringShape_1 = createShape(document, "0.6 0.6 .5", "0.4 0.4 .2", points_1.join(" "));
    let ringShape_2 = createShape(document, "0.6 0.6 .5", "0.4 0.4 .2", points_2.join(" "));
    ring.appendChild(ringShape_1);
    ring.appendChild(ringShape_2);
    scene.appendChild(ring);
    scene.appendChild(ring);

    // Add a PointLight to the rings
    let ringLight = document.createElement("PointLight");
    ringLight.setAttribute("rotation", "0 0 1 1.57");
    ringLight.setAttribute("location", `${saturn_position}`);
    ringLight.setAttribute("color", "0. 0.3 1"); // Soft blue glow
    ringLight.setAttribute("intensity", "5.0"); // Brightness
    ringLight.setAttribute("radius", "500"); // Spread
    ringLight.setAttribute("on", "true");

    ring.appendChild(ringLight); // Attach light to rings
    planetGroup.appendChild(ring);
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

document.addEventListener("DOMContentLoaded", function () {
    animatePlanets(document);
});

//timespeed - convert 1 day to 1s
let orbit_velocity = 1;
//animate planets by rotating transform nodes around y-axis
function animatePlanets(document) {
    let sunRotation = document.getElementById("sunRotation");
    let earthRotation = document.getElementById("earthRotation");
    let marsRotation = document.getElementById("marsRotation");
    let jupiterRotation = document.getElementById("jupiterRotation");
    let saturnRotation = document.getElementById("saturnRotation");
    let uranusRotation = document.getElementById("uranusRotation");
    let neptuneRotation = document.getElementById("neptuneRotation");

    let earthTransform = document.getElementById("earth");
    let marsTransform = document.getElementById("mars");
    let jupiterTransform = document.getElementById("jupiter");
    let saturnTransform = document.getElementById("saturn");
    let uranusTransform = document.getElementById("uranus");
    let neptuneTransform = document.getElementById("neptune");


    let angle = 0;
    function rotate(){
        angle += 0.1;
        sunRotation.setAttribute("rotation", `0 1 0 ${angle * (Math.PI / 180)}`);
        earthRotation.setAttribute("rotation", `0 1 0 ${angle * (Math.PI / 180)}`);
        marsRotation.setAttribute("rotation", `0 1 0 ${angle * (Math.PI / 180)}`);
        jupiterRotation.setAttribute("rotation", `0 1 0 ${angle * (Math.PI / 180)}`);
        saturnRotation.setAttribute("rotation", `0 1 0 ${angle * (Math.PI / 180)}`);
        uranusRotation.setAttribute("rotation", `0 1 0 ${angle * (Math.PI / 180)}`);
        neptuneRotation.setAttribute("rotation", `0 1 0 ${angle * (Math.PI / 180)}`);
        requestAnimationFrame(rotate)
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


/* TODO Orbitting planets - not part of Assignment 1 submission
// function orbit(){
    //     let earth_angle = 0;
    //     let mars_angle = 0;
    //     let jupiter_angle = 0;
    //     let saturn_angle = 0;
    //     let uranus_angle = 0;
    //     let neptune_angle = 0;
    //     function animate(){
    //
    //         earth_angle += orbit_velocity / earth_period;
    //         mars_angle += orbit_velocity / mars_period;
    //         jupiter_angle += orbit_velocity / jupiter_period;
    //         saturn_angle += orbit_velocity / saturn_period;
    //         uranus_angle += orbit_velocity / uranus_period;
    //         neptune_angle += orbit_velocity / neptune_period;
    //         earthTransform.setAttribute("translation", `${Math.cos(earth_angle) * 1000} 0 ${Math.sin(earth_angle) * 1000}`);
    //         marsTransform.setAttribute("translation", `${Math.cos(mars_angle) * 1000} 0 ${Math.sin(mars_angle) * 1000}`);
    //         jupiterTransform.setAttribute("translation", `${Math.cos(jupiter_angle) * 3000} 0 ${Math.sin(jupiter_angle) * 3000}`);
    //         saturnTransform.setAttribute("translation", `${Math.cos(saturn_angle) * 2000} 0 ${Math.sin(saturn_angle) * 2000}`);
    //         uranusTransform.setAttribute("translation", `${Math.cos(uranus_angle) * 1600} 0 ${Math.sin(uranus_angle) * 1600}`);
    //         neptuneTransform.setAttribute("translation", `${Math.cos(neptune_angle) * 100} 0 ${Math.sin(neptune_angle) * 100}`);
    //         requestAnimationFrame(animate);
    //     }
    //     animate();
    // }
    //
    // orbit();
 */