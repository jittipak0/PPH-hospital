<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_record_requests', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('hn', 50);
            $table->string('citizen_id_hash', 128);
            $table->string('citizen_id_masked', 32);
            $table->string('phone', 20);
            $table->string('email');
            $table->text('address');
            $table->text('reason');
            $table->boolean('consent');
            $table->string('idcard_path')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 512)->nullable();
            $table->timestamps();

            $table->index('citizen_id_hash');
            $table->index('hn');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_record_requests');
    }
};
