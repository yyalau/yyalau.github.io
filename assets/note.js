/* note.js - theme picker, table of contents and reading progress for note pages */
(function () {
    'use strict';
    var doc = document;
    var content = doc.getElementById('content');
    var toc = doc.getElementById('toc');
    var tocToggle = doc.getElementById('tocToggle');
    var label = doc.getElementById('progressLabel');
    var bar = doc.getElementById('progressBar');
    var themeSelect = doc.getElementById('themeSelect');

    /* --- theme picker (persisted per device) --- */
    themeSelect.value = doc.documentElement.getAttribute('data-theme') || 'dark';
    themeSelect.onchange = function () {
        doc.documentElement.setAttribute('data-theme', themeSelect.value);
        try { localStorage.setItem('note-theme', themeSelect.value); } catch (e) {}
    };

    /* --- collect headings, numbered like the CSS counters (1, 1.1, ...) --- */
    var heads = [];
    var links = [];
    var nodes = content.querySelectorAll('h2, h3');
    var h2n = 0;
    var h3n = 0;
    var usedIds = {};
    var i;
    for (i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var level = el.tagName === 'H2' ? 2 : 3;
        var num;
        if (level === 2) { h2n++; h3n = 0; num = String(h2n); }
        else { h3n++; num = h2n + '.' + h3n; }
        if (!el.id) {
            var base = el.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
            var id = base;
            var n = 2;
            while (usedIds[id] || doc.getElementById(id)) { id = base + '-' + n; n++; }
            el.id = id;
        }
        usedIds[el.id] = true;
        heads.push({ el: el, level: level, num: num, text: el.textContent, h2num: h2n });

        var a = doc.createElement('a');
        a.href = '#' + el.id;
        a.className = level === 2 ? 'toc-h2' : 'toc-h3';
        var numSpan = doc.createElement('span');
        numSpan.className = 'toc-num';
        numSpan.textContent = num;
        a.appendChild(numSpan);
        a.appendChild(doc.createTextNode(el.textContent));
        toc.appendChild(a);
        links.push(a);
    }

    if (heads.length === 0) {
        tocToggle.style.display = 'none';
        label.style.display = 'none';
    }

    /* --- contents drawer --- */
    function setToc(open) {
        toc.className = open ? 'toc open' : 'toc';
        tocToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    tocToggle.onclick = function () {
        setToc(toc.className.indexOf('open') === -1);
    };
    toc.onclick = function (e) {
        var t = e.target;
        while (t && t !== toc) {
            if (t.tagName === 'A') { setToc(false); return; }
            t = t.parentNode;
        }
    };
    doc.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) { setToc(false); }
    });
    doc.addEventListener('click', function (e) {
        if (toc.className.indexOf('open') !== -1 && !toc.contains(e.target) && e.target !== tocToggle) {
            setToc(false);
        }
    });

    /* --- reading progress + current-section label + scroll spy --- */
    var activeLink = null;
    function update() {
        var scrollTop = window.pageYOffset || doc.documentElement.scrollTop;
        var max = doc.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? Math.min(100, Math.max(0, scrollTop / max * 100)) : 100) + '%';

        var current = null;
        var j;
        for (j = 0; j < heads.length; j++) {
            if (heads[j].el.getBoundingClientRect().top <= 90) { current = heads[j]; }
            else { break; }
        }

        if (activeLink) { activeLink.className = activeLink.className.replace(' active', ''); }
        activeLink = null;
        label.textContent = '';
        if (current) {
            var idx = heads.indexOf(current);
            links[idx].className += ' active';
            activeLink = links[idx];
            if (h2n > 0) {
                var strong = doc.createElement('strong');
                strong.textContent = '\u00a7' + current.h2num + ' of ' + h2n;
                label.appendChild(strong);
                label.appendChild(doc.createTextNode(' \u00b7 ' + current.text));
            }
        } else if (h2n > 0) {
            label.textContent = 'Introduction';
        }
    }

    var ticking = false;
    function onScroll() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(function () { ticking = false; update(); });
        }
    }
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    update();
})();
