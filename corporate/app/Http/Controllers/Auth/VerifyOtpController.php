<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cookie;
use App\Models\Admin;

class VerifyOtpController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate([
            'otp' => 'required',
        ]);

        // 🍪 Get email from cookie
        $email = $request->cookie('otp_login_email');

        if (!$email) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'OTP session expired',
            ], 400);
        }

        $record = DB::table('password_resets')
            ->where('email', $email)
            ->where('otp', $request->otp)
            ->first();

        if (!$record) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'Wrong OTP',
            ], 400);
        }

        // ⏱ OTP expiry (5 min)
        if (now()->diffInMinutes($record->created_at) > 5) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'OTP expired',
            ], 400);
        }

        $admin = Admin::where('email', $email)->first();

        // 🧹 cleanup
        DB::table('password_resets')->where('email', $email)->delete();
        Cookie::queue(Cookie::forget('otp_login_email'));

        // 🔑 Sanctum token
        $token = $admin->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Login successful',
            'token'   => $token,
            'admin'   => [
                'id'    => $admin->id,
                'name'  => $admin->name,
                'email' => $admin->email,
            ],
        ]);
    }
}


// namespace App\Http\Controllers\Auth;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\DB;
// use App\Models\Admin;

// class VerifyOtpController extends Controller
// {
//     public function verify(Request $request)
//     {
//         $request->validate([
//             'email' => 'required|email',
//             'otp'   => 'required',
//         ]);

//         $record = DB::table('password_resets')
//             ->where('email', $request->email)
//             ->where('otp', $request->otp)
//             ->first();

//         if (!$record) {
//             return response()->json([
//                 'status'  => 'failed',
//                 'message' => 'Wrong OTP',
//             ], 400);
//         }

//         // ⏱ OTP expiry (5 minutes)
//         if (now()->diffInMinutes($record->created_at) > 5) {
//             return response()->json([
//                 'status'  => 'failed',
//                 'message' => 'OTP expired',
//             ], 400);
//         }

//         $admin = Admin::where('email', $request->email)->first();

//         if (!$admin) {
//             return response()->json([
//                 'status'  => 'failed',
//                 'message' => 'Invalid request',
//             ], 400);
//         }

//         // 🧹 delete OTP
//         DB::table('password_resets')->where('email', $request->email)->delete();

//         // 🔑 Create Sanctum token
//         $token = $admin->createToken('auth_token')->plainTextToken;

//         return response()->json([
//             'status'  => 'success',
//             'message' => 'Login successful',
//             'token'   => $token,
//             'admin'   => [
//                 'id'    => $admin->id,
//                 'name'  => $admin->name,
//                 'email' => $admin->email,
//             ],
//         ]);
//     }
// }
