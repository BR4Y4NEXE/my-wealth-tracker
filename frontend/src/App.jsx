import { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

function App() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    type: '',
    category_id: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const filteredCategories = categories.filter(cat => cat.type === formData.type)

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

  const resetForm = () => {
    setFormData({
      type: '',
      category_id: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = editingId
      ? `http://127.0.0.1:8000/api/transactions/${editingId}`
      : 'http://127.0.0.1:8000/api/transactions'

    const method = editingId ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const savedTransaction = await response.json()

        if (editingId) {
          setTransactions(transactions.map(t =>
            t.id === editingId ? savedTransaction : t
          ))
        } else {
          setTransactions([savedTransaction, ...transactions])
        }

        resetForm()
      } else {
        const error = await response.json()
        alert('Error: ' + JSON.stringify(error.errors))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar la transacción')
    }
  }

  const handleEdit = (transaction) => {
    setFormData({
      type: transaction.category.type,
      category_id: transaction.category_id.toString(),
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date
    })
    setEditingId(transaction.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta transacción?')) return

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      })

      if (response.ok) {
        setTransactions(transactions.filter(t => t.id !== id))
      } else {
        alert('Error al eliminar')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar la transacción')
    }
  }

  const balance = transactions.reduce((acc, t) => {
    return t.category?.type === 'income' ? acc + parseFloat(t.amount) : acc - parseFloat(t.amount)
  }, 0)

  const expensesByCategory = transactions
    .filter(t => t.category?.type === 'expense')
    .reduce((acc, t) => {
      const catName = t.category.name
      acc[catName] = (acc[catName] || 0) + parseFloat(t.amount)
      return acc
    }, {})

  const chartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [{
      data: Object.values(expensesByCategory),
      backgroundColor: [
        '#EF4444', '#F97316', '#F59E0B', '#EAB308',
        '#84CC16', '#22C55E', '#14B8A6', '#06B6D4',
        '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7'
      ],
      borderWidth: 0,
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((context.raw / total) * 100).toFixed(1)
            return `${context.label}: ${formatMoney(context.raw)} (${percentage}%)`
          }
        }
      }
    },
    cutout: '65%'
  }

  const hasExpenses = Object.keys(expensesByCategory).length > 0

  return (
    <div className="min-h-screen bg-gray-100 font-sans px-5 py-10">
      <div className="max-w-4xl mx-auto">

        <header className="mb-8">
          <h1 className="text-gray-900 text-3xl font-bold tracking-tight">
            MyWealth Tracker
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <p className="text-gray-500 text-sm font-medium mb-2">
                Balance actual
              </p>
              <p className={`text-4xl font-bold tracking-tight ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatMoney(balance)}
              </p>
            </div>

            <button
              onClick={() => {
                if (showForm) {
                  resetForm()
                } else {
                  setShowForm(true)
                }
              }}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm mb-6 transition-all ${
                showForm
                  ? 'bg-gray-100 text-gray-500 border border-gray-200'
                  : 'bg-gray-900 text-white'
              }`}
            >
              {showForm ? 'Cancelar' : 'Nueva transacción'}
            </button>

            {showForm && (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                <div className="mb-5">
                  <label className="block mb-2 font-medium text-sm text-gray-700">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value, category_id: ''})}
                    required
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-gray-400"
                  >
                    <option value="">Seleccionar</option>
                    <option value="income">Ingreso</option>
                    <option value="expense">Gasto</option>
                  </select>
                </div>

                <div className="mb-5">
                  <label className="block mb-2 font-medium text-sm text-gray-700">
                    Categoría
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    required
                    disabled={!formData.type}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-gray-400 disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">{formData.type ? 'Seleccionar' : 'Primero selecciona un tipo'}</option>
                    {filteredCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-5">
                  <label className="block mb-2 font-medium text-sm text-gray-700">
                    Monto
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    placeholder="0.00"
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-400"
                  />
                </div>

                <div className="mb-5">
                  <label className="block mb-2 font-medium text-sm text-gray-700">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    placeholder="Ej: Almuerzo"
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-400"
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium text-sm text-gray-700">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
                >
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </form>
            )}

            {loading ? (
              <p className="text-center text-gray-500 text-sm">Cargando...</p>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 font-semibold text-sm text-gray-900">
                  Movimientos
                </div>

                {transactions.length === 0 ? (
                  <div className="px-5 py-10 text-center text-gray-500 text-sm">
                    No hay transacciones
                  </div>
                ) : (
                  transactions.map(t => (
                    <div key={t.id} className="flex justify-between items-center px-5 py-4 border-b border-gray-100 group">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900 mb-1">
                          {t.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          {t.category.name} · {t.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold text-sm ${t.category.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {t.category.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(t)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-10 lg:self-start">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-sm text-gray-900 mb-4">
                Gastos por Categoría
              </h2>
              {hasExpenses ? (
                <div className="h-64">
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                  No hay gastos registrados
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
