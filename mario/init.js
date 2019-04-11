// Main Game
compiling.audio.push({
  "main_sound": "./music_main.mp3"
});

compiling.audio.push({
  "coin": "./coin.mp3"
});

Q.load(`${unroll(unroll(Object.values(compiling)).map(e => Object.values(e))).join(",")}, ./level.tmx`, function() {
  // Sprites sheets can be created manually
  compiling.sheet.forEach(sheet => { Q.compileSheets(sheet.png_path, sheet.json_path) });

  // Audio
  if(Q.hasWebAudio){
    Q.audio.enableWebAudioSound();
  }else{
    Q.audio.enableHTML5Sound();
  }
  Q.load(Object.assign({}, ...compiling.audio), function(){
    // Finally, call stageScene to run the game
    Q.loadTMX("./level.tmx", function() {
      //Q.audio.play("main_sound", { loop: true });
      Q.stageScene("level1");
    });

  });

});


Q.scene("level1", function(stage) {
  // Adio

  Q.stageTMX("./level.tmx", stage);

  //stage.locate(0, 0);
  stage.add("viewport").follow(Q("Player").first(), {
    x: true,
    y: false
  },
  {
    minX: 0,
    maxX: 80 * 34,
    minY: 0,
    maxY: 200
  });


  // Add in a couple of enemies
  /*stage.insert(new Q.Enemy({ x: 700, y: 0 }));
  stage.insert(new Q.Enemy({ x: 800, y: 0 }));
  // Finally add in the tower goal
  stage.insert(new Q.Tower({ x: 180, y: 50 }));*/
});
