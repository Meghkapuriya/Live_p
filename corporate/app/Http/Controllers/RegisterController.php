<?php

namespace App\Http\Controllers;

use App\Models\Registration;

class RegisterController extends Controller
{


    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Registration::with('payments')->latest()->get()
        ]);
    }

    // 🔹 GET SINGLE USER WITH PAYMENTS
    public function show($id)
    {
        $user = Registration::with('payments')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }
}
