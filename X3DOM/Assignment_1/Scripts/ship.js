function initalize_ship(document) {
    console.log("Creating the ship");
    ship(document);

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
    coordinate.setAttribute("point", points);
    triangle.appendChild(coordinate);

    shape.appendChild(appearance);
    shape.appendChild(triangle);
    return shape;
}

function createAccelerator(document, translation) {
    let transform = document.createElement("transform");
    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "1 0 0");
    material.setAttribute("emissiveColor", "0 .2 0");
    appearance.appendChild(material);

    let cone = document.createElement("Cone");
    cone.setAttribute("bottomRadius", "1");
    cone.setAttribute("height", "2");
    cone.setAttribute("bottom", "true");

    shape.appendChild(appearance);
    shape.appendChild(cone);

    transform.setAttribute("translation", translation);
    transform.setAttribute("rotation", "1 0 0 -1.57");
    transform.setAttribute("scale", "0.5 0.5 0.5");
    transform.appendChild(shape);
    return transform;
}

function ship(document) {
    let scene = document.getElementById("scene");
    let shipGroup = document.createElement("transform");
    shipGroup.setAttribute("translation", "0 0 0");

    let shapes = [
        ["0 0 1", "0 .2 0", "-1.5 0 0 1.5 0 0 0 0 -1"],
        ["0 1 0", "0 .2 0", "-4 0 0 4 0 0 0 0 5"],
        ["0 1 0", "0 .2 0", "0 5 5 4 0 0 -4 0 0"],
        ["0 1 0", "0 .2 0", "0 0 5 4 0 0 0 5 5"],
        ["0 1 0", "0 .2 0", "0 0 5 0 5 5 -4 0 0"],
        ["0 1 0", "0 .2 0", "1.5 0 2.5 4 0 0 10 0 2.5"],
        ["0 0 1", "0 .2 0", "3 1 1 2 0 2.5 10 0 2.5"],
        ["1 0 0", "0 .2 0", "4 0 0 3 1 1 10 0 2.5"],
        ["0 1 0", "0 .2 0", "-4 0 0 -1.5 0 2.5 -10 0 2.5"],
        ["0 0 1", "0 .2 0", "-2 0 2.5 -3 1 1 -10 0 2.5"],
        ["1 0 0", "0 .2 0", "-3 1 1 -4 0 0 -10 0 2.5"],

        ["0 1 0", "0 .2 0", "-3.5 -1 0 3.5 -1 0   0 -1 -5"],
        ["0 0 1", "0 .2 0", "0 -1 -5 -0 -1 -5 3.5 -1 0"],
        //front section
        ["1 0 0", "0 .2 0", "3.5 -1 0  1.5 2 0  0.5 -1 -5"],
        ["1 0 0", "0 .2 0", "0.5 -1 -5 1.5 2 0  3.5 -1 0"],

        ["0 0 1", "0 .2 0", "-3.5 -1 0  -1.5 2 0  -0.5 -1 -5"],
        ["0 0 1", "0 .2 0", "-0.5 -1 -5 -1.5 2 0  -3.5 -1 0"],

        //Front section connection to main body
        ["0 1 0", "0 .2 0", "3.5 -1 0  1.5 2 0  0 5 5"],
        ["0 1 0", "0 .2 0", "0 5 5 1.5 2 0  3.5 -1 0"],

        ["0 1 0", "0 .2 0", "-3.5 -1 0  -1.5 2 0  0 5 5"],
        ["0 1 0", "0 .2 0", "0 5 5 -1.5 2 0  -3.5 -1 0"],

        // //windows above connection to main body
        ["0 0 1", "0 .2 0", "1.5 2 0 -1.5 2 0 0 5 5"],

        //cover barrel
        ["0 .3 0", "0 .2 0", "1.5 2 0 0 1 -2 0 2 0"],
        ["0 .3 0", "0 .2 0", "0 1 -2 -1.5 2 0 0 2 0"],
        ["0 .3 0", "0 .2 0", "0 1 -2 1.5 2 0 0 2 0"],
        ["0 .3 0", "0 .2 0", "-1.5 2 0 0 1 -2 0 2 0"],

        //connect  front section with cover barrel
        ["1 0 0", "0 .5 0.1", "1.35 .75 -2 0 1 -2 1.5 2 0"],
        ["1 0 0", "0 .5 0.1", "0 1 -2 -1.35 .75 -2  -1.5 2 0"],

        //cover bottom of ship
        ["0 1 0", "0 .2 0", "4 -1 0 -4 -1 0 0 -1 -5"],
        //mirror
        ["0 1 0", "0 .2 0", "4 -1 0 0 -1 -5 -4 -1 0"],
        //behind barrel fix
        ["0 0 1", "0 .2 0", "-3.7 -1 0 .5 -1 0 0 2 0"],
        //mirror
        ["0 0 1", "0 .2 0", "-.5 -1 0 3.7 -1 0 0 2 0 "],

        //fix back-face
        ["0 0 1", "0 .2 0", "3.7 -1 0 -.5 -1 0 0 2 0 "],
        //mirror
        ["0 0 1", "0 .2 0", ".5 -1 0 -3.7 -1 0 0 2 0 "],


    ];

    shapes.forEach(([color, emissive, points]) => {
        shipGroup.appendChild(createShape(document, color, emissive, points));
    });

    shipGroup.appendChild(createAccelerator(document, "5 0 1"));
    shipGroup.appendChild(createAccelerator(document, "-5 0 1"));


    let yaw_transform = document.createElement("transform");
    let pitch_transform = document.createElement("transform");
    let roll_transform = document.createElement("transform");
    pitch_transform.setAttribute("id", "pitchTransform");
    yaw_transform.setAttribute("id", "yawTransform");
    roll_transform.setAttribute("id", "rollTransform");
    yaw_transform.appendChild(shipGroup);
    pitch_transform.appendChild(yaw_transform);
    roll_transform.appendChild(pitch_transform);
    scene.appendChild(roll_transform);
}



export {initalize_ship}