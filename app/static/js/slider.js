/* =========================================================
   SLIDER DA HERO (home)
   Estrutura: .hero-slider > .hero-slide (+ .active)
              .hero-dots > button
   - Pausa ao passar o mouse, com foco no hero e com a aba oculta
   - Não troca sozinho se o usuário pediu menos movimento
========================================================= */

(function () {
    "use strict";

    const hero = document.querySelector(".slider-hero");
    if (!hero) return;

    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll(".hero-dots button"));
    if (slides.length < 2) return;

    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const INTERVALO = 6000;

    let atual = Math.max(0, slides.findIndex((s) => s.classList.contains("active")));
    let timer = null;
    let pausado = false;

    function mostrar(indice) {
        atual = (indice + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            const ativo = i === atual;
            slide.classList.toggle("active", ativo);
            slide.setAttribute("aria-hidden", String(!ativo));
        });

        dots.forEach((dot, i) => {
            const ativo = i === atual;
            dot.classList.toggle("active", ativo);
            dot.setAttribute("aria-current", ativo ? "true" : "false");
        });

        hero.style.setProperty("--slide-duracao", INTERVALO + "ms");
    }

    function parar() {
        window.clearInterval(timer);
        timer = null;
        hero.classList.add("is-paused");
    }

    function iniciar() {
        if (reduzMovimento || pausado || document.hidden) return;
        parar();
        hero.classList.remove("is-paused");
        // Reinicia a barra de progresso do indicador ativo
        dots.forEach((d) => d.classList.remove("run"));
        void hero.offsetWidth;
        if (dots[atual]) dots[atual].classList.add("run");
        timer = window.setInterval(() => {
            mostrar(atual + 1);
            dots.forEach((d) => d.classList.remove("run"));
            void hero.offsetWidth;
            if (dots[atual]) dots[atual].classList.add("run");
        }, INTERVALO);
    }

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            mostrar(i);
            iniciar();
        });
    });

    hero.addEventListener("mouseenter", () => { pausado = true; parar(); });
    hero.addEventListener("mouseleave", () => { pausado = false; iniciar(); });
    hero.addEventListener("focusin", () => { pausado = true; parar(); });
    hero.addEventListener("focusout", (e) => {
        if (!hero.contains(e.relatedTarget)) { pausado = false; iniciar(); }
    });

    document.addEventListener("visibilitychange", () => {
        document.hidden ? parar() : iniciar();
    });

    mostrar(atual);
    if (reduzMovimento) hero.classList.add("is-paused");
    iniciar();
})();
