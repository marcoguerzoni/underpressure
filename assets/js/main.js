/* ==========================================================================
   Under Pressure — main.js (vanilla, defer, existence-guarded)
   ========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion:reduce)").matches
    : false;

  /* ---------------------------------------------------------------------
     1. Mobile menu toggle
     --------------------------------------------------------------------- */
  (function mobileMenu() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!header || !toggle || !nav) return;

    function open() {
      header.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Chiudi il menu");
    }
    function close() {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Apri il menu");
    }
    function isOpen() {
      return header.classList.contains("is-open");
    }

    toggle.addEventListener("click", function () {
      isOpen() ? close() : open();
    });

    // Close on link click
    nav.addEventListener("click", function (e) {
      if (e.target.closest(".nav-link")) close();
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        close();
        toggle.focus();
      }
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (isOpen() && !header.contains(e.target)) close();
    });
  })();

  /* ---------------------------------------------------------------------
     2. Active-nav highlighting (aria-current fallback / correction)
     --------------------------------------------------------------------- */
  (function activeNav() {
    var links = document.querySelectorAll(".site-nav .nav-link");
    if (!links.length) return;
    var path = location.pathname.split("/").pop() || "index.html";
    if (path === "") path = "index.html";
    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === path) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  })();

  /* ---------------------------------------------------------------------
     3. Rotating quote box
     --------------------------------------------------------------------- */
  (function quoteBox() {
    var textEl = document.getElementById("quote-text");
    var sourceEl = document.getElementById("quote-source");
    if (!textEl || !sourceEl) return;

    var quotes = [
      {
        text: "«L’85% degli studenti quindicenni ha paura di prendere brutti voti.»",
        source: "— OCSE–PISA"
      },
      {
        text: "«A 15 anni, il 78% delle ragazze si sente stressato dagli impegni scolastici.»",
        source: "— HBSC-Italia 2022"
      },
      {
        text: "«Il 70% è in ansia per le verifiche anche quando si è preparato.»",
        source: "— OCSE–PISA"
      },
      {
        text: "«Quasi 3 ragazze su 4 riferiscono sintomi di malessere più volte a settimana.»",
        source: "— HBSC-Italia 2022"
      }
    ];

    // Build dots
    var dotsWrap = document.querySelector(".quote-dots");
    var dots = [];
    if (dotsWrap) {
      dotsWrap.removeAttribute("aria-hidden");
      quotes.forEach(function (q, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Vai alla citazione " + (i + 1));
        b.addEventListener("click", function () {
          show(i);
          restart();
        });
        dotsWrap.appendChild(b);
        dots.push(b);
      });
    }

    var current = 0;
    var timer = null;

    function paintDots(i) {
      dots.forEach(function (d, di) {
        if (di === i) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });
    }

    function swap(i) {
      current = i;
      textEl.textContent = quotes[i].text;
      sourceEl.textContent = quotes[i].source;
      paintDots(i);
    }

    function show(i) {
      i = (i + quotes.length) % quotes.length;
      if (i === current && textEl.textContent.indexOf(quotes[i].text) !== -1) {
        // still repaint dots for direct dot clicks
      }
      if (reduce) {
        swap(i);
        return;
      }
      textEl.style.opacity = "0";
      window.setTimeout(function () {
        swap(i);
        textEl.style.opacity = "1";
      }, 400);
    }

    function next() {
      show(current + 1);
    }

    function restart() {
      if (timer) window.clearInterval(timer);
      if (!reduce) timer = window.setInterval(next, 6000);
    }

    // Initial paint of dots
    paintDots(0);

    // Controls
    var nextBtn = document.querySelector(".quote-next");
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        next();
        restart();
      });
    }
    var quoteFig = document.querySelector(".quote");
    if (quoteFig) {
      quoteFig.addEventListener("click", function () {
        next();
        restart();
      });
    }

    restart();
  })();

  /* ---------------------------------------------------------------------
     4. Chart scroll-reveal
     --------------------------------------------------------------------- */
  (function chartReveal() {
    var charts = document.querySelectorAll(".chart");
    if (!charts.length) return;

    if (reduce || !("IntersectionObserver" in window)) {
      charts.forEach(function (c) {
        c.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    charts.forEach(function (c) {
      io.observe(c);
    });
  })();
})();
