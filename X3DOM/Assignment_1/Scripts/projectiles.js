<!-- barrel -->
// <group id="projectile">
//     <transform id="leftRightTransform">
//         <transform id="upDownTransform">
//             <transform rotation="1 0 0 -1.57" translation="0 0 -2">
//                 <shape>
//                     <appearance>
//                         <material diffuseColor='0.7 0.7 0.7'></material>
//                     </appearance>
//                     <cylinder height="3" radius=.95></cylinder>
//             </shape>
//         </transform>
//     </transform>
// </transform>
// </group>


// Projectiles - first is the barrel
let projectilesGroup = document.getElementById("projectile");
let projectiles = projectilesGroup.children;

function projectile_movement() {
    for (let p = 1; p < projectiles.length; p++) {
        let currentProjectile = projectiles[p].children[0].children[0];
        let translation = currentProjectile.getAttribute("translation");
        let translationArray = translation.split(" ");
        let translationZ = translationArray[2];

        translationZ -= 0.9; // speed of projectile can implement a speed variable
        if (translationZ > -500) {
            currentProjectile.setAttribute("translation", "0 0 " + translationZ);
        } else {
            projectilesGroup.removeChild(projectiles[p]);
        }
    }
}


//barrel geometry
let leftRightTransform = document.getElementById("leftRightTransform");
let upDownTransform = document.getElementById("upDownTransform");


function fireProjectile() {
    let projectile = document.getElementById("projectile");

    let left_rightTransform = document.createElement("transform");
    left_rightTransform.setAttribute("rotation", "0 1 0 " + pitch);
    projectile.append(left_rightTransform);

    let up_downTransform = document.createElement("transform");
    up_downTransform.setAttribute("rotation", "1 0 0 " + yaw);
    left_rightTransform.append(up_downTransform);

    let distanceTransform = document.createElement("transform");
    distanceTransform.setAttribute("translation", "0 0 -5");
    up_downTransform.append(distanceTransform);

    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    material.setAttribute("diffuseColor", "0 0.5 0");
    appearance.append(material);

    let sphere = document.createElement("sphere");
    sphere.setAttribute("radius", "0.9", "solid", "true");
    shape.append(sphere);
    shape.append(appearance);
    distanceTransform.append(shape);
    console.log("firing projectile");
}
