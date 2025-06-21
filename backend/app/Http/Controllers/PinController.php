<?php

namespace App\Http\Controllers;

use App\Models\Pin;
use Illuminate\Http\Request;

class PinController extends Controller
{
    public function store(Request $request) {
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'game' => 'required|string|max:255',
            'note' => 'nullable|string|max:500',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        return Pin::create($validated);
    }

    public function index() {
        return Pin::all();
    }
}

