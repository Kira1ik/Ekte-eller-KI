"use strict";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* HEADER PÅ SCROLL */
const Header = {
  init() {
    const el = $("#header");
    if (!el) return;
    window.addEventListener(
      "scroll",
      () => {
        el.classList.toggle("skrollet", window.scrollY > 40);
      },
      { passive: true },
    );
  },
};

/* MOBILMENY */
const Meny = {
  init() {
    const knapp = $("#navToggle");
    const liste = $("#navLinks");
    if (!knapp || !liste) return;

    const lukk = () => {
      knapp.setAttribute("aria-expanded", "false");
      liste.classList.remove("åpen");
      document.body.style.overflow = "";
    };

    knapp.addEventListener("click", () => {
      const åpen = knapp.getAttribute("aria-expanded") === "true";
      knapp.setAttribute("aria-expanded", String(!åpen));
      liste.classList.toggle("åpen", !åpen);
      document.body.style.overflow = !åpen ? "hidden" : "";
    });

    $$(".nav__links a").forEach((a) => a.addEventListener("click", lukk));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") lukk();
    });
  },
};

/* REVEAL */
const Reveal = {
  init() {
    const el = $$(".reveal");
    if (!el.length) return;

    if (!("IntersectionObserver" in window)) {
      el.forEach((e) => e.classList.add("synlig"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("synlig");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
    );

    el.forEach((e, i) => {
      e.style.transitionDelay = `${Math.min(i % 4, 3) * 80}ms`;
      obs.observe(e);
    });
  },
};

/* AKTIV SEKSJON */
const Aktiv = {
  init() {
    const seksjoner = $$("section[id]");
    if (!seksjoner.length || !("IntersectionObserver" in window)) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.id;
            $$(".nav__links a").forEach((a) => {
              a.classList.toggle("aktiv", a.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.4 },
    );

    seksjoner.forEach((s) => obs.observe(s));
  },
};

/* SMOOTH ANKER */
const Anker = {
  init() {
    $$('a[href^="#"]').forEach((l) => {
      l.addEventListener("click", (e) => {
        const href = l.getAttribute("href");
        if (href === "#" || href.length < 2) return;
        const mål = document.querySelector(href);
        if (!mål) return;
        e.preventDefault();
        const topp = mål.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: topp, behavior: "smooth" });
      });
    });
  },
};

/* QUIZ */
const Quiz = {
  sporsmal: [
    {
      spm: "Hvor mange % av skolelederne i ungdomsskolen sier at elevene bruker KI?",
      svar: [
        { tekst: "89 %", riktig: true },
        { tekst: "65 %", riktig: false },
        { tekst: "32 %", riktig: false },
      ],
      forklaring: "Ifølge «Spørsmål til Skole-Norge 2025» svarer 89 % ja.",
    },
    {
      spm: "Hva er en deepfake?",
      svar: [
        { tekst: "En dyp samtale med en venn", riktig: false },
        { tekst: "Syntetisk video eller lyd laget med KI", riktig: true },
        { tekst: "En type kryptering", riktig: false },
      ],
      forklaring:
        "Deepfakes er KI-generert innhold som etterligner virkelige personer.",
    },
    {
      spm: "Hva er Alisa mest bekymret for?",
      svar: [
        { tekst: "At KI bruker for mye strøm", riktig: false },
        { tekst: "At vi slutter å tenke kritisk selv", riktig: true },
        { tekst: "At KI er for dyrt", riktig: false },
      ],
      forklaring:
        "Alisa mener kritisk tenkning forsvinner når vi kopierer uten å sjekke.",
    },
    {
      spm: "Hvilken fordel trekker Polina og Zhanna frem?",
      svar: [
        { tekst: "KI gjør alltid skolearbeid bedre", riktig: false },
        { tekst: "KI forklarer vanskelige ting enklere", riktig: true },
        { tekst: "KI gjør oss smartere automatisk", riktig: false },
      ],
      forklaring: "De mener KI gjør læring enklere og tryggere.",
    },
    {
      spm: "Hva sier statistikken om unge 21–30 år i AI-utsatte yrker?",
      svar: [
        { tekst: "Sysselsettingen steg med 6,6 %", riktig: false },
        { tekst: "Sysselsettingen sank med 6,6 %", riktig: true },
        { tekst: "Ingen endring", riktig: false },
      ],
      forklaring:
        "Totalt gikk sysselsettingen opp, men blant unge i utsatte yrker sank den.",
    },
    {
      spm: "Hva er det viktigste rådet fra episoden?",
      svar: [
        { tekst: "Slutt å bruke KI helt", riktig: false },
        { tekst: "Bruk KI som verktøy — men tenk selv", riktig: true },
        { tekst: "Stol blindt på KI-svar", riktig: false },
      ],
      forklaring: "KI er et verktøy — du har ansvaret for å tenke selv.",
    },
  ],

  indeks: 0,
  poeng: 0,
  besvart: false,

  init() {
    this.startKnapp = $("#startKnapp");
    this.startBoks = $("#quizStart");
    this.boks = $("#quizBoks");
    this.resultat = $("#quizResultat");
    this.teller = $("#sporsmalTeller");
    this.poengTeller = $("#poengTeller");
    this.barFyll = $("#quizBarFyll");
    this.spmTekst = $("#sporsmalTekst");
    this.svarBoks = $("#svarBoks");
    this.feedback = $("#feedback");
    this.neste = $("#nesteKnapp");

    if (!this.startKnapp) return;

    this.startKnapp.addEventListener("click", () => this.start());
    this.neste.addEventListener("click", () => this.nesteSporsmal());
  },

  start() {
    this.indeks = 0;
    this.poeng = 0;
    this.startBoks.classList.add("skjult");
    this.resultat.classList.add("skjult");
    this.boks.classList.remove("skjult");
    this.vis();
  },

  vis() {
    this.besvart = false;
    const s = this.sporsmal[this.indeks];

    this.teller.textContent = `${this.indeks + 1} / ${this.sporsmal.length}`;
    this.poengTeller.textContent = `${this.poeng} poeng`;
    this.barFyll.style.width = `${(this.indeks / this.sporsmal.length) * 100}%`;
    this.spmTekst.textContent = s.spm;
    this.feedback.textContent = "";
    this.neste.disabled = true;
    this.neste.textContent =
      this.indeks === this.sporsmal.length - 1 ? "Se resultat →" : "Neste →";

    this.svarBoks.innerHTML = "";
    s.svar.forEach((alt) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = alt.tekst;
      b.addEventListener("click", () => this.velg(alt, b));
      this.svarBoks.appendChild(b);
    });
  },

  velg(alt, knapp) {
    if (this.besvart) return;
    this.besvart = true;

    const alle = this.svarBoks.querySelectorAll("button");
    alle.forEach((b) => (b.disabled = true));

    if (alt.riktig) {
      knapp.classList.add("riktig");
      this.poeng++;
      this.feedback.textContent = `✓ Riktig! ${this.sporsmal[this.indeks].forklaring}`;
    } else {
      knapp.classList.add("feil");
      const riktigSvar = this.sporsmal[this.indeks].svar.find((a) => a.riktig);
      alle.forEach((b) => {
        if (b.textContent === riktigSvar.tekst) b.classList.add("riktig");
      });
      this.feedback.textContent = `✕ Ikke helt. ${this.sporsmal[this.indeks].forklaring}`;
    }

    this.poengTeller.textContent = `${this.poeng} poeng`;
    this.neste.disabled = false;
  },

  nesteSporsmal() {
    this.indeks++;
    if (this.indeks >= this.sporsmal.length) return this.avslutt();
    this.vis();
  },

  avslutt() {
    this.boks.classList.add("skjult");
    this.resultat.classList.remove("skjult");

    const prosent = Math.round((this.poeng / this.sporsmal.length) * 100);
    const profil = this.beregnProfil(prosent);

    this.resultat.innerHTML = `
      <h3>${profil.tittel}</h3>
      <div class="quiz__resultat-sirkel" style="--prosent:${prosent}">
        <span>${prosent}%</span>
      </div>
      <p>${profil.tekst}</p>
      <p style="color:var(--accent-2);font-family:'JetBrains Mono',monospace;font-size:.8rem">
        ${this.poeng} / ${this.sporsmal.length} poeng
      </p>
      <button id="restartKnapp" class="knapp knapp--primaer" type="button">Prøv igjen</button>
    `;

    $("#restartKnapp").addEventListener("click", () => this.start());
  },

  beregnProfil(prosent) {
    if (prosent >= 90)
      return {
        tittel: "🏆 KI-ekspert",
        tekst: "Du har full kontroll. Nå kan du hjelpe andre å forstå KI.",
      };
    if (prosent >= 70)
      return {
        tittel: "🧠 Bevisst bruker",
        tekst: "God oversikt! Du ser gjennom det meste.",
      };
    if (prosent >= 50)
      return {
        tittel: "📚 På vei",
        tekst: "Du har grunnlaget. Hør episoden en gang til.",
      };
    return {
      tittel: "🌊 Nysgjerrig",
      tekst: "Ingen skam! Start med podkasten – så tar du quizen igjen.",
    };
  },
};

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  Header.init();
  Meny.init();
  Reveal.init();
  Aktiv.init();
  Anker.init();
  Quiz.init();
  console.log(
    "%cKI-Ishiki · klar 🎙️",
    "color:#E23E57;font-weight:700;font-size:14px",
  );
});
