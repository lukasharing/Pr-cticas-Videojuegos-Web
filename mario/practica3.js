const unroll = (e) => [].concat.apply([], e.map(a => Object.values(a)));

const compiling = {
  audio: new Array(),
  sheet: new Array(),
};

const Q = window.Q = Quintus().include("Sprites, Scenes, Anim, 2D, TMX, Input, Audio").setup({
  width: 800, // Set the default width to 800 pixels
  height: 600, // Set the default height to 600 pixels
}).controls();
