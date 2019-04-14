// -------------------- Bloopa ---------------------
compiling.sheet.push({
  png_path: "../images/bloopa.png",
  json_path: "./bloopa.json"
});

Q.animations("bloopa",{
    up: {
      frames: [0]
    },
    down: {
      frames: [1]
    },
    dead: {
      frames: [2]
    }
});

Q.Sprite.extend("Bloopa", {

  init: function(p){
    this._super(p, {
      sheet: "bloopa",
      sprite: "bloopa",
      gravity: false,
      vx: 50.0,
      //skipCollision: true
    });

    this.current_state = "up";
    this.dead_counter = 4;

    this.add('Enemy');
    this.updownAnimation();
  },

  // Update
  step: function(e){
    this.play(this.current_state);

    if(this.current_state === "dead"){
      --this.dead_counter;
      if(this.dead_counter <= 0){
        this.destroy();
      }
      this.stop();
    }

  },

  updownAnimation: function(){
    this.current_state = "up";
    const start_y = this.p.y;
    this.animate({
        y: start_y + 50
    }, 1.0,
    {
      callback: function(){ this.current_state = "down"; },
      easing: Q.Easing.Quadratic.Out
    }).chain({ // Animación de bajada
      y: start_y - 50
    }, 0.7,
    {
      callback: this.updownAnimation,
      easing: Q.Easing.Quadratic.In
    });
  }

});
