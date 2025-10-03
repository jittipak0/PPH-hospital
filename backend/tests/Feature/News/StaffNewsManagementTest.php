<?php

namespace Tests\Feature\News;

use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Session;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StaffNewsManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_viewer_cannot_access_staff_news(): void
    {
        $user = User::factory()->create([
            'role' => 'viewer',
        ]);

        Sanctum::actingAs($user, $user->abilities());

        $response = $this->getJson('/api/staff/news');

        $response->assertForbidden();
    }

    public function test_staff_can_list_all_news_entries(): void
    {
        $published = News::factory()->create([
            'title' => 'Published News',
            'published_at' => Carbon::now()->subDay(),
        ]);
        $draft = News::factory()->create([
            'title' => 'Draft News',
            'published_at' => null,
        ]);

        $user = User::factory()->create([
            'role' => 'staff',
        ]);

        Sanctum::actingAs($user, $user->abilities());

        $response = $this->getJson('/api/staff/news');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'news' => [[
                        'id', 'title', 'summary', 'body', 'published_at', 'created_at', 'updated_at',
                    ]],
                    'pagination' => ['current_page', 'per_page', 'total', 'last_page'],
                ],
                'meta' => ['request_id'],
            ]);

        $titles = collect($response->json('data.news'))->pluck('title')->all();

        $this->assertEqualsCanonicalizing([
            $published->title,
            $draft->title,
        ], $titles);
    }

    public function test_staff_cannot_create_without_admin_ability(): void
    {
        $user = User::factory()->create([
            'role' => 'staff',
        ]);

        Sanctum::actingAs($user, $user->abilities());

        $response = $this
            ->withHeaders($this->csrfHeaders())
            ->postJson('/api/staff/news', [
                'title' => 'New Update',
            ]);

        $response->assertForbidden();
    }

    public function test_admin_can_create_news(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        Sanctum::actingAs($user, $user->abilities());

        $payload = [
            'title' => 'Policy Update',
            'body' => 'Detailed announcement for staff.',
            'published_at' => Carbon::now()->toIso8601String(),
        ];

        $response = $this
            ->withHeaders($this->csrfHeaders())
            ->postJson('/api/staff/news', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.title', $payload['title'])
            ->assertJsonPath('data.body', $payload['body'])
            ->assertJsonStructure([
                'data' => ['id', 'title', 'summary', 'body', 'published_at', 'created_at', 'updated_at'],
                'meta' => ['request_id'],
            ]);

        $this->assertDatabaseHas('news', [
            'title' => $payload['title'],
        ]);
    }

    public function test_create_requires_title(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        Sanctum::actingAs($user, $user->abilities());

        $response = $this
            ->withHeaders($this->csrfHeaders())
            ->postJson('/api/staff/news', [
                'body' => 'Missing title should trigger validation.',
            ]);

        $response->assertUnprocessable();
    }

    public function test_admin_can_update_news(): void
    {
        $news = News::factory()->create([
            'title' => 'Original Title',
            'body' => 'Original body.',
        ]);

        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        Sanctum::actingAs($user, $user->abilities());

        $response = $this
            ->withHeaders($this->csrfHeaders())
            ->putJson("/api/staff/news/{$news->id}", [
                'title' => 'Updated Title',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.title', 'Updated Title');

        $this->assertDatabaseHas('news', [
            'id' => $news->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_update_missing_record_returns_not_found(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        Sanctum::actingAs($user, $user->abilities());

        $response = $this
            ->withHeaders($this->csrfHeaders())
            ->putJson('/api/staff/news/999', [
                'title' => 'Updated Title',
            ]);

        $response->assertNotFound()
            ->assertJsonStructure([
                'error' => ['message'],
                'meta' => ['request_id'],
            ]);
    }

    public function test_admin_can_delete_news(): void
    {
        $news = News::factory()->create();

        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        Sanctum::actingAs($user, $user->abilities());

        $response = $this
            ->withHeaders($this->csrfHeaders())
            ->deleteJson("/api/staff/news/{$news->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('news', [
            'id' => $news->id,
        ]);
    }

    /**
     * @return array<string, string>
     */
    protected function csrfHeaders(): array
    {
        Session::start();

        return [
            'X-CSRF-TOKEN' => csrf_token(),
            'X-Requested-With' => 'XMLHttpRequest',
        ];
    }
}
