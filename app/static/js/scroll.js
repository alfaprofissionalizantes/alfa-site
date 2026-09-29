/* =========================================================
   CARROSSEL DE CURSOS (mobile)
   Atualiza os indicadores (.scroll-indicador .dot) conforme
   o card visível e permite tocar no indicador para navegar.
========================================================= */

(function () {
    "use strict";

    const grid = document.querySelector(".cursos-grid");
    const dots = Array.from(document.querySelectorAll(".scroll-indicador .dot"));
    if (!grid || !dots.length) return;

    const cards = Array.from(grid.querySelectorAll(".curso-card"));
    if (!cards.length) return;

    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function ativar(indice) {
        dots.forEach((dot, i) => {
            const ativo = i === indice;
            dot.classList.toggle("active", ativo);
            if (ativo) dot.setAttribute("aria-current", "true");
            else dot.removeAttribute("aria-current");
        });
    }

    // Card mais visível dentro do carrossel
    if ("IntersectionObserver" in window) {
        const visibilidade = new Map();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                visibilidade.set(entry.target, entry.intersectionRatio);
            });

            let melhor = 0;
            let maior = -1;
            cards.forEach((card, i) => {
                const r = visibilidade.get(card) || 0;
                if (r > maior) { maior = r; melhor = i; }
            });
            ativar(melhor);
        }, { root: grid, threshold: [0.25, 0.5, 0.75, 1] });

        cards.forEach((card) => observer.observe(card));
    }

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            const card = cards[i];
            if (!card) return;
            const padding = parseFloat(getComputedStyle(grid).paddingLeft) || 0;
            const deslocamento = card.getBoundingClientRect().left - grid.getBoundingClientRect().left;
            grid.scrollTo({
                left: grid.scrollLeft + deslocamento - padding,
                behavior: reduzMovimento ? "auto" : "smooth"
            });
        });
    });
})();
