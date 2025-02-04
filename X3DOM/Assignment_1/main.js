/*
<!--
• All X3D scene elements can be added / removed / updated dynamically
using JavaScript
• Useful functions:
• document.getElementById(id)
• Get an element from the X3D scene by specifying its id.
• document.createElement(elementName)
• Create a new X3D element by specifying its type.
• Element.setAttribute(name, value)
• Set an attribute of a X3D element by specifying the attribute name and the attribute value
• Element.getAttribute(name)
• Get an attribute value by specifying the attribute name
• Element.append(element)
• Append an X3D element to another element
-->
 */

//global scene and coordinate information
let scene = document.getElementById("scene");

// let movement_inputs = document.addEventListener();

//scene tick
let timeStart = -1;
let rotationRads = 2 * Math.PI;

//barrel geometry
let leftRightTransform = document.getElementById("leftRightTransform");
let upDownTransform = document.getElementById("upDownTransform");

// Projectiles - first is the ship
let projectilesGroup = document.getElementById("projectile");
let projectiles = projectilesGroup.children;


function main() {
    scene = document.getElementById("scene");
    document.addEventListener("keyup", keyup);
    console.log("initalized scene");
    // display_camera_pos();
    scene.appendChild(initalize_borders(document));
    scene.appendChild(initalize_target(document));

    animationFrame();
}

function animationFrame() {
    window.requestAnimationFrame(updateModel);
}

function updateModel(timeStamp_ms) {
    if (timeStart == -1) {
        timeStart = timeStamp_ms;
    }
    projectile_movement();
    ship_movement();
    camera_movement();
    window.requestAnimationFrame(updateModel);
}

function projectile_movement() {
    for (let p = 1; p < projectiles.length; p++) {
        let currentProjectile = projectiles[p].children[0].children[0];
        let translation = currentProjectile.getAttribute("translation");
        let translationArray = translation.split(" ");
        let translationZ = translationArray[2];

        translationZ -= 0.9; // speed of projectile can implement a speed variable
        if (translationZ > -50) {
            currentProjectile.setAttribute("translation", "0 -3 " + translationZ);
        } else {
            projectilesGroup.removeChild(projectiles[p]);
        }
    }
}

function camera_movement() {

    //TODO - camera will follow the ship FORWARDS
    // current_cord_x -= Math.sin(heading);
    // current_cord_z -= Math.cos(heading);
    //TODO - camera will follow the ship BACKWARDS
    // current_cord_x += Math.sin(heading);
    // current_cord_z += Math.cos(heading);
}

function ship_movement() {
    //ship will drift in the direction of camera
    let ship = projectiles[0].children[0].children[0];
    let translation = ship.getAttribute("translation");
    let translationArray = translation.split(" ");
    let translationZ = translationArray[2];
    // translationZ -= 0.001;
    ship.setAttribute("translation", "0 -3 " + translationZ);
}



//coordinate information x y z
let viewpoint = document.getElementById("viewpoint");
let current_cord_arr = viewpoint.getAttribute("position").split(" ");
let current_cord_x = parseFloat(current_cord_arr[0]);
let current_cord_y = parseFloat(current_cord_arr[1]);
let current_cord_z = parseFloat(current_cord_arr[2]);


function display_camera_pos() {
    console.log("Current Camera Position: " + document.getElementById("viewpoint").position);
    console.log("Current Camera Orientation: " + document.getElementById("viewpoint").orientation);
    // console.log("Current updown" + upDownTransform.rotation);
    // console.log("Current leftright" + leftRightTransform.rotation);
}


// //3D vector yaw
// let yaw = -90.0; //float
// let pitch = 0.0; //float
// //center of the screen
// let lastx = 500;
// let lasty = 200;
// //checkif first
// let firstMouse = true;
//
// function camera_callback(scene, xpos, ypos) {
//     //xpos and ypos are the current camera position relative to ship 0, -3, -10
//     /*
//     Calculate the mouse's offset since the last frame.
//     Add the offset values to the camera's yaw and pitch values.
//     Add some constraints to the minimum/maximum pitch values.
//     Calculate the direction vector.
//      */
//     if (firstMouse) {
//         lastx = xpos;
//         lasty = ypos;
//         firstMouse = false;
//     }
//     //check if first mouse
//     console.log("First Mouse: " + firstMouse);
//     let xoffset = xpos - lastx;
//     let yoffset = lasty - ypos;
//     lastx = xpos;
//     lasty = ypos;
//
//     yaw += xoffset;
//     pitch += yoffset;
//
//     //normalize the direction vector
//     let direction = [];
//     direction[0] = Math.cos(yaw * Math.PI / 180);
//     direction[2] = Math.sin(yaw * Math.PI / 180);
//     //3D vector pitch
//     direction[0] = Math.cos(pitch * Math.PI / 180) * Math.cos(yaw * Math.PI / 180);
//     direction[1] = Math.sin(pitch * Math.PI / 180);
//     direction[2] = Math.cos(pitch * Math.PI / 180) * Math.cos(yaw * Math.PI / 180);
//     //normalize the direction vector
//     normalize_vector(direction);
// }
//
// function normalize_vector(direction) {
//     let length = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1] + direction[2] * direction[2]);
//     direction[0] /= length;
//     direction[1] /= length;
//     direction[2] /= length;
//     return direction;
// }
//camera movement , fire projectile and display camera position
//camera
let headingDelta = Math.PI / 60.0;
let heading = 0;

//ship movement
let updown_theta = 0;
let leftright_theta = 0;
let angleincrement = Math.PI / 60.0;
//keep in mind - pitch, yaw and roll


const cameraOffset = [0, 0, 0];
const ship_position = [0, -3, -10];

function update_Camera() {
    //convert to radians
    let yaw = leftright_theta;
    let pitch = updown_theta;
    const Yaw_rads = yaw * Math.PI / 180;
    const Pitch_rads = pitch * Math.PI / 180;
    //calculate camera orientation relative to ship orientation
    const cameraPos = [
        ship_position[0] + cameraOffset[0] *  Math.cos(Yaw_rads) * Math.cos(Pitch_rads),
        ship_position[1] + cameraOffset[1] * Math.sin(Pitch_rads),
        ship_position[2] + cameraOffset[2] * Math.sin(Yaw_rads) * Math.cos(Pitch_rads)
    ];
    //viewpoint Issue - must combine to single quaternion


}

function keyup(event) {
    switch (event.key) {
        case 'ArrowUp':
            updown_theta += angleincrement;
            break;
        case 'ArrowDown':
            updown_theta -= angleincrement;
            break;
        case 'ArrowLeft':
            leftright_theta += angleincrement;
            break;
        case 'ArrowRight':
            leftright_theta -= angleincrement;
            break;
        case `f`:
            fireProjectile();
            break;
        case `d`:
            display_camera_pos();
            break;
    }
    update_Camera();

    //ship original cord 0 -3 -10
    leftRightTransform.setAttribute("rotation", "0 1 0 " + leftright_theta);
    upDownTransform.setAttribute("rotation", "1 0 0 " + updown_theta);

    console.log("User pressed: " + event.key);
}

function fireProjectile() {
    let projectile = document.getElementById("projectile");

    let left_rightTransform = document.createElement("transform");
    left_rightTransform.setAttribute("rotation", "0 1 0 " + leftright_theta);
    projectile.append(left_rightTransform);

    let up_downTransform = document.createElement("transform");
    up_downTransform.setAttribute("rotation", "1 0 0 " + updown_theta);
    left_rightTransform.append(up_downTransform);

    let distanceTransform = document.createElement("transform");
    distanceTransform.setAttribute("translation", "0 -3 -12");
    up_downTransform.append(distanceTransform);

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0 0.5 0");
    appearance.append(material);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", "0.9", "solid", "true");
    shape.append(sphere);
    shape.append(appearance);
    distanceTransform.append(shape);
    console.log("firing projectile");
}

function initalize_ship(document) {
    console.log("Creating the ship");
    let transform_UpDown = document.createElement("Transform");
    let transform_leftRight = document.createElement("Transform");
    let shape = document.createElement("Shape");
    let appearance = document.createElement("Appearance");
    let material = document.createElement("Material");
    material.setAttribute("diffuseColor", "0.68 0.85 .9");
    appearance.appendChild(material);
    let box = document.createElement("box");
    transform_UpDown.setAttribute("translation", "0 -3 -10");
    transform_leftRight.setAttribute("id", "transform_leftRight_ship");
    transform_UpDown.setAttribute("id", "transform_UpDown_ship");
    shape.appendChild(appearance);
    shape.appendChild(box);
    transform_UpDown.appendChild(shape);
    transform_leftRight.appendChild(transform_UpDown);
    return transform_leftRight;
}

function initalize_target(document) {
    console.log("creating target object..");
    let transform = document.createElement("Transform");
    let shape = document.createElement("Shape");
    let appearance = document.createElement("Appearance");
    let material = document.createElement("Material");
    material.setAttribute("diffuseColor", "0.9 0 .9");
    appearance.appendChild(material);
    let cone = document.createElement("cone");
    transform.setAttribute("translation", "0 0 -30");
    transform.setAttribute("id", "target");
    shape.appendChild(appearance);
    shape.appendChild(cone);
    transform.appendChild(shape);
    return transform;
}

function initalize_borders(document) {
    console.log("Creating the floor");
    let transform = document.createElement("Transform");
    let shape = document.createElement("Shape");
    let appearance = document.createElement("appearance");
    let ImageTexture = document.createElement("ImageTexture");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0.68 0.85 .9");
    ImageTexture.setAttribute("url", "../Textures/glowing-shimmering-stars-space-abstract-background_250994-1378.png");
    // appearance.appendChild(material);
    appearance.appendChild(ImageTexture);
    let Rectangle = document.createElement("Rectangle2D");
    Rectangle.setAttribute("size", "50 50", "solid", "true");
    transform.setAttribute("translation", "0 0 -40")
    shape.append(appearance);
    shape.append(Rectangle);
    transform.append(shape);
    return transform;
}


//Modify camera position to x0 y0 z30
function change_view() {
    scene = document.getElementById("scene");
    if (scene) {
        let Viewpoint = document.getElementById("viewpoint");
        Viewpoint.setAttribute("position", "0 0 30",);
        console.log("changed view " + Viewpoint.position);
        scene.appendChild(Viewpoint);
    }
}

//testing js and x3dom dynamics
function addBox() {
    scene = document.getElementById("scene");
    if (scene) {
        console.log("adding box");
        let Transform = document.createElement("Transform");
        Transform.setAttribute("translation", current_cord);
        let shape = document.createElement("shape");
        let appearance = document.createElement("appearance");
        let material = document.createElement("material");
        material.setAttribute("diffuseColor", "1 0 0");
        appearance.append(material);
        let box = document.createElement("box");
        shape.append(appearance);
        shape.append(box);
        Transform.append(shape);
        scene.appendChild(Transform);
        // scene.appendChild(shape);
        current_cord[2] = current_cord[2] + 1;
        console.log(current_cord);
    }


}