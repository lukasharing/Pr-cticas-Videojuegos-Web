const compiling_sheets = new Array();

const Q = window.Q = Quintus().include("Sprites,Scenes,Anim,2D,TMX,Input").setup({
  width: 800, // Set the default width to 800 pixels
  height: 600, // Set the default height to 600 pixels
}).controls();
