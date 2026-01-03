<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

class ResetPasswordController extends Controller
{
    public function reset(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'otp'      => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $record = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();

        if (!$record) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'Invalid OTP',
            ], 400);
        }

        // OTP expiry: 10 minutes
        if (now()->diffInMinutes($record->created_at) > 10) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'OTP expired',
            ], 400);
        }

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'Invalid request',
            ], 400);
        }

        // update password
        $admin->update([
            'password' => Hash::make($request->password),
        ]);

        // delete OTP
        DB::table('password_resets')->where('email', $request->email)->delete();

        // security: logout all devices
        $admin->tokens()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Password reset successful',
        ], 200);
    }
}
