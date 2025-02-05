
function initalize_ship(document) {
    console.log("Creating the ship");

    let Shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0 0 1", "emissiveColor", "0 .2 0");
    appearance.appendChild(material);

    let Triangle = document.createElement("TriangleSet");
    let Coordinate = document.createElement("Coordinate");
    Coordinate.setAttribute("point", "-6 0 0 6 0 0 0 6 0");
    Triangle.appendChild(Coordinate);

    Shape.appendChild(appearance);
    Shape.appendChild(Triangle);

    scene.appendChild(Shape);
}

export {initalize_ship}