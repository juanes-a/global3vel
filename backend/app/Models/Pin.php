<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pin extends Model
{
    protected $table = 'pins';
    protected $fillable = ['username', 'game', 'note', 'lat', 'lng'];

}
