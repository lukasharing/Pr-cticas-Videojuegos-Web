// -------------------- Players ---------------------
compiling.sheet.push({
  png_path: "../images/mario_small.png",
  json_path: "./mario_small.json"
});


Q.animations("player_anim",{
    stand: {
      frames: [0],
      rate: 1/5
    },
    run_right: {
      frames: [1, 2, 3, 0],
      rate: 1/15
    },
    jump: {
      frames: [4],
      rate: 1/15
    },
});

Q.Sprite.extend("Player", {
  // the init constructor is called on creation
  init: function(p) {
    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sheet: "mario", // Setting a sprite sheet sets sprite width and height
      sprite: "player_anim",
      jumpSpeed: -550,
      frame: 0
    });

    this.add('2d, animation, platformerControls');

    Q.input.on("fire");

    this.on("fire", this, "run");
    this.on("hit", this, "collision");
  },

  // Update
  step: function(dt){

    if(Math.abs(this.p.vy) > 0){
      this.play("jump");
    }else if(Math.abs(this.p.vx) > 0){
      this.play("run_right");
    }else{
      this.play("stand");
    }
  },

  // Run
  fire: function(){
    console.log(1);
  },

  // Render
  draw: function(ctx){
    ctx.save();
      ctx.scale(-2 * (this.p.direction === "left") + 1, 1);
      this._super(ctx);
    ctx.restore();
  },

  collision: function(c) {
    //console.log(collision.obj);
    // Check the collision, if it's the Tower, you win!
    /*if(collision.obj.isA("Tower")) {
      Q.stageScene("endGame",1, { label: "You Won!" });
      this.destroy();
    }*/
  }

});
