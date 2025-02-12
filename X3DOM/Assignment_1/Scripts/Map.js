function initalize_borders(document) {
    console.log("Creating the floor");
    let border_arr = [];
    let rotation_param = ["1 0 0 -1.57", "0 1 0 0", "0 1 0 1.57", "1 0 0 1.57"];
    let translation_param = ["0 -1000 0", "0 0 -1000", "-1000 0 0", "0 1000 0 "];

    for (let i = 0; i < rotation_param.length; i++) {
        let transform = document.createElement("Transform");
        let shape = document.createElement("Shape");
        let appearance = document.createElement("appearance");
        let ImageTexture = document.createElement("ImageTexture");
        let material = document.createElement("material");

        material.setAttribute("diffuseColor", "0 0 .1");
        ImageTexture.setAttribute("url", "../Textures/glowing-shimmering-stars-space-abstract-background_250994-1378.png");
        appearance.appendChild(material);

        let Rectangle = document.createElement("Rectangle2D");
        Rectangle.setAttribute("size", "2000 2000", "solid", "true");

        transform.setAttribute("translation", translation_param[i]);
        transform.setAttribute("rotation", rotation_param[i]);
        console.log("current rotation object: " + transform.getAttribute("rotation"));
        console.log(rotation_param[i]);

        shape.append(appearance);
        shape.append(Rectangle);
        transform.append(shape);

        border_arr.push(transform);
        scene.appendChild(border_arr[i]);
    }
}


export {initalize_borders}