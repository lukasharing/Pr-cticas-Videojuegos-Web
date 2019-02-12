/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */

 let animation = false;
MemoryGame = function(gs) {
  this.graphics    = gs;
  this.state       = "";
  this.total_flip  = 0;
  this.cards       = new Array(16);
  this.cards_name  = Object.keys(gs.maps).filter(a => a !== "back");

  this.first_card  = -1;
  this.second_card = -1;

  this.game_title = "Memory Game";

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
    // If not out of index
    if(e == null || e < 0 || e > 15 || animation || this.cards[e].flip) return;

		if(this.first_card < 0){
			this.first_card = e;
      self.cards[e].time = 1.0;
		}else if(this.second_card < 0 && this.first_card !== e){
			this.second_card = e;
      self.cards[e].time = 1.0;
		}

		if(this.first_card >= 0 && this.second_card >= 0){
      animation = true;
      setTimeout(function(){
        animation = false;
        console.log(self.cards[self.first_card].sprite, self.cards[self.second_card].sprite);
  			if(self.cards[self.first_card].compare(self.cards[self.second_card])){
  				self.cards[self.first_card].flip = true;
  				self.cards[self.second_card].flip = true;
          self.total_flip += 2;
          self.game_title = "Match Found!!";
          if(self.total_flip == self.cards.length){
            self.game_title = "You Win!";
          }
  			}else{
          self.game_title = "Try Again";
        }
  			self.first_card = -1;
  			self.second_card = -1;
      }, 800);
		}

  };

  this.draw = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    self.graphics.drawMessage(self.game_title);

    for(let j = 0; j < 4; ++j){
      for(let i = 0; i < 4; ++i){
        let id = i + j * 4;
        self.cards[id].draw(self.graphics, self.first_card, self.second_card);
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

  let self = this;
  this.draw = function(gfx, first, second) {


    if(this.flip || first == this.index || second == this.index){
      this.time = Math.max(0.0, this.time - 0.1);
      if(this.time >= 0.5){
        gfx.draw("back", this.index, this.time);
      }else{
        gfx.draw(self.sprite, this.index, 1.0 - this.time);
      }

    }else{
      gfx.draw("back", this.index, 1.0);
    }
  };

  this.compare = function(a) { return (self.sprite == a.sprite); };
};
