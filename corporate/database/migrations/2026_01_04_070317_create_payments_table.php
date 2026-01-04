<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // 🔗 Relation with registrations table
            $table->foreignId('user_id')
                ->constrained('registrations')
                ->cascadeOnDelete();

            $table->decimal('amount', 10, 2);
            $table->string('payment_id')->unique();
            $table->string('order_id')->nullable();
            $table->string('signature')->nullable();
            $table->timestamp('paid_at')->useCurrent();
            $table->string('status')->default('success');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
