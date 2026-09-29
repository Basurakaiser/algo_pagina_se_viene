let misionSeleccionada = null;


async function cargarMisionDelGremio() {

    try {

        const respuesta = await fetch(
            'http://localhost:8000/api/mision-aleatoria/'
        );

        const misiones = await respuesta.json();

        const contenedor =
            document.querySelector('.contenedor-contenido');

        contenedor.innerHTML = '';


        misiones.forEach(datos => {

            const numeroImagen = datos.imagen_pergamino
                .replace('pergamino', '')
                .replace('.png', '');


            const estrellasLlenas =
                '★'.repeat(datos.prioridad);

            const estrellasVacias =
                '☆'.repeat(
                    Math.max(0, 5 - datos.prioridad)
                );

            const cadenaEstrellas =
                estrellasLlenas + estrellasVacias;


            let textoRoles = "Cualquiera";

            if (datos.roles && datos.roles.length > 0) {
                textoRoles = datos.roles.join(' o ');
            }


            const angulo =
                (Math.random() * 8) - 4;


            const pergamino =
                document.createElement('div');

            pergamino.className =
                'contenedor-pergamino';

            pergamino.dataset.id = datos.id;
            pergamino.dataset.rotacion = angulo;

            pergamino.style.transform =
                `rotate(${angulo}deg)`;


            pergamino.innerHTML = `
                <img
                    src="recursos/imagenes/quest/${numeroImagen}.png"
                    alt="Pergamino de Misión"
                    class="imagen-papel-pergamino"
                >

                <div class="datos-mision-encima">

                    <div class="mision-categoria">
                        ${datos.categoria}
                    </div>

                    <div class="mision-descripcion">
                        ${datos.descripcion}
                    </div>

                    <div class="bloque-detalles-abajo">

                        <div class="mision-prioridad">
                            Prioridad ${cadenaEstrellas}
                        </div>

                        <div class="mision-recompensa">
                            Recompensa
                            ${datos.recompensa}
                            ${datos.recompensa === 1
                                ? 'punto'
                                : 'puntos'}
                        </div>

                        <div class="mision-roles-permitidos">
                            Exclusivo ${textoRoles}
                        </div>

                    </div>

                </div>
            `;


            pergamino.addEventListener(
                'click',
                () => seleccionarMision(pergamino, datos)
            );


            contenedor.appendChild(pergamino);

        });


    } catch (error) {

        console.error(
            "Error al conectar con Django:",
            error
        );

    }

}


function seleccionarMision(pergamino, datos) {

    // Quitamos la selección anterior
    document
        .querySelectorAll('.contenedor-pergamino')
        .forEach(elemento => {

            elemento.classList.remove('seleccionada');

            const rotacion =
                elemento.dataset.rotacion;

            elemento.style.transform =
                `rotate(${rotacion}deg)`;

        });


    // Seleccionamos la nueva
    pergamino.classList.add('seleccionada');

    /*
     * La dejamos recta y ligeramente
     * más grande.
     */
    pergamino.style.transform =
        'rotate(0deg) scale(1.07)';


    // Guardamos TODOS los datos
    misionSeleccionada = datos;


    // Activamos el botón
    document.getElementById(
        'boton-tomar-mision'
    ).disabled = false;
}


document.getElementById(
    'boton-tomar-mision'
).addEventListener('click', tomarMision);


async function tomarMision() {

    if (!misionSeleccionada) {
        return;
    }


    /*
     * TEMPORAL.
     *
     * Después reemplazaremos esto por el
     * usuario real que tengas identificado.
     */
    const usuarioActual = 'kaiser';


    try {

        const respuesta = await fetch(
            `http://localhost:8000/api/misiones/${misionSeleccionada.id}/tomar/`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    usuario: usuarioActual
                })
            }
        );


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            alert(
                resultado.error ||
                'No se pudo tomar la misión.'
            );

            return;
        }


        /*
         * Django ya cambió:
         *
         * disponible
         *      ↓
         * en_progreso
         */


        // Guardamos cuál misión elegimos.
        localStorage.setItem(
            'misionActivaId',
            misionSeleccionada.id
        );


        // Ahora sí vamos a la mesa.
        window.location.href =
            'pagina21.html';


    } catch (error) {

        console.error(
            'Error al tomar la misión:',
            error
        );

    }

}


cargarMisionDelGremio();