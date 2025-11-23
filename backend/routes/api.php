<?php

use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => '¡Conexión Exitosa entre Laravel y React!',
        'dinero_meta' => 3000
    ]);
});