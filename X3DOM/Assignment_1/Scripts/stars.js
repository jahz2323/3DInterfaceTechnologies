function initalize_stars(document) {
    console.log("Creating the stars");
    stars(document);
}

//create randomized stars around the scene -
// each have light source and a custom shape
// - around box -300,-300,-300 to -500,-500,-500

stars = (document) => {
    let scene = document.getElementById("scene");
    let starGroup = document.createElement("transform");
    starGroup.setAttribute("translation", "0 0 0");

    for (let i = 0; i < 100; i++) {
        let shape = document.createElement("shape");
        let appearance = document.createElement("appearance");
        let material = document.createElement("material");
        material.setAttribute("diffuseColor", "1 1 1");
        material.setAttribute("emissiveColor", "1 1 1");
        appearance.appendChild(material);

        let sphere = document.createElement("sphere");
        sphere.setAttribute("radius", "1");
        sphere.setAttribute("solid", "true");

        shape.appendChild(appearance);
        shape.appendChild(sphere);

        let transform = document.createElement("transform");
        transform.setAttribute("translation", `${Math.floor(Math.random() * 1000) - 500} ${Math.floor(Math.random() * 1000) - 500} ${Math.floor(Math.random() * 1000) - 500}`);
        transform.appendChild(shape);
        starGroup.appendChild(transform);
    }
    scene.appendChild(starGroup);
}