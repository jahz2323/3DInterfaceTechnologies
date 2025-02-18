export let ammoBoxes = [];
export const shipRadius = 10;
export const boxRadius = 2.5;

function getRandomArbitrary(number, number2) {
    // Returns a random number between number and number2
    return Math.random() * (number2 - number) + number;
}

function createAmmoBox() {
    // Create 200 boxes in randomized positions from x(-1000,1000), y(500,500), z(-1000,1000)
    let ammoGroup = document.createElement("Group");
    ammoGroup.setAttribute("id", "ammoGroup");
    for (let i = 0; i <= 350; i++) {
        let x = getRandomArbitrary(-2000, 2000);
        let y = getRandomArbitrary(-2000, 2000);
        let z = getRandomArbitrary(-4000, 1000);

        let ammoTransform = document.createElement("Transform");
        ammoTransform.setAttribute("translation", `${x} ${y} ${z}`);

        // Create Inline element to load the X3D model
        let inlineModel = document.createElement("Inline");
        inlineModel.setAttribute("url", "../Assignment_1/models/star.x3d"); // Path to your model
        inlineModel.setAttribute("scale", "0.5 0.5 0.5"); // Scale the model down
        inlineModel.setAttribute("rotation", "0 1 0 1.57"); // Rotate the model to point forward

        // Append the model to the Transform node
        ammoTransform.appendChild(inlineModel);
        ammoGroup.appendChild(ammoTransform);
        scene.appendChild(ammoGroup);

        // Store the ammo box data in ammoBoxes array, including the DOM element
        ammoBoxes.push({
            x: x,
            y: y,
            z: z,
            element: ammoTransform // Store the DOM element for removal
        });
    }
    animateBoxes();
}
function animateBoxes() {
    let angle = 0;
    // Animate the ammo boxes
    function rotate(){
        angle += 0.05;
        ammoBoxes.forEach((box, index) => {
            // Rotate the ammo box
            box.element.setAttribute("rotation", `0 1 1 ${angle}`);
        });
        requestAnimationFrame(rotate);
    }
    rotate();
}



export { createAmmoBox };
