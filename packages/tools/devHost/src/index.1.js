/* eslint-disable-next-line import/no-internal-modules */
import { canvas, engine } from "./index";
import * as BABYLON from "@dev/core";
import "@dev/loaders";
import "@tools/accessibility";
import * as ACCESSIBILITY from "@tools/accessibility";

/**
 * A more complicated scene, with boxes, spheres, and wrappers
 * Accessibility enabled.
 */
export let createScene = function () {
    let scene = new BABYLON.Scene(engine);
    let camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // add some objects

    // not salient objects
    const parent = new BABYLON.TransformNode("parent");
    parent.accessibilityTag = {
        // isSalient: true,
        description: "A parent of all, of the root",
        role: "header",
        aria: {
            "aria-label": "main",
            "aria-xxx": "xxx",
            "aria-valuemin": "0",
        },
    };

    const boxDecs = new BABYLON.TransformNode("boxDecs");
    boxDecs.parent = parent;
    boxDecs.accessibilityTag = {
        // isSalient: true,
        description: "A parent without salient children",
        role: "test",
        aria: {
            "aria-label": "box",
            "aria-xxx": "xxx",
            "aria-valuemin": "0",
        },
    };
    let boxDec1 = BABYLON.MeshBuilder.CreateBox("boxDec1", { size: 0.3 }, scene);
    boxDec1.parent = boxDecs;
    boxDec1.position.x = -3;
    boxDec1.position.z = -4;
    let boxDec2 = BABYLON.MeshBuilder.CreateBox("boxDec2", { size: 0.3 }, scene);
    boxDec2.parent = boxDecs;
    boxDec2.position.x = 3;
    boxDec2.position.z = -4;

    // salient objects, static
    let boxes = new BABYLON.TransformNode("boxes");
    boxes.parent = parent;
    boxes.accessibilityTag = {
        isSalient: true,
        description: "A group of boxes",
    };
    let box0 = BABYLON.MeshBuilder.CreateBox("box3", { size: 0.5 }, scene);
    box0.parent = boxes;
    box0.position.z = -1;
    box0.position.y = 0.6;
    box0.accessibilityTag = {
        isSalient: true,
        description: "A small box in the middle of the scene",
    };
    let box1 = BABYLON.MeshBuilder.CreateBox("box1", {}, scene);
    box1.parent = boxes;
    box1.position.x = 1;
    box1.accessibilityTag = {
        isSalient: true,
        description: "A big box on the left of the small box",
    };
    let box2 = BABYLON.MeshBuilder.CreateBox("box2", {}, scene);
    box2.parent = boxes;
    box2.position.x = -1;
    box2.accessibilityTag = {
        isSalient: true,
        description: "A big box on the right of the small box",
    };

    // salient objects, interactive
    let sphereWrapper = new BABYLON.TransformNode("sphereWrapper");
    sphereWrapper.accessibilityTag = {
        isSalient: true,
        description: "A group of spheres",
    };
    sphereWrapper.parent = parent;
    let mat = new BABYLON.StandardMaterial("Gray", scene);
    mat.diffuseColor = BABYLON.Color3.Gray();
    let spheresCount = 6;
    let alpha = 0;
    for (let index = 0; index < spheresCount; index++) {
        const sphere = BABYLON.Mesh.CreateSphere("Sphere " + index, 32, 1, scene);
        sphere.parent = sphereWrapper;
        sphere.position.x = 3 * Math.cos(alpha);
        sphere.position.z = 3 * Math.sin(alpha);
        sphere.material = mat;
        const sphereOnClicked = () => {
            alert(`You just clicked ${sphere.name}!`);
        };
        const sphereOnLeftClicked2 = () => {
            alert(`You just LEFT clicked ${sphere.name}!`);
        };
        const sphereOnRightClicked = () => {
            alert(`You just RIGHT clicked ${sphere.name}!`);
        };
        sphere.accessibilityTag = {
            isSalient: true,
            description: sphere.name,
        };
        sphere.actionManager = new BABYLON.ActionManager(scene);
        sphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, sphereOnClicked));
        sphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, sphereOnLeftClicked2));
        sphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnRightPickTrigger, sphereOnRightClicked));
        alpha += (2 * Math.PI) / spheresCount;
    }

    console.log("Start the show!");
    ACCESSIBILITY.AccessibilityRenderer.RenderAccessibilityTree(scene);
    return scene;
};
