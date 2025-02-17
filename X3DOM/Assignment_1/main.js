let scene = document.getElementById("scene");


//console.logs to html
(function (){
    let old = console.log;
    let logger = document.getElementById('log');
    console.log = function(message){
        if (typeof message == 'object') {
            logger.innerHTML = (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML = message + '<br />';
        }
    }
}) ();

function main() {
    scene = document.getElementById("scene");
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
    projectile_update();
}

function Display_pos(yaw, pitch) {
    let position_overlay = [document.getElementById("yaw"), document.getElementById("pitch")];
    position_overlay[0].textContent = pitch;
    position_overlay[1].textContent = yaw;
}




let shipPos = {
    x: 0,
    y: 0,
    z: 0
};

document.addEventListener("DOMContentLoaded", () => {
    console.log("Page fully loaded, initializing...");

    // Select elements
    const mouseTracker = document.getElementById("mouseTracker");
    const yawDisplay = document.getElementById("yaw");
    const pitchDisplay = document.getElementById("pitch");

    // Initialize positional variables
    let shipPos = { x: 0, y: 0, z: 0 };
    let yaw = 0;
    let pitch = 0;
    let speed = 0;
    let roll = 0; // Variable to store the roll of the ship
    let rollSpeed = 0.05; // Speed at which the ship rolls
    let acceleration = 0.1;
    let max_speed = 2.2;
    let deceleration = 0.01;
    let sensitivity = 0.5;

    // Track key states
    let keys = {};

    function updateCrossHair(offsetX, offsetY) {
        let crosshair = document.getElementById("crosshairSVG");

        let canvasheight = 700;
        let canvaswidth = 800;

        let newcx = (offsetX * 0.5 + 0.5) * canvaswidth;
        let newcy = (offsetY * 0.5 + 0.5) * canvasheight;

        if (crosshair) {
            crosshair.getElementsByTagName("circle")[0].setAttribute("cx", newcx);
            crosshair.getElementsByTagName("circle")[0].setAttribute("cy", newcy + 30);
        }
    }

    // Mouse Tracking for Yaw & Pitch
    mouseTracker.addEventListener("mousemove", (event) => {
        let rect = mouseTracker.getBoundingClientRect();
        let centerX = rect.width / 2;
        let centerY = rect.height / 2;

        let offsetX = (event.clientX - rect.left - centerX) / centerX;
        let offsetY = (event.clientY - rect.top - centerY) / centerY;

        updateCrossHair(offsetX, offsetY);

        // Convert offset to yaw and pitch
        let maxYaw = Math.PI /2;  // 180 degrees (left/right)
        let maxPitch = Math.PI ;  // 90 degrees (up/down)

        yaw = offsetX * maxYaw;
        pitch = offsetY * maxPitch;

        // **Clamp pitch to prevent flipping upside-down**
        pitch = Math.max(-maxPitch, Math.min(maxPitch, pitch));
        yaw = Math.max(-maxYaw, Math.min(maxYaw, yaw));

        yawDisplay.textContent = `Current Yaw: ${yaw.toFixed(2)}`;
        pitchDisplay.textContent = `Current Pitch: ${pitch.toFixed(2)}`;

        //moveship to the centre of viewpoint

        yawDisplay.textContent = `Current Yaw: ${yaw.toFixed(2)}`;
        pitchDisplay.textContent = `Current Pitch: ${pitch.toFixed(2)}`;


        // Pass the yaw, pitch, and updated camera distance to the ship movement function or the camera control function
        ship_movement(yaw, pitch, shipPos);
    });


    let prevYaw = 0;

    function ship_movement(yaw, pitch, shipPos) {
        let Ship_yawTransform = document.getElementById("yawTransform");
        let Ship_pitchTransform = document.getElementById("pitchTransform");
        let Ship_rollTransform = document.getElementById("rollTransform"); // Add a roll transform in your scene.

        if (!Ship_yawTransform || !Ship_pitchTransform || !Ship_rollTransform) {
            console.error("One or more transform elements not found!");
            return;
        }

        yaw *= sensitivity;
        pitch *= sensitivity;
        let yawChange = yaw + prevYaw;
        let roll = yawChange * 5; // Adjust factor for a natural feel

        // Clamp roll to avoid excessive tilting
        roll = Math.max(-0.8, Math.min(0.8, roll));
        // Apply transformations
        Ship_yawTransform.setAttribute("rotation", `0 1 0 ${-yaw}`);
        Ship_pitchTransform.setAttribute("rotation", `1 0 0 ${-pitch}`);
        Ship_rollTransform.setAttribute("rotation", `0 0 1 ${-roll}`);


        prevYaw = yaw;
    }


    function updateShipPosition() {
        let forwardVector = {
            x:  Math.sin(yaw) * Math.cos(pitch),
            y: -Math.sin(pitch),
            z: -Math.cos(yaw) * Math.cos(pitch),
        };


        // Normalize vectors to prevent diagonal speed boost
        let forwardMagnitude = Math.sqrt(forwardVector.x ** 2 + forwardVector.y ** 2 + forwardVector.z ** 2);

        if (forwardMagnitude > 0) {
            forwardVector.x /= forwardMagnitude;
            forwardVector.y /= forwardMagnitude;
            forwardVector.z /= forwardMagnitude;
        }

        // Handle movement and acceleration using switch
        switch (true) {
            case keys["w"]:
                speed += acceleration;
                if (speed > max_speed) speed = max_speed;
                break;
            case keys["s"]:
                speed -= acceleration;
                if (speed < -max_speed) speed = -max_speed;
                break;
            default:
                speed -= deceleration;  // Apply deceleration if no movement key is pressed
                if (speed < 0) speed = 0;
                break;
        }

        // Apply forward movement (W/S) in the z direction
        shipPos.x += forwardVector.x * speed;
        shipPos.y += forwardVector.y * speed;
        shipPos.z += forwardVector.z * speed;


        let shipTransform = document.getElementById("shipTransform");
        if (shipTransform) {
            shipTransform.setAttribute("translation", `${shipPos.x} ${shipPos.y} ${shipPos.z}`);
        } else {
            console.error("shipTransform element not found!");
        }

        // Fire projectile if 'f' is pressed
        if (keys["f"]) {
            fireProjectile(yaw, pitch);
        }
    }



    function updateCamera() {
        let viewpoint = document.getElementById("viewpoint");
        if (!viewpoint) {
            console.error("Viewpoint not found!");
            return;
        }

        // Apply sensitivity to yaw and pitch for slower camera movement
        let adjustedYaw = yaw * sensitivity;
        let adjustedPitch = pitch * sensitivity;

        // Camera offset is determined by yaw and pitch
        let cameraDistance = 100;  // Distance behind the ship

        let cameraOffset = {
            x: Math.sin(adjustedYaw),  // Move the camera based on yaw (left/right)
            y: 20,  // Keep the camera slightly above the ship
            z: Math.cos(adjustedYaw) * cameraDistance  // Move the camera behind along the z-axis
        };

        // Apply the offset to the ship's position
        let cameraPosX = shipPos.x + cameraOffset.x;
        let cameraPosY = shipPos.y + cameraOffset.y;
        let cameraPosZ = shipPos.z + cameraOffset.z;

        // Update the camera's position
        viewpoint.setAttribute("position", `${cameraPosX} ${cameraPosY} ${cameraPosZ}`);

        // Adjust the camera's orientation to always look at the ship
        viewpoint.setAttribute("orientation", `0 1 0 ${-adjustedYaw}`);

        // Now check if the ship is within the viewport (on screen)

        // Projection of the ship's position to 2D screen coordinates
        let shipPosInFrontOfCamera = {
            x: shipPos.x - cameraPosX,
            y: shipPos.y - cameraPosY,
            z: shipPos.z - cameraPosZ
        };

        // Perspective division (naive approach: screen-space position)
        let screenX = shipPosInFrontOfCamera.x / shipPosInFrontOfCamera.z;
        let screenY = shipPosInFrontOfCamera.y / shipPosInFrontOfCamera.z;

        // Scale the position based on the camera field of view (fov)
        let fov = Math.PI / 3; // Assuming 60 degree field of view (adjust if needed)
        let aspectRatio = window.innerWidth / window.innerHeight; // Aspect ratio of the viewport

        // Convert to 2D screen space with perspective
        let normalizedX = (screenX / Math.tan(fov / 2)) * aspectRatio;
        let normalizedY = screenY / Math.tan(fov / 2);

        // Check if the ship is within the screen's visible area (clamp values)
        let onScreen = Math.abs(normalizedX) < 1 && Math.abs(normalizedY) < 1;

        if (onScreen) {
            console.log("Ship is on screen!");
        } else {
            console.log("Ship is off screen!");
        }
    }



    // Keyboard Event Listeners
    document.addEventListener("keydown", (event) => {
        keys[event.key] = true;
    });

    document.addEventListener("keyup", (event) => {
        keys[event.key] = false;
    });
    function fireProjectile(yaw, pitch) {
        console.log("Firing projectile");

        let parent_node = document.getElementById("scene");
        if (!parent_node) return;

        // Limit number of projectiles to avoid lag
        if (projectiles.length >= maxProjectiles) {
            let oldProjectile = projectiles.shift();
            oldProjectile.element.parentNode.removeChild(oldProjectile.element);
        }

        // Create projectile elements
        let projectileTransform = document.createElement("transform");
        let projectile = document.createElement("shape");

        let projectile_appearance = document.createElement("appearance");
        let projectile_material = document.createElement("material");
        projectile_material.setAttribute("diffuseColor", "1 0 0"); // Bright red
        projectile_material.setAttribute("emissiveColor", "1 0.2 0.2"); // Bright red for visibility
        projectile_appearance.appendChild(projectile_material);

        let projectile_sphere = document.createElement("sphere");
        projectile_sphere.setAttribute("radius", "0.2"); // Smaller size
        projectile_sphere.setAttribute("solid", "true");

        projectile.appendChild(projectile_appearance);
        projectile.appendChild(projectile_sphere);
        projectileTransform.appendChild(projectile);
        parent_node.appendChild(projectileTransform);



        // **Set projectile's initial position to the ship's CURRENT position**
        let projectileStartPos = { ...shipPos }; // Copy ship's position at time of firing
        projectileTransform.setAttribute("translation", `${projectileStartPos.x} ${projectileStartPos.y} ${projectileStartPos.z}`);

        // **Calculate projectile movement direction (based on ship's yaw & pitch)**
        let projectileSpeed = 5; // Adjust projectile speed
        let forwardVector = {
            x: Math.sin(yaw) * Math.cos(pitch),
            y: -Math.sin(pitch),
            z: -Math.cos(yaw) * Math.cos(pitch),
        };

        // Normalize the vector to ensure uniform speed
        let magnitude = Math.sqrt(forwardVector.x ** 2 + forwardVector.y ** 2 + forwardVector.z ** 2);
        if (magnitude > 0) {
            forwardVector.x /= magnitude;
            forwardVector.y /= magnitude;
            forwardVector.z /= magnitude;
        }

        // Store projectile data
        projectiles.push({
            element: projectileTransform,
            position: { ...projectileStartPos }, // Clone starting position
            velocity: {
                x: forwardVector.x * projectileSpeed,
                y: forwardVector.y * projectileSpeed,
                z: forwardVector.z * projectileSpeed
            }
        });
    }
    // Game loop for smooth updates
    function gameLoop() {
        updateShipPosition();
        updateCamera();

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});



// Start update loop when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("Page fully loaded, initializing...");

});

let projectiles = []; // Store active projectiles
const maxProjectiles = 100; // Limit projectiles

function projectile_update() {
    if (projectiles.length === 0) {
        window.requestAnimationFrame(projectile_update);
        return;
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        let projectile = projectiles[i];

        // Update position based on velocity
        projectile.position.x += projectile.velocity.x;
        projectile.position.y += projectile.velocity.y;
        projectile.position.z += projectile.velocity.z;

        // Update projectile's transform position
        projectile.element.setAttribute("translation",
            `${projectile.position.x} ${projectile.position.y} ${projectile.position.z}`
        );

        // Remove projectile if it moves too far
        if (Math.abs(projectile.position.x) < -500 ||
            Math.abs(projectile.position.y) < -500 ||
            Math.abs(projectile.position.z) < -500) {
            projectile.element.parentNode.removeChild(projectile.element);
            projectiles.splice(i, 1);
        }
    }

    window.requestAnimationFrame(projectile_update);
}

