<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PinController;

Route::get('/pins', [PinController::class, 'index']);
Route::post('/pins', [PinController::class, 'store']);
