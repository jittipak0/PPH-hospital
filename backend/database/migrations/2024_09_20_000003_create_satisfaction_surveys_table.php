<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('satisfaction_surveys', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('score_overall');
            $table->unsignedTinyInteger('score_waittime');
            $table->unsignedTinyInteger('score_staff');
            $table->text('comment')->nullable();
            $table->date('service_date');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 512)->nullable();
            $table->timestamps();

            $table->index('service_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('satisfaction_surveys');
    }
};
