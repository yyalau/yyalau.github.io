/*
  glossary-quiz-data.js - question pool for the Music Terms (Glossary) quiz.
  Data follows resources/glossaryV2.md. Questions are multiple choice (4 options).

  Exposes buildGlossaryPool(grade, langs) -> [question] where each question is:
    { promptText, promptHTML, correctDisplay, correctVal, options[4], hint }
  Every question is "What does <term> mean?" with 4 meaning options.
  In the browser it also attaches to window; in Node it exports via module.exports
  so the pool can be unit-tested.
*/
(function (global) {
  'use strict';

  // ---------- reference data (from resources/glossaryV2.md) ----------
  // t = term, m = short clean meaning used for the options.
  var GLOSSARY = {
    '1': {
      italian: [
        { t: 'a tempo',           m: 'in time' },
        { t: 'accelerando',       m: 'getting faster' },
        { t: 'adagio',            m: 'slow and leisurely' },
        { t: 'allegretto',        m: 'moderately fast' },
        { t: 'allegro',           m: 'quick and cheerful' },
        { t: 'andante',           m: 'at a walking pace' },
        { t: 'cantabile',         m: 'in a singing style' },
        { t: 'crescendo',         m: 'getting louder' },
        { t: 'da capo',           m: 'repeat from the beginning' },
        { t: 'decrescendo',       m: 'getting softer' },
        { t: 'diminuendo',        m: 'getting softer' },
        { t: 'dolce',             m: 'gentle and sweet' },
        { t: 'forte (f)',         m: 'loud' },
        { t: 'fortissimo (ff)',   m: 'very loud' },
        { t: 'fine',              m: 'the end' },
        { t: 'legato',            m: 'smoothly' },
        { t: 'mezzo forte (mf)',  m: 'moderately loud' },
        { t: 'moderato',          m: 'at a moderate speed' },
        { t: 'mezzo piano (mp)',  m: 'moderately soft' },
        { t: 'piano (p)',         m: 'soft' },
        { t: 'pianissimo (pp)',   m: 'very soft' },
        { t: 'rallentando',       m: 'slowing down' },
        { t: 'ritardando',        m: 'slowing down' },
        { t: 'staccato',          m: 'short and detached' }
      ]
    },
    '2': {
      italian: [
        { t: 'alla marcia',      m: 'in the manner of a march' },
        { t: 'allargando',       m: 'getting slower and louder' },
        { t: 'con moto',         m: 'with movement' },
        { t: 'con (col)',        m: 'with' },
        { t: 'dal segno (D.S.)', m: 'play from the sign' },
        { t: 'e (ed)',           m: 'and' },
        { t: 'espressivo',       m: 'expressive' },
        { t: 'fortepiano (fp)',  m: 'loud then immediately soft' },
        { t: 'grave',            m: 'very slow and solemn' },
        { t: 'grazioso',         m: 'graceful' },
        { t: 'largo',            m: 'slow and stately' },
        { t: 'lento',            m: 'slow' },
        { t: 'ma',               m: 'but' },
        { t: 'meno',             m: 'less' },
        { t: 'meno mosso',       m: 'slower' },
        { t: 'molto',            m: 'very' },
        { t: 'non troppo',       m: 'not too much' },
        { t: 'più',              m: 'more' },
        { t: 'più mosso',        m: 'more quickly' },
        { t: 'poco a poco',      m: 'little by little' },
        { t: 'presto',           m: 'fast' },
        { t: 'ritenuto',         m: 'immediately slower' },
        { t: 'senza',            m: 'without' },
        { t: 'vivace (vivo)',    m: 'lively' }
      ]
    },
    '3': {
      italian: [
        { t: 'agitato',          m: 'agitated' },
        { t: 'andantino',        m: 'slightly faster than andante' },
        { t: 'animato',          m: 'animated' },
        { t: 'ben (bene)',       m: 'well' },
        { t: 'con forza',        m: 'with force' },
        { t: 'energico',         m: 'energetic' },
        { t: 'giocoso',          m: 'playful' },
        { t: 'leggiero',         m: 'lightly' },
        { t: 'maestoso',         m: 'majestic' },
        { t: 'marcato',          m: 'marked and accented' },
        { t: 'pesante',          m: 'heavy' },
        { t: 'prestissimo',      m: 'very fast' },
        { t: 'prima (primo)',    m: 'first' },
        { t: 'risoluto',         m: 'resolute' },
        { t: 'scherzando',       m: 'jokingly' },
        { t: 'semplice',         m: 'simple' },
        { t: 'sempre',           m: 'always' },
        { t: 'sforzando (sfz)',  m: 'with sudden emphasis' },
        { t: 'simile',           m: 'in the same way' },
        { t: 'sostenuto',        m: 'sustained' },
        { t: 'subito',           m: 'suddenly' },
        { t: 'tranquillo',       m: 'calm' },
        { t: 'triste',           m: 'sad' }
      ]
    },
    '4': {
      italian: [
        { t: 'affettuoso',    m: 'tender and affectionate' },
        { t: 'alla breve',    m: 'cut time (2/2)' },
        { t: 'amabile',       m: 'pleasant and amiable' },
        { t: 'appassionato',  m: 'passionate' },
        { t: 'assai',         m: 'very' },
        { t: 'come prima',    m: 'as before' },
        { t: 'comodo',        m: 'comfortable and leisurely' },
        { t: 'tempo comodo',  m: 'at a comfortable speed' },
        { t: 'con brio',      m: 'with vigour' },
        { t: 'deciso',        m: 'decisively' },
        { t: 'larghetto',     m: 'quite slow' },
        { t: 'mesto',         m: 'sad and mournful' },
        { t: 'misterioso',    m: 'mysterious' },
        { t: 'ritmico',       m: 'rhythmical' },
        { t: 'rubato',        m: 'with flexible timing' },
        { t: 'stringendo',    m: 'getting faster' }
      ]
    },
    '5': {
      italian: [
        { t: 'a niente',      m: 'fading to nothing' },
        { t: 'ad libitum',    m: 'at will, optional' },
        { t: 'attacca',       m: 'go straight on' },
        { t: 'cantando',      m: 'singing' },
        { t: 'con dolore',    m: 'in a sad manner' },
        { t: 'con spirito',   m: 'in a lively manner' },
        { t: 'doloroso',      m: 'sorrowful' },
        { t: 'largamente',    m: 'broadly' },
        { t: 'morendo',       m: 'dying away' },
        { t: 'perdendosi',    m: 'dying away' },
        { t: 'quasi',         m: 'almost' },
        { t: 'rinforzando',   m: 'reinforcing' },
        { t: 'smorzando',     m: 'dying away' },
        { t: 'sonoro',        m: 'resonant' },
        { t: 'sotto voce',    m: 'in an undertone' }
      ],
      french: [
        { t: 'animé',  m: 'lively' },
        { t: 'douce',  m: 'gentle and sweet' },
        { t: 'lent',   m: 'slow' },
        { t: 'modéré', m: 'at a moderate speed' },
        { t: 'retenu', m: 'held back' },
        { t: 'vite',   m: 'fast' }
      ],
      german: [
        { t: 'langsam', m: 'slow' },
        { t: 'lebhaft', m: 'lively' },
        { t: 'mässig',  m: 'at a moderate speed' },
        { t: 'ruhig',   m: 'peaceful and calm' },
        { t: 'schnell', m: 'fast' },
        { t: 'traurig', m: 'sad' }
      ]
    }
  };

  // ---------- helpers ----------
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function localShuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function shuffle(arr) {
    var f = (global.quizHelpers && global.quizHelpers.shuffle) || localShuffle;
    return f(arr);
  }

  function uniqueMeanings(terms) {
    var seen = {}, out = [];
    terms.forEach(function (x) {
      if (!seen[x.m]) { seen[x.m] = true; out.push(x.m); }
    });
    return out;
  }

  var HINT = 'Pick the one best answer, then press Submit (or Enter).';

  // ---------- build the pool ----------
  function buildGlossaryPool(grade, langs) {
    var g = GLOSSARY[grade];
    if (!g) return [];
    var terms = [];
    (langs || []).forEach(function (lang) {
      var list = g[lang];
      if (list) {
        list.forEach(function (x) { terms.push({ t: x.t, m: x.m, lang: lang }); });
      }
    });
    if (terms.length === 0) return [];

    // full per-language glossaries (all grades) used as distractor pools, so
    // options stay within the same language but feel related across grades.
    var LANGS = ['italian', 'french', 'german'];
    var fullByLang = {};
    LANGS.forEach(function (lang) {
      var all = [];
      Object.keys(GLOSSARY).forEach(function (gr) {
        var list = GLOSSARY[gr][lang];
        if (list) {
          list.forEach(function (x) { all.push({ t: x.t, m: x.m, lang: lang }); });
        }
      });
      fullByLang[lang] = all;
    });

    var pool = [];

    // every question: term -> meaning (options are related meanings, same language)
    terms.forEach(function (term) {
      var candidates = uniqueMeanings(fullByLang[term.lang])
        .filter(function (m) { return m !== term.m; });
      var distractors = shuffle(candidates).slice(0, 3);
      pool.push({
        promptHTML: 'What does <span class="given">' + esc(term.t) + '</span> mean?',
        promptText: 'What does ' + term.t + ' mean?',
        correctDisplay: term.m,
        correctVal: term.m,
        options: [term.m].concat(distractors),
        hint: HINT
      });
    });

    return pool;
  }

  global.buildGlossaryPool = buildGlossaryPool;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildGlossaryPool: buildGlossaryPool, GLOSSARY: GLOSSARY };
  }
})(typeof window !== 'undefined' ? window : globalThis);
