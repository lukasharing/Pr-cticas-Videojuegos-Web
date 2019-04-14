// -------------------- Goombas ---------------------
// Goomba Overground
compiling.sheet.push({
  png_path: "../images/piranha.png",
  json_path: "./piranha.json"
});

Q.animations("piranha_overground",{
    run: {
      frames: [0, 1],
      rate: 1/5
    }
});

Q.Sprite.extend("Piranha", {

  init: function(p){
    this._super(p, {
      sheet: "piranha",
      sprite: "piranha_overground",
      gravity: false
    });

    this.add('2d, animation, tween');

    this.time = 0;

    //this.on("bump.left, bump.right", this, "collision");
    //this.on("bump", this, "collision");
  },

  // Update
  step: function(dt){
    this.play("run");
    this.animate({y: this.p.y + 50}, 1.0).chain({y: this.p.y}, 1.0, {loop: true});

  },
});


// Goomba Underground
Q.Sprite.extend("Goomba-Underground", {});
