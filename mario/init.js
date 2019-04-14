// Main Game
compiling.audio.push({
  "main_sound": "./music_main.mp3",
  "end_sound": "./music_level_complete.mp3"
});

Q.load(`${unroll(unroll(Object.values(compiling)).map(e => Object.values(e))).join(",")}, ./level.tmx`, function() {
  Q.state.set("score", 0);

  // Sprites sheets can be created manually
  compiling.sheet.forEach(sheet => { Q.compileSheets(sheet.png_path, sheet.json_path) });

  // Audio
  if(Q.hasWebAudio){
    Q.audio.enableWebAudioSound();
  }else{
    Q.audio.enableHTML5Sound();
  }

  const assets = Object.assign({}, ...compiling.audio);
  assets["bg"] = "../images/bg.png"; // Load Background
  Q.load(assets, function(){
    // Finally, call stageScene to run the game
    Q.loadTMX("./level.tmx", function() {
      Q.stageScene("intro");
    });

  });

});

Q.scene("intro", function(stage) {
  stage.insert(new Q.Repeater({ asset: "bg", speedX: 0.5, speedY: 0.5, type: 0 }));

  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  var button = box.insert(new Q.UI.Button(
    { x: 0, y: 0, fill: "#CCCCCC", label: "Jugar!" }
  ));

  var text = box.insert(new Q.UI.Text(
    { x: 0, y: -20 - button.p.h, fill: "#CCCCCC", label: "Mario!!" }
  ));

  button.on("click",function() {
    Q.clearStages();
    Q.stageScene("level1");
  });

  box.fit(20);

});

Q.scene("end", function(stage) {
  stage.insert(new Q.Repeater({ asset: "bg", speedX: 0.5, speedY: 0.5, type: 0 }));

  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  var button = box.insert(new Q.UI.Button(
    { x: 0, y: 0, fill: "#CCCCCC", label: "Jugar de nuevo" }
  ));

  var text = box.insert(new Q.UI.Text(
    { x: 0, y: -20 - button.p.h, fill: "#CCCCCC", label: "Has muerto!" }
  ));

  button.on("click",function() {
    Q.clearStages();
    Q.stageScene("level1", 0);
  });

  box.fit(20);

});

// GUI
Q.scene("GUI", function(stage) {
  console.log(1);
  stage.insert(new Q.Score());
});

Q.scene("level1", function(stage) {
  Q.audio.play("main_sound", { loop: true });
  
  Q.stageScene("GUI", 1);

  // TMX
  Q.stageTMX("./level.tmx", stage);

  // GUI
  const viewport = stage.add("viewport");

  viewport.follow(Q("Player").first(), {
    x: true,
    y: false
  },{
    minX: 0,
    maxX: 60 * 34,
    minY: 0,
    maxY: 20 * 34
  });


  // Add in a couple of enemies
  /*stage.insert(new Q.Enemy({ x: 700, y: 0 }));
  stage.insert(new Q.Enemy({ x: 800, y: 0 }));
  // Finally add in the tower goal
  stage.insert(new Q.Tower({ x: 180, y: 50 }));*/
});
