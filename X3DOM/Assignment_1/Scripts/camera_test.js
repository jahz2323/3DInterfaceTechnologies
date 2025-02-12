export class Camera_pos {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    update_pos(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get_pos() {
        return [this.x, this.y, this.z];
    }
    
}

document.getElementById("birds_eye").addEventListener("click", function () {
    Change_Orientation("up");
});

document.getElementById("bottom_up").addEventListener("click", function () {
    Change_Orientation("down");
});

document.getElementById("left_view").addEventListener("click", function () {
    Change_Orientation("left");
});

document.getElementById("right_view").addEventListener("click", function () {
    Change_Orientation("right");
});

function Change_Orientation(direction) {
    console.log("Camera moved: " + direction);
    switch (direction) {
        case "up":
            viewpoint.setAttribute("position", "0 50 0");
            viewpoint.setAttribute("orientation", "1 0 0 -1.57");
            break;
        case "down":
            viewpoint.setAttribute("position", "0 -50 0");
            viewpoint.setAttribute("orientation", "1 0 0 1.57");
            break;
        case "left":
            viewpoint.setAttribute("position", "-20 0 0");
            viewpoint.setAttribute("orientation", "0 1 0 -1.57");
            break;
        case "right":
            viewpoint.setAttribute("position", "20 0 0");
            viewpoint.setAttribute("orientation", "0 1 0 1.57");
            break;
    }

}

export {
    Change_Orientation
}