<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Registration extends Model
{
    protected $table = 'registrations';
    protected $fillable = [
        'mobile',
        'surname',
        'name',
        'dob',
        'gender',
        'email',
        'password',
        'address',
        'state',
        'city',
        'pincode',
        'ciap',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'dob' => 'date',
    ];

    // 🔐 Auto hash password
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    /**
     * 🔗 User has many payments
     */
    public function payments()
    {
        return $this->hasMany(Payment::class, 'user_id');
    }
}
