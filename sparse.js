function createSparse() {
var sparse = {
  instrumentsLoaded: false,
  playOnLoad: true
};

sparse.init = function init() {
  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instruments: ['acoustic_grand_piano', 'acoustic_grand_piano'],
    callback: this.onInstrumentsLoaded.bind(this)
  });
};

sparse.onInstrumentsLoaded = function onInstrumentsLoaded() {
  this.instrumentsLoaded = true;
  if (this.playOnLoad) {
    this.play();
  }
  var msgEl = document.querySelector('#message');
  msgEl.innerText = 'Piano ready.';
  msgEl.classList.add('faded');
};

sparse.play = function play() {
  var delays = [0, 0]; // One per channel;

  function playNote(note, channel) {
    MIDI.noteOn(channel, note.pitch, note.velocity, delays[channel]);
    delays[channel] += note.duration;
  }

  var spewer = createRiffSpewer({
    beatSpan: ~~(Math.random() * 8),
    beatWobble: 0,
    rootPitch: 28, // E
    pitchRange: [28, 28 + 48],
    durationRange: [8, 64],
    pitchTransformer: majorKeyFitter(28)
  });

  if (!this.instrumentsLoaded) {
    this.playOnLoad = true;
    return;
  }

  this.playOnLoad = false;
  MIDI.programChange(0, 0);
  var riff = spewer.spew();

  for (var noteIndex = 0; noteIndex < riff.length; ++noteIndex) {
    var note1 = riff[noteIndex];
    playNote(note1, 0);
  }

  setTimeout(sparse.play.bind(sparse), 30000);
};


// scale should have an entry for all 12 half-steps, each either null or not 
// null.
function findClosest(scale, pitch) {
  var closest = null;
  for (var i = pitch; i >= 0; --i) {
    if (scale[i] !== null) {
      closest = i;
      break;
    }
  }

  return (closest !== null) ? closest : pitch;
}

function fitToPitch(pitch, scale) {
  var offset = pitch % 12;
  var base = ~~(pitch / 12) * 12;
  var newOffset = findClosest(scale, offset);
  console.log('In:', offset, 'Out:', newOffset);
  return base + newOffset;
}

// Just fits notes to the key – cannot do anything about whether the tonic 
// dominates.
function majorKeyFitter(tonic) {
  // 0, 2, 4, 5, 7, 9, 11
  var scale = [0, null, 2, null, 4, 5, null, 7, null, 9, null, 11];
  // Shift it to the tonic.
  var tonicMod = tonic % 12;
  scale = scale.concat(scale.splice(0, tonicMod));

  function fitToMajorKey(pitch) {
    return fitToPitch(pitch, scale);
  }

  return fitToMajorKey;
}

return sparse;
}

var sparse = createSparse();
sparse.init();
sparse.play();
