/*
  instrument-quiz-data.js - question pool for the Instruments & Terms quiz.
  All questions are true/false. The data follows resources/instruments.md.

  Exposes buildInstrumentPool(shuffleFn?) -> [question] where each question is:
    { type, promptText, promptHTML, expected(Boolean), correctDisplay, hint }
  In the browser it also attaches to window; in Node it exports via module.exports
  so the pool can be unit-tested.
*/
(function (global) {
  'use strict';

  // ---------- reference data (from resources/instruments.md) ----------
  var INSTR = [
    { name: 'Violin',      family: 'string',   clefs: ['treble'],        transposing: false },
    { name: 'Viola',       family: 'string',   clefs: ['alto'],          transposing: false },
    { name: 'Cello',       family: 'string',   clefs: ['bass'],          transposing: false },
    { name: 'Double bass', family: 'string',   clefs: ['bass'],          transposing: true  },
    { name: 'Harp',        family: 'string',   clefs: ['treble','bass'], transposing: false },
    { name: 'Piccolo',     family: 'woodwind', clefs: ['treble'],        transposing: false, reed: 'none'   },
    { name: 'Flute',       family: 'woodwind', clefs: ['treble'],        transposing: false, reed: 'none'   },
    { name: 'Oboe',        family: 'woodwind', clefs: ['treble'],        transposing: false, reed: 'double' },
    { name: 'Clarinet',    family: 'woodwind', clefs: ['treble'],        transposing: true,  reed: 'single' },
    { name: 'Cor anglais', family: 'woodwind', clefs: ['treble'],        transposing: true,  reed: 'double' },
    { name: 'Bassoon',     family: 'woodwind', clefs: ['tenor','bass'],  transposing: false, reed: 'double' },
    { name: 'Trumpet',     family: 'brass',    clefs: ['treble'],        transposing: true  },
    { name: 'Horn',        family: 'brass',    clefs: ['treble','bass'], transposing: true  },
    { name: 'Trombone',    family: 'brass',    clefs: ['tenor','bass'],  transposing: false },
    { name: 'Tuba',        family: 'brass',    clefs: ['bass'],          transposing: false }
  ];
  // range orders, high -> low (harp excluded - its range spans the whole family)
  var STRING_RANGE = ['Violin', 'Viola', 'Cello', 'Double bass'];
  var BRASS_RANGE  = ['Trumpet', 'Horn', 'Trombone', 'Tuba'];

  var PERC = [
    { name: 'timpani',       definite: true  },
    { name: 'side drum',     definite: false },
    { name: 'bass drum',     definite: false },
    { name: 'cymbals',       definite: false },
    { name: 'triangle',      definite: false },
    { name: 'tambourine',    definite: false },
    { name: 'castanets',     definite: false },
    { name: 'tam-tam',       definite: false },
    { name: 'xylophone',     definite: true  },
    { name: 'marimba',       definite: true  },
    { name: 'glockenspiel',  definite: true  },
    { name: 'vibraphone',    definite: true  },
    { name: 'celesta',       definite: true  },
    { name: 'tubular bells', definite: true  }
  ];

  // choir voice types, high -> low
  var VOICES = ['soprano', 'mezzo-soprano', 'alto', 'tenor', 'baritone', 'bass'];

  var TERMS = [
    { term: 'pizzicato',      meaning: 'pluck the strings',                          families: ['strings'] },
    { term: 'arco',           meaning: 'play with the bow',                          families: ['strings'] },
    { term: 'sul ponticello', meaning: 'play with the bow close to the bridge',     families: ['strings'] },
    { term: 'up bow',         meaning: 'draw the bow upward across the strings',    families: ['strings'] },
    { term: 'down bow',       meaning: 'draw the bow downward across the strings',  families: ['strings'] },
    { term: 'sul G',          meaning: 'play on the G string',                      families: ['strings'] },
    { term: 'con sord.',      meaning: 'use a mute',                                 families: ['strings', 'brass', 'piano'] },
    { term: 'senza sord.',    meaning: 'remove the mute',                           families: ['strings', 'brass', 'piano'] },
    { term: 'una corda',      meaning: 'press the soft pedal',                      families: ['piano'] },
    { term: 'tre corde',      meaning: 'release the soft pedal',                    families: ['piano'] },
    { term: 'con pedale',     meaning: 'press the sustain pedal',                   families: ['piano'] },
    { term: 'senza pedale',   meaning: 'release the sustain pedal',                 families: ['piano'] },
    { term: 'mano sinistra',  meaning: 'play with the left hand',                   families: ['piano'] },
    { term: 'mano destra',    meaning: 'play with the right hand',                  families: ['piano'] },
    { term: 'arpeggiation',   meaning: 'spread the notes of a chord one after another', families: ['any'] },
    { term: 'slur',           meaning: 'play the notes without separation',         families: ['strings', 'woodwind', 'brass', 'piano', 'vocal'] }
  ];

  var HINT = 'Tap True or False, then press Submit (or Enter).';

  // ---------- formatting helpers ----------
  function cap1(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  // escape HTML, then turn **x** into a highlighted <span class="given">x</span>
  function fmt(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*([^*]+)\*\*/g, '<span class="given">$1</span>');
  }
  function plain(s) { return s.replace(/\*\*/g, ''); }
  function makeQ(type, marked, expected) {
    return {
      type: type,
      promptText: plain(marked),
      promptHTML: fmt(marked),
      expected: !!expected,
      correctDisplay: expected ? 'True' : 'False',
      hint: HINT
    };
  }

  function localShuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // ---------- build the full (capped, shuffled) pool ----------
  function buildInstrumentPool(shuffleFn, perType) {
    var shuffle = shuffleFn || (global.quizHelpers && global.quizHelpers.shuffle) || localShuffle;
    var PER_TYPE = (typeof perType === 'number' && perType >= 0) ? perType : 10;
    var t1 = [], t2 = [], t3 = [], t4 = [], t5 = [], t6 = [], t7 = [], t8 = [], t9 = [], t10 = [], t11 = [];
    var i, j;

    // type 1: <word> means to <meaning>
    for (i = 0; i < TERMS.length; i++) {
      var tr = TERMS[i];
      t1.push(makeQ(1, '**' + cap1(tr.term) + '** means to ' + tr.meaning + '.', true));
      var others = [];
      for (j = 0; j < TERMS.length; j++) { if (j !== i) others.push(TERMS[j]); }
      var wrong = others[Math.floor(Math.random() * others.length)];
      t1.push(makeQ(1, '**' + cap1(tr.term) + '** means to ' + wrong.meaning + '.', false));
    }

    // type 2: the <percussion> produces sounds of <definite/indefinite> pitch
    for (i = 0; i < PERC.length; i++) {
      var p = PERC[i];
      var ok2 = p.definite ? 'definite' : 'indefinite';
      var bad2 = p.definite ? 'indefinite' : 'definite';
      t2.push(makeQ(2, 'The **' + cap1(p.name) + '** produces sounds of **' + ok2 + '** pitch.', true));
      t2.push(makeQ(2, 'The **' + cap1(p.name) + '** produces sounds of **' + bad2 + '** pitch.', false));
    }

    // type 3: the <instrument> is a <string/brass/woodwind> instrument
    var fams = ['string', 'woodwind', 'brass'];
    for (i = 0; i < INSTR.length; i++) {
      var inst = INSTR[i];
      t3.push(makeQ(3, 'The **' + inst.name + '** is a **' + inst.family + '** instrument.', true));
      var wf = fams.filter(function (f) { return f !== inst.family; });
      var w = wf[Math.floor(Math.random() * wf.length)];
      t3.push(makeQ(3, 'The **' + inst.name + '** is a **' + w + '** instrument.', false));
    }

    // type 4: the <instrument> is a <transposing/non-transposing> instrument
    for (i = 0; i < INSTR.length; i++) {
      var ins = INSTR[i];
      var ok4 = ins.transposing ? 'transposing' : 'non-transposing';
      var bad4 = ins.transposing ? 'non-transposing' : 'transposing';
      t4.push(makeQ(4, 'The **' + ins.name + '** is a **' + ok4 + '** instrument.', true));
      t4.push(makeQ(4, 'The **' + ins.name + '** is a **' + bad4 + '** instrument.', false));
    }

    // type 5: <instrument> has a higher range than <instrument in the same family>
    function rangePairs(order) {
      for (i = 0; i < order.length; i++) {
        for (j = 0; j < order.length; j++) {
          if (i === j) continue;
          // order is high -> low, so i<j means order[i] sounds higher than order[j]
          t5.push(makeQ(5, 'The **' + order[i] + '** has a higher range than the **' + order[j] + '**.', i < j));
        }
      }
    }
    rangePairs(STRING_RANGE);
    rangePairs(BRASS_RANGE);

    // type 6: the <instrument> is the highest/lowest sounding <family> instrument
    function hiLo(order, family) {
      var highest = order[0], lowest = order[order.length - 1];
      for (i = 0; i < order.length; i++) {
        t6.push(makeQ(6, 'The **' + order[i] + '** is the highest sounding **' + family + '** instrument.', order[i] === highest));
        t6.push(makeQ(6, 'The **' + order[i] + '** is the lowest sounding **' + family + '** instrument.',  order[i] === lowest));
      }
    }
    hiLo(STRING_RANGE, 'string');
    hiLo(BRASS_RANGE, 'brass');

    // type 7: the <instrument> is a <single/double> reed instrument
    for (i = 0; i < INSTR.length; i++) {
      var iw = INSTR[i];
      if (iw.reed && iw.reed !== 'none') {
        var okr = iw.reed;
        var badr = okr === 'single' ? 'double' : 'single';
        t7.push(makeQ(7, 'The **' + iw.name + '** is a **' + okr + '** reed instrument.', true));
        t7.push(makeQ(7, 'The **' + iw.name + '** is a **' + badr + '** reed instrument.', false));
      } else if (iw.reed === 'none') {
        t7.push(makeQ(7, 'The **' + iw.name + '** is a **single** reed instrument.', false));
        t7.push(makeQ(7, 'The **' + iw.name + '** is a **double** reed instrument.', false));
      }
    }

    // type 8: the <voice> has a higher range than <voice>
    for (i = 0; i < VOICES.length; i++) {
      for (j = 0; j < VOICES.length; j++) {
        if (i === j) continue;
        // VOICES is high -> low, so i<j means VOICES[i] is higher
        t8.push(makeQ(8, 'The **' + cap1(VOICES[i]) + '** voice has a higher range than the **' + cap1(VOICES[j]) + '** voice.', i < j));
      }
    }

    // type 9: the <instrument> (sometimes) uses the <xxx> clef
    var CLEFS = ['treble', 'alto', 'tenor', 'bass'];
    for (i = 0; i < INSTR.length; i++) {
      var ic = INSTR[i];
      for (j = 0; j < CLEFS.length; j++) {
        var uses = ic.clefs.indexOf(CLEFS[j]) !== -1;
        t9.push(makeQ(9, 'The **' + ic.name + '** uses the **' + CLEFS[j] + '** clef.', uses));
      }
    }

    // type 10: <word> can be used in <instrument/family>
    var FAM10 = [
      { key: 'strings',    phrase: 'string instruments' },
      { key: 'brass',      phrase: 'brass instruments' },
      { key: 'woodwind',   phrase: 'woodwind instruments' },
      { key: 'piano',      phrase: 'the piano' },
      { key: 'vocal',      phrase: 'vocal music' },
      { key: 'percussion', phrase: 'percussion instruments' }
    ];
    function applies(term, key) {
      return term.families.indexOf('any') !== -1 || term.families.indexOf(key) !== -1;
    }
    for (i = 0; i < TERMS.length; i++) {
      var tt = TERMS[i];
      for (j = 0; j < FAM10.length; j++) {
        t10.push(makeQ(10, '**' + cap1(tt.term) + '** can be used in ' + FAM10[j].phrase + '.', applies(tt, FAM10[j].key)));
      }
    }
    // curated specific-instrument statements (match the spec's examples)
    t10.push(makeQ(10, 'A **double bass** may be played **pizzicato**.', true));
    t10.push(makeQ(10, '**Pizzicato** can be used in the **violin**.', true));
    t10.push(makeQ(10, '**Pizzicato** can be used in the **trumpet**.', false));
    t10.push(makeQ(10, '**Una corda** can be used in the **violin**.', false));
    t10.push(makeQ(10, '**Con sord.** can be used in the **trumpet**.', true));
    t10.push(makeQ(10, '**Arco** can be used in the **flute**.', false));

    // type 11: the <instrument> can only play one note at a time
    // (winds & brass are monophonic; strings are polyphonic)
    for (i = 0; i < INSTR.length; i++) {
      var im = INSTR[i];
      var mono = (im.family === 'woodwind' || im.family === 'brass');
      t11.push(makeQ(11, 'The **' + im.name + '** can only play one note at a time.', mono));
    }

    // cap each type so no single type dominates a round, then shuffle
    var groups = [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11];
    var capped = groups.map(function (g) { return PER_TYPE === Infinity ? g.slice() : shuffle(g).slice(0, PER_TYPE); });
    var flat = [];
    for (i = 0; i < capped.length; i++) {
      for (j = 0; j < capped[i].length; j++) flat.push(capped[i][j]);
    }
    return shuffle(flat);
  }

  global.buildInstrumentPool = buildInstrumentPool;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildInstrumentPool: buildInstrumentPool };
  }
})(typeof window !== 'undefined' ? window : globalThis);
