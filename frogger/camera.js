/*  _-_      _-_      _-__-_   _-__-__-__-__-__-__-__-_
    _-_      _-_      _-__-_   _-__-_      _-__-_
    _-_      _-_      _-__-__-_   _-_      _-__-_
    _-_      _-_      _-__-__-_   _-__-__-__-__-__-__-_
    _-__-__-__-__-__-__-__-_   _-__-_      _-_      _-_
    _-__-__-__-__-__-__-__-_   _-__-_      _-__-__-__-_
    ***************************************************
    ***************************************************
    This content is coded by Lukas Häring García and the
    idea is taken from some other hacking programs.
*/
const CAMERA_FRICTION = 0.94;

// Zoom CONSTANTS
const MIN_ZOOM = 4;
const MAX_ZOOM = 0.16;

class Camera{
  constructor(entity){
    /* Following */
    this._f = entity;

    /* Camera Coordinates */
    this._p = new Vector(game.width / 2, 0);

    /* Camera Velocity */
    this._v = new Vector(0, 0);
  };

  get x(){ return this._p.x - game.width / 2; };
  get y(){ return this._p.y + game.height; };

  /* Main Methods */
  restore(){
    this._zoom = 1;
    this._v = new Vector(0, 0);
    this.properties = {};
  };

  update(self){
    if(this._f.position.y > game.height / 2){
      this._v = this._v.scale(CAMERA_FRICTION);
      this._v.x = 0;
      this._p.x = game.width / 2;

      const df = this._f.position.y - (this._p.y + game.height / 2);
      this._v.y += df;
      this._v.y *= 1/3;
    }
    this._p.y = Math.max(0, this._p.y + this._v.y);
  };
}
