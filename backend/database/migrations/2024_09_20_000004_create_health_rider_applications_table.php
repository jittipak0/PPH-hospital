<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('health_rider_applications', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('hn', 50);
            $table->text('address');
            $table->string('district');
            $table->string('province');
            $table->string('zipcode', 10);
            $table->string('phone', 20);
            $table->string('line_id', 50)->nullable();
            $table->boolean('consent');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 512)->nullable();
            $table->timestamps();

            $table->index('hn');
            $table->index('district');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_rider_applications');
    }
};
