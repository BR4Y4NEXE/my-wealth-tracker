import { useEffect, useState } from 'react'

function App() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/transactions')
      .then(response => response.json())
      .then(data => {
        setTransactions(data)
        setLoading(false)
      })
      .catch(error => console.error('Error:', error))
  }, [])

  // Función simple para formatear dinero (Ej: $1,500.00)
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'Arial, sans-serif' }}>
      
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#333' }}>💰 MyWealth Tracker</h1>
        <p style={{ color: '#666' }}>Tu camino a la austeridad y los $3k/mes</p>
      </header>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Cargando tus finanzas...</p>
      ) : (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          
          {/* Encabezado de la lista */}
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
            Movimientos Recientes
          </div>

          {/* Lista de Transacciones */}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {transactions.map(t => (
              <li key={t.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '15px', 
                borderBottom: '1px solid #eee',
                backgroundColor: 'white'
              }}>
                <div>
                  {/* Nombre de la categoría y descripción */}
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: t.category.color + '20', // Color suave de fondo
                    color: t.category.color, 
                    fontWeight: 'bold', 
                    fontSize: '0.8rem',
                    marginRight: '10px'
                  }}>
                    {t.category.name}
                  </span>
                  <span style={{ color: '#555' }}>{t.description}</span>
                  <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '4px' }}>{t.date}</div>
                </div>

                {/* Monto (Verde si es ingreso, Rojo si es gasto) */}
                <div style={{ 
                  fontWeight: 'bold', 
                  color: t.category.type === 'income' ? '#10B981' : '#EF4444' 
                }}>
                  {t.category.type === 'income' ? '+' : '-'} {formatMoney(t.amount)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App