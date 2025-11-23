<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
{
    // 1. Crear un usuario de prueba (ID: 1)
    $user = \App\Models\User::factory()->create([
        'name' => 'Ingeniero Futuro',
        'email' => 'admin@admin.com',
        'password' => bcrypt('password'),
    ]);

    // 2. Crear Categorías
    $catSalario = \App\Models\Category::create(['name' => 'Salario', 'type' => 'income', 'color' => '#10B981']); // Verde
    $catComida = \App\Models\Category::create(['name' => 'Comida', 'type' => 'expense', 'color' => '#EF4444']); // Rojo
    $catGym = \App\Models\Category::create(['name' => 'Gimnasio', 'type' => 'expense', 'color' => '#3B82F6']); // Azul

    // 3. Crear Transacciones Ficticias para el Usuario 1
    \App\Models\Transaction::create([
        'user_id' => $user->id,
        'category_id' => $catSalario->id,
        'amount' => 1500.00, // Mitad de la meta de 3k
        'description' => 'Pago Quincena 1',
        'date' => now()->subDays(5),
    ]);

    \App\Models\Transaction::create([
        'user_id' => $user->id,
        'category_id' => $catComida->id,
        'amount' => 15.50,
        'description' => 'Hamburguesas',
        'date' => now()->subDays(2),
    ]);
    
    \App\Models\Transaction::create([
        'user_id' => $user->id,
        'category_id' => $catGym->id,
        'amount' => 30.00,
        'description' => 'Mensualidad Gym',
        'date' => now(),
    ]);
}
}
