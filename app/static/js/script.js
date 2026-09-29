/* =========================================================
   ALFA — JavaScript global (carregado em todas as páginas)

   - Navbar ao rolar
   - Menu mobile (gaveta) e dropdown de cursos
   - Botão voltar ao topo
   - Animação de entrada (.reveal / .reveal-stagger)
   - Contadores animados (.contador[data-target])

   Tudo verifica se o elemento existe antes de usar.
   O scroll suave para âncoras é feito via CSS
   (scroll-behavior + scroll-padding-top).
========================================================= */

(function () {
    "use strict";

    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileQuery = window.matchMedia("(max-width: 1099px)");
    const body = document.body;

    /* =========================================
       SCROLL: navbar + voltar ao topo
       Um único listener, com requestAnimationFrame.
    ========================================= */

    const navbar = document.querySelector(".navbar");

    const btnTop = document.createElement("button");
    btnTop.type = "button";
    btnTop.className = "back-to-top";
    btnTop.setAttribute("aria-label", "Voltar ao topo");
    btnTop.dataset.tooltip = "Voltar ao topo";
    btnTop.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
    body.appendChild(btnTop);

    btnTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: reduzMovimento ? "auto" : "smooth" });
        const skip = document.querySelector(".skip-link");
        if (skip) skip.focus({ preventScroll: true });
    });

    let ticking = false;

    function aoRolar() {
        const y = window.scrollY;

        if (navbar) {
            navbar.classList.toggle("navbar-scroll", y > 40);
        }

        btnTop.classList.toggle("is-visible", y > 600);
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(aoRolar);
            ticking = true;
        }
    }, { passive: true });

    aoRolar();

    /* =========================================
       MENU MOBILE
       Mantém .mobile-menu-button e .menu.active
    ========================================= */

    const botaoMenu = document.querySelector(".mobile-menu-button");
    const painel = document.querySelector(".nav-panel");
    const menu = document.querySelector(".menu");
    const botaoFechar = document.querySelector(".nav-close");
    const overlay = document.querySelector(".nav-overlay");

    function menuAberto() {
        return body.classList.contains("nav-open");
    }

    function abrirMenu() {
        if (!painel) return;
        body.classList.add("nav-open");
        if (menu) menu.classList.add("active");
        if (overlay) overlay.hidden = false;
        if (botaoMenu) {
            botaoMenu.setAttribute("aria-expanded", "true");
            botaoMenu.setAttribute("aria-label", "Fechar menu");
        }
        // Foco no primeiro item após a animação começar
        window.setTimeout(() => {
            const primeiro = painel.querySelector(".menu a, .menu button");
            if (primeiro) primeiro.focus();
        }, 60);
    }

    function fecharMenu(devolverFoco) {
        if (!menuAberto()) return;
        body.classList.remove("nav-open");
        if (menu) menu.classList.remove("active");
        if (botaoMenu) {
            botaoMenu.setAttribute("aria-expanded", "false");
            botaoMenu.setAttribute("aria-label", "Abrir menu");
            if (devolverFoco) botaoMenu.focus();
        }
        if (overlay) {
            window.setTimeout(() => {
                if (!menuAberto()) overlay.hidden = true;
            }, 380);
        }
    }

    if (botaoMenu && painel) {
        botaoMenu.addEventListener("click", () => {
            menuAberto() ? fecharMenu(true) : abrirMenu();
        });
    }

    if (botaoFechar) {
        botaoFechar.addEventListener("click", () => fecharMenu(true));
    }

    if (overlay) {
        overlay.addEventListener("click", () => fecharMenu(false));
    }

    // Fecha ao clicar em qualquer link do menu
    if (painel) {
        painel.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => fecharMenu(false));
        });

        // Mantém o foco dentro da gaveta enquanto aberta
        painel.addEventListener("keydown", (e) => {
            if (e.key !== "Tab" || !menuAberto() || !mobileQuery.matches) return;
            const focaveis = Array.from(
                painel.querySelectorAll("a[href], button:not([disabled])")
            ).filter((el) => el.offsetParent !== null);
            if (!focaveis.length) return;
            const primeiro = focaveis[0];
            const ultimo = focaveis[focaveis.length - 1];
            if (e.shiftKey && document.activeElement === primeiro) {
                e.preventDefault();
                ultimo.focus();
            } else if (!e.shiftKey && document.activeElement === ultimo) {
                e.preventDefault();
                primeiro.focus();
            }
        });
    }

    // Ao passar para desktop, garante o menu fechado
    const aoMudarTela = () => {
        if (!mobileQuery.matches) fecharMenu(false);
    };
    if (mobileQuery.addEventListener) {
        mobileQuery.addEventListener("change", aoMudarTela);
    }

    /* =========================================
       DROPDOWN DE CURSOS
       Mantém .dropdown e .dropdown.active
    ========================================= */

    const dropdown = document.querySelector(".dropdown");
    const dropdownToggle = document.querySelector(".dropdown-toggle");

    function setDropdown(aberto) {
        if (!dropdown || !dropdownToggle) return;
        dropdown.classList.toggle("active", aberto);
        dropdownToggle.setAttribute("aria-expanded", String(aberto));
    }

    if (dropdown && dropdownToggle) {
        dropdownToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            setDropdown(!dropdown.classList.contains("active"));
        });

        // Desktop: fecha ao clicar fora
        document.addEventListener("click", (e) => {
            if (!mobileQuery.matches && !dropdown.contains(e.target)) {
                setDropdown(false);
            }
        });

        // Desktop: fecha quando o foco sai do dropdown
        dropdown.addEventListener("focusout", (e) => {
            if (!mobileQuery.matches && !dropdown.contains(e.relatedTarget)) {
                setDropdown(false);
            }
        });
    }

    // Esc fecha dropdown e menu
    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        if (dropdown && dropdown.classList.contains("active") && !mobileQuery.matches) {
            setDropdown(false);
            if (dropdownToggle) dropdownToggle.focus();
            return;
        }
        fecharMenu(true);
    });

    /* =========================================
       ANIMAÇÃO DE ENTRADA
    ========================================= */

    const revelaveis = document.querySelectorAll(".reveal, .reveal-stagger");

    if (revelaveis.length) {
        if (reduzMovimento || !("IntersectionObserver" in window)) {
            revelaveis.forEach((el) => el.classList.add("is-visible"));
        } else {
            const observerReveal = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observerReveal.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

            revelaveis.forEach((el) => observerReveal.observe(el));
        }
    }

    /* =========================================
       CONTADORES
       <span class="contador" data-target="3000">0</span>
       Opcional: data-prefix / data-suffix
    ========================================= */

    const contadores = document.querySelectorAll(".contador[data-target]");

    function formatar(n) {
        return n.toLocaleString("pt-BR");
    }

    function escrever(el, valor) {
        el.textContent = (el.dataset.prefix || "") + formatar(valor) + (el.dataset.suffix || "");
    }

    function animarContador(el) {
        const alvo = parseInt(el.dataset.target, 10) || 0;

        if (reduzMovimento) {
            escrever(el, alvo);
            return;
        }

        const duracao = 1600;
        const inicio = performance.now();

        function passo(agora) {
            const p = Math.min((agora - inicio) / duracao, 1);
            const suavizado = 1 - Math.pow(1 - p, 3);
            escrever(el, Math.round(suavizado * alvo));
            if (p < 1) window.requestAnimationFrame(passo);
        }

        window.requestAnimationFrame(passo);
    }

    if (contadores.length) {
        if (!("IntersectionObserver" in window)) {
            contadores.forEach((el) => escrever(el, parseInt(el.dataset.target, 10) || 0));
        } else {
            const observerContador = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animarContador(entry.target);
                        observerContador.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.6 });

            contadores.forEach((el) => {
                // Começa do zero só quando a animação vai acontecer
                if (!reduzMovimento) escrever(el, 0);
                observerContador.observe(el);
            });
        }
    }
})();
