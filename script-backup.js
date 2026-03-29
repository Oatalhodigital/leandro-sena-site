(function () {
    document.querySelectorAll(".faq-question").forEach(function (button) {
        button.addEventListener("click", function () {
            var item = button.closest(".faq-item");
            var wasActive = item.classList.contains("active");
            document.querySelectorAll(".faq-item.active").forEach(function (open) {
                open.classList.remove("active");
            });
            if (!wasActive) {
                item.classList.add("active");
            }
        });
    });

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
        observer.observe(el);
    });

    var header = document.querySelector("header");
    var toggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");

    if (toggle && header && navLinks) {
        toggle.addEventListener("click", function () {
            var open = header.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                header.classList.remove("nav-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    var y = document.getElementById("year");
    if (y) {
        y.textContent = String(new Date().getFullYear());
    }

    var formOrcamento = document.getElementById("form-orcamento");
    var formSuccess = document.getElementById("form-success");
    if (formOrcamento && formSuccess) {
        formOrcamento.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!formOrcamento.checkValidity()) {
                formOrcamento.reportValidity();
                return;
            }

            var formData = new FormData(formOrcamento);
            var nome = String(formData.get("nome") || "").trim();
            var email = String(formData.get("email") || "").trim();
            var objetivoKey = String(formData.get("objetivo") || "").trim();
            var mensagemCliente = String(formData.get("mensagem") || "").trim();

            var objetivoMap = {
                site: "Site institucional",
                landing: "Landing page (vendas / leads)",
                loja: "Loja virtual",
                blog: "Portal / blog",
                outro: "Outro"
            };
            var objetivoLabel = objetivoMap[objetivoKey] || objetivoKey || "Não informado";

            var destinoWhatsapp = "5531982606442";
            var destinoEmail = "leandros2kat@gmail.com";
            var destinoLinkedIn = "https://www.linkedin.com/in/leandro-h-p-sena/";

            var payload = "Olá! Recebi uma solicitação de orçamento pelo site.\n\n" +
                "Nome: " + nome + "\n" +
                "E-mail: " + email + "\n" +
                "Objetivo: " + objetivoLabel + "\n\n" +
                "Mensagem do cliente:\n" + mensagemCliente + "\n\n" +
                "Link do formulário: " + String(window.location.href || "") + "\n";

            var subject = "Solicitação de orçamento - " + (nome || "Cliente");

            // Abre as notificações (WhatsApp + e-mail). No LinkedIn, copiamos a mensagem
            // para que você cole na conversa/DM.
            try {
                var waUrl = "https://wa.me/" + destinoWhatsapp + "?text=" + encodeURIComponent(payload);
                window.open(waUrl, "_blank", "noopener,noreferrer");
            } catch (err) { }

            try {
                var mailtoUrl = "mailto:" + destinoEmail +
                    "?subject=" + encodeURIComponent(subject) +
                    "&body=" + encodeURIComponent(payload);
                window.open(mailtoUrl, "_blank", "noopener,noreferrer");
            } catch (err) { }

            try {
                // Tenta copiar para colar no LinkedIn (muitas contas bloqueiam pré-preenchimento via URL).
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(payload).catch(function () { });
                }
                window.open(destinoLinkedIn, "_blank", "noopener,noreferrer");
            } catch (err) { }

            formSuccess.hidden = false;
            formOrcamento.reset();
            formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
            formSuccess.focus({ preventScroll: true });
        });
    }
})();
