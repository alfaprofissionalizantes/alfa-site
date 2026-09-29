/* =========================================================
   QUEM SOMOS — slider da estrutura e depoimentos
   (animação de entrada e contadores ficam no script.js)
========================================================= */

(function () {
    "use strict";

    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ===================== SLIDER DA ESTRUTURA ===================== */
    (function () {
        const slider = document.getElementById("slider");
        const dotsWrap = document.getElementById("dots");
        if (!slider || !dotsWrap) return;

        const slides = Array.from(slider.querySelectorAll(".slide"));
        if (!slides.length) return;

        const prevBtn = slider.querySelector(".slider-btn.prev");
        const nextBtn = slider.querySelector(".slider-btn.next");
        let current = 0;
        let timer = null;

        slides.forEach((_, i) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", "Ir para imagem " + (i + 1));
            dot.addEventListener("click", () => goTo(i));
            dotsWrap.appendChild(dot);
        });

        const dots = Array.from(dotsWrap.children);

        function show(i) {
            slides.forEach((s, idx) => {
                s.classList.toggle("active", idx === i);
                s.setAttribute("aria-hidden", String(idx !== i));
            });
            dots.forEach((d, idx) => {
                d.classList.toggle("is-active", idx === i);
                d.setAttribute("aria-current", idx === i ? "true" : "false");
            });
        }

        function goTo(i) {
            current = (i + slides.length) % slides.length;
            show(current);
            restart();
        }

        function start() {
            if (reduzMovimento) return;
            stop();
            timer = window.setInterval(() => goTo(current + 1), 5000);
        }

        function stop() {
            window.clearInterval(timer);
        }

        function restart() {
            stop();
            start();
        }

        if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1));
        if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1));

        slider.addEventListener("mouseenter", stop);
        slider.addEventListener("mouseleave", start);
        slider.addEventListener("focusin", stop);
        slider.addEventListener("focusout", (e) => {
            if (!slider.contains(e.relatedTarget)) start();
        });

        show(0);
        start();
    })();

    /* ===================== CARROSSEL DE DEPOIMENTOS ===================== */
    (function () {
        const track = document.getElementById("depoTrack");
        const dotsWrap = document.getElementById("depoDots");
        if (!track || !dotsWrap) return;

        const items = Array.from(track.children);
        if (!items.length) return;

        let index = 0;
        let timer = null;

        items.forEach((_, i) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", "Depoimento " + (i + 1));
            dot.addEventListener("click", () => goTo(i));
            dotsWrap.appendChild(dot);
        });

        const dots = Array.from(dotsWrap.children);

        function update() {
            track.style.transform = `translateX(-${index * 100}%)`;
            items.forEach((it, i) => it.setAttribute("aria-hidden", String(i !== index)));
            dots.forEach((d, i) => {
                d.classList.toggle("is-active", i === index);
                d.setAttribute("aria-current", i === index ? "true" : "false");
            });
        }

        function goTo(i) {
            index = (i + items.length) % items.length;
            update();
            restart();
        }

        function start() {
            if (reduzMovimento) return;
            window.clearInterval(timer);
            timer = window.setInterval(() => goTo(index + 1), 6000);
        }

        function restart() {
            window.clearInterval(timer);
            start();
        }

        track.addEventListener("mouseenter", () => window.clearInterval(timer));
        track.addEventListener("mouseleave", start);

        update();
        start();
    })();
})();
