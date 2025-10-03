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
            $table->string('full_name', 255);
            $table->string('hn', 50)->nullable();
            $table->text('address');
            $table->string('district', 120);
            $table->string('province', 120);
            $table->string('zipcode', 10);
            $table->string('phone', 30);
            $table->string('line_id', 100)->nullable();
            $table->boolean('consent')->default(false);
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 255)->nullable();
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
