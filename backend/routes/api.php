<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TransactionController;

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => '¡Conexión Exitosa entre Laravel y React!',
        'dinero_meta' => 3000
    ]);
});

Route::get('/transactions', [TransactionController::class, 'index']);