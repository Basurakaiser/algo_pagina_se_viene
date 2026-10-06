import { useEffect, useState } from "react";

import { misionesApi } from "../api/client";

import "./GestionMisiones.css";


const formularioInicial = {
    categoria: "creador_personaje",
    roles_permitidos: "programador",
    asignado_a: "todos",
    estado: "disponible",
    descripcion: "",
    prioridad: 1,
    recompensa_puntos: 1,
    numero_pergamino: 1,
};


function GestionMisiones({ cambiarPantalla }) {

    const [misiones, setMisiones] = useState([]);

    const [formulario, setFormulario] =
        useState(formularioInicial);

    const [editandoId, setEditandoId] =
        useState(null);

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // CARGAR MISIONES
    // =====================================================

    useEffect(() => {

        cargarMisiones();

    }, []);


    async function cargarMisiones() {

        try {

            setCargando(true);
            setError("");

            const datos =
                await misionesApi.listar();

            setMisiones(datos);

        } catch (error) {

            console.error(error);

            setError(
                "No se pudieron cargar las misiones."
            );

        } finally {

            setCargando(false);

        }

    }


    // =====================================================
    // CAMBIAR FORMULARIO
    // =====================================================

    function cambiarCampo(event) {

        const { name, value } =
            event.target;


        setFormulario((anterior) => ({

            ...anterior,

            [name]:
                name === "prioridad" ||
                name === "recompensa_puntos" ||
                name === "numero_pergamino"

                    ? Number(value)

                    : value,

        }));

    }


    // =====================================================
    // CREAR / EDITAR
    // =====================================================

    async function guardarMision(event) {

        event.preventDefault();


        if (!formulario.descripcion.trim()) {

            setError(
                "La descripción es obligatoria."
            );

            return;

        }


        try {

            setGuardando(true);
            setError("");


            if (editandoId) {

                await misionesApi.actualizar(
                    editandoId,
                    formulario
                );

            } else {

                await misionesApi.crear(
                    formulario
                );

            }


            setFormulario(
                formularioInicial
            );

            setEditandoId(null);


            await cargarMisiones();


        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "No se pudo guardar la misión."
            );

        } finally {

            setGuardando(false);

        }

    }


    // =====================================================
    // EDITAR
    // =====================================================

    function comenzarEdicion(mision) {

        setEditandoId(mision.id);


        setFormulario({

            categoria:
                mision.categoria,

            roles_permitidos:
                mision.roles_permitidos,

            asignado_a:
                mision.asignado_a,

            estado:
                mision.estado,

            descripcion:
                mision.descripcion,

            prioridad:
                mision.prioridad,

            recompensa_puntos:
                mision.recompensa_puntos,

            numero_pergamino:
                mision.numero_pergamino,

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    }


    function cancelarEdicion() {

        setEditandoId(null);

        setFormulario(
            formularioInicial
        );

        setError("");

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    async function eliminarMision(id) {

        const confirmar =
            window.confirm(
                "¿Seguro que quieres eliminar esta misión?"
            );


        if (!confirmar) {
            return;
        }


        try {

            setError("");


            await misionesApi.eliminar(id);


            await cargarMisiones();


        } catch (error) {

            console.error(error);


            setError(
                error.message ||
                "No se pudo eliminar la misión."
            );

        }

    }


    // =====================================================
    // JSX
    // =====================================================

    return (

        <main className="gestion-misiones">


            {/* VOLVER */}

            <button
                className="gestion-volver"

                onClick={() =>
                    cambiarPantalla("taberna")
                }
            >

                ← Volver

            </button>


            {/* CABECERA */}

            <header className="gestion-cabecera">

                <h1>
                    Registro del Gremio
                </h1>

                <p>
                    Administración de Quests
                </p>

            </header>


            {/* =========================
                FORMULARIO
               ========================= */}

            <section className="gestion-panel">


                <h2>

                    {editandoId
                        ? `Editar Quest #${editandoId}`
                        : "Publicar nueva Quest"}

                </h2>


                <form
                    className="gestion-formulario"

                    onSubmit={guardarMision}
                >


                    {/* CATEGORÍA */}

                    <div className="gestion-campo">

                        <label>
                            Categoría
                        </label>


                        <select
                            name="categoria"

                            value={
                                formulario.categoria
                            }

                            onChange={
                                cambiarCampo
                            }
                        >

                            <option value="creador_personaje">
                                Creador de personaje
                            </option>

                            <option value="creacion_lore">
                                Creación de lore
                            </option>

                            <option value="juegos_casino">
                                Juegos de casino
                            </option>

                            <option value="mecanicas_jugador">
                                Mecánicas del jugador
                            </option>

                            <option value="npc">
                                NPC
                            </option>

                            <option value="creacion_mapa">
                                Creación del mapa
                            </option>

                            <option value="rogue_lite">
                                Rogue Lite
                            </option>

                        </select>

                    </div>


                    {/* ROLES */}

                    <div className="gestion-campo">

                        <label>
                            Roles permitidos
                        </label>

                        <input
                            name="roles_permitidos"

                            value={
                                formulario.roles_permitidos
                            }

                            onChange={
                                cambiarCampo
                            }
                        />

                    </div>


                    {/* DESCRIPCIÓN */}

                    <div className="
                        gestion-campo
                        gestion-descripcion
                    ">

                        <label>
                            Descripción de la Quest
                        </label>

                        <input
                            name="descripcion"

                            value={
                                formulario.descripcion
                            }

                            onChange={
                                cambiarCampo
                            }

                            placeholder="
                                Describe el objetivo de la Quest...
                            "
                        />

                    </div>


                    {/* ASIGNADO */}

                    <div className="gestion-campo">

                        <label>
                            Aventurero asignado
                        </label>


                        <select
                            name="asignado_a"

                            value={
                                formulario.asignado_a
                            }

                            onChange={
                                cambiarCampo
                            }
                        >

                            <option value="todos">
                                Todos / Libre
                            </option>

                            <option value="kaiser">
                                Kaiser
                            </option>

                            <option value="lea">
                                Lea
                            </option>

                            <option value="ruoye">
                                Ruoye
                            </option>

                            <option value="vicho">
                                Vicho
                            </option>

                            <option value="kano">
                                Kano
                            </option>

                            <option value="walalan">
                                Walalan
                            </option>

                            <option value="hisoka">
                                Hisoka
                            </option>

                        </select>

                    </div>


                    {/* ESTADO */}

                    <div className="gestion-campo">

                        <label>
                            Estado
                        </label>


                        <select
                            name="estado"

                            value={
                                formulario.estado
                            }

                            onChange={
                                cambiarCampo
                            }
                        >

                            <option value="disponible">
                                ⚔ Disponible
                            </option>

                            <option value="en_progreso">
                                ⏳ En progreso
                            </option>

                            <option value="entregada">
                                📨 Entregada
                            </option>

                            <option value="completada">
                                💎 Completada
                            </option>

                        </select>

                    </div>


                    {/* PRIORIDAD */}

                    <div className="gestion-campo">

                        <label>
                            Prioridad
                        </label>

                        <input
                            type="number"

                            min="1"
                            max="5"

                            name="prioridad"

                            value={
                                formulario.prioridad
                            }

                            onChange={
                                cambiarCampo
                            }
                        />

                    </div>


                    {/* PUNTOS */}

                    <div className="gestion-campo">

                        <label>
                            Recompensa
                        </label>

                        <input
                            type="number"

                            min="1"

                            name="recompensa_puntos"

                            value={
                                formulario.recompensa_puntos
                            }

                            onChange={
                                cambiarCampo
                            }
                        />

                    </div>


                    {/* PERGAMINO */}

                    <div className="gestion-campo">

                        <label>
                            Pergamino
                        </label>


                        <select
                            name="numero_pergamino"

                            value={
                                formulario.numero_pergamino
                            }

                            onChange={
                                cambiarCampo
                            }
                        >

                            {[1, 2, 3, 4, 5, 6].map(
                                (numero) => (

                                    <option
                                        key={numero}
                                        value={numero}
                                    >

                                        Pergamino {numero}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* BOTONES */}

                    <div className="
                        gestion-acciones-formulario
                    ">

                        <button
                            className="gestion-boton"

                            type="submit"

                            disabled={guardando}
                        >

                            {guardando

                                ? "Guardando..."

                                : editandoId

                                    ? "Guardar cambios"

                                    : "Publicar Quest"}

                        </button>


                        {editandoId && (

                            <button
                                type="button"

                                className="
                                    gestion-boton
                                    gestion-boton-secundario
                                "

                                onClick={
                                    cancelarEdicion
                                }
                            >

                                Cancelar edición

                            </button>

                        )}

                    </div>

                </form>

            </section>


            {/* ERROR */}

            {error && (

                <div className="gestion-error">

                    ⚠ {error}

                </div>

            )}


            {/* =========================
                LISTADO
               ========================= */}

            <section className="gestion-listado">

                <h2>
                    Libro de Quests
                </h2>


                {cargando ? (

                    <p className="gestion-mensaje">

                        Consultando el registro
                        del gremio...

                    </p>

                ) : misiones.length === 0 ? (

                    <p className="gestion-mensaje">

                        No existen Quests registradas.

                    </p>

                ) : (

                    <div className="
                        gestion-tabla-contenedor
                    ">

                        <table className="gestion-tabla">

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>
                                        Descripción
                                    </th>

                                    <th>
                                        Categoría
                                    </th>

                                    <th>
                                        Estado
                                    </th>

                                    <th>
                                        Puntos
                                    </th>

                                    <th>
                                        Acciones
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {misiones.map(
                                    (mision) => (

                                    <tr
                                        key={
                                            mision.id
                                        }
                                    >

                                        <td>
                                            #{mision.id}
                                        </td>

                                        <td>
                                            {
                                                mision.descripcion
                                            }
                                        </td>

                                        <td>
                                            {
                                                mision.categoria
                                            }
                                        </td>

                                        <td>
                                            {
                                                mision.estado
                                            }
                                        </td>

                                        <td>
                                            {
                                                mision.recompensa_puntos
                                            }
                                        </td>


                                        <td>

                                            <div className="
                                                gestion-tabla-acciones
                                            ">

                                                <button
                                                    onClick={() =>
                                                        comenzarEdicion(
                                                            mision
                                                        )
                                                    }
                                                >

                                                    Editar

                                                </button>


                                                <button
                                                    className="
                                                        gestion-boton-eliminar
                                                    "

                                                    onClick={() =>
                                                        eliminarMision(
                                                            mision.id
                                                        )
                                                    }
                                                >

                                                    Eliminar

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </main>

    );

}


export default GestionMisiones;