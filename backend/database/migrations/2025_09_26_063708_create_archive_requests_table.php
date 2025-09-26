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
        Schema::create('archive_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('staff_id');
            $table->string('document_type');
            $table->string('ref_no');
            $table->date('needed_date');
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
        Schema::dropIfExists('archive_requests');
    }
};
