const Q = Quintus().include("Sprites,Touch,TMX").setup({
  width: 800, // Set the default width to 800 pixels
  height: 600, // Set the default height to 600 pixels
  upsampleWidth: 420, // Double the pixel density of the
  upsampleHeight: 320, // game if the w or h is 420x320
  // or smaller (useful for retina phones)
  downsampleWidth: 1024, // Halve the pixel density if resolution
  downsampleHeight: 768 // is larger than or equal to 1024x768
}).touch();


Q.load("./data/mario_small.png, ./data/mario_small.json, ./data/level.json, ./images/tiles.png, ./images/bg.png", function() {
  // Sprites sheets can be created manually
  Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
  // Or from a .json asset that defines sprite locations
  Q.compileSheets("sprites.png","sprites.json");
  // Finally, call stageScene to run the game
  Q.stageScene("level1");
});



Q.scene("level1",function(stage) {
  // Add in a repeater for a little parallax action
  stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));
  // Add in a tile layer, and make it the collision layer
  stage.collisionLayer(new Q.TileLayer({
    dataAsset: 'level.json',
    sheet: 'tiles'
  }));
  // Create the player and add them to the stage
  /*var player = stage.insert(new Q.Player());
  // Give the stage a moveable viewport and tell it
  // to follow the player.
  stage.add("viewport").follow(player);
  // Add in a couple of enemies
  stage.insert(new Q.Enemy({ x: 700, y: 0 }));
  stage.insert(new Q.Enemy({ x: 800, y: 0 }));
  // Finally add in the tower goal
  stage.insert(new Q.Tower({ x: 180, y: 50 }));*/
});
