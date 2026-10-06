import { useState } from "react";
import "./Entrada.css";

function Entrada({ cambiarPantalla }) {
    const [entrando, setEntrando] = useState(false);

    const entrarCastillo = () => {
        if (entrando) return;

        setEntrando(true);

        // 1.25 s abriendo + 0.55 s entrando
        setTimeout(() => {
            cambiarPantalla("taberna");
        }, 800);
    };

    return (
        <main className={`entrada-escenario ${entrando ? "entrando" : ""}`}>

            <div className="entrada-contenedor-puerta">

                {/* Fondo de piedras */}
                <img
                    src="/recursos/imagenes/fondo_piedras.png"
                    alt=""
                    className="entrada-piedras"
                    draggable="false"
                />

                {/* Puerta animada */}
                <div
                    className={`entrada-puerta-animada ${
                        entrando ? "abriendo" : ""
                    }`}
                    aria-hidden="true"
                />

                {/* Hojas */}
                <img
                    src="/recursos/imagenes/hojas_png.png"
                    alt=""
                    className="entrada-hojas-verdes"
                    draggable="false"
                />

                {/* Zona para entrar */}
                <button
                    className="entrada-area-colision"
                    onClick={entrarCastillo}
                    disabled={entrando}
                    aria-label="Entrar al castillo"
                />

            </div>

        </main>
    );
}

export default Entrada;