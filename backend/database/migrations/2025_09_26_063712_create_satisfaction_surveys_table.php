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
        Schema::create('satisfaction_surveys', function (Blueprint $table) {
            $table->id();
            $table->enum('channel', ['opd', 'ipd', 'online']);
            $table->unsignedTinyInteger('score_service');
            $table->unsignedTinyInteger('score_clean');
            $table->unsignedTinyInteger('score_speed');
            $table->text('comment')->nullable();
            $table->boolean('contact_optin')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('satisfaction_surveys');
    }
};
