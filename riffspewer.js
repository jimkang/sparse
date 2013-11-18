function createRiffSpewer(riffOpts) {

/*
riffOpts should contain: {
  beatSpan: number,
  beatWobble: number,
  rootPitch: number,
  pitchRange: [],
  durationRange: []
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
    riff.push({
      pitch: Math.floor(Math.random() * noteRangeLength) + 
        this.opts.pitchRange[0],
      duration: 1.0/4,
      // Math.floor(Math.random() * durationRangeLength) + this.durationRange[0];
      velocity: 127
    });
  }
  return riff;
};

return riffSpewer;
}
