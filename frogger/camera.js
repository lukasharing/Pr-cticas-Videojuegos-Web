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
    this._p = entity.position;

    /* Camera Velocity */
    this._v = new Vector(0, 0);
  };

  get x(){ return this._p.x + game.width / 2; };
  get y(){ return this._p.y - game.height / 2; };

  /* Main Methods */
  restore(){
    this._zoom = 1;
    this._v = new Vector(0, 0);
    this.properties = {};
  };

  update(self){
    this._v = this._v.scale(CAMERA_FRICTION);
    this._p = this._p.add(this._v);

    const df = this._f.position.subtract(this._p);
    this._v = this._v.add(df).scale(1/3);
  };
}
