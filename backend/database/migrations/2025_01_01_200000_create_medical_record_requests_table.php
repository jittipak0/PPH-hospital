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
            $table->string('full_name', 255);
            $table->string('hn', 50);
            $table->string('citizen_id_hash', 64)->index();
            $table->string('citizen_id_masked', 32);
            $table->string('phone', 30);
            $table->string('email', 255)->nullable();
            $table->text('address');
            $table->text('reason')->nullable();
            $table->boolean('consent')->default(false);
            $table->string('idcard_path', 255)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->timestamps();

            $table->index('hn');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_record_requests');
    }
};
