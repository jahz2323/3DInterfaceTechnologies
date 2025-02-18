import {createAmmoBox, boxRadius, shipRadius, ammoBoxes} from "./Scripts/AmmoBox.js";
import {Planet_Arr, createPlanets} from "./Scripts/planets.js";
import {check_Group} from "./Scripts/click_interactions.js";

let scene = document.getElementById("scene");


//console.logs to html
(function () {
    let old = console.log;
    let logger = document.getElementById('log');
    console.log = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML = (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML = message + '<br />';
        }
    }
})();

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

// Start update loop when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    let bgm = new Audio("../Assignment_1/Audio/BG.mp3");
    bgm.volume = 0.8;
    bgm.loop = true;
    bgm.play();

    console.log("Page fully loaded, initializing...");

    // Select elements
    const mouseTracker = document.getElementById("mouseTracker");
    const yawDisplay = document.getElementById("yaw");
    const pitchDisplay = document.getElementById("pitch");
    const rollDisplay = document.getElementById("roll");
    const xDisplay = document.getElementById("x");
    const yDisplay = document.getElementById("y");
    const zDisplay = document.getElementById("z");

    // Initialize positional variables
    let shipPos = {x: 0, y: 0, z: 0}; // Initial ship position
    let prevYaw = 0; // Previous yaw for roll calculation
    let yaw = 0; // Variable to store the yaw of the ship
    let pitch = 0; // Variable to store the pitch of the ship
    let speed = 0; // Variable to store the speed of the ship
    let roll = 0; // Variable to store the roll of the ship
    let rollSpeed = 0.05; // Speed at which the ship rolls
    let acceleration = 0.1;
    let max_speed = 5; // Maximum speed of the ship
    let deceleration = 0.5; // Deceleration rate
    let sensitivity = 0.5; // higher sensitivity for faster movement

    // Track key states
    let keys = {};
    let FirstPerson = false; // First person view flag

    // Set canvas dimensions
    let canvasheight = 700;
    let canvaswidth = 800;

    //game variables
    let ammo = 50; // Initial ammo count
    let ammo_regain = 0.1; // Ammo regain rate
    let health = 100; // Initial health
    let score = 0; // Initial score

    //toggle state
    let planetsVisible = true;
    let ammoVisible = true;

    function GameState() {
        AmmoCheck();
        HealthCheck();
        ScoreCheck();
    }

    function ScoreCheck() {
        document.getElementById("score").textContent = "Score: " + score;
    }

    function HealthCheck() {
        document.getElementById("health").textContent = "Health: " + health;
        if (health <= 0) {
            console.log("Game Over");
            return false;
        }
        return true;
    }

    function AmmoCheck() {
        document.getElementById("ammo").textContent = "Ammo: " + ammo;
        if (ammo <= 0) {
            console.log("Out of Ammo");
            return false
        }
        return true;
    }

    // Fire projectile on key press
    addEventListener("keypress", (event) => {
        if (event.key === "f") {
            if (AmmoCheck()) {
                //play audio
                let audio = new Audio("../Assignment_1/Audio/blaster.wav");
                audio.volume = 0.01;
                audio.play();

                //fire projectile
                fireProjectile(yaw, pitch);
                ammo -= 1;
            } else {
                console.log("Out of Ammo");
            }

        }
        if (event.key === "v") {
            //change to first person flight;
            //change the viewpoint to the ship
            FirstPerson = !FirstPerson;
        }
    })


    function updateCrossHair(offsetX, offsetY) {
        let crosshair = document.getElementById("crosshairSVG");

        let newcx = (offsetX * 0.5 + 0.5) * canvaswidth;
        let newcy = (offsetY * 0.5 + 0.5) * canvasheight;

        if (crosshair) {
            crosshair.getElementsByTagName("circle")[0].setAttribute("cx", newcx);
            crosshair.getElementsByTagName("circle")[0].setAttribute("cy", newcy + 30);
        }
    }

    // Mouse Tracking for Yaw & Pitch & Roll
    mouseTracker.addEventListener("mousemove", (event) => {
        let rect = mouseTracker.getBoundingClientRect();
        let centerX = rect.width / 2;
        let centerY = rect.height / 2;

        let offsetX = (event.clientX - rect.left - centerX) / centerX;
        let offsetY = (event.clientY - rect.top - centerY) / centerY;

        updateCrossHair(offsetX, offsetY);

        // Convert offset to yaw and pitch
        let maxYaw = Math.PI;  // 45 degrees (left/right)
        let maxPitch = Math.PI / 2;  // 90 degrees (up/down)

        yaw = offsetX * maxYaw;
        pitch = offsetY * maxPitch;

        // **Clamp pitch to prevent flipping upside-down**
        pitch = Math.max(-maxPitch, Math.min(maxPitch, pitch));
        yaw = Math.max(-maxYaw, Math.min(maxYaw, yaw));

        // Handle roll (keyboard based or add a separate event listener)
        // For example, if "Q" or "E" is pressed, adjust roll


        // Clamp roll (optional, depends on your game mechanics)
        let maxRoll = Math.PI / 2;  // Limit roll to 90 degrees
        roll = Math.max(-maxRoll, Math.min(maxRoll, roll));

        yawDisplay.textContent = `Current Yaw: ${yaw.toFixed(2)}`;
        pitchDisplay.textContent = `Current Pitch: ${pitch.toFixed(2)}`;
        rollDisplay.textContent = `Current Roll: ${roll.toFixed(2)}`;

        // ship orientation code
        ship_orientation(yaw, pitch, roll, shipPos);
    });

    function ship_orientation(yaw, pitch, shipPos) {
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


    function updateCamera() {
        let viewpoint = document.getElementById("viewpoint");
        if (!viewpoint) {
            console.error("Viewpoint not found!");
            return;
        }

        // Apply sensitivity to yaw and pitch for slower camera movement
        let adjustedYaw = yaw * sensitivity;
        let adjustedPitch = pitch * sensitivity;
        let adjustedRoll = roll * sensitivity;

        // Camera offset is determined by yaw and pitch
        let cameraDistance = 100;  // Distance behind the ship
        let firstPersonDistance = 50;  // Distance in front of the ship in -z coord

        if (FirstPerson) {
            // First-person view: Camera directly on the ship's position
            console.log("First Person View");
            // Set the viewpoint to infront of the ship

            let forwardVector = {
                x: Math.sin(adjustedYaw) * Math.cos(adjustedPitch),
                y: -Math.sin(adjustedPitch),
                z: -Math.cos(adjustedYaw) * Math.cos(adjustedPitch),
            };

            // Normalize the vector to ensure uniform speed
            let magnitude = Math.sqrt(forwardVector.x ** 2 + forwardVector.y ** 2 + forwardVector.z ** 2);
            if (magnitude > 0) {
                forwardVector.x /= magnitude;
                forwardVector.y /= magnitude;
                forwardVector.z /= magnitude;
            }

            let cameraPosX = shipPos.x + forwardVector.x * firstPersonDistance;
            let cameraPosY = shipPos.y + forwardVector.y * firstPersonDistance;
            let cameraPosZ = shipPos.z + forwardVector.z * firstPersonDistance;


            // Set the camera position in front of the ship
            viewpoint.setAttribute("position", `${cameraPosX} ${cameraPosY} ${cameraPosZ}`);
            viewpoint.setAttribute("orientation", `0 1 0 ${-yaw}`);
            updateShipPosition();
            return;
        }

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
        updateShipPosition(adjustedYaw, adjustedPitch);
    }

    function updateShipPosition() {

        // Update ship position based on yaw and pitch
        let forwardVector = {
            x: Math.sin(yaw) * Math.cos(pitch),
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
            //very unstable rotation ?? - mouse and keyboard input
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
        xDisplay.textContent = `X: ${shipPos.x.toFixed(2)}`;
        yDisplay.textContent = `Y: ${shipPos.y.toFixed(2)}`;
        zDisplay.textContent = `Z: ${shipPos.z.toFixed(2)}`;

    }


    // Keyboard Event Listeners
    document.addEventListener("keydown", (event) => {
        keys[event.key] = true;
        let ship_bgm = new Audio("../Assignment_1/Audio/ShipMoveMusic.mp3");
        ship_bgm.volume = 0.1;
        ship_bgm.play();

        ship_bgm.pause();
        ship_bgm.currentTime = 0;


    });

    document.addEventListener("keyup", (event) => {
        keys[event.key] = false;
    });


    function fireProjectile(yaw, pitch) {

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
        let projectileStartPos = {...shipPos}; // Copy ship's position at time of firing
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
            position: {...projectileStartPos}, // Clone starting position
            velocity: {
                x: forwardVector.x * projectileSpeed,
                y: forwardVector.y * projectileSpeed,
                z: forwardVector.z * projectileSpeed
            }
        });
    }

    //check for collisions
    function checkShipCollision(shipPos) {
        //check for planets collision

        Planet_Arr.forEach(planet => {
            let planetPos = planet[0];
            let planetRadius = planet[1];

            let [x, y, z] = planetPos[0].split(" ").map(parseFloat);
            let dx = shipPos.x - x;
            let dy = shipPos.y - y;
            let dz = shipPos.z - z;

            let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < shipRadius + planetRadius) {
                console.log("Collision detected with planet at: " +
                    `${x.toFixed(2)}  
                    ${y.toFixed(2)} 
                    ${z.toFixed(2)}`);
                let audio = new Audio("../Assignment_1/Audio/crash.mp3");
                audio.volume = 0.1;
                audio.play();

                //reset ship position
                shipPos.x = 0;
                shipPos.y = 0;
                shipPos.z = 0;

                //decrement health
                health -= 10;
            }
        });

        //check for boxes collision
        for (let i = 0; i < ammoBoxes.length; i++) {
            let box = ammoBoxes[i];

            let dx = shipPos.x - box.x;
            let dy = shipPos.y - box.y;
            let dz = shipPos.z - box.z;
            let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < shipRadius + boxRadius) {
                console.log("Collision detected with ammo box at:"
                    + `${box.x.toFixed(2)}
                    ${box.y.toFixed(2)}
                    ${box.z.toFixed(2)}`);
                ammoBoxes.splice(i, 1);
                box.element.remove();
                i--;
                ammo += 10;
                score += 100;

                let audio = new Audio("../Assignment_1/Audio/collect.wav");
                audio.volume = 0.5;
                audio.play();

                health -= 10;
            }
        }
    }

    function checktoggles(){
        if(!ammoVisible){
            let ammoGroup = document.getElementById("ammoGroup");
            if(ammoGroup){
                ammoGroup.setAttribute("render", "false");
                ammoGroup.remove();
                return;
            }
            else{
                createAmmoBox();
                ammoVisible = !ammoVisible;
                return;;
            }
            ammoVisible = !ammoVisible;
        }


        if(!planetsVisible){
            let planetGroup = document.getElementById("planetGroup");
            if(planetGroup){
                planetGroup.setAttribute("render", "false");
                planetGroup.remove();
                return;
            }
            else{
                createPlanets();
                ammoVisible = !ammoVisible;
                return;;
            }
        }
    }

    document.querySelector("#toggle button:nth-child(1)").addEventListener("click", () => {
        planetsVisible = !planetsVisible;
        console.log("Planets visibility:", planetsVisible);
        checktoggles();
    });

    document.querySelector("#toggle button:nth-child(2)").addEventListener("click", () => {
        ammoVisible = !ammoVisible;
        console.log("Ammo visibility:", ammoVisible);
        checktoggles();
    });


    // Game loop for smooth updates
    function gameLoop() {
        updateCamera();
        checkShipCollision(shipPos);
        GameState(); // Check game state
        requestAnimationFrame(gameLoop);
    }

    check_Group();
    gameLoop();

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

window.requestAnimationFrame(projectile_update);


export {main}
