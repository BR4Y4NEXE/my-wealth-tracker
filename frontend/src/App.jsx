import { useEffect, useState } from 'react'

function App() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    type: '',
    category_id: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Filtrar categorías por tipo seleccionado
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
          type: '',
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

  const balance = transactions.reduce((acc, t) => {
    return t.category?.type === 'income' ? acc + parseFloat(t.amount) : acc - parseFloat(t.amount)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-100 font-sans px-5 py-10">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-gray-900 text-3xl font-bold tracking-tight">
            MyWealth Tracker
          </h1>
        </header>

        {/* Balance Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <p className="text-gray-500 text-sm font-medium mb-2">
            Balance actual
          </p>
          <p className={`text-4xl font-bold tracking-tight ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatMoney(balance)}
          </p>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm mb-6 transition-all ${
            showForm
              ? 'bg-gray-100 text-gray-500 border border-gray-200'
              : 'bg-gray-900 text-white'
          }`}
        >
          {showForm ? 'Cancelar' : 'Nueva transacción'}
        </button>

        {/* Form */}
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
              Guardar
            </button>
          </form>
        )}

        {/* Transactions List */}
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
                <div key={t.id} className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-sm text-gray-900 mb-1">
                      {t.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {t.category.name} · {t.date}
                    </p>
                  </div>
                  <span className={`font-semibold text-sm ${t.category.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
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
