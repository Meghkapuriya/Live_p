<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Models\Admin;

class ForgotPasswordController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $otp = rand(100000, 999999);

        // silently check admin
        $admin = Admin::where('email', $request->email)->first();

        if ($admin) {
            // store/update OTP
            DB::table('password_resets')->updateOrInsert(
                ['email' => $request->email],
                [
                    'otp'        => $otp,
                    'created_at' => now(),
                ]
            );

            // send email
            Mail::raw(
                "Your password reset OTP is: {$otp}",
                function ($message) use ($request) {
                    $message->to($request->email)
                            ->subject('Password Reset OTP');
                }
            );
        }

        // SAME response always (no info leak)
        return response()->json([
            'status'  => 'success',
            'message' => 'If the email exists, an OTP has been sent.',
        ], 200);
    }
}
