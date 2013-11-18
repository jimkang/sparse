function createSandworm() {
var sandworm = {
  instrumentsLoaded: false,
  playOnLoad: true,
  riffSpewer: createRiffSpewer({
    beatSpan: 32,
    beatWobble: 0,
    rootPitch: 20,
    pitchRange: [16, 64],
    durationRange: [1, 4]
  })
};

sandworm.init = function init() {
  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instruments: [ "acoustic_grand_piano", "synth_drum" ],
    callback: this.onInstrumentsLoaded.bind(this)
  });
};

sandworm.onInstrumentsLoaded = function onInstrumentsLoaded() {
  this.instrumentsLoaded = true;
  if (this.playOnLoad) {
    this.play();
  }
  document.querySelector('#message').innerText = 'Instruments loaded.';
};

sandworm.play = function play() {
  if (this.instrumentsLoaded) {
    this.playOnLoad = false;
    MIDI.programChange(0, 0);

    var riff = this.riffSpewer.spew();
    var delay = 0;
    riff.forEach(function playNote(note) {
      MIDI.noteOn(0, note.pitch, note.velocity, delay);
      delay += note.duration;
    });
  }
  else {
    this.playOnLoad = true;
  }
}

return sandworm;
}

var sandworm = createSandworm();
sandworm.init();
sandworm.play();
