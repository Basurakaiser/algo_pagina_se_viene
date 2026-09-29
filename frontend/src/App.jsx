import { useEffect, useState } from 'react'

function App() {
  const [misiones, setMisiones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/mision-aleatoria/')
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('No se pudieron obtener las misiones')
        }

        return respuesta.json()
      })
      .then((datos) => {
        setMisiones(datos)
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setCargando(false)
      })
  }, [])

  if (cargando) {
    return <h2>Cargando misiones...</h2>
  }

  if (error) {
    return <h2>Error: {error}</h2>
  }

  return (
    <div>
      <h1>Tablero de misiones</h1>

      {misiones.length === 0 ? (
        <p>No hay misiones disponibles.</p>
      ) : (
        misiones.map((mision) => (
          <div key={mision.id}>
            <h2>{mision.categoria}</h2>

            <p>{mision.descripcion}</p>
            <p>Prioridad: {mision.prioridad}</p>
            <p>Recompensa: {mision.recompensa} puntos</p>
            <p>Roles: {mision.roles.join(', ')}</p>

            <hr />
          </div>
        ))
      )}
    </div>
  )
}

export default App