<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->string('donor_name');
            $table->decimal('amount', 12, 2);
            $table->string('channel', 20);
            $table->string('phone', 20);
            $table->string('email');
            $table->text('note')->nullable();
            $table->string('reference_code', 20)->unique();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 512)->nullable();
            $table->timestamps();

            $table->index('channel');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
