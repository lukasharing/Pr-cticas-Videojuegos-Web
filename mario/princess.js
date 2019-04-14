// -------------------- Princess ---------------------
compiling.sheet.push({
  png_path: "../images/princess.png",
  json_path: "./princess.json"
});

Q.animations("princess",{
    idle: {
      frames: [0]
    },
});

Q.Sprite.extend("Princess", {

  init: function(p){
    this._super(p, {
      sheet: "princess",
      sprite: "princess",
    });

    this.add('2d, animation, tween');
  },

  // Update
  step: function(e){
    this.play("idle");
  },

});
