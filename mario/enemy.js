// -------------------- Enemy ---------------------
Q.component("Enemy", {

  added: function(){

    this.entity.add('2d, animation, aiBounce, tween');
    this.entity.on("bump.top", this, "dead");

    this.entity.on('bump.left, bump.right, bump.bottom', this, "kill");

  },

  dead: function(collide){
    if(collide.obj.isA("Player")){
      this.entity.current_state = "dead";
      collide.obj.p.vy = -300;
      this.entity.debind("kill");
      this.entity.p.vx = 0;
    }
  },

  kill: function(collide){
    if (collide.obj.isA("Player")){
      collide.obj.trigger("dead");
    }
  }

});
