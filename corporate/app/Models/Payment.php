<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';
    protected $fillable = [
        'user_id',
        'amount',
        'payment_id',
        'order_id',
        'signature',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'amount'  => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    /**
     * 🔗 Payment belongs to a user
     */
    public function user()
    {
        return $this->belongsTo(Registration::class, 'user_id');
    }
}
