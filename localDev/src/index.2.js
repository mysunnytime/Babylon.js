/**
 * A more complicated scene, with boxes, spheres, and wrappers
 */
let createScene = function () {

    let scene = new BABYLON.Scene(engine);
    let camera = new BABYLON.ArcRotateCamera('Camera', -Math.PI/2, Math.PI/2, 5, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    let light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // GUI
    // let plane = BABYLON.Mesh.CreatePlane('plane', 2);
    let plane = BABYLON.MeshBuilder.CreatePlane('plane', {size: 3});
    plane.position.z = 0.5;
    let adt = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);

    let bg = new BABYLON.GUI.Rectangle('rect');
    bg.width = 1;
    bg.height = 1;
    bg.background = 'gray';
    adt.addControl(bg);

    let textBlock = new BABYLON.GUI.TextBlock('intro', 'Are you happy today?');
    textBlock.color = 'black';
    textBlock.fontSize = 60;
    textBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textBlock.top = 0;
    textBlock.height = 0.2
    bg.addControl(textBlock);

    let panel = new BABYLON.GUI.StackPanel();
    bg.addControl(panel);
    panel.height = 0.5;
    panel.width = 1;

    let radio1Text = 'Yes!';
    let selection = radio1Text;
    let radio1 = BABYLON.GUI.RadioButton.AddRadioButtonWithHeader(
        radio1Text,
        'groupString',
        true,
        (btn, value) => {
            if (value) selection = radio1Text;
            console.log('value: ' + value + '; selection: ' + selection);
        }
    );
    let radio2Text = 'Absolutely yes!!!!';
    radio1.height = '150px';
    radio1.scaleX = 3;
    radio1.scaleY = 3;
    let radio2 = BABYLON.GUI.RadioButton.AddRadioButtonWithHeader(
        radio2Text,
        'groupString',
        false,
        (btn, value) => {
            if (value) selection = radio2Text;
            console.log('value: ' + value + '; selection: ' + selection);
        }
    )
    radio2.scaleX = 3;
    radio2.scaleY = 3;
    radio1.height = '150px';
    panel.addControl(radio1);
    panel.addControl(radio2);

    let btn = BABYLON.GUI.Button.CreateSimpleButton('but1', 'Click Me');
    btn.width = 0.5;
    btn.height = '150px';
    btn.background = 'green';
    btn.textBlock.fontSize = 60;
    btn.onPointerUpObservable.add(function() {
        alert(selection + ' You are very happy!! Enjoy your day!!');
    });
    btn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btn.top = '-100px';
    bg.addControl(btn);

    // Add accessibility

    // console.log('Start the show!');
    // let html = getAccessibilityHTML(scene);
    // console.log(html);
    // engine.getRenderingCanvas().before(html);

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
