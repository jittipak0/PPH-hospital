<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medical_record_requests', function (Blueprint $table) {
            $table->id();
            $table->string('citizen_id', 20);
            $table->string('hn', 20);
            $table->string('fullname');
            $table->date('dob');
            $table->string('phone', 30);
            $table->string('email');
            $table->text('purpose');
            $table->string('date_range')->nullable();
            $table->enum('delivery_method', ['pickup', 'post', 'elec']);
            $table->boolean('consent');
            $table->json('files')->nullable();
            $table->enum('status', ['new', 'processing', 'done', 'rejected'])->default('new');
            $table->timestamps();
            $table->index(['citizen_id', 'hn']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_requests');
    }
};
