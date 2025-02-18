export let ammoBoxes = [];
export const shipRadius = 10;
export const boxRadius = 2.5;

function getRandomArbitrary(number, number2) {
    // Returns a random number between number and number2
    return Math.random() * (number2 - number) + number;
}

function createAmmoBox() {
    // Create 200 boxes in randomized positions from x(-1000,1000), y(500,500), z(-1000,1000)
    for (let i = 0; i <= 350; i++) {
        let x = getRandomArbitrary(-2000, 2000);
        let y = getRandomArbitrary(-2000, 2000);
        let z = getRandomArbitrary(-2000, 2000);

        // Create the ammo box DOM element
        let ammoTransform = document.createElement("Transform");
        ammoTransform.setAttribute("translation", `${x} ${y} ${z}`);

        let shape = document.createElement("shape");
        let appearance = document.createElement("appearance");
        let material = document.createElement("material");
        material.setAttribute("diffuseColor", "0.2 0 0"); // Red color for the ammo box
        appearance.appendChild(material);

        let box = document.createElement("box");
        box.setAttribute("size", "5 5 5"); // Box size (you can adjust)
        shape.appendChild(appearance);
        shape.appendChild(box);
        ammoTransform.appendChild(shape);

        // Append the ammo box to the scene
        scene.appendChild(ammoTransform);

        // Store the ammo box data in ammoBoxes array, including the DOM element
        ammoBoxes.push({
            x: x,
            y: y,
            z: z,
            element: ammoTransform // Store the DOM element for removal
        });
    }
}

export { createAmmoBox };
