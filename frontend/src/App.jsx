import { useEffect, useState } from 'react'

function App() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:8000/api/transactions').then(r => r.json()),
      fetch('http://127.0.0.1:8000/api/categories').then(r => r.json())
    ])
      .then(([transData, catData]) => {
        setTransactions(transData)
        setCategories(catData)
        setLoading(false)
      })
      .catch(error => console.error('Error:', error))
  }, [])

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://127.0.0.1:8000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const newTransaction = await response.json()
        setTransactions([newTransaction, ...transactions])
        setFormData({
          category_id: '',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        })
        setShowForm(false)
      } else {
        const error = await response.json()
        alert('Error: ' + JSON.stringify(error.errors))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar la transacción')
    }
  }

  // Calcular balance
  const balance = transactions.reduce((acc, t) => {
    return t.category?.type === 'income' ? acc + parseFloat(t.amount) : acc - parseFloat(t.amount)
  }, 0)

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F3F4F6',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>

        {/* Header */}
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{
            color: '#111827',
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '4px',
            letterSpacing: '-0.5px'
          }}>
            MyWealth Tracker
          </h1>
          
        </header>

        {/* Balance Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: '0 0 8px 0', fontWeight: '500' }}>
            Balance actual
          </p>
          <p style={{
            color: balance >= 0 ? '#059669' : '#DC2626',
            fontSize: '36px',
            fontWeight: '700',
            margin: 0,
            letterSpacing: '-1px'
          }}>
            {formatMoney(balance)}
          </p>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: showForm ? '#F3F4F6' : '#111827',
            color: showForm ? '#6B7280' : '#FFFFFF',
            border: showForm ? '1px solid #E5E7EB' : 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            marginBottom: '24px',
            transition: 'all 0.15s ease'
          }}
        >
          {showForm ? 'Cancelar' : 'Nueva transacción'}
        </button>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '13px',
                color: '#374151'
              }}>
                Categoría
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  fontSize: '14px',
                  color: '#111827',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Seleccionar</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.type === 'income' ? 'Ingreso' : 'Gasto'})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '13px',
                color: '#374151'
              }}>
                Monto
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  fontSize: '14px',
                  color: '#111827',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '13px',
                color: '#374151'
              }}>
                Descripción
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                placeholder="Ej: Almuerzo"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  fontSize: '14px',
                  color: '#111827',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '13px',
                color: '#374151'
              }}>
                Fecha
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  fontSize: '14px',
                  color: '#111827',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <button type="submit" style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#111827',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Guardar
            </button>
          </form>
        )}

        {/* Transactions List */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>Cargando...</p>
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #F3F4F6',
              fontWeight: '600',
              fontSize: '14px',
              color: '#111827'
            }}>
              Movimientos
            </div>

            {transactions.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
                No hay transacciones
              </div>
            ) : (
              transactions.map(t => (
                <div key={t.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderBottom: '1px solid #F3F4F6'
                }}>
                  <div>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontWeight: '500',
                      fontSize: '14px',
                      color: '#111827'
                    }}>
                      {t.description}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#9CA3AF'
                    }}>
                      {t.category.name} · {t.date}
                    </p>
                  </div>
                  <span style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: t.category.type === 'income' ? '#059669' : '#DC2626'
                  }}>
                    {t.category.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
