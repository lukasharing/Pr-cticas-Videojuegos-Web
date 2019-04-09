// -------------------- Blocks ---------------------
// Coin Block
Q.animations("block-coin",{
    run: {
      frames: [7 * 5 + 2, 7 * 4 + 2, 7 * 3 + 2],
      rate: 1/5
    },
});

Q.Sprite.extend("Bloque-Moneda", {

  init: function(p){
    this._super(p,{
      sheet: "tiles",
      sprite: "block-coin"
    });

    this.add('animation');
  },

  // Update
  step: function(e){
    this.play("run");
  }

});
