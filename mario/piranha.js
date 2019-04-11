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
    });

    this.add('animation');

    this.p.y += 24;

    this.time = 0;

    //this.on("bump.left, bump.right", this, "collision");
    this.on("bump", this, "kill");
  },

  // Update
  step: function(dt){
    this.play("run");

    this.time += dt * 48 / 10;
    const direction = Math.sign(Math.cos(this.time));
    this.p.y += direction;
  },

  kill: function(collide){

  },

});


// Goomba Underground
Q.Sprite.extend("Goomba-Underground", {});
