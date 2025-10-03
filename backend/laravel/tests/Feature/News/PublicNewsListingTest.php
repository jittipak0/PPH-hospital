<?php

namespace Tests\Feature\News;

use App\Models\News;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class PublicNewsListingTest extends TestCase
{
    use RefreshDatabase;

    public function test_lists_only_published_news_in_descending_order(): void
    {
        $older = News::factory()->create([
            'published_at' => Carbon::now()->subDays(5),
            'title' => 'Older Update',
        ]);
        $newer = News::factory()->create([
            'published_at' => Carbon::now()->subDay(),
            'title' => 'Latest Update',
        ]);
        News::factory()->create([
            'published_at' => Carbon::now()->addDay(),
            'title' => 'Future Announcement',
        ]);

        $response = $this->getJson('/api/news');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'news' => [
                        ['id', 'title', 'body', 'published_at'],
                    ],
                    'pagination' => ['current_page', 'per_page', 'total', 'last_page'],
                ],
                'meta' => ['request_id'],
            ])
            ->assertJsonPath('data.news.0.title', 'Latest Update')
            ->assertJsonPath('data.news.1.title', 'Older Update')
            ->assertJsonPath('data.pagination.total', 2);

        $this->assertEquals(
            $newer->published_at?->toIso8601String(),
            $response->json('data.news.0.published_at')
        );
        $this->assertEquals(
            $older->published_at?->toIso8601String(),
            $response->json('data.news.1.published_at')
        );
    }

    public function test_can_sort_oldest_first(): void
    {
        $older = News::factory()->create([
            'published_at' => Carbon::now()->subDays(5),
            'title' => 'Older Update',
        ]);
        $newer = News::factory()->create([
            'published_at' => Carbon::now()->subDay(),
            'title' => 'Latest Update',
        ]);

        $response = $this->getJson('/api/news?sort=published_at');

        $response->assertOk()
            ->assertJsonPath('data.news.0.title', 'Older Update')
            ->assertJsonPath('data.news.1.title', 'Latest Update');

        $this->assertEquals(
            $older->published_at?->toIso8601String(),
            $response->json('data.news.0.published_at')
        );
        $this->assertEquals(
            $newer->published_at?->toIso8601String(),
            $response->json('data.news.1.published_at')
        );
    }

    public function test_invalid_sort_parameter_returns_validation_error(): void
    {
        $response = $this->getJson('/api/news?sort=invalid');

        $response->assertUnprocessable()
            ->assertJsonStructure([
                'errors' => ['sort'],
            ]);
    }
}
