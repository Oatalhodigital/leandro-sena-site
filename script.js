// Inicialização do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB07tis8vUZzDlaM2GDiROn-xmxXgHdVtQ",
  authDomain: "leandro-sena-web.firebaseapp.com",
  projectId: "leandro-sena-web",
  storageBucket: "leandro-sena-web.firebasestorage.app",
  messagingSenderId: "125091906843",
  appId: "1:125091906843:web:4ccd0c80f44487ab417fbe",
  measurementId: "G-KRQ7CRLCSM"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

(function () {
    // FAQ Accordion
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

    // Reveal Animation
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

    // Mobile Navigation
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

    // Footer Year
    var y = document.getElementById("year");
    if (y) {
        y.textContent = String(new Date().getFullYear());
    }

    // Formulário de Solicitação de Projeto
    var formOrcamento = document.getElementById("form-orcamento");
    var formSuccess = document.getElementById("form-success");
    var btnReuniao = document.getElementById("btn-reuniao");

    if (formOrcamento && formSuccess) {
        formOrcamento.addEventListener("submit", function (e) {
            e.preventDefault();
            
            if (!formOrcamento.checkValidity()) {
                formOrcamento.reportValidity();
                return;
            }

            // Desabilita o botão para evitar envios duplicados
            var submitBtn = formOrcamento.querySelector('button[type="submit"]');
            var originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Enviando...";

            var formData = new FormData(formOrcamento);
            var nome = String(formData.get("nome") || "").trim();
            var email = String(formData.get("email") || "").trim();
            var whatsapp = String(formData.get("whatsapp") || "").trim();
            var objetivo = String(formData.get("objetivo") || "").trim();
            var descricao = String(formData.get("descricao") || "").trim();

            // Salvar no Firebase
            salvarLeadFirebase(nome, email, whatsapp, objetivo, descricao)
                .then(function() {
                    // Enviar WhatsApp para Leandro
                    enviarWhatsAppLeandro(nome, whatsapp, objetivo, descricao);
                    
                    // Mostrar mensagem de sucesso
                    formSuccess.hidden = false;
                    formOrcamento.reset();
                    formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    formSuccess.focus({ preventScroll: true });
                })
                .catch(function(error) {
                    console.error("Erro ao salvar lead:", error);
                    alert("Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente ou entre em contato diretamente pelo WhatsApp.");
                })
                .finally(function() {
                    // Reabilita o botão
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
        });
    }

    // Configurar link de reunião
    if (btnReuniao) {
        btnReuniao.addEventListener("click", function(e) {
            e.preventDefault();
            // Link do Google Meet (você pode alterar este link)
            var meetingLink = "https://meet.google.com/abc-defg-hij";
            window.open(meetingLink, "_blank");
        });
    }

    // Função para salvar lead no Firebase
    function salvarLeadFirebase(nome, email, whatsapp, objetivo, descricao) {
        var leadData = {
            nome: nome,
            email: email,
            whatsapp: whatsapp,
            objetivo: objetivo,
            descricao: descricao,
            dataCriacao: firebase.firestore.FieldValue.serverTimestamp(),
            status: "novo",
            origem: "site_leandro_sena"
        };

        return db.collection("orcamentos").add(leadData)
            .then(function(docRef) {
                console.log("Lead salvo com ID: ", docRef.id);
                console.log("Dados salvos:", leadData);
                return docRef;
            })
            .catch(function(error) {
                console.error("Erro ao salvar lead: ", error);
                throw error;
            });
    }

    // Função para enviar WhatsApp para Leandro
    function enviarWhatsAppLeandro(nome, whatsapp, objetivo, descricao) {
        // Mapear objetivo para texto legível
        var objetivoMap = {
            "estetica": "Estética",
            "design": "Design", 
            "comercial": "Comercial",
            "site-pessoal": "Site Pessoal",
            "empresarial": "Empresarial",
            "outros": "Outros"
        };
        var objetivoLabel = objetivoMap[objetivo] || objetivo || "Não informado";

        var mensagem = "🚀 *Novo Lead Recebido!*\n\n" +
            "👤 *Nome:* " + nome + "\n" +
            "📱 *WhatsApp:* " + whatsapp + "\n" +
            "🎯 *Objetivo:* " + objetivoLabel + "\n" +
            "📝 *Problema:* " + descricao + "\n\n" +
            "🔗 *Ação Necessária:* Entrar em contato em até 2 horas\n" +
            "📅 *Próximo Passo:* Agendar reunião de diagnóstico";

        var whatsappUrl = "https://wa.me/5531982606442?text=" + encodeURIComponent(mensagem);
        
        // Abre o WhatsApp em uma nova aba
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }

    // Validação de telefone (formato brasileiro) - Versão simplificada
    var whatsappInput = document.querySelector('input[name="whatsapp"]');
    if (whatsappInput) {
        // Garantir que o campo está habilitado
        whatsappInput.disabled = false;
        whatsappInput.readOnly = false;
        whatsappInput.removeAttribute('disabled');
        whatsappInput.removeAttribute('readonly');
        
        whatsappInput.addEventListener('input', function(e) {
            var value = e.target.value.replace(/\D/g, '');
            var maxLength = 11;
            
            // Limitar a 11 dígitos
            if (value.length > maxLength) {
                value = value.substring(0, maxLength);
            }
            
            // Aplicar formatação
            if (value.length > 0) {
                if (value.length <= 2) {
                    e.target.value = '(' + value;
                } else if (value.length <= 6) {
                    e.target.value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
                } else if (value.length <= 10) {
                    e.target.value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 6) + '-' + value.substring(6);
                } else {
                    e.target.value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7, 11);
                }
            } else {
                e.target.value = '';
            }
        });
        
        // Permitir apenas números, backspace, delete, setas
        whatsappInput.addEventListener('keydown', function(e) {
            // Permitir: backspace (8), delete (46), tab (9), escape (27), enter (13)
            // Permitir: setas (37-40), home (36), end (35)
            if ([8, 9, 13, 27, 46, 37, 38, 39, 40, 36, 35].includes(e.keyCode)) {
                return;
            }
            
            // Permitir apenas números (48-57) e números do numpad (96-105)
            if (!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105))) {
                e.preventDefault();
            }
        });
        
        console.log('✅ Campo WhatsApp habilitado e com máscara aplicada');
    } else {
        console.log('❌ Campo WhatsApp não encontrado');
    }

    // Otimização de performance: Lazy loading para imagens
    if ('IntersectionObserver' in window) {
        var imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // Adicionar indicador de carregamento para melhor UX
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Verificação adicional do campo WhatsApp
        var whatsappInput = document.querySelector('input[name="whatsapp"]');
        if (whatsappInput) {
            console.log('🔍 Verificação do campo WhatsApp:');
            console.log('- Tipo:', whatsappInput.type);
            console.log('- Disabled:', whatsappInput.disabled);
            console.log('- ReadOnly:', whatsappInput.readOnly);
            console.log('- Required:', whatsappInput.required);
            
            // Forçar habilitação
            whatsappInput.disabled = false;
            whatsappInput.readOnly = false;
            whatsappInput.focus();
            whatsappInput.blur();
            
            console.log('✅ Campo WhatsApp verificado e habilitado');
        }
    });

})();
