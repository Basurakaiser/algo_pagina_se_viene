import { useEffect, useState } from "react";

import "./TablonQuests.css";

import { misionesApi } from "../api/client";


function TablonQuests({ cambiarPantalla }) {


    // =====================================================
    // ⚙️ CONFIGURACIÓN
    // =====================================================

    // Temporal hasta implementar login.
    const USUARIO_ACTUAL = "kaiser";


    // =====================================================
    // ESTADOS
    // =====================================================

    const [misiones, setMisiones] = useState([]);

    const [misionSeleccionada, setMisionSeleccionada] =
        useState(null);

    const [cargando, setCargando] = useState(true);

    const [tomandoMision, setTomandoMision] =
        useState(false);

    const [error, setError] = useState("");


    // =====================================================
    // CARGAR MISIONES
    // =====================================================

    useEffect(() => {

        cargarMisiones();

    }, []);


    const cargarMisiones = async () => {

        setCargando(true);
        setError("");

        try {

            /*
                Ya no hacemos fetch directamente aquí.

                TablonQuests le pide las misiones a client.js
                y client.js se encarga de comunicarse con Django.
            */

            const datos =
                await misionesApi.disponibles();


            /*
                Guardamos también una rotación
                aleatoria para cada pergamino.

                Así React NO genera un ángulo nuevo
                cada vez que vuelve a renderizar.
            */

            const misionesPreparadas = datos.map(
                (mision) => ({

                    ...mision,

                    rotacion:
                        (Math.random() * 8) - 4

                })
            );


            setMisiones(misionesPreparadas);


        } catch (error) {

            console.error(
                "Error al conectar con Django:",
                error
            );

            setError(
                "No se pudieron cargar las Quests."
            );

        } finally {

            setCargando(false);

        }

    };


    // =====================================================
    // SELECCIONAR MISIÓN
    // =====================================================

    const seleccionarMision = (mision) => {

        if (tomandoMision) return;

        setMisionSeleccionada(mision);

    };


    // =====================================================
    // TOMAR MISIÓN
    // =====================================================

    const tomarMision = async () => {

        if (!misionSeleccionada) return;
        if (tomandoMision) return;


        setTomandoMision(true);


        try {

            /*
                Antes hacíamos aquí todo el fetch POST.

                Ahora client.js se encarga de:
                - construir la URL
                - usar POST
                - enviar JSON
                - comprobar errores HTTP
                - convertir la respuesta a JSON
            */

            await misionesApi.tomar(
                misionSeleccionada.id,
                USUARIO_ACTUAL
            );


            /*
                Lo conservamos porque tu sistema
                ya utiliza este dato.
            */

            localStorage.setItem(
                "misionActivaId",
                misionSeleccionada.id
            );


            /*
                React cambia de pantalla
                sin recargar la página.
            */

            cambiarPantalla("questActiva");


        } catch (error) {

            console.error(
                "Error al tomar la misión:",
                error
            );

            alert(
                error.message ||
                "No se pudo conectar con el servidor."
            );

            setTomandoMision(false);

        }

    };


    // =====================================================
    // VOLVER A LA TABERNA
    // =====================================================

    const regresar = () => {

        cambiarPantalla("taberna");

    };


    // =====================================================
    // UTILIDADES
    // =====================================================

    const obtenerNumeroPergamino = (
        imagenPergamino
    ) => {

        if (!imagenPergamino) {
            return "1";
        }

        return imagenPergamino
            .replace("pergamino", "")
            .replace(".png", "");

    };


    const obtenerEstrellas = (prioridad) => {

        const prioridadSegura = Math.max(
            0,
            Math.min(5, prioridad || 0)
        );

        return (
            "★".repeat(prioridadSegura) +
            "☆".repeat(5 - prioridadSegura)
        );

    };


    const obtenerRoles = (roles) => {

        if (roles && roles.length > 0) {
            return roles.join(" o ");
        }

        return "Cualquiera";

    };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <main className="tablon-quests">


            {/* =========================
                REGRESAR
               ========================= */}

            <button
                className="tablon-boton-regresar"
                onClick={regresar}
            >

                ← Regresar

            </button>


            {/* =========================
                TOMAR MISIÓN
               ========================= */}

            <button
                className="tablon-boton-tomar"
                onClick={tomarMision}
                disabled={
                    !misionSeleccionada ||
                    tomandoMision
                }
            >

                {tomandoMision
                    ? "Tomando Quest..."
                    : "Tomar misión"}

            </button>


            {/* =========================
                CONTENEDOR
               ========================= */}

            <div className="tablon-contenido">


                {/* =========================
                    CARGANDO
                   ========================= */}

                {cargando && (

                    <p className="tablon-mensaje">

                        Cargando misiones...

                    </p>

                )}


                {/* =========================
                    ERROR
                   ========================= */}

                {!cargando && error && (

                    <div className="tablon-error">

                        <p>{error}</p>

                        <button
                            onClick={cargarMisiones}
                        >

                            Intentar de nuevo

                        </button>

                    </div>

                )}


                {/* =========================
                    SIN QUESTS
                   ========================= */}

                {!cargando &&
                    !error &&
                    misiones.length === 0 && (

                    <p className="tablon-mensaje">

                        No hay Quests disponibles.

                    </p>

                )}


                {/* =========================
                    LISTA DE QUESTS
                   ========================= */}

                {!cargando &&
                    !error &&
                    misiones.map((mision) => {


                        const seleccionada =
                            misionSeleccionada?.id ===
                            mision.id;


                        const numeroPergamino =
                            obtenerNumeroPergamino(
                                mision.imagen_pergamino
                            );


                        const estrellas =
                            obtenerEstrellas(
                                mision.prioridad
                            );


                        const roles =
                            obtenerRoles(
                                mision.roles
                            );


                        return (

                            <div
                                key={mision.id}

                                className={
                                    `tablon-pergamino ${
                                        seleccionada
                                            ? "seleccionada"
                                            : ""
                                    }`
                                }

                                style={{
                                    "--rotacion":
                                        `${mision.rotacion}deg`
                                }}

                                onClick={() =>
                                    seleccionarMision(
                                        mision
                                    )
                                }
                            >


                                {/* =========================
                                    IMAGEN PERGAMINO
                                   ========================= */}

                                <img
                                    src={
                                        `/recursos/imagenes/quest/${numeroPergamino}.png`
                                    }

                                    alt="Pergamino de Misión"

                                    className="tablon-imagen-pergamino"

                                    draggable="false"
                                />


                                {/* =========================
                                    DATOS DE LA MISIÓN
                                   ========================= */}

                                <div className="tablon-datos-mision">


                                    {/* CATEGORÍA */}

                                    <div className="tablon-categoria">

                                        {mision.categoria}

                                    </div>


                                    {/* DESCRIPCIÓN */}

                                    <div className="tablon-descripcion">

                                        {mision.descripcion}

                                    </div>


                                    {/* DETALLES */}

                                    <div className="tablon-detalles">


                                        {/* PRIORIDAD */}

                                        <div className="tablon-prioridad">

                                            Prioridad{" "}
                                            {estrellas}

                                        </div>


                                        {/* RECOMPENSA */}

                                        <div className="tablon-recompensa">

                                            Recompensa{" "}
                                            {mision.recompensa}{" "}

                                            {mision.recompensa === 1
                                                ? "punto"
                                                : "puntos"}

                                        </div>


                                        {/* ROLES */}

                                        <div className="tablon-roles">

                                            Exclusivo{" "}
                                            {roles}

                                        </div>


                                    </div>

                                </div>

                            </div>

                        );

                    })}

            </div>

        </main>

    );

}


export default TablonQuests;