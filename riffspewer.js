function createRiffSpewer(riffOpts) {

/*
riffOpts should contain: {
  beatSpan: number,
  beatWobble: number,
  rootPitch: number,
  pitchRange: [],
  durationRange: []

  // Optional:
  pitchTransformer: function
}
*/ 

var riffSpewer = {
  opts: riffOpts,
};

riffSpewer.spew = function spew() {
  var riff = [];
  var noteRangeLength = this.opts.pitchRange[1] - this.opts.pitchRange[0] + 1;
  var durationRangeLength = this.opts.durationRange[1] - 
    this.opts.durationRange[0] + 1;

  for (var i = 0; i <= this.opts.beatSpan; ++i) {
    var pitch = Math.floor(Math.random() * noteRangeLength) + 
      this.opts.pitchRange[0];
    if (this.opts.pitchTransformer) {
      pitch = this.opts.pitchTransformer(pitch);
    }

    riff.push({
      pitch: pitch,
      duration: 
        ~~(Math.random() * durationRangeLength) + this.opts.durationRange[0],
      velocity: 127
    });
  }
  return riff;
};

return riffSpewer;
}
