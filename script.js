"use strict";
      const $ = (sel, root = document) => root.querySelector(sel);
      const $$ = (sel, root = document) =>
        Array.from(root.querySelectorAll(sel));

      const Nav = {
        init() {
          this.toggle = $("#navToggle");
          this.links = $("#navLinks");
          if (!this.toggle || !this.links) return;
          this.toggle.addEventListener("click", () => this.toggleMenu());
          $$(".nav__links a").forEach((a) =>
            a.addEventListener("click", () => this.close()),
          );
          document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.close();
          });
        },
        toggleMenu() {
          const open = this.toggle.getAttribute("aria-expanded") === "true";
          this.toggle.setAttribute("aria-expanded", String(!open));
          this.toggle.setAttribute(
            "aria-label",
            open ? "Åpne meny" : "Lukk meny",
          );
          this.links.classList.toggle("is-open", !open);
          document.body.style.overflow = !open ? "hidden" : "";
        },
        close() {
          if (!this.toggle) return;
          this.toggle.setAttribute("aria-expanded", "false");
          this.toggle.setAttribute("aria-label", "Åpne meny");
          this.links.classList.remove("is-open");
          document.body.style.overflow = "";
        },
      };

      const Reveal = {
        init() {
          const els = $$(".reveal");
          if (!els.length) return;
          if (!("IntersectionObserver" in window)) {
            els.forEach((e) => e.classList.add("is-visible"));
            return;
          }
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add("is-visible");
                  io.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
          );
          els.forEach((el) => io.observe(el));
        },
      };

      const Counters = {
        init() {
          const els = $$("[data-count]");
          if (!els.length || !("IntersectionObserver" in window)) return;
          const animate = (el) => {
            const target = parseInt(el.dataset.count, 10);
            const dur = 1400;
            const start = performance.now();
            const tick = (now) => {
              const p = Math.min((now - start) / dur, 1);
              const ease = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.round(target * ease);
              if (p < 1) requestAnimationFrame(tick);
              else el.textContent = target;
            };
            requestAnimationFrame(tick);
          };
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  animate(entry.target);
                  io.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.5 },
          );
          els.forEach((el) => io.observe(el));
        },
      };

      const CastFlip = {
        init() {
          $$("[data-flip]").forEach((card) => {
            card.addEventListener("click", () =>
              card.classList.toggle("is-flipped"),
            );
          });
        },
      };

      const MythFlip = {
        init() {
          $$(".myth__card").forEach((card) => {
            const flip = () => card.classList.toggle("is-flipped");
            card.addEventListener("click", flip);
            card.addEventListener("keydown", (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                flip();
              }
            });
          });
        },
      };

      const Anchors = {
        init() {
          $$('a[href^="#"]').forEach((link) => {
            link.addEventListener("click", (e) => {
              const href = link.getAttribute("href");
              if (!href || href === "#") return;
              const target = document.querySelector(href);
              if (!target) return;
              e.preventDefault();
              const top =
                target.getBoundingClientRect().top + window.scrollY - 100;
              window.scrollTo({ top, behavior: "smooth" });
            });
          });
        },
      };

      const Confetti = {
        fire(duration = 2600) {
          const colors = [
            "#ff4d8d",
            "#ffd84d",
            "#4a7eff",
            "#a855f7",
            "#22c55e",
            "#1a1a1a",
          ];
          const layer = document.createElement("div");
          layer.className = "confetti";
          document.body.appendChild(layer);
          for (let i = 0; i < 90; i++) {
            const p = document.createElement("div");
            p.className = "confetti__piece";
            p.style.left = Math.random() * 100 + "%";
            p.style.background =
              colors[Math.floor(Math.random() * colors.length)];
            p.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
            p.style.animationDelay = Math.random() * 0.5 + "s";
            if (Math.random() > 0.5) p.style.width = "6px";
            layer.appendChild(p);
          }
          setTimeout(() => layer.remove(), duration + 1000);
        },
      };

      const Quiz = {
        questions: [
          {
            q: "Hvor mange prosent av skolelederne i ungdomsskolen sier at elevene bruker KI?",
            answers: [
              { text: "89 %", correct: true },
              { text: "65 %", correct: false },
              { text: "32 %", correct: false },
            ],
            explanation:
              "Ifølge «Spørsmål til Skole-Norge 2025» svarer 89 % av skolelederne i ungdomsskolen ja.",
          },
          {
            q: "Hva er en deepfake?",
            answers: [
              { text: "En dyp samtale med en venn", correct: false },
              { text: "Syntetisk video eller lyd laget med KI", correct: true },
              { text: "En type kryptering", correct: false },
            ],
            explanation:
              "Deepfakes er KI-generert innhold som etterligner virkelige personer.",
          },
          {
            q: "Hva er Alisa mest bekymret for?",
            answers: [
              { text: "At KI bruker for mye strøm", correct: false },
              { text: "At vi slutter å tenke kritisk selv", correct: true },
              { text: "At KI er for dyrt", correct: false },
            ],
            explanation:
              "Alisa mener kritisk tenkning forsvinner når vi kopierer uten å sjekke.",
          },
          {
            q: "Hvilken fordel trekker Polina og Zhanna frem?",
            answers: [
              { text: "KI gjør alltid skolearbeid bedre", correct: false },
              { text: "KI forklarer vanskelige ting enklere", correct: true },
              { text: "KI gjør oss smartere automatisk", correct: false },
            ],
            explanation:
              "De mener KI gjør læring enklere og tryggere — man kan spørre uten å føle seg dum.",
          },
          {
            q: "Hva sier statistikken om unge 21–30 år i AI-utsatte yrker?",
            answers: [
              { text: "Sysselsettingen steg med 6,6 %", correct: false },
              { text: "Sysselsettingen sank med 6,6 %", correct: true },
              { text: "Ingen endring", correct: false },
            ],
            explanation:
              "Totalt gikk sysselsettingen opp, men blant unge i utsatte yrker sank den med 6,6 %.",
          },
          {
            q: "Hva er det viktigste rådet fra episoden?",
            answers: [
              { text: "Slutt å bruke KI helt", correct: false },
              { text: "Bruk KI som verktøy — men tenk selv", correct: true },
              { text: "Stol blindt på KI-svar", correct: false },
            ],
            explanation: "KI er et verktøy — du har ansvaret for å tenke selv.",
          },
        ],

        index: 0,
        correct: 0,
        answered: false,

        init() {
          this.intro = $("#quizIntro");
          this.game = $("#quizGame");
          this.result = $("#quizResult");
          this.startBtn = $("#startBtn");
          this.count = $("#quizCount");
          this.bar = $("#quizBarFill");
          this.question = $("#quizQuestion");
          this.answers = $("#quizAnswers");
          this.feedback = $("#quizFeedback");
          this.nextBtn = $("#nextBtn");
          if (!this.startBtn) return;
          this.startBtn.addEventListener("click", () => this.start());
          this.nextBtn.addEventListener("click", () => this.next());
        },

        start() {
          this.index = 0;
          this.correct = 0;
          this.intro.style.display = "none";
          this.result.classList.remove("is-active");
          this.game.classList.add("is-active");
          this.render();
        },

        render() {
          this.answered = false;
          const q = this.questions[this.index];
          this.count.textContent = `${String(this.index + 1).padStart(2, "0")} / ${String(this.questions.length).padStart(2, "0")}`;
          this.bar.style.width = `${(this.index / this.questions.length) * 100}%`;
          this.question.textContent = q.q;
          this.feedback.textContent = "";
          this.feedback.className = "quiz__feedback";
          this.nextBtn.disabled = true;
          this.nextBtn.textContent =
            this.index === this.questions.length - 1
              ? "Se resultat →"
              : "Neste →";
          this.answers.innerHTML = "";
          const letters = ["a", "b", "c", "d"];
          q.answers.forEach((a, i) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "quiz__answer";
            const letter = document.createElement("span");
            letter.className = "quiz__letter";
            letter.textContent = letters[i];
            const answerText = document.createElement("span");
            answerText.textContent = a.text;
            btn.append(letter, answerText);
            btn.addEventListener("click", () => this.choose(a, btn));
            this.answers.appendChild(btn);
          });
        },

        choose(answer, button) {
          if (this.answered) return;
          this.answered = true;
          const all = Array.from(this.answers.children);
          all.forEach((b) => (b.disabled = true));
          if (answer.correct) {
            button.classList.add("is-correct");
            this.correct++;
            this.feedback.className = "quiz__feedback is-correct";
            const strong = document.createElement("strong");
            strong.textContent = "Riktig! ";
            this.feedback.replaceChildren(strong, document.createTextNode(this.questions[this.index].explanation));
          } else {
            button.classList.add("is-wrong");
            const rightText = this.questions[this.index].answers.find(
              (a) => a.correct,
            ).text;
            all.forEach((b) => {
              if (b.textContent.includes(rightText))
                b.classList.add("is-correct");
            });
            this.feedback.className = "quiz__feedback is-wrong";
            const strong = document.createElement("strong");
            strong.textContent = "Ikke helt. ";
            this.feedback.replaceChildren(strong, document.createTextNode(this.questions[this.index].explanation));
          }
          this.nextBtn.disabled = false;
        },

        next() {
          this.index++;
          if (this.index >= this.questions.length) return this.finish();
          this.render();
        },

        finish() {
          this.game.classList.remove("is-active");
          this.result.classList.add("is-active");
          const total = this.questions.length;
          const pct = Math.round((this.correct / total) * 100);
          const profile = this.verdict(pct);
          this.result.innerHTML = `
      <div class="quiz__result-score">${this.correct}<span>/${total}</span></div>
      <div class="quiz__result-verdict">${profile.label}</div>
      <p class="quiz__result-text">${profile.text}</p>
      <div class="quiz__result-actions">
        <button id="restartBtn" class="btn btn--pink" type="button">Prøv igjen</button>
        <a href="#episode" class="btn">Tilbake til episoden</a>
      </div>
    `;
          $("#restartBtn").addEventListener("click", () => this.start());
          if (pct >= 70) Confetti.fire();
        },

        verdict(pct) {
          if (pct === 100)
            return {
              label: "Full pott",
              text: "Du hadde alle riktige. Husk likevel å sjekke informasjon fra KI.",
            };
          if (pct >= 80)
            return {
              label: "Nesten perfekt",
              text: "Du har god oversikt over temaet.",
            };
          if (pct >= 60)
            return {
              label: "God oversikt",
              text: "Du kan det viktigste, men noen av spørsmålene er verdt å se på igjen.",
            };
          if (pct >= 40)
            return {
              label: "På vei",
              text: "Du har fått med deg noe av innholdet. Se gjennom temaene og prøv igjen.",
            };
          return {
            label: "Nysgjerrig",
            text: "Det er helt greit å ikke kunne alt ennå. Hør episoden og prøv quizen en gang til.",
          };
        },
      };



      const ImageQuiz = {
        questions: [
          {
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=960&h=640&fit=crop&crop=faces&auto=format&q=80",
            alt: "Portrettfoto av en kvinne",
            answer: "real",
            explanation: "Dette er et ekte portrettfoto fra Unsplash. Men utseendet alene er ikke alltid nok til å avgjøre om et bilde er ekte.",
          },
          {
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Th%C3%A9%C3%A2tre_D%E2%80%99op%C3%A9ra_Spatial.png/960px-Th%C3%A9%C3%A2tre_D%E2%80%99op%C3%A9ra_Spatial.png",
            alt: "Digitalt kunstverk med mennesker i et stort rom",
            answer: "ai",
            explanation: "Dette kunstverket ble laget med Midjourney i 2022. Det er et kjent eksempel på KI-generert kunst.",
          },
          {
            image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&h=667&fit=crop&auto=format&q=80",
            alt: "Fotografi av landskap i naturlig lys",
            answer: "real",
            explanation: "Dette er et fotografi fra Unsplash. Ekte bilder kan også se uvanlige eller veldig perfekte ut.",
          },
          {
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Artificial_intelligence_in_education.jpg/960px-Artificial_intelligence_in_education.jpg",
            alt: "Illustrasjon av en robot som hjelper en elev",
            answer: "ai",
            explanation: "Dette bildet er merket som KI-generert på Wikimedia Commons.",
          },
        ],

        index: 0,
        correct: 0,
        answered: false,

        init() {
          this.intro = $("#imageQuizIntro");
          this.game = $("#imageQuizGame");
          this.result = $("#imageQuizResult");
          this.startBtn = $("#imageQuizStartBtn");
          this.count = $("#imageQuizCount");
          this.bar = $("#imageQuizBarFill");
          this.image = $("#imageQuizImage");
          this.answers = $("#imageQuizAnswers");
          this.feedback = $("#imageQuizFeedback");
          this.nextBtn = $("#imageQuizNextBtn");
          if (!this.startBtn) return;
          this.startBtn.addEventListener("click", () => this.start());
          this.nextBtn.addEventListener("click", () => this.next());
        },

        start() {
          this.index = 0;
          this.correct = 0;
          this.intro.style.display = "none";
          this.result.classList.remove("is-active");
          this.game.classList.add("is-active");
          this.render();
        },

        render() {
          this.answered = false;
          const item = this.questions[this.index];
          this.count.textContent = `${String(this.index + 1).padStart(2, "0")} / ${String(this.questions.length).padStart(2, "0")}`;
          this.bar.style.width = `${(this.index / this.questions.length) * 100}%`;
          this.image.src = item.image;
          this.image.alt = item.alt;
          this.feedback.textContent = "";
          this.feedback.className = "quiz__feedback";
          this.nextBtn.disabled = true;
          this.nextBtn.textContent = this.index === this.questions.length - 1 ? "Se resultat →" : "Neste →";
          this.answers.replaceChildren();

          const choices = [
            { value: "real", text: "Ekte foto" },
            { value: "ai", text: "Laget med KI" },
          ];

          choices.forEach((choice, i) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "quiz__answer";
            const letter = document.createElement("span");
            letter.className = "quiz__letter";
            letter.textContent = i === 0 ? "A" : "B";
            const text = document.createElement("span");
            text.textContent = choice.text;
            button.append(letter, text);
            button.addEventListener("click", () => this.choose(choice.value, button));
            this.answers.appendChild(button);
          });
        },

        choose(answer, button) {
          if (this.answered) return;
          this.answered = true;
          const item = this.questions[this.index];
          const buttons = Array.from(this.answers.children);
          buttons.forEach((itemButton) => (itemButton.disabled = true));
          const rightAnswer = answer === item.answer;
          if (rightAnswer) {
            this.correct++;
            button.classList.add("is-correct");
          } else {
            button.classList.add("is-wrong");
            buttons.forEach((itemButton) => {
              const label = itemButton.textContent.includes("Ekte foto") ? "real" : "ai";
              if (label === item.answer) itemButton.classList.add("is-correct");
            });
          }
          const strong = document.createElement("strong");
          strong.textContent = rightAnswer ? "Riktig! " : "Ikke helt. ";
          this.feedback.className = rightAnswer ? "quiz__feedback is-correct" : "quiz__feedback is-wrong";
          this.feedback.replaceChildren(strong, document.createTextNode(item.explanation));
          this.nextBtn.disabled = false;
        },

        next() {
          this.index++;
          if (this.index >= this.questions.length) return this.finish();
          this.render();
        },

        finish() {
          this.game.classList.remove("is-active");
          this.result.classList.add("is-active");
          let message = "Det kan være vanskelig å se forskjell. Sjekk alltid kilden når et bilde betyr noe.";
          if (this.correct === this.questions.length) message = "Full pott! Du svarte riktig på alle fire bildene.";
          else if (this.correct >= 2) message = "Bra jobbet. Noen KI-bilder kan være vanskelige å oppdage, så sjekk også hvor bildet kommer fra.";
          this.result.innerHTML = `
            <div class="quiz__result-score">${this.correct}<span>/${this.questions.length}</span></div>
            <div class="quiz__result-verdict">${this.correct === this.questions.length ? "Full pott" : "Bildeekspert på vei"}</div>
            <p class="quiz__result-text">${message}</p>
            <div class="quiz__result-actions">
              <button id="imageQuizRestartBtn" class="btn btn--pink" type="button">Prøv igjen</button>
              <a href="#quiz" class="btn">Ta testen om episoden</a>
            </div>
          `;
          $("#imageQuizRestartBtn").addEventListener("click", () => this.start());
          if (this.correct >= 3) Confetti.fire();
        },
      };

      document.addEventListener("DOMContentLoaded", () => {
        Nav.init();
        Reveal.init();
        Counters.init();
        Anchors.init();
        Quiz.init();
        ImageQuiz.init();
      });
