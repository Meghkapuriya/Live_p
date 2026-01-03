<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

class ProfileController extends Controller
{
    /**
     * Get logged-in admin profile
     */
    public function profile(Request $request)
    {
        /** @var Admin $admin */
        $admin = $request->user();

        return response()->json([
            'status' => 'success',
            'admin'  => [
                'id'     => $admin->id,
                'name'   => $admin->name,
                'email'  => $admin->email,
                'avatar' => $admin->avatar,
            ],
        ]);
    }

    /**
     * Update admin profile
     */
    public function updateProfile(Request $request)
    {
        /** @var Admin $admin */
        $admin = $request->user();

        $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => 'required|email|unique:admin,email,' . $admin->id,
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:1024',
        ]);

        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $avatarName = time() . '.' . $avatar->getClientOriginalExtension();
            $avatar->move(public_path('images'), $avatarName);
            $admin->avatar = $avatarName;
        }

        $admin->update([
            'name'  => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Profile updated successfully',
        ]);
    }

    /**
     * Update admin password
     */
    public function updatePassword(Request $request)
    {
        /** @var Admin $admin */
        $admin = $request->user();

        $request->validate([
            'current_password' => 'required',
            'password'         => 'required|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $admin->password)) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'Current password is incorrect',
            ], 400);
        }

        $admin->update([
            'password' => Hash::make($request->password),
        ]);

        // 🔐 Security: logout from all devices
        $admin->tokens()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Password updated successfully',
        ]);
    }
}
