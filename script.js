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
            formSuccess.hidden = false;
            formOrcamento.reset();
            formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
            formSuccess.focus({ preventScroll: true });
        });
    }
})();
