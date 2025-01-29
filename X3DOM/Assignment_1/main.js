/*
<!--
• All X3D scene elements can be added / removed / updated dynamically
using JavaScript
• Useful functions:
• document.getElementById(id)
• Get an element from the X3D scene by specifying its id.
• document.createElement(elementName)
• Create a new X3D element by specifying its type.
• Element.setAttribute(name, value)
• Set an attribute of a X3D element by specifying the attribute name and the attribute value
• Element.getAttribute(name)
• Get an attribute value by specifying the attribute name
• Element.append(element)
• Append an X3D element to another element
-->
 */
//global scene and coordinate information
let scene = document.getElementById("scene");
let current_cord = [0,0,0];
// let movement_inputs = document.addEventListener();

function main(){
    scene = document.getElementById("scene");
    if(scene){
        console.log("initalized scene");
        display_camera_pos()
        scene.appendChild(initalize_floor(document));
        scene.appendChild(initalize_reels(document));
    }

}
function initalize_reels(document, current_cord = [0,0,0]){
    let num_reels=3;
    let shape = document.createElement("Shape");
    let reels =[];
    for (let i = 0; i <= num_reels; i++){
        //create the 3 slots to rotate
        shape = document.createElement("Shape");
        let appearance = document.createElement("appearance");
        let ImageTexture = document.createElement("ImageTexture");
        //change for creating own reel geometry
        ImageTexture.setAttribute("url", "../Textures/brick_texture.jpg");
        // appearance.appendChild(material);
        appearance.appendChild(ImageTexture);
        let Sphere = document.createElement("Sphere");
        shape.append(appearance);
        shape.append(Sphere);
        reels.push(shape);
    }
    return shape;
}

function display_camera_pos (){
    console.log("Current Camera Position: " + document.getElementById("Origin").position);
}
function initalize_floor(document){
    console.log("Creating the floor");
    let transform = document.createElement("Transform");
    let shape = document.createElement("Shape");
    let appearance = document.createElement("appearance");
    let ImageTexture = document.createElement("ImageTexture");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0.68 0.85 .9");
    ImageTexture.setAttribute("url", "../Textures/Seamless+hotel+casino+carpet+texture-73221360.jpg");
    // appearance.appendChild(material);
    appearance.appendChild(ImageTexture);
    let Rectangle = document.createElement("Rectangle2D");
    Rectangle.setAttribute("size", "50 50" , "solid", "true");
    transform.setAttribute("translation", "0 0 -1")
    shape.append(appearance);
    shape.append(Rectangle);
    transform.append(shape);
    return transform;
}

function movement(event){
    let key = event.target.id;
    console.log(key);
}

//Modify camera position to x0 y0 z30
function change_view(){
    scene = document.getElementById("scene");
    if(scene){
        let Viewpoint= document.getElementById("Origin");
        Viewpoint.setAttribute("position", "0 0 30",);
        console.log("changed view " + Viewpoint.position);
        scene.appendChild(Viewpoint);
    }
}
//testing js and x3dom dynamics
function addBox(){
    scene = document.getElementById("scene");
    if(scene){
        console.log("adding box");
        let Transform = document.createElement("Transform");
        Transform.setAttribute("translation", current_cord);
        let shape = document.createElement("shape");
        let appearance = document.createElement("appearance");
        let material = document.createElement("material");
        material.setAttribute("diffuseColor", "1 0 0");
        appearance.append(material);
        let box = document.createElement("box");
        shape.append(appearance);
        shape.append(box);
        Transform.append(shape);
        scene.appendChild(Transform);
        // scene.appendChild(shape);
        current_cord[2] = current_cord[2] + 1;
        console.log(current_cord);
    }


}