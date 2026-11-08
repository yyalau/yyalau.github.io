/*
  quiz-core.js - shared engine for the music quizzes.
  A page builds a QuizCore with hooks describing its question pool, choice UI,
  tap behaviour and answer evaluation. The engine owns screen switching, the
  (optional) per-question timer, the flow (start -> quiz -> result) and the
  end-of-round review table.

  Expected DOM ids (present in each quiz page):
    startScreen, quizScreen, resultScreen, startBtn, restartBtn,
    qIdx, qTotal, overallBar, prompt, choices, submitRow, submitBtn, liveHint,
    sec, bar (timer - hidden automatically when hasTimer is false),
    correctCount, totalCount, cc, wc, tbody
*/
(function () {
  'use strict';

  // ---------- shared pure helpers ----------
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function setEq(a, b) {
    if (a.length !== b.length) return false;
    var sa = a.slice().sort(), sb = b.slice().sort();
    return sa.every(function (v, i) { return v === sb[i]; });
  }

  function byId(id) { return document.getElementById(id); }

  // ---------- engine ----------
  function QuizCore(cfg) {
    this.totalQuestions = cfg.totalQuestions || 20;
    this.getPool = cfg.getPool;
    this.renderChoices = cfg.renderChoices;
    this.onTap = cfg.onTap;
    this.evalAnswer = cfg.evalAnswer;
    this.hintFor = cfg.hintFor || function (q) { return q.hint; };
    this.hasTimer = !!cfg.hasTimer;
    this.getTimeLimit = cfg.getTimeLimit || function () { return 30; };
    this.requireSelection = !!cfg.requireSelection;
    this.feedback = !!cfg.feedback;
    this.renderFeedback = cfg.renderFeedback;
    this.markChoices = cfg.markChoices;

    this.questions = [];
    this.current = 0;
    this.answers = [];
    this.selection = new Set();
    this.busy = false;
    this.feedbackPending = false;
    this.timer = null;
    this.timeLimitSec = 30;

    this._wire();
    this._initChrome();
  }

  QuizCore.prototype.choiceBtn = function (label, val, extra) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'choice' + (extra ? ' ' + extra : '');
    b.dataset.val = val;
    b.textContent = label;
    return b;
  };

  QuizCore.prototype._initChrome = function () {
    if (isFinite(this.totalQuestions)) {
      var qt = byId('qTotal'); if (qt) qt.textContent = this.totalQuestions;
      var tc = byId('totalCount'); if (tc) tc.textContent = this.totalQuestions;
    }
    if (!this.hasTimer) {
      var t = document.querySelector('.timer');
      if (t) t.classList.add('hidden');
    }
  };

  QuizCore.prototype._wire = function () {
    var self = this;
    var startBtn = byId('startBtn');
    if (startBtn) startBtn.addEventListener('click', function () { self.start(); });
    var restartBtn = byId('restartBtn');
    if (restartBtn) restartBtn.addEventListener('click', function () { self.backToStart(); });
    var submitBtn = byId('submitBtn');
    if (submitBtn) submitBtn.addEventListener('click', function () { self.submit(); });
    var choices = byId('choices');
    if (choices) choices.addEventListener('click', function (e) {
      var btn = e.target.closest('.choice');
      if (!btn || self.busy) return;
      self.onTap(self.questions[self.current], btn.dataset.val, self.selection);
      self._renderSelectionUI();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var qs = byId('quizScreen');
      if (!qs || qs.classList.contains('hidden')) return;
      self.submit();
    });
  };

  QuizCore.prototype.show = function (which) {
    byId('startScreen').classList.toggle('hidden', which !== 'start');
    byId('quizScreen').classList.toggle('hidden', which !== 'quiz');
    byId('resultScreen').classList.toggle('hidden', which !== 'result');
  };

  QuizCore.prototype.start = function () {
    var pool = this.getPool ? this.getPool() : [];
    if (!pool || pool.length === 0) return;
    this.timeLimitSec = this.getTimeLimit() || 30;
    this.questions = shuffle(pool);
    if (isFinite(this.totalQuestions)) {         // Infinity -> use every question (no cap)
      this.questions = this.questions.slice(0, this.totalQuestions);
    }
    this.current = 0;
    this.answers = [];
    var qt = byId('qTotal'); if (qt) qt.textContent = this.questions.length;
    var tc = byId('totalCount'); if (tc) tc.textContent = this.questions.length;
    this.show('quiz');
    this._renderQuestion();
  };

  QuizCore.prototype.backToStart = function () {
    this._stopTimer();
    this.show('start');
  };

  QuizCore.prototype._renderQuestion = function () {
    var self = this;
    var q = this.questions[this.current];
    this.busy = false;
    this.selection = new Set();
    this.feedbackPending = false;
    var fb = byId('feedback'); if (fb) fb.classList.add('hidden');
    byId('qIdx').textContent = (this.current + 1);
    byId('prompt').innerHTML = q.promptHTML;
    byId('liveHint').textContent = this.hintFor(q);
    byId('overallBar').style.width = (this.current / this.questions.length * 100) + '%';
    var ui = {
      choiceBtn: function (l, v, e) { return self.choiceBtn(l, v, e); },
      setSubmitLabel: function (t) { var sb = byId('submitBtn'); if (sb) sb.textContent = t; }
    };
    this.renderChoices(q, byId('choices'), ui);
    var sr = byId('submitRow'); if (sr) sr.classList.remove('hidden');
    this._renderSelectionUI();
    if (this.hasTimer) {
      this._updateTimer(this.timeLimitSec);
      this._startTimer();
    }
  };

  QuizCore.prototype._renderSelectionUI = function () {
    var self = this;
    document.querySelectorAll('#choices .choice').forEach(function (b) {
      b.classList.toggle('sel', self.selection.has(b.dataset.val));
    });
    if (this.requireSelection) {
      var sb = byId('submitBtn');
      if (sb) sb.disabled = this.selection.size === 0;
    }
  };

  QuizCore.prototype._startTimer = function () {
    var self = this;
    this._stopTimer();
    var start = Date.now();
    this.timer = setInterval(function () {
      var left = Math.max(0, self.timeLimitSec * 1000 - (Date.now() - start));
      self._updateTimer(left / 1000);
      if (left <= 0) { self._stopTimer(); self._onTimeout(); }
    }, 80);
  };
  QuizCore.prototype._stopTimer = function () {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  };
  QuizCore.prototype._updateTimer = function (leftSec) {
    var sec = byId('sec'); if (sec) sec.textContent = Math.ceil(leftSec);
    var bar = byId('bar');
    if (bar) {
      bar.style.width = (leftSec / this.timeLimitSec) * 100 + '%';
      if (leftSec <= this.timeLimitSec * 0.2) bar.style.background = 'var(--bad)';
      else if (leftSec <= this.timeLimitSec * 0.4) bar.style.background = 'var(--warn)';
      else bar.style.background = 'var(--good)';
    }
  };

  QuizCore.prototype.submit = function () {
    if (this.feedbackPending) {                // feedback shown -> button is "Next Question"
      this.feedbackPending = false;
      this._advance();
      return;
    }
    if (this.busy) return;
    if (this.selection.size === 0) return;     // nothing chosen -> ignore explicit submit
    this._recordAnswer();
  };
  QuizCore.prototype._recordAnswer = function () {
    var q = this.questions[this.current];
    var r = this.evalAnswer(q, this.selection);
    this._lockAnswer(q, r);
  };
  QuizCore.prototype._lockAnswer = function (q, r) {
    this.busy = true;
    this._stopTimer();
    this.answers.push({ raw: r.display, correct: r.correct, missed: false });
    if (this.feedback) {
      this.feedbackPending = true;
      this._renderFeedback(q, r);
    } else {
      this._advance();
    }
  };
  QuizCore.prototype._renderFeedback = function (q, r) {
    var fb = byId('feedback');
    if (fb) {
      fb.innerHTML = '';
      if (this.renderFeedback) {
        this.renderFeedback(q, r, fb);
      } else {
        var el = document.createElement('div');
        el.className = 'fb ' + (r.correct ? 'fb-ok' : 'fb-bad');
        el.innerHTML = '<b>' + (r.correct ? 'Correct!' : 'Not quite.') + '</b> ' +
          'The answer is <span class="given">' + escapeHtml(q.correctDisplay) + '</span>.';
        fb.appendChild(el);
      }
      fb.classList.remove('hidden');
    }
    if (this.markChoices) this.markChoices(q, r);
    var last = this.current >= this.questions.length - 1;
    var sb = byId('submitBtn');
    if (sb) sb.textContent = last ? 'See Results' : 'Next Question';
  };
  QuizCore.prototype._onTimeout = function () {
    if (this.busy) return;
    if (this.selection.size > 0) {              // picked something but didn't submit -> record it
      this._recordAnswer();
    } else {                                    // nothing picked -> counts as missing
      this.busy = true;
      this._stopTimer();
      this.answers.push({ raw: '', correct: false, missed: true });
      this._advance();
    }
  };
  QuizCore.prototype._advance = function () {
    this._stopTimer();
    this.current++;
    if (this.current >= this.questions.length) this._showResults();
    else this._renderQuestion();
  };

  QuizCore.prototype._showResults = function () {
    this.show('result');
    var correct = this.answers.filter(function (a) { return a.correct; }).length;
    var wrong = this.answers.length - correct;
    byId('correctCount').textContent = correct;
    byId('totalCount').textContent = this.answers.length;
    byId('cc').textContent = correct;
    byId('wc').textContent = wrong;
    var tbody = byId('tbody');
    tbody.innerHTML = '';
    this.questions.forEach(function (q, i) {
      var a = this.answers[i];
      var your = a.missed
        ? '<span class="your miss">(no answer)</span>'
        : '<span class="your">' + escapeHtml(a.raw) + '</span>';
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td class="num">' + (i + 1) + '</td>' +
        '<td class="qtext">' + escapeHtml(q.promptText) + '</td>' +
        '<td>' + your + '</td>' +
        '<td class="correct">' + escapeHtml(q.correctDisplay) + '</td>' +
        '<td class="status ' + (a.correct ? 'v' : 'x') + '">' + (a.correct ? 'V' : 'X') + '</td>';
      tbody.appendChild(tr);
    }, this);
  };

  // expose
  var root = typeof window !== 'undefined' ? window : globalThis;
  root.QuizCore = QuizCore;
  root.quizHelpers = { shuffle: shuffle, escapeHtml: escapeHtml, setEq: setEq };
})();
