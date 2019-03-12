class Frogger{

	constructor(callback){
		const canvas = document.getElementById("game");
		this.width = canvas.width = 528;
		this.height = canvas.height = 625;
		this.ctx = canvas.getContext("2d");

		// KeyBoard
		this.keymap = {};

		this.fps = 0;
		this.max_frame = 1000/30;
		this.last_time = 0;
		this.request = null;

		this.sprite_buffer = {};

		this.draw = this.render_title;

		// Entities
		this.entities = new Array(1);

		// Map Chunk queue
		this.chunks = new Array();

		this.load_sprites().then(e => {
			//this.render_background();

			// Add Player to the game
			this.entities[0] = new Player(this);
			this.camera = new Camera(this.entities[0]);
			this.chunks[0] = new Sea(0);
			//this.entities[1] = new Turtle(this);

			callback(this);
			this.play();
		});
	};

	getKey(code){ return (this.keymap[code] || false); };

	load_image(name, src){
		return new Promise((ok, bad) => {
			const img = new Image();
			img.onload = () => {
				this.sprite_buffer[name] = img;
				ok();
			};
			img.onerror = () => bad();
			img.src = src;
		});
	};

	load_sprites(){
		return Promise.all([
			this.load_image("player", "./images/frog.png"),
			this.load_image("turtle", "./images/turtle.png"),
			this.load_image("logo", "./images/logo.png"),
			this.load_image("road", "./images/road.png"),
			this.load_image("water", "./images/water.png"),
		]);
	};

	play(time = 0.0){


		const now = performance.now();
		const delta = now - this.last_time;
		if(delta >= this.max_frame){

			this.last_frame = now - (delta % this.max_frame);
			this.fps = 1000 / (time - this.last_time);
			this.last_time = time;
			//console.log(df);
			this.ctx.clearRect(0, 0, this.width, this.height);

			const dt = 1 / this.fps;

			this.update(dt);
			this.draw(this.current_frame);

		}


		this.request = requestAnimationFrame((dt) => this.play(dt));
	};

	update(dt){

		this.camera.update();

		this.entities.forEach( e => e.update(dt) );
	};

	render_title(dt){

		//this.ctx.drawImage(this.map, 0, 0);
		const logo = this.sprite_buffer["logo"];
		this.ctx.drawImage(logo, (this.width - logo.width) / 2, 150);

		this.ctx.font = "bold 30px Verdana";
		this.ctx.textAlign = "center";
		this.ctx.strokeStyle = "white";
		this.ctx.save();
			this.ctx.translate(this.width / 2, 400);
			const anim_scl = 1.0 - Math.cos(dt / 10) / 8;
			this.ctx.scale(anim_scl, anim_scl)
			this.ctx.fillText("Press Space to play!", 0, 0);
			this.ctx.strokeText("Press Space to play!", 0, 0);
		this.ctx.restore();

		this.render_game();
	};

	render_game(){

		this.ctx.save();
			this.ctx.translate(this.camera.x, -this.camera.y);
			this.chunks[0].draw(this.ctx);
			this.entities.forEach( e => e.draw(this.ctx) );
		this.ctx.restore();
	};

};
