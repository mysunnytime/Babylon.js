/* eslint-disable-next-line import/no-internal-modules */
import { canvas, engine } from "./index";
import * as BABYLON from "@dev/core";
import "@dev/loaders";
import * as GUI from "@dev/gui";
import * as ACCESSIBILITY from "@tools/html-twin-renderer/";

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

    let card = BABYLON.MeshBuilder.CreatePlane("card", { size: 3 });
    card.setEnabled(true);
    card.accessibilityTag = {
        isSalient: true,
        description: "Easter Event Card",
    };
    let adt = GUI.AdvancedDynamicTexture.CreateForMesh(card);

    let wrapFront = new GUI.Rectangle("TeamsCardUI_wrapFront");
    wrapFront.width = "80%";
    wrapFront.background = "white";
    adt.addControl(wrapFront);

    let url = "https://raw.githubusercontent.com/TNyawara/EasterBunnyGroupProject/master/Assets/Easter_UI/Backgrounds/background_10.png";
    let thumbnailCustomized = new GUI.Image("TeamsCardUI_ThumbnailImage", url);
    thumbnailCustomized.alt = "Background image";
    thumbnailCustomized.width = "100%";
    thumbnailCustomized.height = "100%";
    wrapFront.addControl(thumbnailCustomized);

    let toggle = true;
    card.actionManager = new BABYLON.ActionManager(scene);
    card.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
            if (toggle) {
                // wrapFront.removeControl(thumbnailCustomized);
                wrapFront.clearControls();
            } else {
                wrapFront.addControl(thumbnailCustomized);
            }
            toggle = !toggle;
        })
    );

    console.log("Start the show!");
    ACCESSIBILITY.HTMLTwinRenderer.RenderAccessibilityTree(scene);
    return scene;
};
