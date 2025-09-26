<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('medical_record_requests', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 150);
            $table->string('hn', 20);
            $table->string('citizen_id_hash', 64);
            $table->string('citizen_id_last4', 4);
            $table->string('phone', 20);
            $table->string('email');
            $table->string('address', 500);
            $table->text('reason');
            $table->boolean('consent');
            $table->string('idcard_path');
            $table->timestamps();

            $table->index('hn');
            $table->index('citizen_id_hash');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_record_requests');
    }
};
