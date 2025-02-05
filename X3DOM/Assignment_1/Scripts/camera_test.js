
// //3D vector yaw
// let yaw = -90.0; //float
// let pitch = 0.0; //float
// //center of the screen
// let lastx = 500;
// let lasty = 200;
// //checkif first
// let firstMouse = true;
//
// function camera_callback(scene, xpos, ypos) {
//     //xpos and ypos are the current camera position relative to ship 0, -3, -10
//     /*
//     Calculate the mouse's offset since the last frame.
//     Add the offset values to the camera's yaw and pitch values.
//     Add some constraints to the minimum/maximum pitch values.
//     Calculate the direction vector.
//      */
//     if (firstMouse) {
//         lastx = xpos;
//         lasty = ypos;
//         firstMouse = false;
//     }
//     //check if first mouse
//     console.log("First Mouse: " + firstMouse);
//     let xoffset = xpos - lastx;
//     let yoffset = lasty - ypos;
//     lastx = xpos;
//     lasty = ypos;
//
//     yaw += xoffset;
//     pitch += yoffset;
//
//     //normalize the direction vector
//     let direction = [];
//     direction[0] = Math.cos(yaw * Math.PI / 180);
//     direction[2] = Math.sin(yaw * Math.PI / 180);
//     //3D vector pitch
//     direction[0] = Math.cos(pitch * Math.PI / 180) * Math.cos(yaw * Math.PI / 180);
//     direction[1] = Math.sin(pitch * Math.PI / 180);
//     direction[2] = Math.cos(pitch * Math.PI / 180) * Math.cos(yaw * Math.PI / 180);
//     //normalize the direction vector
//     normalize_vector(direction);
// }
//
// function normalize_vector(direction) {
//     let length = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1] + direction[2] * direction[2]);
//     direction[0] /= length;
//     direction[1] /= length;
//     direction[2] /= length;
//     return direction;
// }
//camera movement , fire projectile and display camera position
//camera
// let headingDelta = Math.PI / 60.0;
// let heading = 0;
