const BASE_URL = "/api";


async function request(url, options = {}) {

    const respuesta = await fetch(
        `${BASE_URL}${url}`,
        {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },

            ...options,
        }
    );


    // DELETE puede responder 204 sin contenido.
    if (respuesta.status === 204) {
        return null;
    }


    let datos = null;

    try {
        datos = await respuesta.json();
    } catch {
        datos = null;
    }


    if (!respuesta.ok) {

        const mensaje =
            datos?.error ||
            datos?.detail ||
            `Error del servidor: ${respuesta.status}`;

        throw new Error(
            typeof mensaje === "string"
                ? mensaje
                : JSON.stringify(mensaje)
        );
    }


    return datos;
}


// ==================================================
// API DE MISIONES
// ==================================================

export const misionesApi = {

    // CRUD DEL LABORATORIO

    listar: () =>
        request("/misiones/"),


    obtener: (id) =>
        request(`/misiones/${id}/`),


    crear: (mision) =>
        request(
            "/misiones/",
            {
                method: "POST",
                body: JSON.stringify(mision),
            }
        ),


    actualizar: (id, mision) =>
        request(
            `/misiones/${id}/`,
            {
                method: "PUT",
                body: JSON.stringify(mision),
            }
        ),


    eliminar: (id) =>
        request(
            `/misiones/${id}/`,
            {
                method: "DELETE",
            }
        ),


    // ==================================================
    // FUNCIONES PROPIAS DE TU JUEGO
    // ==================================================

    disponibles: () =>
        request("/mision-aleatoria/"),


    activa: (usuario) =>
        request(
            `/mision-activa/${usuario}/`
        ),


    tomar: (id, usuario) =>
        request(
            `/misiones/${id}/tomar/`,
            {
                method: "POST",

                body: JSON.stringify({
                    usuario: usuario,
                }),
            }
        ),


    entregar: (id) =>
        request(
            `/misiones/${id}/entregar/`,
            {
                method: "POST",
            }
        ),
};