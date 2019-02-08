/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {
  this.graphics    = gs;
  this.state       = "";
  this.total_flip  = 0;
  this.cards       = new Array(16);
  this.cards_name  = Object.keys(gs.maps).filter(a => a !== "back");

  this.first_card  = -1;
  this.second_card = -1;

  let self = this;
  this.initGame = function(){
    // Init cards
    for(let i = 0; i < 8; ++i){
      self.cards[(i << 0x1)]       = i;
      self.cards[(i << 0x1) | 0x1] = i;
    }

    // Random Swaps
    const random_int = function(a){ return Math.floor(Math.random() * a); };
    for(let i = 0; i < 16; ++i){
      const card1 = random_int(16);
      const card2 = random_int(16);
      [self.cards[card1], self.cards[card2]] = [self.cards[card2], self.cards[card1]]; // ES6 Swap
    }
    self.cards.forEach((e, i) => { self.cards[i] = new MemoryGameCard(this.cards_name[e], i); });
  };

  this.onClick = function(e){
    // If not out of index.
    if(e < 0 || e > 15) return;

    // Check if animations did finish
    if((this.first_card >= 0 && !this.cards[this.first_card].isflip()) ||
       (this.second_card >= 0 && !this.cards[this.second_card].isflip())) return;

    if(this.first_card > 0 && this.second_card > 0){
      this.first_card  = -1;
      this.second_card = -1;
    }

    if(this.first_card < 0){
      this.first_card = e;
    }else{
      this.second_card = e;
    }

    if(this.first_card > 0 && this.second_card > 0){
      if(this.first_card === this.second_card){
        this.cards[this.second_card].flip = true;
        this.cards[this.first_card].flip = true;
      }else{
        this.cards[this.first_card].time = 1.0;
        this.cards[this.second_card].time = 1.0;
      }
    }

  };

  this.draw = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let j = 0; j < 4; ++j){
      for(let i = 0; i < 4; ++i){
        let id = i + j * 4;
        self.cards[id].draw(self.graphics, id, self.first_card, self.second_card);
      }
    }
  };

};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id, ix) {
  this.sprite = id;
  this.flip   = false;
  this.index  = ix;
  this.time   = 1.0;

  this.isflip = function(){ return (this.time == -1.0 || this.flip); };

  let self = this;
  this.draw = function(gfx, id, first, second) {

    if(first == this.index || second == this.index){
      this.time = Math.max(-1.0, this.time - 0.1);
    }

    if(this.time >= 0.0){
      gfx.draw("back", id, this.time);
    }else{
      gfx.draw(self.sprite, id, -this.time);
    }
  };

  this.compare = function(a) { return (self.sprite == a.sprite); };
};
