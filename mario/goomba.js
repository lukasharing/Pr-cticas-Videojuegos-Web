// -------------------- Goombas ---------------------
// Goomba Overground
compiling.sheet.push({
  png_path: "../images/goomba.png",
  json_path: "./goomba.json"
});

Q.animations("goomba_overground",{
    run: {
      frames: [0, 1],
      rate: 1/5
    },
    dead: {
      frames: [2],
      rate: 1/5
    }
});

const DEATH_GOOMBA_ANIMATION = 4;

Q.Sprite.extend("Goomba-Overground", {

  init: function(p){
    this._super(p, {
      sheet: "goomba",
      sprite: "goomba_overground",
      vx: 100,
    });

    this.add('Enemy');
    this.dead_counter = DEATH_GOOMBA_ANIMATION;
    this.current_state = "run";

  },

  // Update
  step: function(e){
    this.play(this.current_state);
    if(this.current_state === "dead"){
      --this.dead_counter;
      if(this.dead_counter <= 0){
        this.destroy();
      }
    }
  },

});


// Goomba Underground
Q.Sprite.extend("Goomba-Underground", {});
