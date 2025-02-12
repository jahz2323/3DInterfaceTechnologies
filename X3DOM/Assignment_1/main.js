let scene = document.getElementById("scene");

// let movement_inputs = document.addEventListener();


function main() {
    scene = document.getElementById("scene");
    document.addEventListener("keyup", keyup);
    console.log("initalized scene");
    animationFrame();
}

function animationFrame() {
    window.requestAnimationFrame(updateModel);
}

let timeStart = -1;
function updateModel(timeStamp_ms) {
    if (timeStart === -1) {
        timeStart = timeStamp_ms;
    }
    window.requestAnimationFrame(updateModel);
}

function Display_pos(yaw, pitch) {
    let position_overlay = [document.getElementById("yaw"), document.getElementById("pitch")];
    position_overlay[0].textContent = yaw;
    position_overlay[1].textContent = pitch;
}


//directional movement variables
let pitch = 0;
let yaw = 0;
let angleincrement = Math.PI / 20.0; // rotation

let speed = 20;
let max_speed =100;
let acceleration = 0.5;
let moving = false;

let shipPos = {
    x:0,
    y:0,
    z:0
};
let barrelPos = {
    x:0,
    y:0,
    z:0
}

// keep track of x,y,z positions
function ship_movement() {
    let Ship_rollTransform = document.getElementById("rollTransform");
    if(!moving) return;
    console.log("Moving ship");

    speed += acceleration;
    if(speed > max_speed) {
        speed = max_speed;
    }

    //convert  yaw and pitch to forward movement
    let dx =  Math.sin(yaw) * Math.cos(pitch);
    let dy =  Math.sin(yaw);
    let dz =  Math.cos(pitch) * Math.cos(pitch);

    shipPos.x += dx * acceleration;
    shipPos.y += dy * acceleration;
    shipPos.z += dz * acceleration;

    console.log(shipPos);

    Ship_rollTransform.setAttribute("translation", `${shipPos.x} ${shipPos.y} ${shipPos.z}`);
    upDownTransform.setAttribute("translation", `${barrelPos.x} ${barrelPos.y} ${barrelPos.z}`);
    console.log(Ship_rollTransform.getAttribute("translation"));
}

// JQuery listen for hold events
$(document).keypress(function (e){
    if(e.which == 32 ){
        moving=true;
        ship_movement(document);
    }
    else{
        moving = false;
    }
});

function keyup(event) {
    let Ship_rollTransform = document.getElementById("rollTransform");
    let Ship_yawTransform = document.getElementById("yawTransform");
    let Ship_pitchTransform = document.getElementById("pitchTransform");
    // transform nodes
    switch (event.key) {
        case 'ArrowUp':
            yaw += angleincrement;
            Display_pos(yaw, pitch);
            Ship_yawTransform.setAttribute("rotation", "1 0 0 " + yaw);
            break;
        case 'ArrowDown':
            yaw -= angleincrement;
            Display_pos(yaw, pitch);
            Ship_yawTransform.setAttribute("rotation", "1 0 0 " + yaw);
            break;
        case 'ArrowLeft':
            pitch += angleincrement;
            Display_pos(yaw, pitch);
            Ship_pitchTransform.setAttribute("rotation", "0 1 0 " + pitch);
            break;
        case 'ArrowRight':
            pitch -= angleincrement;
            Display_pos(yaw, pitch);
            Ship_pitchTransform.setAttribute("rotation", "0 1 0 " + pitch);
            break;
        case `f`:
            fireProjectile();
            break;
        case `d`:
            // display_camera_pos();
            break;
    }
    leftRightTransform.setAttribute("rotation", "0 1 0 " + pitch);
    upDownTransform.setAttribute("rotation", "1 0 0 " + yaw);
    console.log("User pressed: " + event.key);
}


