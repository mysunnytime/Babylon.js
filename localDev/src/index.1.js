/**
 * Simple scene: three boxes + a group of spheres
 */
let createScene = function () {
    let scene = new BABYLON.Scene(engine);
    let camera = new BABYLON.ArcRotateCamera("Camera", Math.PI/2, Math.PI/4, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // add some objects
    let box0 = BABYLON.MeshBuilder.CreateBox("box3", {size: 0.5}, scene);
    box0.position.z = -1;
    box0.position.y = 0.6;
    box0.accessibilityTag = {
        isSalient: true,
        description: "A small box in the middle of the scene",
        isWholeObject: true,
    }
    let box1 = BABYLON.MeshBuilder.CreateBox("box1", {}, scene);
    box1.position.x = 1;
    box1.accessibilityTag = {
        isSalient: true,
        description: "A big box on the left of the small box",
        isWholeObject: true,
    }
    let box2 = BABYLON.MeshBuilder.CreateBox("box2", {}, scene);
    box2.position.x = -1;
    box2.accessibilityTag = {
        isSalient: true,
        description: "A big box on the right of the small box",
        isWholeObject: true,
    }
    let mat = new BABYLON.StandardMaterial("Gray", scene);
    mat.diffuseColor = BABYLON.Color3.Gray();
    let spheresCount = 6;
    let alpha = 0;
    for (let index = 0; index < spheresCount; index++) {
        const sphere = BABYLON.Mesh.CreateSphere("Sphere " + index, 32, 1, scene);
        sphere.position.x = 3 * Math.cos(alpha);
        sphere.position.z = 3 * Math.sin(alpha);
        sphere.material = mat;
        const sphereOnClicked = () => {
            alert(`You just clicked ${sphere.name}!`)
        }
        sphere.accessibilityTag = {
            isSalient: true,
            description: sphere.name,
            isWholeObject: true,
            isClickable: true,
            onClicked: sphereOnClicked
        };
        sphere.actionManager = new BABYLON.ActionManager(scene);
        sphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, sphereOnClicked));
        alpha += (2 * Math.PI) / spheresCount;
    }

    console.log('Start the show!');
    let html = getAccessibilityHTML(scene);
    console.log(html);
    // engine.getRenderingCanvas().insertAdjacentHTML('beforebegin', html);
    engine.getRenderingCanvas().before(html);
    return scene;
};

// define generation method
let getAccessibilityHTML = function (scene) {
    const wrap = document.createElement("div");
    wrap.style.position = "absolute";
    wrap.style.left = "-999px";
    // wrap.style.visibility = "hidden";
    scene.meshes.forEach((mesh) => {
        if (mesh.accessibilityTag.isSalient) {
            let element;
            if(!mesh.accessibilityTag.isClickable) {
                element = document.createElement("div");
                element.setAttribute("tabindex", "0")
            }
            else {
                element = document.createElement("button");
                element.onclick = mesh.accessibilityTag.onClicked;
            }
            const text = document.createTextNode(mesh.accessibilityTag.description);
            element.appendChild(text);
            element.onfocus = function () {
                console.log(mesh.name);
                mesh.enableEdgesRendering(0.999);
                mesh.edgesWidth = 5;
                mesh.edgesColor = new BABYLON.Color4(0.25, 0.5, 1, 1);
            };
            element.onblur = function () {
                console.log(mesh.name);
                mesh.disableEdgesRendering();
            };
            mesh.accessibilityTag.element = element;
            wrap.append(element);
        }
    });
    return wrap;
};
