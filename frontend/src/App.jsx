import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // Hacemos la petición al backend
    fetch('http://127.0.0.1:8000/api/test')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error conectando:', error));
  }, [])

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Panel de Control Financiero</h1>
      <p>Estado de la conexión:</p>
      
      {data ? (
        <div style={{ border: '2px solid green', padding: '20px', borderRadius: '10px' }}>
          <h2>{data.message}</h2>
          <p>Meta mensual: <strong>${data.dinero_meta} USD</strong></p>
        </div>
      ) : (
        <p>Cargando datos del servidor...</p>
      )}
    </div>
  )
}

export default App