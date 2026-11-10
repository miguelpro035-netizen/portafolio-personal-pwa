/* ==========================================
   PORTAFOLIO PERSONAL - MIGUEL ANGEL
   JQUERY + EVENTOS + VALIDACIONES + PWA
========================================== */

$(document).ready(function () {

    // 1. DETECCIÓN DE DISPOSITIVO
    const esMovil = window.matchMedia("(max-width: 768px)").matches;

    $("#deviceMessage").text(
        esMovil
        ? "📱 Vista optimizada para celular o tablet"
        : "💻 Vista optimizada para computadora"
    );

    // 2. MENÚ HAMBURGUESA CON SLIDETOGGLE
    $("#hamburgerBtn").on("click", function () {

        $("#mainMenu").stop(true, true).slideToggle(300);

        const expanded = $(this).attr("aria-expanded") === "true";

        $(this).attr("aria-expanded", !expanded);
        $(this).text(expanded ? "☰" : "✕");
    });

    // EVENT BUBBLING Y DELEGACIÓN DE EVENTOS
    // El evento se escucha desde el contenedor principal.
    $("body").on("click", "#mainMenu a", function () {

        if (window.matchMedia("(max-width: 900px)").matches) {
            $("#mainMenu").stop(true, true).slideUp(250);
            $("#hamburgerBtn")
                .attr("aria-expanded", "false")
                .text("☰");
        }
    });

    // 3. MODO OSCURO Y CLARO
    const temaGuardado = localStorage.getItem("temaPersonal");

    if (temaGuardado === "claro") {
        $("body").addClass("light-mode");
    }

    $("#themeToggle").on("click", function () {

        $("body").toggleClass("light-mode");

        const nuevoTema = $("body").hasClass("light-mode")
            ? "claro"
            : "oscuro";

        localStorage.setItem("temaPersonal", nuevoTema);

        $(this).text(
            nuevoTema === "claro" ? "🌙" : "☀️"
        );
    });

    $("#themeToggle").text(
        $("body").hasClass("light-mode") ? "🌙" : "☀️"
    );

    // 4. FILTRO DINÁMICO DE TRES CAPAS
    const datosPerfil = {
        academico: {
            nombre: "Área académica",
            categorias: {
                programacion: {
                    nombre: "Programación",
                    elementos: {
                        html: "HTML: estructura de páginas web.",
                        css: "CSS: diseño y presentación visual.",
                        javascript: "JavaScript: interactividad y lógica web.",
                        cpp: "C++: fundamentos de programación."
                    }
                },
                universidad: {
                    nombre: "Formación universitaria",
                    elementos: {
                        sistemas: "Ingeniería de Sistemas: formación tecnológica.",
                        bases: "Bases de Datos: organización de información.",
                        redes: "Redes: comunicación entre dispositivos."
                    }
                }
            }
        },

        personal: {
            nombre: "Área personal",
            categorias: {
                aficiones: {
                    nombre: "Aficiones",
                    elementos: {
                        musica: "Música: entretenimiento y expresión.",
                        deportes: "Deportes: actividad y recreación.",
                        viajes: "Viajes: conocer nuevos lugares."
                    }
                },
                preferencias: {
                    nombre: "Preferencias",
                    elementos: {
                        tecnologia: "Tecnología: innovación y aprendizaje.",
                        aprendizaje: "Aprendizaje: descubrir nuevos conocimientos."
                    }
                }
            }
        },

        profesional: {
            nombre: "Área profesional",
            categorias: {
                habilidades: {
                    nombre: "Habilidades",
                    elementos: {
                        desarrollo: "Desarrollo web y creación de interfaces.",
                        trabajo: "Trabajo en equipo y colaboración.",
                        creatividad: "Creatividad y resolución de problemas."
                    }
                },
                objetivos: {
                    nombre: "Objetivos",
                    elementos: {
                        graduacion: "Concluir la carrera universitaria.",
                        proyectos: "Desarrollar proyectos tecnológicos.",
                        experiencia: "Adquirir experiencia profesional."
                    }
                }
            }
        }
    };

    const $area = $("#areaSelect");
    const $categoria = $("#moduleSelect");
    const $elemento = $("#itemSelect");
    const $resultado = $("#filterResult");

    // CAPA 1: ÁREA
    $area.on("change", function () {

        const area = $(this).val();

        $categoria.html('<option value="">Selecciona una categoría</option>');
        $elemento.html('<option value="">Selecciona un elemento</option>');

        $categoria.prop("disabled", true);
        $elemento.prop("disabled", true);

        if (!area || !datosPerfil[area]) {
            $resultado.text("Selecciona un área para continuar.");
            return;
        }

        $.each(datosPerfil[area].categorias, function (key, categoria) {
            $categoria.append(
                $("<option>", {
                    value: key,
                    text: categoria.nombre
                })
            );
        });

        $categoria.prop("disabled", false);

        $resultado.text("Área seleccionada: " + datosPerfil[area].nombre);
        $resultado.hide().fadeIn(350);
    });

    // CAPA 2: CATEGORÍA
    $categoria.on("change", function () {

        const area = $area.val();
        const categoria = $(this).val();

        $elemento.html('<option value="">Selecciona un elemento</option>');
        $elemento.prop("disabled", true);

        if (!area || !categoria ||
            !datosPerfil[area]?.categorias[categoria]) {
            $resultado.text("Selecciona una categoría válida.");
            return;
        }

        const elementos = datosPerfil[area].categorias[categoria].elementos;

        $.each(elementos, function (key, descripcion) {
            $elemento.append(
                $("<option>", {
                    value: key,
                    text: key.charAt(0).toUpperCase() + key.slice(1)
                })
            );
        });

        $elemento.prop("disabled", false);

        $resultado.text("Categoría: " +
            datosPerfil[area].categorias[categoria].nombre);

        $resultado.hide().fadeIn(350);
    });

    // CAPA 3: ELEMENTO
    $elemento.on("change", function () {

        const area = $area.val();
        const categoria = $categoria.val();
        const elemento = $(this).val();

        if (!area || !categoria || !elemento) {
            $resultado.text("Completa las tres capas.");
            return;
        }

        const descripcion =
            datosPerfil[area].categorias[categoria].elementos[elemento];

        if (!descripcion) {
            $resultado.text("No se encontró información.");
            return;
        }

        $resultado.stop(true, true).fadeOut(150, function () {
            $(this).html(
                "<strong>Elemento seleccionado:</strong><br>" +
                $("<div>").text(descripcion).html()
            ).fadeIn(350);
        });
    });

    // 5. VALIDACIÓN ESTRICTA DEL FORMULARIO
    const $nombre = $("#nombre");
    const $correo = $("#correo");
    const $mensaje = $("#mensaje");
    const $acepto = $("#acepto");

    function mostrarError(campo, mensaje, selectorError) {

        $(selectorError).text(mensaje);

        $(campo)
            .removeClass("valid")
            .toggleClass("invalid", mensaje !== "");
    }

    function validarNombre() {

        const valor = $nombre.val().trim();

        const expresion = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:[ '-][A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)+$/;

        if (valor.length < 5 || valor.length > 60) {
            mostrarError($nombre, "Ingrese su nombre completo (5 a 60 caracteres).", "#nombreError");
            return false;
        }

        if (!expresion.test(valor)) {
            mostrarError($nombre, "Utilice letras y espacios; no se permiten números ni símbolos.", "#nombreError");
            return false;
        }

        mostrarError($nombre, "", "#nombreError");
        $nombre.addClass("valid");
        return true;
    }

    function validarCorreo() {

        const valor = $correo.val().trim();

        const expresion = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (valor.length > 254 || !expresion.test(valor)) {
            mostrarError($correo, "Ingrese un correo electrónico válido.", "#correoError");
            return false;
        }

        mostrarError($correo, "", "#correoError");
        $correo.addClass("valid");
        return true;
    }

    function validarMensaje() {

        const valor = $mensaje.val().trim();

        if (valor.length < 15 || valor.length > 500) {
            mostrarError($mensaje, "El mensaje debe tener entre 15 y 500 caracteres.", "#mensajeError");
            return false;
        }

        if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(valor)) {
            mostrarError($mensaje, "El mensaje debe contener texto.", "#mensajeError");
            return false;
        }

        mostrarError($mensaje, "", "#mensajeError");
        $mensaje.addClass("valid");
        return true;
    }

    function validarAceptacion() {

        if (!$acepto.is(":checked")) {
            $("#aceptoError").text("Debe confirmar que sus datos son correctos.");
            return false;
        }

        $("#aceptoError").text("");
        return true;
    }

    // VALIDACIÓN EN TIEMPO REAL: KEYUP
    $nombre.on("keyup blur", validarNombre);
    $correo.on("keyup blur", validarCorreo);
    $mensaje.on("keyup blur", validarMensaje);
    $acepto.on("change", validarAceptacion);

    // EVENTO SUBMIT + PREVENTDEFAULT
    $("#contactForm").on("submit", function (event) {

        event.preventDefault();

        const nombreValido = validarNombre();
        const correoValido = validarCorreo();
        const mensajeValido = validarMensaje();
        const aceptacionValida = validarAceptacion();

        const formularioValido =
            nombreValido &&
            correoValido &&
            mensajeValido &&
            aceptacionValida;

        if (!formularioValido) {

            $("#formResponse")
                .removeClass("success")
                .addClass("error-response")
                .text("Revise los campos. Hay información incorrecta o incompleta.")
                .hide().fadeIn(300);

            return;
        }

        $("#formResponse")
            .removeClass("error-response")
            .addClass("success")
            .text("¡Validación exitosa! El formulario está correctamente completado. Esta demostración no envía datos a un servidor.")
            .hide().fadeIn(400);

        // No se simula un envío real ni se almacenan datos personales.
        this.reset();

        $(".form-group input, .form-group textarea").removeClass("valid invalid");
    });

    // 6. EFECTOS DE INTERFAZ
    $(".info-card").each(function (indice) {
        $(this).css("animation-delay", (indice * 0.08) + "s");
    });

    // 7. REGISTRO DEL SERVICE WORKER
    if ("serviceWorker" in navigator) {

        navigator.serviceWorker.register("./sw.js")
            .then(function () {
                $("#pwaStatus").text("✓ Aplicación PWA preparada");
            })
            .catch(function (error) {
                console.error("Error al registrar PWA:", error);
                $("#pwaStatus").text("No se pudo registrar el modo PWA.");
            });

    } else {
        $("#pwaStatus").text("Este navegador no admite Service Workers.");
    }

    // 8. CAMBIO DE VISTA AL REDIMENSIONAR
    $(window).on("resize", function () {

        const movil = window.matchMedia("(max-width: 768px)").matches;

        $("#deviceMessage").text(
            movil
            ? "📱 Vista optimizada para celular o tablet"
            : "💻 Vista optimizada para computadora"
        );
    });

    // SCROLL REVEAL
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add("active");
            observador.unobserve(entrada.target);
        }
    });
}, {
    threshold: 0.15
});

document.querySelectorAll(".reveal").forEach(elemento => {
    observador.observe(elemento);
});

// BARRA DE PROGRESO DEL SCROLL
$("body").prepend('<div class="scroll-progress"></div>');

$(window).on("scroll", function () {
    const scrollTop = $(window).scrollTop();
    const altura = $(document).height() - $(window).height();

    const progreso = altura > 0
        ? (scrollTop / altura) * 100
        : 0;

    $(".scroll-progress").css("width", progreso + "%");
});
});