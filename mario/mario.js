// -------------------- Players ---------------------
compiling.sheet.push({
  png_path: "../images/mario_small.png",
  json_path: "./mario_small.json"
});

compiling.audio.push({
  "dead": "./music_die.mp3",
});

Q.animations("player_anim",{
    stand: {
      frames: [0],
      rate: 1/5
    },
    run: {
      frames: [1, 2, 3, 0],
      rate: 1/15
    },
    jump: {
      frames: [4]
    },
    end: {
      frames: [6, 7],
      rate: 1/15
    },
    dead: {
      frames: [12]
    }
});

Q.Sprite.extend("Player", {
  // the init constructor is called on creation
  init: function(p) {
    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sheet: "mario", // Setting a sprite sheet sets sprite width and height
      sprite: "player_anim",
      jumpSpeed: -550,
      frame: 0,
    });

    this.add('2d, animation, platformerControls, tween');

    this.end = undefined;

    this.on("fire", this, "run");
    this.on("hit", this, "collision");
    this.on("dead", this, "dead");
  },

  // Update
  step: function(dt){
    if(this.end !== undefined){
      this.play(this.end);
      return;
    }

    if(Math.abs(this.p.vy) > 0){
      this.play("jump");
    }else if(Math.abs(this.p.vx) > 0){
      this.play("run");
    }else{
      this.play("stand");
    }

    this.p.flip = (this.p.direction === "left") ? "x" : undefined;
  },

  // Dead
  dead: function(){
    this.del("platformerControls");
    this.end = "dead";
    this.p.skipCollision = true;
    Q.audio.stop();
    Q.audio.play("dead");
    this.animate({ vy: -200}, 1.0).chain({}, 1.0, {
      callback: function(){
        Q.clearStages();
        Q.stageScene("end", 0);
      }
    });
  },



  collision: function(collide) {

    if(collide.obj.isA("Flag")){
      this.del("platformerControls");
      this.debind("collision");
      this.p.gravity = false;
      this.p.vx = 0;
      this.p.vy = 0;
      this.p.x += 20;
      this.end = "end";

      const base = Q.height - 34 * 3;
      Q.state.inc("score", Math.floor((base - this.p.y)/32 * 100));

      this.animate({y: base}, 1.0, {
        callback: function(){
          this.end = "run";
          this.p.gravity = true;

          this.animate({vx: 100.0}, 2.0, {
            callback: function(){
              this.end = "stand";
              this.p.vy = -300;
              this.p.vx = 0;
              Q("Princess").first().p.vy = -300;
            }
          });
          Q.audio.stop();
          Q.audio.play("end_sound");
        }
      });
    }

  }

});
