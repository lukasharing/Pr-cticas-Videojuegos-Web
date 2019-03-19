const CHUNK_AHEAD = 2;

const fill = (char, num, string) => new Array(Math.max(0, num - string.length)).fill(char).join("") + string;

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
		this.points = 0;
		this.anim_points = 0;

		this.player = null;

		// Map Chunk queue
		this.chunks = new Array();

		this.load_sprites().then(e => {
			//this.render_background();

			this.generate_log(2);
			this.generate_log(3);
			this.generate_log(4);

			// Add Player to the game
			this.player = new Player(this);
			this.camera = new Camera(this.player);
			this.update_chunks();
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
			this.load_image("log3", "./images/log.png"),
			this.load_image("car", "./images/cars.png"),
			this.load_image("truck", "./images/truck.png"),
			this.load_image("fly", "./images/fly.png"),
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
			this.draw(time);

		}


		this.request = requestAnimationFrame((dt) => this.play(dt));
	};


	update_chunks(dt){
		const btm = Math.floor(this.camera._p.y / (48 * 5));
		const top = Math.floor((this.camera._p.y + this.height) / (48 * 5)) + CHUNK_AHEAD;

		for(let i = btm; i < top; i++){
			if(this.chunks[i] == null){
				const rnd = Math.random();
				let terrain = 0;
				if(rnd < 0.5){
					terrain = new Sea(i);
				}else{
					terrain = new Field(i);
				}
				terrain.put_flies();
				this.chunks[i] = terrain;
			}else{
				this.chunks[i].update(dt);
			}
		}

	};


	generate_log(n){
		const log = document.createElement("canvas");
		const ctx = log.getContext("2d");
		log.width = 42 * n;
		log.height = 42;

		ctx.drawImage(this.sprite_buffer[`log3`], 0, 0, 42, 42, 0, 0, 42, 42);
		for(let i = 1; i < (n - 1); ++i){
			ctx.drawImage(this.sprite_buffer[`log3`], 42, 0, 42, 42, 42 * i, 0, 42, 42);
		}
		ctx.drawImage(this.sprite_buffer[`log3`], 84, 0, 42, 42, 42 * (n - 1), 0, 42, 42);

		this.sprite_buffer[`log${n}`] = log;
	};

	update(dt){
		this.update_chunks(dt);

		if(this.draw.name == "render_title") return;

		this.camera.update(dt);
		const chunk = this.chunks[Math.floor(this.player.position.y / (48 * 5))];
		this.player.update(dt, chunk);
	};

	render_title(time){

		//this.ctx.drawImage(this.map, 0, 0);
		const logo = this.sprite_buffer["logo"];
		this.ctx.drawImage(logo, (this.width - logo.width) / 2, 150);

		this.ctx.font = "bold 30px Verdana";
		this.ctx.textAlign = "center";
		this.ctx.strokeStyle = "white";
		this.ctx.save();
			this.ctx.translate(this.width / 2, 400);
			const anim_scl = 1.0 - Math.cos(time / 200) / 8;
			this.ctx.scale(anim_scl, anim_scl)
			this.ctx.fillText("Press Space to play!", 0, 0);
			this.ctx.strokeText("Press Space to play!", 0, 0);
		this.ctx.restore();

		this.ctx.font = "bold 20px Verdana";
		this.ctx.textAlign = "center";
		this.ctx.strokeStyle = "white";
		this.ctx.save();
			this.ctx.translate(this.width / 2, this.height - 20);
			this.ctx.fillText("Game done by Lukas Haring", 0, 0);
			this.ctx.strokeText("Game done by Lukas Haring", 0, 0);
		this.ctx.restore();

		if(this.getKey("Space")){
			this.draw = this.render_game;
		}

	};

	render_chunks(time){
		const btm = Math.floor(this.camera._p.y / (48 * 5));
		const top = Math.floor((this.camera._p.y + this.height) / (48 * 5));

		for(let i = btm; i <= top; i++){
			this.chunks[i].draw(this.ctx);
		}
		this.player.draw(this.ctx);
	};

	render_game(){

		this.ctx.save();
			this.ctx.translate(this.camera.x, this.camera.y);
			this.render_chunks();
		this.ctx.restore();


		// Menu
		this.anim_points += Math.max(0, this.points - this.anim_points) / 3;
		const points = "Points: " + fill("0", 8, Math.round(this.anim_points).toString());
		this.ctx.textAlign = "left";
		this.ctx.fillStyle = "white";
		this.ctx.strokeStyle = "black";
		this.ctx.font = "bold 30px Arial";
		this.ctx.save();
			this.ctx.translate(20, 30);
			this.ctx.fillText(points, 0, 0);
			this.ctx.strokeText(points, 0, 0);
		this.ctx.restore();
	};

};
