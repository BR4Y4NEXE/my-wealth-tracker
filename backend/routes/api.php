<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\CategoryController;

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => '¡Conexión Exitosa entre Laravel y React!',
        'dinero_meta' => 3000
    ]);
});

Route::get('/transactions', [TransactionController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);
Route::put('/transactions/{transaction}', [TransactionController::class, 'update']);
Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy']);
Route::get('/categories', [CategoryController::class, 'index']);