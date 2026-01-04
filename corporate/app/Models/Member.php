<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'position',
        'rank',
        'photo'
    ];

    protected $appends = ['photo_url'];

    public function getPhotoUrlAttribute()
    {
        if (!$this->photo) return null;

        // ✅ If base64, return as-is
        if (str_starts_with($this->photo, 'data:image')) {
            return $this->photo;
        }

        // ✅ If file path, return storage URL
        return asset('storage/' . $this->photo);
    }
}
