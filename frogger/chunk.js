class Chunk{
  constructor(_m, _t, _i){
    this.map    = _m;
    this.tiles  = _t;
    this.canvas = 0;
    this.id     = _i;
    this.entities = new Array();
    this.generate();
  };

  generate(){
    const w_tiles = 11, h_tiles = 5;

    this.canvas = document.createElement("canvas");
    this.canvas.width = w_tiles * 48;
    this.canvas.height = h_tiles * 48;

    const ctx = this.canvas.getContext("2d");
    for(let i = 0; i < w_tiles; ++i){
        for(let j = 0; j < h_tiles; ++j){
          ctx.drawImage(
            this.tiles,
            48 * this.map[j][i],
            0,
            48,
            48,
            i * 48,
            j * 48,
            48,
            48
          );
        }
    }

  };

  draw(ctx){
    ctx.save();
      ctx.translate(0, -(this.id + 1) * this.canvas.height);
      ctx.drawImage(this.canvas, 0, 0);

      ctx.translate(0, this.canvas.height);
      this.entities.forEach((e) => {
        if(!e.dead){
          e.draw(ctx);
        }
      });
    ctx.restore();
  };

  update(dt){
    this.entities.forEach((e) => {
      e.update(dt);
    });
  };

  is_safe(e){
  	const dsafe = e.position.y - this.id * this.canvas.height;

  	return (dsafe <= 48 || dsafe >= (this.canvas.height - 48));
  };

  put_flies(){
    const total = 1 + Math.floor(Math.random() * 3);
    for(let i = 0; i < total; ++i){
      const fly = new Fly();
      fly.set(Math.floor(Math.random() * 10 + 1) *  48, Math.floor(Math.random() * 2 + 2) *  48);
      this.entities.push(fly);
    }
  };
};


/* Templates */
class Sea extends Chunk{
  constructor(id){
    super(new Array(
      new Array(2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2),
      new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
    ), game.sprite_buffer["water"], id);

    for(let i = 0; i <= 3; ++i){
      const queue_direction = Math.round(Math.random()) * 2 - 1;
      const queue_velocity = Math.random() * 2 + 1;

      const entity_type = Math.random();
      if(entity_type < 0.3){
        const queue_timer = 50;
        for(let j = 0; j < 3; ++j){
          const turtle = new Turtle();
          turtle.set(
            undefined,
            48 * (i + 1)
          );
          turtle.setDelay(queue_timer * j);
          turtle.setVelocity(queue_velocity);
          turtle.setDirection(queue_direction);
          this.entities.push(turtle);
        }
      }else{
        const queue_timer = 80;
        const log_size = Math.round(Math.random()) + 2;
        for(let j = 0; j < 5 - log_size; ++j){
          const turtle = new Log(log_size);
          turtle.set(
            undefined,
            48 * (i + 1)
          );
          turtle.setDelay(queue_timer * j);
          turtle.setVelocity(queue_velocity);
          turtle.setDirection(queue_direction);
          this.entities.push(turtle);
        }
      }
    }
  };
};

class Field extends Chunk{
  constructor(id){
    super(new Array(
      new Array(2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2),
      new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
    ), game.sprite_buffer["road"], id);

    for(let i = 0; i <= 3; ++i){
      const queue_direction = Math.round(Math.random()) * 2 - 1;
      const queue_velocity = Math.random() * 2 + 2;

      const entity_type = Math.random();

      if(entity_type < 0.5){
        const queue_timer = 120;
        for(let j = 0; j < 2; ++j){
          const truck = new Truck();
          truck.set(
            undefined,
            48 * (i + 1)
          );

          truck.setDelay(queue_timer * j);
          truck.setVelocity(queue_velocity * 1.2);
          truck.setDirection(queue_direction);
          this.entities.push(truck);

        }
      }else{
        const queue_timer = 40;
        for(let j = 0; j < 3; ++j){
          const car = new Car();
          car.set(
            undefined,
            48 * (i + 1)
          );
          car.setDelay(queue_timer * j);
          car.setVelocity(queue_velocity);
          car.setDirection(queue_direction);
          this.entities.push(car);
        }
      }
    }

  };


};
