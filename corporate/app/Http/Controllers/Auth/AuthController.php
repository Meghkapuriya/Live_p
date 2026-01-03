<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Logout user (ALL devices)
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Logout success',
        ], 200);
    }

    /**
     * Get logged-in user
     */
    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user'   => $request->user(),
        ], 200);
    }
}
