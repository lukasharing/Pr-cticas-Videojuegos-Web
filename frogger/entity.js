const VEC_L = new Vector(-1, +0);
const VEC_T = new Vector(+0, +1);
const VEC_B = new Vector(+0, -1);
const VEC_R = new Vector(+1, +0);

class Entity {
  constructor(_s, _w, _h, _t, _cw, _ch){

    this.sprite = _s;

    this.width  = _w;
    this.height = _h;

    this.time   = 0;
    this.current_frame  = 0;
    this.total_frames = _t;

    this.position = new Vector(0.0, 0.0);
    this.last_position = this.position.clone();
    this.last_angle = 0;

    this.dead = false;

  	// CollisionBox
  	this.collide_box = new Vector(_cw, _ch);
  	this.collidable = true;
  };



  get velocityVector(){ return this.position.subtract(this.last_position); }

  get x(){ return this.position.x - game.width / 2; }
  get y(){ return -this.position.y - game.height / 2; }
  set(x = this.position.x, y = this.position.y){
    this.position.set(x, y);
    this.last_position.set(x, y);
  };

  update(dt){

    const vel = this.velocityVector;
    this.last_position = this.position.clone();
    this.position = this.position.add(vel.scale(0.98 * dt));

    if(!this.last_position.compare(this.position)){
      this.last_angle = Math.atan2(this.velocityVector.x, this.velocityVector.y);
    }

    ++this.time;
  };

  draw(ctx){

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

  collide(e, chunk){
  	if(!this.collidable) return false;

  	// AABB
  	const er = e.position.x + e.collide_box.x / 2;
  	const el = e.position.x - e.collide_box.x / 2;

  	const et = e.position.y - e.collide_box.y / 2;
  	const eb = e.position.y + e.collide_box.y / 2;

  	const tr = this.position.x + this.collide_box.x / 2;
  	const tl = this.position.x - this.collide_box.x / 2;

  	const tt = (this.position.y + chunk.id * chunk.canvas.height) - this.collide_box.y / 2;
  	const tb = (this.position.y + chunk.id * chunk.canvas.height) + this.collide_box.y / 2;

  	return (el < tr && er > tl && et < tb && eb > tt);
  };
};

class Player extends Entity{

  constructor(game){
    super(
      game.sprite_buffer["player"],
      40, // Width,
      54, // Height
      6, // Total Frames
	    15,
	    15
    );

	this.lifes = 4;
    this.set(game.width/2, 20);
	this.invincible = 0;
	
	
	this.max_chunk = 0;
  };

  update(dt, chunk){
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
    if(this.velocityVector.length > 0.1){
      this.current_frame = Math.floor(this.time * this.velocityVector.length / 10) % this.total_frames;
    }


  	// Collision
  	let collision = false;
  	for(let i = 0; i < chunk.entities.length; ++i){
  		const e = chunk.entities[i];
  		if(!e.dead && e.collide(this, chunk)){
  			collision |= e.collision(this, collision);
  		}
  	}

	--this.invincible;
  	if(this.invincible < 0 && ((chunk instanceof Sea && !chunk.is_safe(this) && !collision) || (chunk instanceof Field && collision))){
  		this.collide();
  	}

    // Boundings
    this.position.y = Math.max(0, this.position.y);
    this.position.x = Math.max(0, Math.min(game.width, this.position.x));
	
	// Check if we go to an higher chunk
	if(chunk.id > this.max_chunk){
		this.max_chunk = chunk.id;
		game.points += 1000;
	}
  };

  draw(ctx){

	ctx.save();
		ctx.globalAlpha = Math.abs(Math.cos(Math.max(0.0, this.invincible) / 2));
		super.draw(ctx);
	ctx.restore();
  };
  
  collide(){
	if(--this.lifes < 0){
		game.draw = game.render_end;
	}
	this.invincible = 25;
  };
};

class Fly extends Entity{

  constructor(){
    super(
      game.sprite_buffer["fly"],
      43, // Width,
      32, // Height
      2, // Total Frames
	    15, // CollisionBox Width
	    15, // CollisionBox Height
    );
    this.time = Math.random() * 100;
  };

  update(dt){
    ++this.time;

    this.current_frame = (this.time >> 3) % this.total_frames;
  };

  draw(ctx){
    ctx.save();
      const scale = 1.0 + Math.abs(Math.cos(this.time / 10) * 0.5);
      //ctx.translate(-this.position.x, this.position.y);
      ctx.translate(this.position.x, -this.position.y);
      ctx.scale(scale, scale);
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

  collision(e){
    game.points += 100;
    this.dead = true;
    return false;
  };
};

class MovingEntity extends Entity{

  constructor(_s, _w, _h, _t, _cw, _ch){

    super(_s, _w, _h, _t, _cw, _ch);

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
      this.last_position.x = (!dv) * (game.width + this.width/2) + dv * (-this.width/2),
      undefined
    );
  };

  get velocity(){ return this.direction * this._velocity; };

  update(dt){
    super.update(dt);
    if(--this.current_delay < 0){
      this.position.x += this.velocity;
      if(this.position.x < -this.width/2 || this.position.x > (game.width + this.width/2)){
        this.restore();
      }
    }
  };

  draw(ctx){
    super.draw(ctx);
  };

};


class Log extends MovingEntity{

  constructor(n){
    super(
      game.sprite_buffer[`log${n}`],
      42 * n, // Width,
      42, // Height
      1, // Total Frames
  	  42 * n, // CollisionBox Width
  	  38 // CollisionBox Height
    );
  };

  update(dt){
    super.update(dt);

    this.last_angle = 0.0;
  };

  draw(ctx){
    super.draw(ctx);
  };

  collision(e, last_collide){
    if(!last_collide){
      e.position.x += this.velocity;
    }
    return true;
  };

};


class Turtle extends MovingEntity{

  constructor(){
    super(
      game.sprite_buffer["turtle"],
      50, // Width,
      50, // Height
      9, // Total Frames
	    40, // CollisionBox Width
	    40, // CollisionBox Height
    );
  };

  update(dt){
    super.update(dt);
    this.current_frame = Math.floor(Math.abs(Math.sin(this.time / 50)) * this.total_frames);
  };

  draw(ctx){
    super.draw(ctx);
  };

  collision(e, last_collide){
    if(!last_collide){
      e.position.x += this.velocity;
    }

    return (this.current_frame <= 7);
  };
};

class Car extends MovingEntity{

  constructor(){
    super(
      game.sprite_buffer["car"],
      98, // Width,
      49, // Height
      1, // Total Frames
	    60, // CollisionBox Width
	    40, // CollisionBox Height
    );

    this.current_frame = Math.floor(Math.random() * 3);
  };

  update(dt){
    super.update(dt);

    this.last_angle = (Math.sign(this.velocity) + 1) * H_PI + PI;
  };

  draw(ctx){
    super.draw(ctx);
  };

  collision(e){
      return true;
  };
};

class Truck extends MovingEntity{

  constructor(){
    super(
      game.sprite_buffer["truck"],
      201, // Width,
      47, // Height
      1, // Total Frames
	    170, // CollisionBox Width
	    40, // CollisionBox Height
    );
  };

  update(dt){
    super.update(dt);
    this.last_angle = (Math.sign(this.velocity) + 1) * H_PI + PI;
  };

  draw(ctx){
    super.draw(ctx);
  };

  collision(e){
    return true;
  };
};
