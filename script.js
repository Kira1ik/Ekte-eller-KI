"use strict";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* Mobilmeny */
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    navLinks.classList.toggle("åpen", !open);
  });
  $$(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("åpen");
      navToggle.setAttribute("aria-expanded", "false");
    }),
  );
}

/* Quiz */
const Quiz = {
  sporsmal: [
    {
      spm: "Hvor mange prosent av skolelederne på ungdomsskolen sier elevene bruker KI?",
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
      spm: "Hva skjedde med sysselsettingen blant unge 21–30 år i KI-utsatte yrker?",
      svar: [
        { tekst: "Den steg med 6,6 %", riktig: false },
        { tekst: "Den sank med 6,6 %", riktig: true },
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
      this.indeks === this.sporsmal.length - 1 ? "Se resultat" : "Neste";

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
      this.feedback.textContent = `Riktig! ${this.sporsmal[this.indeks].forklaring}`;
    } else {
      knapp.classList.add("feil");
      const riktigSvar = this.sporsmal[this.indeks].svar.find((a) => a.riktig);
      alle.forEach((b) => {
        if (b.textContent === riktigSvar.tekst) b.classList.add("riktig");
      });
      this.feedback.textContent = `Ikke helt. ${this.sporsmal[this.indeks].forklaring}`;
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
    let tittel, tekst;
    if (prosent >= 90) {
      tittel = "KI-ekspert";
      tekst = "Du har full kontroll på temaet.";
    } else if (prosent >= 70) {
      tittel = "Bevisst bruker";
      tekst = "God oversikt — men det finnes alltid mer å lære.";
    } else if (prosent >= 50) {
      tittel = "På vei";
      tekst = "Du har grunnlaget. Hør episoden en gang til.";
    } else {
      tittel = "Nysgjerrig";
      tekst = "Ingen skam — start med podkasten, og prøv igjen.";
    }

    this.resultat.innerHTML = `
      <h3>${tittel}</h3>
      <div class="quiz__resultat-sirkel" style="--prosent:${prosent}">
        <span>${prosent}%</span>
      </div>
      <p>${tekst}</p>
      <p class="poeng">${this.poeng} av ${this.sporsmal.length} riktige</p>
      <button id="restartKnapp" class="knapp" type="button">Prøv igjen</button>
    `;

    $("#restartKnapp").addEventListener("click", () => this.start());
  },
};

document.addEventListener("DOMContentLoaded", () => Quiz.init());
