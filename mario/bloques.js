// -------------------- Blocks ---------------------
// Coin Block
Q.animations("block-coin",{
    run: {
      frames: [7 * 5 + 2, 7 * 4 + 2, 7 * 3 + 2],
      rate: 1/5
    },
    disabled: {
      frames: [7 * 3 + 3]
    }
});

Q.Sprite.extend("Bloque-Moneda", {

  init: function(p){
    this._super(p,{
      sheet: "tiles",
      sprite: "block-coin",
      vy: 0
    });

    this.state = "run";
    this.dead = -10;

    this.add('2d, animation');

    this.on("bump.bottom", this, "collision");
  },

  // Update
  step: function(e){
    this.play(this.state);

    if(this.state === "disabled"){ this.dead += 2.0; }
  },

  // Override Falling
  update: function(){
    this._super();
  },

  collision: function(entity){
    Q.audio.play("coin");
    this.state = "disabled";
    this.debind("collision");
  },

  draw: function(ctx){
    ctx.save();
      let anim = 1.0 / (1.0 + this.dead * this.dead);
      ctx.translate(0, -10 * anim);
      this._super(ctx);
    ctx.restore();
  },

});
