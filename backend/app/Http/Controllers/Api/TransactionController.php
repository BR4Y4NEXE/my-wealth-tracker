<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function index()
{
    // Cargar transacciones con su categoría, ordenadas por fecha (más reciente primero)
    $transactions = Transaction::with('category')
                    ->orderBy('date', 'desc')
                    ->get();

    return response()->json($transactions);
}
}
