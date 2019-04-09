Q.load(`${[].concat.apply([], compiling_sheets.map(e => Object.values(e))).join(",")}, ./level.tmx`, function() {
  // Sprites sheets can be created manually
  compiling_sheets.forEach(sheet => { Q.compileSheets(sheet.png_path, sheet.json_path) });
  // Finally, call stageScene to run the game

  Q.loadTMX("./level.tmx", function() {
    Q.stageScene("level1");
  });

});


Q.scene("level1", function(stage) {
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
    maxY: 100
  });


  // Add in a couple of enemies
  /*stage.insert(new Q.Enemy({ x: 700, y: 0 }));
  stage.insert(new Q.Enemy({ x: 800, y: 0 }));
  // Finally add in the tower goal
  stage.insert(new Q.Tower({ x: 180, y: 50 }));*/
});
