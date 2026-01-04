<?php

// database/migrations/xxxx_create_registrations_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->string('mobile', 10);
            $table->string('surname');
            $table->string('name');
            $table->date('dob');
            $table->enum('gender', ['Male', 'Female']);
            $table->string('email')->unique();
            $table->string('password');
            $table->text('address');
            $table->string('state');
            $table->string('city');
            $table->string('pincode', 10);
            $table->string('ciap')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
