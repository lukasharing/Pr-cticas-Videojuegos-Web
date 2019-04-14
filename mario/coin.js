// -------------------- Coin ---------------------
compiling.sheet.push({
  png_path: "../images/coin.png",
  json_path: "./coin.json"
});

compiling.audio.push({
  "coin": "./coin.mp3"
});

Q.animations("coin",{
    run: {
      frames: [0, 1],
      rate: 1/5
    }
});

Q.Sprite.extend("Coin", {

  init: function(p){
    this._super(p, {
      sheet: "coin",
      sprite: "coin",
      gravity: false,
      skipCollision: true
    });


    this.add('2d, animation, tween');

    //this.on("bump.left, bump.right", this, "collision");
    this.on("hit", this, "collision");
  },

  // Update
  step: function(dt){
    this.play("run");
  },

  collision: function(collide){
    if(collide.obj.isA("Player")){
      Q.audio.play("coin");
      Q.state.inc("score", 100);

      /* Amimation */
      this.animate({y: this.p.y - 20}, 0.1, {callback: this.destroy});

      this.debind("collision");
    }
  },
});
