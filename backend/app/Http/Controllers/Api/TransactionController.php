<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('category')
                        ->orderBy('date', 'desc')
                        ->get();

        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        $validated['user_id'] = 1;

        $transaction = Transaction::create($validated);
        $transaction->load('category');

        return response()->json($transaction, 201);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        $transaction->update($validated);
        $transaction->load('category');

        return response()->json($transaction);
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }
}
