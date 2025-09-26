<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('satisfaction_surveys', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 150);
            $table->string('hn', 20)->nullable();
            $table->date('service_date');
            $table->enum('service_type', ['outpatient', 'inpatient', 'emergency', 'telemedicine']);
            $table->unsignedTinyInteger('rating');
            $table->text('feedback')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->boolean('consent');
            $table->timestamps();

            $table->index(['service_type', 'service_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('satisfaction_surveys');
    }
};
