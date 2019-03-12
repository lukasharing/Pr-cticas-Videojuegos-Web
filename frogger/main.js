var game;

window.onload = () => {

	game = new Frogger(function(self){

		// Callback
		// KeyDown
		document.addEventListener("keydown", (e) => {
			self.keymap[e.code] = true;
		});

		document.addEventListener("keyup", (e) => {
			self.keymap[e.code] = false;
		});

	});

};
