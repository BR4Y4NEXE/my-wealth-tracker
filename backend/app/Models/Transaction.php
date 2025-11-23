<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['user_id', 'category_id', 'amount', 'description', 'date'];

    // Y ya que estamos aquí, definamos la relación para sacar el nombre de la categoría después
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
