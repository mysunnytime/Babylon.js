/**
 * A simple GUI scene. Shows a card GUI for a easter event, with buttons to 'Join' event, and 'close' card.
 */
let createScene = function ()
{
  let scene = new BABYLON.Scene(engine);
  let camera = new BABYLON.ArcRotateCamera('Camera', -Math.PI/2, Math.PI/2, 5, new BABYLON.Vector3(0, 0, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  let light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  let egg = BABYLON.MeshBuilder.CreateSphere("Egg", {diameterX: 0.62, diameterY: 0.8, diameterZ: 0.6}, scene);
  egg.accessibilityTag = {
    isSalient: true,
    description: "An easter egg"
  }
  egg.actionManager = new BABYLON.ActionManager(scene);
  egg.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPickUpTrigger,
      () => {
          egg.setEnabled(false);
          card.setEnabled(true);
      })
  );
  egg.setEnabled(false);

  let box = BABYLON.MeshBuilder.CreateBox("box", {size: 0.5}, scene);
  box.position.y = -0.65;
  box.parent = egg;

  // GUI
  let card = BABYLON.MeshBuilder.CreatePlane('card', {size: 3});
  card.accessibilityTag = {
    isSalient: true,
    description: "Easter Event Card"
  }
  card.position.z = 0.5;
  let adt = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(card);

  let wrapFront = new BABYLON.GUI.Rectangle('TeamsCardUI_wrapFront');
  wrapFront.width = '80%';
  adt.addControl(wrapFront);

  let bgFront = new BABYLON.GUI.Rectangle('TeamsCardUI_bg');
  bgFront.background = 'white';
  wrapFront.addControl(bgFront);

  let thumbnailBg = new BABYLON.GUI.Rectangle('TeamsCardUI_ThumbnailBg');
  thumbnailBg.width = '100%';
  thumbnailBg.height = '40%';
  thumbnailBg.background = 'gray';
  thumbnailBg.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  thumbnailBg.top = 0;
  wrapFront.addControl(thumbnailBg);

  let url = 'https://raw.githubusercontent.com/TNyawara/EasterBunnyGroupProject/master/Assets/Easter_UI/Backgrounds/background_10.png';
  let thumbnailCustomized = new BABYLON.GUI.Image('TeamsCardUI_ThumbnailImage', url);
  thumbnailCustomized.width = '100%';
  thumbnailCustomized.height = '100%';
  thumbnailBg.addControl(thumbnailCustomized);

  const titleFront = new BABYLON.GUI.TextBlock(
  'TeamsCardUIText_Title',
  'Happy Hoppy'
  );
  titleFront.fontSize = 60;
  titleFront.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  titleFront.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  titleFront.paddingLeft = '7.5%';
  titleFront.top = '40%';
  titleFront.height = '10%';
  wrapFront.addControl(titleFront);

  let dateFront = new BABYLON.GUI.TextBlock('TeamsCardUIText_Date', 'Every day');
  wrapFront.addControl(dateFront);
  dateFront.fontSize = 40;
  dateFront.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  dateFront.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  dateFront.paddingLeft = '7.5%';
  dateFront.top = '50%';
  dateFront.height = '5%';

  const timeFront = new BABYLON.GUI.TextBlock('TeamsCardUIText_Time', '00:00 - 23:59');
  wrapFront.addControl(timeFront);
  timeFront.fontSize = 40;
  timeFront.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  timeFront.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  timeFront.paddingLeft = '35%';
  timeFront.top = '50%';
  timeFront.height = '5%';

  const meetingDetail = new BABYLON.GUI.TextBlock(
  'TeamsCardUIText_GroupName',
  "Help the little bunny rabbits get ready for Easter! Look at all the different colors to decorate Easter eggs with and pick out the shapes you'd like to wear in the parade. "
  );
  wrapFront.addControl(meetingDetail);
  meetingDetail.fontSize = 40;
  meetingDetail.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  meetingDetail.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  meetingDetail.paddingLeft = '7.5%';
  meetingDetail.top = '55%';
  meetingDetail.height = '30%';
  meetingDetail.width = '100%';
  meetingDetail.textWrapping = BABYLON.GUI.TextWrapping.WordWrapEllipsis;

  let joinButton = BABYLON.GUI.Button.CreateSimpleButton('TeamsCardUIButton_Join', 'Join');
  joinButton.background = 'black';
  joinButton.color = 'white';
  joinButton.fontSize = 40;
  joinButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  joinButton.textBlock.textHorizontalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  joinButton.top = '85%';
  joinButton.height = '10%';
  joinButton.width = '40%';
  wrapFront.addControl(joinButton);
  joinButton.onPointerUpObservable.add(() => {
      alert('💐🌼Happy Easter! 🐰🥚');
  });

  let closeButton = BABYLON.GUI.Button.CreateSimpleButton('TeamsCardUIButton_Close', 'X');
  closeButton.background = 'black';
  closeButton.color = 'white';
  closeButton.fontSize = 40;
  closeButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  closeButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  closeButton.textBlock.textHorizontalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  closeButton.top = '0';
  closeButton.height = '12%';
  closeButton.width = '15%';
  wrapFront.addControl(closeButton);
  closeButton.onPointerUpObservable.add(() => {
      // card.setEnabled(false);
      // egg.setEnabled(true);
      // let box = BABYLON.MeshBuilder.CreateBox("box", {size: 0.3}, scene);
      // box.position.x = Math.random() * 2 - 1;
      // box.position.y = Math.random() * 2 - 1;
      // box.position.z = Math.random() * 2 - 1;
      // box.parent = egg;
      // box.accessibilityTag = {
      //   isSalient: true,
      //   description: "box"
      // }
  });

  console.log('Start the show!');
  scene.debugLayer.renderAccessibilityTree();
  scene.debugLayer.show();
  return scene;
}
