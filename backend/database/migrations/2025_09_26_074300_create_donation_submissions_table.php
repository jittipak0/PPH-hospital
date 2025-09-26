<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('donation_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('donor_name', 150);
            $table->decimal('amount', 12, 2);
            $table->enum('channel', ['cash', 'bank_transfer', 'online']);
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->boolean('wants_receipt');
            $table->boolean('consent');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['channel']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donation_submissions');
    }
};
