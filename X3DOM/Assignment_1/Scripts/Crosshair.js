function createCrossHair(document, translation) {
    let crosshairGroup = document.createElement("transform");
    crosshairGroup.setAttribute("translation", `${translation}`); // Set Z to -50 in front of the ship


    // Apply rotation of 90 degrees around the Y-axis
    crosshairGroup.setAttribute("rotation", "1 0 0 1.57"); // 90 degrees rotation along Y axis

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "1 1 0"); // Red color
    appearance.appendChild(material);

    let lineSet = document.createElement("LineSet");
    let coordinate = document.createElement("Coordinate");

    // Define points for an X shape (forming a cross with two diagonal lines)
    coordinate.setAttribute("point",
        "0 0 0  0 0 5 " + // Line from center to (0, 0, 1)
        "0 0 0  0 0 -5 " + // Line from center to (0, 0, -1)
        "0 0 0  5 0 0 " + // Line from center to (1, 0, 0)
        "0 0 0  -5 0 0 " // Line from center to (-1, 0, 0)
    );
    lineSet.appendChild(coordinate);

    let lineIndex = document.createElement("LineIndex");
    lineIndex.setAttribute("lineCount", "4");
    lineIndex.setAttribute("coordIndex", "0 1 -1 2 3 -1");

    shape.appendChild(appearance);
    shape.appendChild(lineSet);
    shape.appendChild(lineIndex);
    crosshairGroup.appendChild(shape);

    return crosshairGroup;
}
export { createCrossHair }