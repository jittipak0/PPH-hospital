<?php

namespace Tests\Unit\Services\News;

use App\Domain\News\Contracts\NewsRepository;
use App\Domain\News\Exceptions\NewsNotFoundException;
use App\Models\News;
use App\Services\News\NewsService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Tests\TestCase;

class NewsServiceTest extends TestCase
{
    public function test_create_news_populates_model_and_persists(): void
    {
        $repository = $this->createMock(NewsRepository::class);

        $repository->expects($this->once())
            ->method('save')
            ->with($this->callback(function (News $news): bool {
                return $news->title === 'Policy Update'
                    && $news->body === 'Details'
                    && $news->published_at !== null;
            }));

        $service = new NewsService($repository);

        $publishedAt = now()->toIso8601String();

        $news = $service->create([
            'title' => 'Policy Update',
            'body' => 'Details',
            'published_at' => $publishedAt,
        ]);

        $this->assertInstanceOf(News::class, $news);
        $this->assertSame('Policy Update', $news->title);
        $this->assertSame('Details', $news->body);
        $this->assertSame($publishedAt, $news->published_at?->toIso8601String());
    }

    public function test_update_throws_exception_when_news_missing(): void
    {
        $repository = $this->createMock(NewsRepository::class);
        $repository->method('find')->with(999)->willReturn(null);

        $service = new NewsService($repository);

        $this->expectException(NewsNotFoundException::class);

        $service->update(999, ['title' => 'Updated']);
    }

    public function test_list_published_delegates_to_repository(): void
    {
        $repository = $this->createMock(NewsRepository::class);
        $paginator = new LengthAwarePaginator(
            Collection::make([]),
            0,
            10,
            1
        );

        $repository->expects($this->once())
            ->method('paginatePublished')
            ->with(10, '-published_at')
            ->willReturn($paginator);

        $service = new NewsService($repository);

        $result = $service->listPublished(10, '-published_at');

        $this->assertSame($paginator, $result);
    }

    public function test_delete_removes_existing_news(): void
    {
        $repository = $this->createMock(NewsRepository::class);
        $news = new News(['title' => 'Delete me']);
        $news->id = 5;

        $repository->expects($this->once())
            ->method('find')
            ->with(5)
            ->willReturn($news);

        $repository->expects($this->once())
            ->method('delete')
            ->with($news);

        $service = new NewsService($repository);

        $service->delete(5);
    }
}
