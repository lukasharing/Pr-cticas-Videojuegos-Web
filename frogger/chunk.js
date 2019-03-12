class Chunk{
  constructor(_m, _t){
    this.map   = _m;
    this.tiles = _t;
    this.canvas = 0;
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
    ctx.drawImage(this.canvas, 0, 0);
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
    ), game.sprite_buffer["water"]);
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
    ), game.sprite_buffer["road"]);
  };

  
};
