import { useState } from "react";
import "./NPC.css";
import { PERSONAJES } from "./personajes";

function NPC({ personaje, volver }) {
    const npc = PERSONAJES[personaje];

    const [modo, setModo] = useState("menu");
    const [dialogoActual, setDialogoActual] = useState(0);
    const [saliendo, setSaliendo] = useState(false);

    if (!npc) {
        return null;
    }

    const hablar = () => {
        setDialogoActual(0);
        setModo("hablar");
    };

    const siguienteDialogo = () => {
        if (dialogoActual < npc.dialogos.length - 1) {
            setDialogoActual(dialogoActual + 1);
            return;
        }

        setModo("menu");
        setDialogoActual(0);
    };

    const mostrarPuntos = () => {
        setModo("puntos");
    };

    const mostrarArchivos = () => {
        setModo("archivos");
    };

    const volverMenu = () => {
        setModo("menu");
    };

    const regresarTaberna = () => {
        if (saliendo) return;

        setSaliendo(true);

        setTimeout(() => {
            volver();
        }, 550);
    };

    return (
        <main
            className={`npc-pantalla ${saliendo ? "npc-saliendo" : ""}`}
            style={{
                backgroundImage: `url("${npc.imagenDialogo}")`
            }}
        >
            <div
                className="npc-sombra"
                aria-hidden="true"
            />

            <button
                className="npc-boton-volver"
                onClick={regresarTaberna}
                disabled={saliendo}
            >
                ← Volver a la taberna
            </button>

            <div className="npc-identidad">
                <div className="npc-nombre">
                    {npc.nombre}
                </div>

                <div className="npc-rol">
                    {npc.rol}
                </div>
            </div>

            {modo === "menu" && (
                <div className="npc-panel">
                    <div className="npc-panel-titulo">
                        ¿Qué necesitas?
                    </div>

                    <button
                        className="npc-opcion"
                        onClick={hablar}
                    >
                        <span className="npc-icono">
                            💬
                        </span>

                        <span>
                            Hablarle
                        </span>

                        <span className="npc-flecha">
                            ›
                        </span>
                    </button>

                    <button
                        className="npc-opcion"
                        onClick={mostrarPuntos}
                    >
                        <span className="npc-icono">
                            ★
                        </span>

                        <span>
                            ¿Cuántos puntos tienes?
                        </span>

                        <span className="npc-flecha">
                            ›
                        </span>
                    </button>

                    <button
                        className="npc-opcion"
                        onClick={mostrarArchivos}
                    >
                        <span className="npc-icono">
                            📜
                        </span>

                        <span>
                            Muéstrame tus archivos
                        </span>

                        <span className="npc-flecha">
                            ›
                        </span>
                    </button>
                </div>
            )}

            {modo === "hablar" && (
                <div className="npc-dialogo">
                    <div className="npc-dialogo-nombre">
                        {npc.nombre}
                    </div>

                    <div className="npc-dialogo-texto">
                        “{npc.dialogos[dialogoActual]}”
                    </div>

                    <button
                        className="npc-boton-continuar"
                        onClick={siguienteDialogo}
                    >
                        {dialogoActual < npc.dialogos.length - 1
                            ? "Continuar"
                            : "Volver"}
                    </button>
                </div>
            )}

            {modo === "puntos" && (
                <div className="npc-dialogo">
                    <div className="npc-dialogo-nombre">
                        {npc.nombre}
                    </div>

                    <div className="npc-dialogo-texto">
                        Actualmente tengo{" "}
                        <strong>
                            {npc.puntos} puntos
                        </strong>{" "}
                        en el gremio.
                    </div>

                    <button
                        className="npc-boton-continuar"
                        onClick={volverMenu}
                    >
                        Volver
                    </button>
                </div>
            )}

            {modo === "archivos" && (
                <div className="npc-archivos">
                    <div className="npc-archivos-cabecera">
                        <div>
                            Archivos de {npc.nombre}
                        </div>

                        <button
                            className="npc-cerrar-archivos"
                            onClick={volverMenu}
                        >
                            ×
                        </button>
                    </div>

                    <div className="npc-lista-archivos">
                        {npc.archivos.map((archivo, index) => (
                            <button
                                key={index}
                                className="npc-archivo"
                                type="button"
                            >
                                <div className="npc-archivo-icono">
                                    📜
                                </div>

                                <div className="npc-archivo-info">
                                    <div className="npc-archivo-nombre">
                                        {archivo.nombre}
                                    </div>

                                    <div className="npc-archivo-tipo">
                                        {archivo.tipo}
                                    </div>
                                </div>

                                <div className="npc-archivo-flecha">
                                    ›
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        className="npc-boton-archivos-volver"
                        onClick={volverMenu}
                    >
                        Volver
                    </button>
                </div>
            )}

            <div
                className="npc-transicion"
                aria-hidden="true"
            />
        </main>
    );
}

export default NPC;