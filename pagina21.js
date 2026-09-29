const usuario = "kaiser";

let misionActivaId = null;


// ==============================
// ELEMENTOS
// ==============================

const zonaMision =
    document.getElementById("zona-mision");

const zonaSinMision =
    document.getElementById("sin-mision");

const imagen =
    document.getElementById("imagen-pergamino-mesa");

const categoria =
    document.getElementById("mesa-mision-categoria");

const descripcion =
    document.getElementById("mesa-mision-descripcion");

const prioridad =
    document.getElementById("mesa-mision-prioridad");

const recompensa =
    document.getElementById("mesa-mision-recompensa");

const roles =
    document.getElementById("mesa-mision-roles");

const botonEntregar =
    document.getElementById("boton-entregar-quest");

const inputArchivo =
    document.getElementById("archivo-mision");

const cuadroSubir =
    document.querySelector(".cuadro-subir-archivo");


// ==============================
// ESTADO INICIAL
// ==============================

zonaMision.style.display = "none";
zonaSinMision.style.display = "none";


// ==============================
// CARGAR MISIÓN
// ==============================

async function cargarMision() {

    try {

        const respuesta = await fetch(
            `http://localhost:8000/api/mision-activa/${usuario}/`
        );

        if (!respuesta.ok) {
            throw new Error(
                `Error del servidor: ${respuesta.status}`
            );
        }

        const datos = await respuesta.json();


        // ==========================
        // NO HAY MISIÓN
        // ==========================

        if (!datos.tiene_mision) {

            mostrarSinMision();

            return;
        }


        // ==========================
        // HAY MISIÓN
        // ==========================

        mostrarMision(datos);


    } catch (error) {

        console.error(
            "Error al cargar la misión:",
            error
        );

        mostrarSinMision();

    }

}


// ==============================
// MOSTRAR MISIÓN
// ==============================

function mostrarMision(datos) {

    zonaSinMision.style.display = "none";
    zonaMision.style.display = "block";

    misionActivaId = datos.id;


    categoria.textContent =
        datos.categoria;


    descripcion.textContent =
        datos.descripcion;


    const prioridadSegura =
        Math.max(
            0,
            Math.min(5, datos.prioridad)
        );


    prioridad.textContent =
        "Prioridad " +
        "★".repeat(prioridadSegura) +
        "☆".repeat(5 - prioridadSegura);


    recompensa.textContent =
        `Recompensa ${datos.recompensa} ${
            datos.recompensa === 1
                ? "punto"
                : "puntos"
        }`;


    if (
        datos.roles &&
        datos.roles.length > 0
    ) {

        roles.textContent =
            "Exclusivo " +
            datos.roles.join(" o ");

    } else {

        roles.textContent =
            "Cualquiera";

    }


    imagen.src =
        `recursos/imagenes/quest/${datos.numero_pergamino}.png`;

}


// ==============================
// SIN MISIÓN
// ==============================

function mostrarSinMision() {

    misionActivaId = null;

    zonaMision.style.display = "none";
    zonaSinMision.style.display = "flex";

}


// ==============================
// CLICK PARA SUBIR
// ==============================

cuadroSubir.addEventListener(
    "click",
    function (event) {

        if (event.target === botonEntregar) {
            return;
        }

        inputArchivo.click();

    }
);


// ==============================
// ARCHIVO SELECCIONADO
// ==============================

inputArchivo.addEventListener(
    "change",
    function () {

        if (!inputArchivo.files.length) {
            return;
        }

        cuadroSubir.querySelector("p").textContent =
            inputArchivo.files[0].name;

    }
);


// ==============================
// DRAG & DROP
// ==============================

cuadroSubir.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        cuadroSubir.classList.add(
            "archivo-encima"
        );

    }
);


cuadroSubir.addEventListener(
    "dragleave",
    function () {

        cuadroSubir.classList.remove(
            "archivo-encima"
        );

    }
);


cuadroSubir.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        cuadroSubir.classList.remove(
            "archivo-encima"
        );


        if (!event.dataTransfer.files.length) {
            return;
        }


        inputArchivo.files =
            event.dataTransfer.files;


        cuadroSubir.querySelector("p").textContent =
            event.dataTransfer.files[0].name;

    }
);


// ==============================
// ENTREGAR QUEST
// ==============================

botonEntregar.addEventListener(
    "click",
    async function (event) {

        event.stopPropagation();


        if (!misionActivaId) {
            return;
        }


        const confirmar = confirm(
            "¿Seguro que quieres entregar esta Quest?"
        );


        if (!confirmar) {
            return;
        }


        botonEntregar.disabled = true;

        botonEntregar.textContent =
            "Entregando...";


        try {

            const respuesta = await fetch(
                `http://localhost:8000/api/misiones/${misionActivaId}/entregar/`,
                {
                    method: "POST"
                }
            );


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {

                throw new Error(
                    resultado.error ||
                    "No se pudo entregar la misión."
                );

            }


            botonEntregar.textContent =
                "✓ Quest entregada";


            setTimeout(
                function () {

                    window.location.href =
                        "pagina20.html";

                },
                800
            );


        } catch (error) {

            console.error(
                "Error al entregar:",
                error
            );


            alert(
                error.message
            );


            botonEntregar.disabled = false;

            botonEntregar.textContent =
                "💎 Entregar Quest";

        }

    }
);


// ==============================
// INICIAR
// ==============================

cargarMision();