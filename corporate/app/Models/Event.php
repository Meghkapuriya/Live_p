<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';

    protected $fillable = [
        'title',
        'link',
        'photo',
        'description',
        'end_date',
        'status',
        'is_manual',
    ];

    // 🔥 THIS LINE WAS MISSING
    protected $appends = ['photo_url'];

    protected $casts = [
        'is_manual' => 'boolean',
    ];

    protected static function booted()
    {
        static::saving(function ($data) {
            if ($data->is_manual) {
                return;
            }
            self::setAutoStatus($data);
        });
    }

    protected static function setAutoStatus($data)
    {
        $endDate = Carbon::parse($data->end_date)->startOfDay()->addDay();

        if (now()->lt($endDate)) {
            $data->status = 'upcoming';
        } elseif (now()->lt($endDate->copy()->addMonth())) {
            $data->status = 'recent';
        } else {
            $data->status = 'past';
        }
    }

    // ✅ BACKEND STORAGE URL
    public function getPhotoUrlAttribute()
    {
        return $this->photo
            ? asset('storage/' . $this->photo)
            : null;
    }
}
