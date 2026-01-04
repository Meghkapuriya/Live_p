<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    // LIST
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Announcement::whereDate('end_date', '>=', now())
                ->latest()
                ->get()
        ]);
    }

    // STORE
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'link'        => 'nullable|url',
            'end_date'    => 'required|date|after_or_equal:today',
            'photo'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $photoPath = null;

        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')
                ->store('announcements', 'public');
        }

        $announcement = Announcement::create([
            ...$validated,
            'photo' => $photoPath,
        ]);

        return response()->json([
            'success' => true,
            'data' => $announcement
        ], 201);
    }

    // SHOW
    public function show($id)
    {
        return response()->json([
            'success' => true,
            'data' => Announcement::findOrFail($id)
        ]);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);

        $validated = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'link'        => 'nullable|url',
            'end_date'    => 'sometimes|required|date|after_or_equal:today',
            'photo'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($announcement->photo) {
                Storage::disk('public')->delete($announcement->photo);
            }

            $announcement->photo = $request->file('photo')
                ->store('announcements', 'public');
        }

        $announcement->fill($validated);
        $announcement->save();

        return response()->json([
            'success' => true,
            'data' => $announcement
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);

        if ($announcement->photo) {
            Storage::disk('public')->delete($announcement->photo);
        }

        $announcement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Deleted successfully'
        ]);
    }
}
