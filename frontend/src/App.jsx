import { lazy, Suspense, useState } from "react";

import Entrada from "./components/Entrada";

const Taberna = lazy(() => import("./components/Taberna"));
const TablonQuests = lazy(() => import("./components/TablonQuests"));
const QuestActiva = lazy(() => import("./components/QuestActiva"));
const NPC = lazy(() => import("./components/NPC/NPC"));

const GestionMisiones = lazy(() =>
    import("./components/GestionMisiones")
);


function App() {

    const [pantalla, setPantalla] = useState("entrada");

    const [npcSeleccionado, setNpcSeleccionado] =
        useState(null);

    const [salaTaberna, setSalaTaberna] =
        useState(1);

    const [regresandoDesdeQuest, setRegresandoDesdeQuest] =
        useState(false);


    // =====================================================
    // NPC
    // =====================================================

    const abrirNPC = (
        idPersonaje,
        salaOrigen
    ) => {

        setSalaTaberna(salaOrigen);

        setNpcSeleccionado(idPersonaje);

        setPantalla("npc");

    };


    const volverDesdeNPC = () => {

        setNpcSeleccionado(null);

        setPantalla("taberna");

    };


    // =====================================================
    // QUEST
    // =====================================================

    const volverDesdeQuest = () => {

        setSalaTaberna(1);

        setRegresandoDesdeQuest(true);

        setPantalla("taberna");

    };


    const terminarRegresoQuest = () => {

        setRegresandoDesdeQuest(false);

    };


    // =====================================================
    // ATAJO AL CRUD
    // Ctrl + Shift + M
    // =====================================================

    const manejarTecla = (event) => {

        if (
            event.ctrlKey &&
            event.shiftKey &&
            event.key.toLowerCase() === "m"
        ) {

            setPantalla("gestion");

        }

    };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div
            onKeyDown={manejarTecla}
            tabIndex={0}
            style={{ outline: "none" }}
        >


            {/* =================================================
                ACCESO A GESTIÓN DE QUESTS
                CRUD LABORATORIO 8
               ================================================= */}

            {pantalla !== "gestion" && (

                <button
                    onClick={() =>
                        setPantalla("gestion")
                    }

                    style={{
                        position: "fixed",

                        // ARRIBA A LA IZQUIERDA
                        top: "20px",
                        left: "20px",

                        zIndex: 99999,

                        // BOTÓN MÁS GRANDE
                        padding: "15px 25px",

                        background:
                            "linear-gradient(#c88a32, #754014)",

                        color: "#ffe3a3",

                        border:
                            "3px solid #d6a34d",

                        borderRadius: "7px",

                        fontFamily:
                            "Georgia, 'Times New Roman', serif",

                        fontSize: "18px",

                        fontWeight: "bold",

                        cursor: "pointer",

                        boxShadow:
                            "0 5px 12px rgba(0, 0, 0, 0.7)",

                        textShadow:
                            "0 2px 2px #000",

                        letterSpacing: "0.4px",
                    }}
                >

                    ⚙ Gestión de Quests

                </button>

            )}


            <Suspense fallback={null}>


                {/* =================================================
                    ENTRADA
                   ================================================= */}

                {pantalla === "entrada" && (

                    <Entrada
                        cambiarPantalla={
                            setPantalla
                        }
                    />

                )}


                {/* =================================================
                    TABERNA
                   ================================================= */}

                {pantalla === "taberna" && (

                    <Taberna
                        cambiarPantalla={
                            setPantalla
                        }

                        abrirNPC={
                            abrirNPC
                        }

                        salaInicial={
                            salaTaberna
                        }

                        setSalaGuardada={
                            setSalaTaberna
                        }

                        regresandoDesdeQuest={
                            regresandoDesdeQuest
                        }

                        terminarRegresoQuest={
                            terminarRegresoQuest
                        }
                    />

                )}


                {/* =================================================
                    TABLÓN DE QUESTS
                   ================================================= */}

                {pantalla === "tablon" && (

                    <TablonQuests
                        cambiarPantalla={
                            setPantalla
                        }
                    />

                )}


                {/* =================================================
                    QUEST ACTIVA
                   ================================================= */}

                {pantalla === "questActiva" && (

                    <QuestActiva
                        cambiarPantalla={
                            setPantalla
                        }

                        volverDesdeQuest={
                            volverDesdeQuest
                        }
                    />

                )}


                {/* =================================================
                    NPC
                   ================================================= */}

                {pantalla === "npc" &&
                    npcSeleccionado && (

                    <NPC
                        personaje={
                            npcSeleccionado
                        }

                        volver={
                            volverDesdeNPC
                        }
                    />

                )}


                {/* =================================================
                    GESTIÓN DE MISIONES
                    CRUD REACT + DJANGO REST
                   ================================================= */}

                {pantalla === "gestion" && (

                    <GestionMisiones
                        cambiarPantalla={
                            setPantalla
                        }
                    />

                )}


            </Suspense>

        </div>

    );

}


export default App;