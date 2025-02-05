
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
    animationFrame();
}

function animationFrame() {
    window.requestAnimationFrame(updateModel);
}

function updateModel(timeStamp_ms) {
    if (timeStart === -1) {
        timeStart = timeStamp_ms;
    }
    projectile_movement();
    ship_movement();
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

function display_camera_pos() {
    console.log("Current Camera Position: " + document.getElementById("viewpoint").position);
    console.log("Current Camera Orientation: " + document.getElementById("viewpoint").orientation);
    console.log("Current yaw " + upDownTransform.rotation);
    console.log("Current pitch " + leftRightTransform.rotation);
}


//ship movement
let pitch = 0;
let yaw = 0;
// let angleincrement = Math.PI / 180.0;

let lastx = 500;
let lasty = 200;
let intial = true;

function updateCamera(yaw, pitch) {
    if(intial){
        lastx = pitch;
        lasty = yaw;
        initial = false;
    }
    let x_offset = pitch - lastx;
    let y_offset = yaw - lasty;
    pitch += x_offset;
    yaw  += y_offset;

    let direction = {};
    direction[0] = Math.cos(yaw * Math.PI / 180) * Math.cos(pitch * Math.PI / 180);
    direction[2] = Math.sin(pitch * Math.PI / 180);
    direction[3] = Math.sin(yaw * Math.PI / 180) * Math.cos(pitch * Math.PI / 180);



    leftRightTransform.setAttribute("rotation", "0 1 0 " + pitch);
    upDownTransform.setAttribute("rotation", "1 0 0 " + yaw);
    let position_overlay = [document.getElementById("yaw"),  document.getElementById("pitch") ] ;
    position_overlay[0].textContent = yaw;
    position_overlay[1].textContent = pitch;
}

function keyup(event) {
    let angleincrement = Math.PI / 180.0;
    switch (event.key) {
        case 'ArrowUp':
            yaw += angleincrement;
            updateCamera(yaw, pitch);
            break;
        case 'ArrowDown':
            yaw -= angleincrement;
            updateCamera(yaw, pitch);
            break;
        case 'ArrowLeft':
            pitch += angleincrement;
            updateCamera(yaw, pitch);
            break;
        case 'ArrowRight':
            pitch -= angleincrement;
            updateCamera(yaw, pitch);
            break;
        case `f`:
            fireProjectile();
            break;
        case `d`:
            display_camera_pos();
            break;
    }
    console.log("User pressed: " + event.key);
}

function fireProjectile() {
    let projectile = document.getElementById("projectile");

    let left_rightTransform = document.createElement("transform");
    left_rightTransform.setAttribute("rotation", "0 1 0 " + pitch);
    projectile.append(left_rightTransform);

    let up_downTransform = document.createElement("transform");
    up_downTransform.setAttribute("rotation", "1 0 0 " + yaw);
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

