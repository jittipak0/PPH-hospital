<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class NewsSeeder extends Seeder
{
    /**
     * Seed baseline news entries for local development only.
     */
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            Log::info('News seeder skipped for non-local environment.');

            return;
        }

        if (News::query()->exists()) {
            Log::info('News seeder skipped because records already exist.');

            return;
        }

        News::factory()
            ->count(3)
            ->published()
            ->create();

        Log::info('Seeded baseline news records for local/testing environment.');
    }
}
