// -------------------- Flag ---------------------
Q.animations("flag",{
    idle: {
      frames: [7 * 6 + 3],
    },
});

Q.Sprite.extend("Flag", {

  init: function(p){
    this._super(p, {
      sheet: "tiles",
      sprite: "flag",
      skipCollision: true,
      gravity: false
    });

    this.add("2d, animation");
  },

  // Update
  step: function(e){
    this.play("idle");
  },
});
