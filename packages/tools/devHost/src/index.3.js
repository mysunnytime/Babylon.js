/* eslint-disable-next-line import/no-internal-modules */
import { canvas, engine } from "./index";
import * as BABYLON from "@dev/core";
import * as GUI from "@dev/gui";
import "@dev/loaders";
// import * as ACCESSIBILITY from "@tools/html-twin-renderer/"
import * as ACCESSIBILITY from "@tools/html-twin-renderer/";
import * as INSPECTOR from "@dev/inspector";

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

    let wrapper = new BABYLON.TransformNode("Wrapper");
    wrapper.setEnabled(true);
    // wrapper.accessibilityTag = {
    //     description: "Wrapper"
    // };

    let egg = BABYLON.MeshBuilder.CreateSphere("Egg", { diameterX: 0.62, diameterY: 0.8, diameterZ: 0.6 }, scene);
    egg.parent = wrapper;
    egg.accessibilityTag = {
        description: "An easter egg",
        aria: {
            "aria-label": "interactive elements",
        },
        eventHandler: {
            click: () => {
                alert("egg clicked!");
            },
        },
    };
    egg.actionManager = new BABYLON.ActionManager(scene);
    egg.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
            wrapper.setEnabled(false);
            card.setEnabled(true);
            // let box = BABYLON.MeshBuilder.CreateBox("box", {size: 0.3}, scene);
            // box.position.x = Math.random() * 2 - 1;
            // box.position.y = Math.random() * 2 - 1;
            // box.position.z = Math.random() * 2 - 1;
            // box.parent = wrapper;
            // box.accessibilityTag = {
            //   description: "box"
            // }
        })
    );

    let box1 = BABYLON.MeshBuilder.CreateBox("box1", { size: 0.3 }, scene);
    box1.parent = wrapper;
    box1.position.x = 1;
    box1.position.z = 0.2;
    box1.accessibilityTag = {
        description: "A small box on the left of the egg",
        isWholeObject: true,
        aria: {
            "aria-label": "scene object",
        },
    };
    let box2 = BABYLON.MeshBuilder.CreateBox("box2", { size: 0.3 }, scene);
    box2.parent = wrapper;
    box2.position.x = -1;
    box2.position.z = 0.2;
    box2.accessibilityTag = {
        description: "A small box on the right of the egg",
        isWholeObject: true,
    };

    let box = BABYLON.MeshBuilder.CreateBox("box", { size: 0.5 }, scene);
    box.position.y = -0.65;
    box.parent = egg;

    // GUI
    let card = BABYLON.MeshBuilder.CreatePlane("card", { size: 3 });
    card.setEnabled(false);
    card.accessibilityTag = {
        description: "Easter Event Card",
    };
    card.position.z = 0.5;
    let adt = GUI.AdvancedDynamicTexture.CreateForMesh(card);

    let wrapFront = new GUI.Rectangle("TeamsCardUI_wrapFront");
    wrapFront.width = "80%";
    wrapFront.background = "white";
    adt.addControl(wrapFront);

    let thumbnailBg = new GUI.Rectangle("TeamsCardUI_ThumbnailBg");
    thumbnailBg.accessibilityTag = {
        description: "Event card",
        aria: {
            "aria-label": "UI elements",
        },
    };
    thumbnailBg.width = "100%";
    thumbnailBg.height = "40%";
    thumbnailBg.background = "gray";
    thumbnailBg.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    thumbnailBg.top = 0;
    wrapFront.addControl(thumbnailBg);

    let url = "https://raw.githubusercontent.com/TNyawara/EasterBunnyGroupProject/master/Assets/Easter_UI/Backgrounds/background_10.png";
    let thumbnailCustomized = new GUI.Image("TeamsCardUI_ThumbnailImage", url);
    thumbnailCustomized.alt = "Background image";
    thumbnailCustomized.width = "100%";
    thumbnailCustomized.height = "100%";
    thumbnailBg.addControl(thumbnailCustomized);

    const titleFront = new GUI.TextBlock("TeamsCardUIText_Title", "Event: Happy Hoppy");
    titleFront.fontSize = 60;
    titleFront.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    titleFront.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    titleFront.paddingLeft = "7.5%";
    titleFront.top = "40%";
    titleFront.height = "10%";
    wrapFront.addControl(titleFront);

    let dateFront = new GUI.TextBlock("TeamsCardUIText_Date", "Every day");
    wrapFront.addControl(dateFront);
    dateFront.fontSize = 40;
    dateFront.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    dateFront.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    dateFront.paddingLeft = "7.5%";
    dateFront.top = "50%";
    dateFront.height = "5%";
    dateFront.isEnabled = false;

    const timeFront = new GUI.TextBlock("TeamsCardUIText_Time", "00:00 - 23:59");
    wrapFront.addControl(timeFront);
    timeFront.fontSize = 40;
    timeFront.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    timeFront.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    timeFront.paddingLeft = "35%";
    timeFront.top = "50%";
    timeFront.height = "5%";

    const meetingDetail = new GUI.TextBlock(
        "TeamsCardUIText_GroupName",
        "Help the little bunny rabbits get ready for Easter! Look at all the different colors to decorate Easter eggs with and pick out the shapes you'd like to wear in the parade. "
    );
    wrapFront.addControl(meetingDetail);
    meetingDetail.fontSize = 40;
    meetingDetail.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    meetingDetail.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    meetingDetail.paddingLeft = "7.5%";
    meetingDetail.top = "55%";
    meetingDetail.height = "30%";
    meetingDetail.width = "100%";
    meetingDetail.textWrapping = GUI.TextWrapping.WordWrapEllipsis;

    let joinButton = GUI.Button.CreateSimpleButton("TeamsCardUIButton_Join", "Join");
    joinButton.background = "black";
    joinButton.color = "white";
    joinButton.fontSize = 40;
    joinButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    joinButton.textBlock.textHorizontalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    joinButton.top = "85%";
    joinButton.height = "10%";
    joinButton.width = "40%";
    wrapFront.addControl(joinButton);
    joinButton.onPointerClickObservable.add(() => {
        alert("💐🌼Happy Easter! 🐰🥚");
    });
    joinButton.accessibilityTag = {
        eventHandler: {
            onclick: () => {
                alert("button clicked, override!");
            },
        },
    };

    let closeButton = GUI.Button.CreateSimpleButton("TeamsCardUIButton_Close", "X");
    closeButton.accessibilityTag = {
        description: "close",
    };
    // setInterval(() => {
    //     if (closeButton.accessibilityTag) {
    //         closeButton.accessibilityTag = undefined;
    //     } else {
    //         closeButton.accessibilityTag = {
    //             description: "close",
    //         };
    //     }
    // }, 5000);
    closeButton.background = "black";
    closeButton.color = "white";
    closeButton.fontSize = 40;
    closeButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    closeButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    closeButton.textBlock.textHorizontalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    closeButton.top = "0";
    closeButton.height = "12%";
    closeButton.width = "15%";
    wrapFront.addControl(closeButton);
    closeButton.onPointerClickObservable.add(() => {
        card.setEnabled(false);
        wrapper.setEnabled(true);
        // let box = BABYLON.MeshBuilder.CreateBox("box", {size: 0.3}, scene);
        // box.position.x = Math.random() * 2 - 1;
        // box.position.y = Math.random() * 2 - 1;
        // box.position.z = Math.random() * 2 - 1;
        // box.parent = wrapper;
        // box.accessibilityTag = {
        //   description: "box"
        // }
    });

    console.log("Start the show!");
    ACCESSIBILITY.HTMLTwinRenderer.RenderAccessibilityTree(scene);
    // INSPECTOR.Inspector.Show();
    return scene;
};
