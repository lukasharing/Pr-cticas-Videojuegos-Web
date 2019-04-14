// -------------------- Blocks ---------------------
// Coin Block
Q.animations("block-coin",{
    idle: {
      frames: [7 * 5 + 2, 7 * 4 + 2, 7 * 3 + 2],
      rate: 1/5
    },
    disabled: {
      frames: [7 * 3 + 3]
    }
});

Q.Sprite.extend("Bloque-Moneda", {

  init: function(p){
    this._super(p, {
      sheet: "tiles",
      sprite: "block-coin",
      gravity: false,
    });

    this.state = "idle";

    this.add('2d, animation, tween');

    this.on("bump.bottom", this, "collision");
  },

  // Update
  step: function(e){
    this.play(this.state);
  },

  collision: function(entity){
    Q.state.inc("score", 100);
    Q.audio.play("coin");
    /* Amimation */
    this.animate({y: this.p.y - 20}, 0.1, Q.Easing.Quadratic.InOut).chain({y: this.p.y}, 0.1, Q.Easing.Quadratic.InOut);

    this.state = "disabled";
    this.debind("collision");
  },

});
