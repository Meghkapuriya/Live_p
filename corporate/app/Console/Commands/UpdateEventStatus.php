<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Event as Data;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class UpdateEventStatus extends Command
{
    protected $signature = 'events:update-status';
    protected $description = 'Clean up expired manual overrides and refresh auto statuses for all events';

    public function handle()
    {
        $processed = 0;
        $refreshed = 0;


        $expiryMonths = (int) config('events.manual_override_expiry_months');


        Data::where('is_manual', true)
            ->chunk(200, function ($events) use (&$processed, $expiryMonths) {
                foreach ($events as $item) {
                    $limit = Carbon::parse($item->end_date)
                        ->endOfDay()
                        ->addMonths($expiryMonths);

                    if (now()->gt($limit)) {
                        Log::info('Manual override expired', [
                            'event_id' => $item->id,
                            'title'    => $item->title,
                            'end_date' => $item->end_date,
                            'expired_at' => now()->toDateTimeString(),
                        ]);

                        $item->is_manual = false;
                        $item->save();
                        $processed++;
                    }
                }
            });


        Data::where('is_manual', false)
            ->chunk(500, function ($events) use (&$refreshed) {
                foreach ($events as $event) {
                    $event->save();
                    $refreshed++;
                }
            });

        // Final output
        $this->info("Event status update completed.");
        $this->info("Expired manual overrides: {$processed}");
        $this->info("Auto-refreshed non-manual events: {$refreshed}");
    }
}
