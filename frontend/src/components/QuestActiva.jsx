import { useEffect, useState } from "react";

import "./QuestActiva.css";

import { misionesApi } from "../api/client";


function QuestActiva({
    cambiarPantalla,
    volverDesdeQuest
}) {

    const usuario = "kaiser";

    const [mision, setMision] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [enlaceDrive, setEnlaceDrive] = useState("");
    const [entregando, setEntregando] = useState(false);
    const [entregada, setEntregada] = useState(false);
    const [error, setError] = useState("");
    const [regresando, setRegresando] = useState(false);


    // =====================================================
    // CARGAR MISIÓN ACTIVA
    // =====================================================

    useEffect(() => {

        cargarMision();

    }, []);


    async function cargarMision() {

        try {

            setCargando(true);
            setError("");

            /*
                Ya no hacemos fetch directamente.

                client.js se encarga de comunicarse
                con Django.
            */

            const datos =
                await misionesApi.activa(usuario);


            if (!datos.tiene_mision) {

                setMision(null);

                return;

            }


            setMision(datos);


        } catch (error) {

            console.error(
                "Error al cargar la misión:",
                error
            );

            setError(
                "No se pudo conectar con el gremio."
            );

            setMision(null);


        } finally {

            setCargando(false);

        }

    }


    // =====================================================
    // VÍNCULO DE ENTREGA
    // =====================================================

    const vinculoActivo =
        enlaceDrive.trim().length > 0;


    // =====================================================
    // PRECARGAR RUNAS
    // =====================================================

    useEffect(() => {

        const imagenes = [
            "/recursos/imagenes/runa.png",
            "/recursos/imagenes/runa2.png"
        ];


        imagenes.forEach((src) => {

            const imagen = new Image();

            imagen.src = src;

        });

    }, []);


    const textoCircular = vinculoActivo

        ? `${enlaceDrive.trim()}  ✦  ${enlaceDrive.trim()}  ✦  `

        : "✦ VÍNCULO SIN ESTABLECER ✦ VÍNCULO SIN ESTABLECER ✦ ";


    // =====================================================
    // REGRESAR A LA TABERNA
    // =====================================================

    const regresarTaberna = () => {

        if (regresando) {
            return;
        }


        setRegresando(true);


        setTimeout(() => {

            if (volverDesdeQuest) {

                volverDesdeQuest();

            } else {

                cambiarPantalla("taberna");

            }

        }, 700);

    };


    // =====================================================
    // ENTREGAR QUEST
    // =====================================================

    async function entregarQuest() {

        if (
            !mision ||
            !vinculoActivo ||
            entregando ||
            entregada
        ) {

            return;

        }


        const confirmar = window.confirm(
            "¿Quieres sellar este vínculo y entregar la Quest?"
        );


        if (!confirmar) {
            return;
        }


        try {

            setEntregando(true);

            setError("");


            /*
                Antes aquí había un fetch POST directo.

                Ahora client.js se encarga de:
                - construir la URL
                - hacer el POST
                - comprobar errores HTTP
                - procesar la respuesta
            */

            await misionesApi.entregar(
                mision.id
            );


            setEntregada(true);


            setTimeout(() => {

                if (volverDesdeQuest) {

                    volverDesdeQuest();

                } else {

                    cambiarPantalla("taberna");

                }

            }, 1200);


        } catch (error) {

            console.error(
                "Error al entregar:",
                error
            );


            setError(
                error.message ||
                "No se pudo entregar la Quest."
            );


            setEntregando(false);

        }

    }


    // =====================================================
    // CLASE PRINCIPAL
    // =====================================================

    const claseQuest = `
        quest-activa
        ${regresando ? "quest-regresando-taberna" : ""}
    `;


    // =====================================================
    // CARGANDO
    // =====================================================

    if (cargando) {

        return (

            <main className={claseQuest}>

                <div className="quest-cargando">

                    Consultando el registro del gremio...

                </div>


                <div
                    className="quest-capa-transicion"
                    aria-hidden="true"
                />

            </main>

        );

    }


    // =====================================================
    // SIN MISIÓN ACTIVA
    // =====================================================

    if (!mision) {

        return (

            <main className={claseQuest}>

                <button
                    className="quest-boton-regresar"
                    onClick={regresarTaberna}
                    disabled={regresando}
                >

                    ← Regresar

                </button>


                <div className="quest-sin-mision">

                    <div className="quest-mensaje-sin-mision">

                        <div className="quest-icono-sin-mision">

                            ⚔

                        </div>


                        <h1>

                            No tienes una Quest activa

                        </h1>


                        <p>

                            Ve al tablero del gremio y elige una misión.

                        </p>


                        <button
                            className="quest-boton-buscar"

                            onClick={() =>
                                cambiarPantalla("tablon")
                            }

                            disabled={regresando}
                        >

                            Ver tablero de Quests

                        </button>

                    </div>

                </div>


                <div
                    className="quest-capa-transicion"
                    aria-hidden="true"
                />

            </main>

        );

    }


    // =====================================================
    // DATOS VISUALES
    // =====================================================

    const prioridadSegura = Math.max(
        0,
        Math.min(
            5,
            Number(mision.prioridad) || 0
        )
    );


    const estrellas =
        "★".repeat(prioridadSegura) +
        "☆".repeat(5 - prioridadSegura);


    const textoRoles =
        mision.roles &&
        mision.roles.length > 0

            ? mision.roles.join(" o ")

            : "Cualquiera";


    // =====================================================
    // JSX
    // =====================================================

    return (

        <main className={claseQuest}>


            {/* =========================
                REGRESAR
               ========================= */}

            <button
                className="quest-boton-regresar"
                onClick={regresarTaberna}
                disabled={regresando}
            >

                ← Regresar

            </button>


            {/* =========================
                PERGAMINO
               ========================= */}

            <div className="quest-pergamino">

                <img
                    src={
                        `/recursos/imagenes/quest/${mision.numero_pergamino}.png`
                    }

                    alt="Pergamino de la Quest"

                    className="quest-imagen-pergamino"

                    draggable="false"
                />


                <div className="quest-datos">


                    <h4 className="quest-categoria">

                        {mision.categoria}

                    </h4>


                    <p className="quest-descripcion">

                        {mision.descripcion}

                    </p>


                    <div className="quest-datos-inferiores">


                        <div className="quest-prioridad">

                            Prioridad {estrellas}

                        </div>


                        <div className="quest-recompensa">

                            Recompensa{" "}

                            {mision.recompensa}{" "}

                            {mision.recompensa === 1
                                ? "punto"
                                : "puntos"}

                        </div>


                        <div className="quest-roles">

                            Exclusivo {textoRoles}

                        </div>


                    </div>

                </div>

            </div>


            {/* =========================
                ZONA DE ENTREGA
               ========================= */}

            <div className="quest-zona-entrega">


                {/* =========================
                    RUNA / VÍNCULO
                   ========================= */}

                <div
                    className={
                        `quest-circulo-vinculo ${
                            vinculoActivo
                                ? "activo"
                                : ""
                        }`
                    }
                >


                    <div className="quest-capas-runa">

                        <img
                            src="/recursos/imagenes/runa.png"

                            alt=""

                            className="
                                quest-imagen-circulo
                                quest-runa-base
                            "

                            draggable="false"
                        />


                        <img
                            src="/recursos/imagenes/runa2.png"

                            alt="Circuito mágico de vínculo"

                            className="
                                quest-imagen-circulo
                                quest-runa-final
                            "

                            draggable="false"
                        />

                    </div>


                    {/* =========================
                        TEXTO CIRCULAR
                       ========================= */}

                    <svg
                        className="quest-texto-circular"
                        viewBox="0 0 600 600"
                        aria-hidden="true"
                    >

                        <defs>

                            <path
                                id="quest-ruta-vinculo"

                                d="
                                    M 300,300
                                    m -270,0
                                    a 270,270 0 1,1 540,0
                                    a 270,270 0 1,1 -540,0
                                "
                            />

                        </defs>


                        <text>

                            <textPath
                                href="#quest-ruta-vinculo"
                                startOffset="0%"
                            >

                                {textoCircular}

                            </textPath>

                        </text>

                    </svg>


                    {/* =========================
                        INPUT DEL VÍNCULO
                       ========================= */}

                    <input
                        type="url"

                        value={enlaceDrive}

                        onChange={(event) => {

                            setEnlaceDrive(
                                event.target.value
                            );

                        }}

                        className="quest-input-vinculo"

                        placeholder="Pega aquí el vínculo"

                        disabled={
                            entregando ||
                            entregada ||
                            regresando
                        }
                    />

                </div>


                {/* =========================
                    SELLAR QUEST
                   ========================= */}

                <div className="quest-zona-sellar">

                    <button
                        type="button"

                        className={`
                            quest-boton-invocador
                            ${vinculoActivo ? "activo" : ""}
                            ${entregando ? "entregando" : ""}
                            ${entregada ? "entregada" : ""}
                        `}

                        onClick={entregarQuest}

                        disabled={
                            !vinculoActivo ||
                            entregando ||
                            entregada ||
                            regresando
                        }

                        aria-label="Sellar y entregar Quest"
                    >

                        <img
                            src="/recursos/imagenes/invocador/programador.png"

                            alt=""

                            className="quest-imagen-invocador"

                            draggable="false"
                        />

                    </button>


                    <div className="quest-texto-sellar">

                        {entregada

                            ? "✦ QUEST SELLADA ✦"

                            : entregando

                                ? "SELLANDO VÍNCULO..."

                                : vinculoActivo

                                    ? "SELLAR QUEST"

                                    : "ESTABLECE EL VÍNCULO"}

                    </div>

                </div>


                {/* =========================
                    ERROR
                   ========================= */}

                {error && (

                    <div className="quest-error">

                        {error}

                    </div>

                )}

            </div>


            {/* =========================
                TRANSICIÓN
               ========================= */}

            <div
                className="quest-capa-transicion"
                aria-hidden="true"
            />

        </main>

    );

}


export default QuestActiva;