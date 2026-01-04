<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegistrationController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\VerifyOtpController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\PaymentController;



/*
|--------------------------------------------------------------------------
| Events CRUD
|--------------------------------------------------------------------------
*/

Route::apiResource('events', EventController::class);

/*
|--------------------------------------------------------------------------
| Announcements CRUD
|--------------------------------------------------------------------------
*/
Route::apiResource('announcements', AnnouncementController::class);

/*
|--------------------------------------------------------------------------
| Members CRUD
|--------------------------------------------------------------------------
*/
Route::apiResource('members', MemberController::class);

/*
|--------------------------------------------------------------------------
| Register API
|--------------------------------------------------------------------------
*/

Route::apiResource('registration', RegisterController::class)
    ->only(['index', 'show']);



Route::middleware('throttle:3,1')->post('/create-order', [PaymentController::class, 'createOrder']);
Route::middleware('throttle:5,1')->post('/submit-form', [PaymentController::class, 'submitForm']);



// 🔓 Public routes
Route::post('/register', [RegistrationController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/login/verify-otp', [VerifyOtpController::class, 'verify']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendOtp']);
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);



// 🔐 Protected admin routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/me', [AuthController::class, 'me']);
    Route::post('/admin/logout', [AuthController::class, 'logout']);
});
