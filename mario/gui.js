Q.UI.Text.extend("Score", {
  init: function(p) {
    this._super({
      x: Q.width / 2,
      y: 30,
      label: "score: 0",
    });
    Q.state.on("change.score", this, "score");
  },

  score: function(score) {
    this.p.label = "score: " + score;
  }
});
