const VEC_L = new Vector(-1, +0);
const VEC_T = new Vector(+0, +1);
const VEC_B = new Vector(+0, -1);
const VEC_R = new Vector(+1, +0);

class Entity {
  constructor(_s, _w, _h, _t, _x, _y){

    this.sprite = _s;

    this.width  = _w;
    this.height = _h;

    this.time   = 0;
    this.current_frame  = 0;
    this.total_frames = _t;

    this.position = new Vector(_x, _y);
    this.last_position = this.position.clone();
    this.last_angle = 0;
  };



  get velocity(){ return this.position.subtract(this.last_position); }

  get x(){ return this.position.x - game.width / 2; }
  get y(){ return -this.position.y - game.height / 2; }
  set(x = this.position.x, y = this.position.y){
    this.position.set(x, y);
    this.last_position.set(x, y);
  };

  update(dt){

    const vel = this.velocity;
    this.last_position = this.position.clone();
    this.position = this.position.add(vel.scale(0.98 * dt));

    ++this.time;
  };

  draw(ctx){
    if(!this.last_position.compare(this.position)){
      this.last_angle = Math.atan2(this.velocity.x, this.velocity.y);
    }

    ctx.save();
      ctx.translate(this.position.x, -this.position.y);
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

    this.set(game.width/2, 20);
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

  constructor(){
    super(
      game.sprite_buffer["turtle"],
      50, // Width,
      50, // Height
      9 // Total Frames
    );

    this.time = Math.random() * 1000;

    this._velocity = 0.0;
    // Delay
    this.current_delay = 0;
    this.direction = 0;
  };

  setDirection(_d){
    this.direction = _d;
    this.restore();
  };

  setDelay(_t){
    this.current_delay = _t;
  };

  setVelocity(_v){
    this._velocity = _v;
  };

  restore(){
    const dv = (this.direction + 1) / 2;
    this.set(
      this.last_position.x = (!dv) * (game.width + 50) + dv * (-50),
      undefined
    );
  };

  update(dt){
    super.update(dt);
    if(this.current_delay-- < 0){
      this.position.x += this.direction * this._velocity;
      this.current_frame = Math.floor(Math.abs(Math.sin(this.time / 50)) * this.total_frames);

      if(this.position.x < -50 || this.position.x > (game.width + 50)){
        this.restore();
      }
    }
  };

  draw(ctx){
    super.draw(ctx);
  };
};
