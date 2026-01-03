<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\VerifyOtpController;

// 🔓 Public routes
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/login/verify-otp', [VerifyOtpController::class, 'verify']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendOtp']);
// Route::post('/reset-password', 'App\Http\Controllers\Auth\ResetPasswordController@reset');
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);



// 🔐 Protected admin routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/me', [AuthController::class, 'me']);
    Route::post('/admin/logout', [AuthController::class, 'logout']);
});
