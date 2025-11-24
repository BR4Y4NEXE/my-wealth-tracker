# MyWealth Tracker

Sistema de seguimiento de finanzas personales con interfaz moderna estilo fintech. Controla tus ingresos y gastos de manera visual e intuitiva.

## Qué hace

- **Registro de transacciones**: Agrega ingresos y gastos con categorías personalizadas
- **Balance en tiempo real**: Visualiza tu balance actual actualizado instantáneamente
- **Gráfico de gastos**: Dona interactiva que muestra la distribución de gastos por categoría
- **CRUD completo**: Crea, edita y elimina transacciones
- **Diseño responsive**: Funciona en desktop y móvil
- **Interfaz Clean Fintech**: Estilo profesional inspirado en Stripe/Revolut

## Stack Tecnológico

### Backend
- **Laravel 12** - Framework PHP
- **MySQL** - Base de datos (XAMPP/phpMyAdmin)
- **Eloquent ORM** - Manejo de modelos y relaciones

### Frontend
- **React 19** - Librería UI
- **Vite** - Build tool y dev server
- **Tailwind CSS v4** - Estilos utility-first
- **Chart.js + react-chartjs-2** - Gráficos interactivos

### API
- RESTful API con endpoints para:
  - `GET /api/transactions` - Listar transacciones
  - `POST /api/transactions` - Crear transacción
  - `PUT /api/transactions/{id}` - Actualizar transacción
  - `DELETE /api/transactions/{id}` - Eliminar transacción
  - `GET /api/categories` - Listar categorías

## Capturas de Pantalla

### Dashboard Principal
![Dashboard](screenshots/dashboard.png)

### Formulario de Nueva Transacción
![Formulario](screenshots/form.png)

### Gráfico de Gastos
![Gráfico](screenshots/chart.png)

> Nota: Agrega tus capturas en la carpeta `screenshots/`

## Instalación

### Requisitos Previos
- PHP 8.2+
- Composer
- Node.js 18+
- npm
- MySQL (XAMPP recomendado)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/MyWealthTracker.git
cd MyWealthTracker
```

### 2. Configurar Backend (Laravel)

```bash
cd backend

# Instalar dependencias
composer install

# Copiar archivo de entorno
cp .env.example .env

# Generar key de la aplicación
php artisan key:generate

# Configurar base de datos en .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=mywealth_tracker
# DB_USERNAME=root
# DB_PASSWORD=

# Crear la base de datos en phpMyAdmin, luego:
php artisan migrate

# (Opcional) Cargar datos de prueba
php artisan db:seed
```

### 3. Configurar Frontend (React)

```bash
cd ../frontend

# Instalar dependencias
npm install

# Instalar dependencias adicionales si no están
npm install chart.js react-chartjs-2 @tailwindcss/postcss
```

### 4. Agregar Categorías Iniciales

Ejecuta en phpMyAdmin o MySQL:

```sql
INSERT INTO categories (name, type, color, created_at, updated_at) VALUES
('Salario', 'income', '#10B981', NOW(), NOW()),
('Freelance', 'income', '#06B6D4', NOW(), NOW()),
('Comida', 'expense', '#EF4444', NOW(), NOW()),
('Transporte', 'expense', '#F97316', NOW(), NOW()),
('Entretenimiento', 'expense', '#8B5CF6', NOW(), NOW()),
('Servicios', 'expense', '#3B82F6', NOW(), NOW());
```

### 5. Iniciar los Servidores

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Acceder a la Aplicación

Abre tu navegador en: `http://localhost:5173`

## Estructura del Proyecto

```
MyWealthTracker/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── TransactionController.php
│   │   │   └── CategoryController.php
│   │   └── Models/
│   │       ├── Transaction.php
│   │       └── Category.php
│   ├── database/migrations/
│   └── routes/api.php
│
├── frontend/                # React App
│   ├── src/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## Características Futuras

- [ ] Autenticación de usuarios
- [ ] Filtros por fecha y categoría
- [ ] Exportar a CSV/PDF
- [ ] Presupuestos mensuales
- [ ] Metas de ahorro
- [ ] Modo oscuro

## Autor

Desarrollado como proyecto de práctica para el manejo de finanzas personales.

## Licencia

MIT License
