/* eslint-disable-next-line import/no-internal-modules */
import { canvas, engine } from "./index";
import * as BABYLON from "@dev/core";
import * as GUI from "@dev/gui";
import "@dev/loaders";
import * as ACCESSIBILITY from "@tools/accessibility";

/**
 * A simple GUI scene. Shows a card GUI for a easter event, with buttons to 'Join' event, and 'close' card.
 */
export let createScene = function () {
    let scene = new BABYLON.Scene(engine);
    let camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 5, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    let isNode = true;
    isNode ? nodesBlinking(scene) : guiBlinking(scene);

    console.log("Start the show!");
    // scene.debugLayer.show();
    ACCESSIBILITY.AccessibilityRenderer.RenderAccessibilityTree(scene);
    return scene;
};

let guiBlinking = (scene) => {
    let card = BABYLON.MeshBuilder.CreatePlane("card", { size: 3 }, scene);
    card.accessibilityTag = {
        isSalient: true,
        description: "Easter Event Card",
    };
    card.position.z = 0.5;
    let adt = GUI.AdvancedDynamicTexture.CreateForMesh(card);

    let wrapFront = new GUI.Rectangle("TeamsCardUI_wrapFront");
    wrapFront.width = "80%";
    wrapFront.background = "white";
    adt.addControl(wrapFront);

    let textCnt = 5;
    let allText = [];
    let i = 0;
    // for(; i < textCnt; i++ ) {
    //     const text = new GUI.TextBlock(
    //     'text ' + i,
    //     'text ' + i
    //     );
    //     text.fontSize = 60;
    //     text.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    //     text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    //     text.paddingLeft = '7.5%';
    //     text.top = Math.random() * 80 + '%';
    //     text.height = '10%';
    //     wrapFront.addControl(text);
    //     allText.push(text);
    // }
    setTimeout(() => {
        for (; i < textCnt; i++) {
            const text = new GUI.TextBlock("text " + i, "text " + i);
            text.fontSize = 60;
            text.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
            text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            text.paddingLeft = "7.5%";
            text.top = Math.random() * 80 + "%";
            text.height = "10%";
            wrapFront.addControl(text);
            allText.push(text);
        }
    }, 5000);

    let toggleRandomText = () => {
        let randomIndex = Math.min(Math.floor(Math.random() * allText.length), allText.length - 1);
        if (randomIndex == -1) return;
        let text = allText[randomIndex];
        // if(text.parent) {wrapFront.removeControl(text);}
        // else {wrapFront.addControl(text);}
        text.isVisible = !text.isVisible;
        // text.isEnabled = !text.isEnabled;
        // console.log(text.name + " (isEnabled = " + text.isEnabled + ") " + text.parent.name);
    };
    setInterval(toggleRandomText, 2000);
};

let nodesBlinking = (scene) => {
    let boxCnt = 5;
    let boxes = [];
    let i = 0;
    for (; i < boxCnt; i++) {
        let box = BABYLON.MeshBuilder.CreateBox("box " + i, { size: 0.3 }, scene);
        box.position.x = Math.random() * 3 - 1.5;
        box.position.y = Math.random() * 3 - 1.5;
        box.position.z = Math.random() * 3 - 1.5;
        box.accessibilityTag = {
            // isSalient: true,
            description: box.name,
        };
        boxes.push(box);
    }
    setTimeout(() => {
        for (; i < boxCnt; i++) {
            let box = BABYLON.MeshBuilder.CreateBox("box " + i, { size: 0.2 }, scene);
            box.position.x = Math.random() * 3 - 1.5;
            box.position.y = Math.random() * 3 - 1.5;
            box.position.z = Math.random() * 3 - 1.5;
            box.accessibilityTag = {
                // isSalient: true,
                description: box.name,
            };
            boxes.push(box);
        }
    }, 5000);

    let toggleRandomBox = () => {
        let randomIndex = Math.min(Math.floor(Math.random() * boxes.length), boxes.length - 1);
        if (randomIndex == -1) return;
        let box = boxes[randomIndex];
        // box.setEnabled(!box.isEnabled());
        // box.accessibilityTag = {
        //     isSalient: !box.accessibilityTag.isSalient,
        //     description: box.name
        // };
        // box.accessibilityTag.isSalient = !box.accessibilityTag.isSalient; // this won't work
        if (box.accessibilityTag) {
            box.accessibilityTag = null;
        } else {
            box.accessibilityTag = {
                description: box.name,
            };
        }
    };
    setInterval(toggleRandomBox, 2000);
};
