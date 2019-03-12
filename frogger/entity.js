const VEC_L = new Vector(-1, +0);
const VEC_T = new Vector(+0, -1);
const VEC_B = new Vector(+0, +1);
const VEC_R = new Vector(+1, +0);

class Entity {
  constructor(_s, _w, _h, _t, _x, _y){

    this.sprite = _s;

    this.width  = _w;
    this.height = _h;

    this.time   = 0;
    this.current_frame  = 0;
    this.total_frames = _t;

    this.position = new Vector(0, 0);
    this.last_position = this.position.clone();
    this.last_angle = 0;
  };

  get velocity(){ return this.position.subtract(this.last_position); }

  update(dt){

    const vel = this.velocity;
    this.last_position = this.position;
    this.position = this.position.add(vel.scale(0.98 * dt));

    ++this.time;
  };

  draw(ctx){
    if(!this.last_position.compare(this.position)){
      this.last_angle = Math.atan2(this.velocity.x, -this.velocity.y);
    }
    ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.last_angle);
      ctx.drawImage(
        this.sprite,
        this.current_frame * this.width,
        0,
        this.width,
        this.height,
        -this.width/2,
        -this.height/2,
        this.width,
        this.height,
      );
    ctx.restore();
  };
};

class Player extends Entity{

  constructor(game){
    super(
      game.sprite_buffer["player"],
      40, // Width,
      54, // Height
      6 // Total Frames
    );
  };

  update(dt){
    super.update(dt);

    // Keys
    if(game.getKey("ArrowRight")){
      this.position = this.position.add(VEC_R.scale(10));
    }

    if(game.getKey("ArrowLeft")){
      this.position = this.position.add(VEC_L.scale(10));
    }

    if(game.getKey("ArrowUp")){
      this.position = this.position.add(VEC_T.scale(10));
    }

    if(game.getKey("ArrowDown")){
      this.position = this.position.add(VEC_B.scale(10));
    }

    // Animation
    this.current_frame = 0;
    if(this.velocity.length > 0.1){
      this.current_frame = Math.floor(this.time * this.velocity.length / 10) % this.total_frames;
    }

  };

  draw(ctx){

    super.draw(ctx);

  };
};

class Turtle extends Entity{

  constructor(game){
    super(
      game.sprite_buffer["turtle"],
      50, // Width,
      50, // Height
      9 // Total Frames
    );
  };

  update(dt){
    super.update(dt);

    this.current_frame = Math.floor(Math.abs(Math.sin(this.time / 50)) * this.total_frames);
  };

  draw(ctx){

    super.draw(ctx);

  };
};
