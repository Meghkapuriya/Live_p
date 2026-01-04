<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event as Data;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    // 🔹 LIST EVENTS
    public function index()
    {
        return response()->json([
            'success'  => true,
            'upcoming' => Data::where('status', 'upcoming')->orderBy('end_date', 'desc')->get(),
            'recent'   => Data::where('status', 'recent')->orderBy('end_date', 'desc')->get(),
            'past'     => Data::where('status', 'past')->orderBy('end_date', 'desc')->get(),
        ]);
    }

    // 🔹 CREATE EVENT
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'link'        => 'required|url',
            'photo'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10048',
            'description' => 'required|string',
            'end_date'    => 'required|date',
            'status'      => 'nullable|in:upcoming,recent,past',
            'is_manual'   => 'nullable|boolean',
        ]);

        // 📸 STORE IMAGE
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('events', 'public');
        }

        $endDate  = Carbon::parse($validated['end_date']);
        $isFuture = $endDate->isFuture();

        $event = new Data();
        $event->title       = $validated['title'];
        $event->link        = $validated['link'];
        $event->photo       = $photoPath;
        $event->description = $validated['description'];
        $event->end_date    = $validated['end_date'];

        if (!$isFuture && !empty($validated['status'])) {
            $event->status    = $validated['status'];
            $event->is_manual = $request->boolean('is_manual', false);
        }

        $event->save();

        return response()->json([
            'success' => true,
            'message' => 'Event created successfully',
            'data'    => $event->fresh(),
        ], 201);
    }

    // 🔹 SHOW EVENT
    public function show($id)
    {
        return response()->json([
            'success' => true,
            'data'    => Data::findOrFail($id),
        ]);
    }




    public function update(Request $request, $id)
    {
        $event = Data::findOrFail($id);

        $validated = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'link'        => 'sometimes|required|url',
            'description' => 'sometimes|required|string',
            'photo'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10048',
            'end_date'    => 'sometimes|required|date',
            'status'      => 'nullable|in:upcoming,recent,past',
            'is_manual'   => 'nullable|boolean',
        ]);

        // 📸 IMAGE UPDATE
        if ($request->hasFile('photo')) {

            if ($event->photo && Storage::disk('public')->exists($event->photo)) {
                Storage::disk('public')->delete($event->photo);
            }

            $event->photo = $request->file('photo')->store('events', 'public');
        }

        // ❗ REMOVE photo before fill
        unset($validated['photo']);

        // ✅ SAFE FILL
        $event->fill($validated);

        // 📅 STATUS LOGIC
        if (!empty($validated['end_date'])) {
            $endDate = Carbon::parse($validated['end_date']);

            if ($endDate->isFuture()) {
                $event->status = 'upcoming';
                $event->is_manual = false;
            } elseif (!empty($validated['status'])) {
                $event->status    = $validated['status'];
                $event->is_manual = $request->boolean('is_manual', false);
            }
        }

        $event->save();

        return response()->json([
            'success' => true,
            'message' => 'Event updated successfully',
            'data'    => $event,
        ]);
    }
    // 🔹 DELETE EVENT
    public function destroy($id)
    {
        $event = Data::findOrFail($id);

        if ($event->photo && Storage::disk('public')->exists($event->photo)) {
            Storage::disk('public')->delete($event->photo);
        }

        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully',
        ]);
    }
}
