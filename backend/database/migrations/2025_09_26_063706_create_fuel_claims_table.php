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
        Schema::create('fuel_claims', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('staff_id');
            $table->string('dept');
            $table->string('vehicle_plate', 20);
            $table->date('trip_date');
            $table->decimal('liters', 8, 2);
            $table->decimal('amount', 10, 2);
            $table->string('receipt_path')->nullable();
            $table->text('note')->nullable();
            $table->enum('status', ['new', 'processing', 'done', 'rejected'])->default('new');
            $table->timestamps();
            $table->index('staff_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fuel_claims');
    }
};
