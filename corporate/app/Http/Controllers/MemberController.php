<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MemberController extends Controller
{
    // 🔹 GET ALL MEMBERS
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Member::orderBy('rank')->get()
        ]);
    }

    // 🔹 STORE MEMBER (IMAGE FILE)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'rank'     => 'required|integer|min:1',
            'category' => 'nullable|string|max:255',

            // ✅ FILE VALIDATION
            'photo'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('members', 'public');
        }

        $member = Member::create([
            'name'     => $validated['name'],
            'position' => $validated['position'],
            'rank'     => $validated['rank'],
            'category' => $validated['category'] ?? null,
            'photo'    => $photoPath, // ✅ PATH ONLY
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Member created successfully',
            'data'    => $member
        ], 201);
    }

    // 🔹 SHOW SINGLE MEMBER
    public function show($id)
    {
        return response()->json([
            'success' => true,
            'data' => Member::findOrFail($id)
        ]);
    }

    // 🔹 UPDATE MEMBER
    public function update(Request $request, $id)
    {
        $member = Member::findOrFail($id);

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'rank'     => 'nullable|integer|min:1',
            'category' => 'nullable|string|max:255',

            // ✅ FILE VALIDATION
            'photo'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // 📸 Update image if new uploaded
        if ($request->hasFile('photo')) {

            // delete old image
            if ($member->photo && Storage::disk('public')->exists($member->photo)) {
                Storage::disk('public')->delete($member->photo);
            }

            $member->photo = $request->file('photo')->store('members', 'public');
        }

        $member->name     = $validated['name'];
        $member->position = $validated['position'];

        if (isset($validated['rank'])) {
            $member->rank = $validated['rank'];
        }

        if (isset($validated['category'])) {
            $member->category = $validated['category'];
        }

        $member->save();

        return response()->json([
            'success' => true,
            'message' => 'Member updated successfully',
            'data'    => $member
        ]);
    }

    // 🔹 DELETE MEMBER
    public function destroy($id)
    {
        $member = Member::findOrFail($id);

        if ($member->photo && Storage::disk('public')->exists($member->photo)) {
            Storage::disk('public')->delete($member->photo);
        }

        $member->delete();

        return response()->json([
            'success' => true,
            'message' => 'Member deleted successfully'
        ]);
    }
}
