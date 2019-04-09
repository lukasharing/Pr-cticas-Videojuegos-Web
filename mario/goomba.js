// -------------------- Goombas ---------------------
// Goomba Overground
compiling_sheets.push({
  png_path: "../images/goomba.png",
  json_path: "./goomba.json"
});

Q.animations("goomba_overground",{
    run: {
      frames: [0, 1],
      rate: 1/5
    },
});

Q.Sprite.extend("Goomba-Overground", {

  init: function(p){
    this._super(p,{
      sheet: "goomba",
      sprite: "goomba_overground"
    });

    this.add('2d, animation');
  },

  // Update
  step: function(e){
    this.play("run");
  }

});


// Goomba Underground
Q.Sprite.extend("Goomba-Underground", {});
