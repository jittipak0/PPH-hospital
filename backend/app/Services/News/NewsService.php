<?php

namespace App\Services\News;

use App\Domain\News\Contracts\NewsRepository;
use App\Domain\News\Exceptions\NewsNotFoundException;
use App\Models\News;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class NewsService
{
    public function __construct(private readonly NewsRepository $newsRepository) {}

    public function listPublished(int $perPage, string $sort): LengthAwarePaginator
    {
        Log::debug('NewsService: listing published news.', [
            'per_page' => $perPage,
            'sort' => $sort,
            'page' => Paginator::resolveCurrentPage(),
        ]);

        $paginator = $this->newsRepository->paginatePublished($perPage, $sort);

        Log::debug('NewsService: published news retrieved.', [
            'per_page' => $perPage,
            'sort' => $sort,
            'returned' => $paginator->count(),
            'total' => $paginator->total(),
        ]);

        return $paginator;
    }

    public function listForStaff(int $perPage, string $sort): LengthAwarePaginator
    {
        Log::debug('NewsService: listing staff news.', [
            'per_page' => $perPage,
            'sort' => $sort,
            'page' => Paginator::resolveCurrentPage(),
        ]);

        $paginator = $this->newsRepository->paginateForStaff($perPage, $sort);

        Log::debug('NewsService: staff news retrieved.', [
            'per_page' => $perPage,
            'sort' => $sort,
            'returned' => $paginator->count(),
            'total' => $paginator->total(),
        ]);

        return $paginator;
    }

    /**
     * @param  array{title: string, body?: ?string, published_at?: ?string}  $attributes
     */
    public function create(array $attributes): News
    {
        Log::debug('NewsService: creating news.', [
            'title' => $attributes['title'] ?? null,
            'body_preview' => Str::limit((string) ($attributes['body'] ?? ''), 80),
            'published_at' => $attributes['published_at'] ?? null,
        ]);

        $news = new News;
        $news->title = $attributes['title'];
        $news->body = $attributes['body'] ?? null;

        if (array_key_exists('published_at', $attributes)) {
            $news->published_at = $attributes['published_at']
                ? Carbon::parse($attributes['published_at'])
                : null;
        }

        $this->newsRepository->save($news);

        Log::debug('NewsService: news created.', [
            'news_id' => $news->getKey(),
        ]);

        return $news;
    }

    /**
     * @param  array{title?: string, body?: ?string, published_at?: ?string}  $attributes
     */
    public function update(int $id, array $attributes): News
    {
        Log::debug('NewsService: updating news.', [
            'news_id' => $id,
            'fields' => array_keys($attributes),
        ]);

        $news = $this->newsRepository->find($id);

        if (! $news) {
            Log::debug('NewsService: news not found for update.', [
                'news_id' => $id,
            ]);

            throw new NewsNotFoundException;
        }

        if (array_key_exists('title', $attributes)) {
            $news->title = $attributes['title'];
        }

        if (array_key_exists('body', $attributes)) {
            $news->body = $attributes['body'];
        }

        if (array_key_exists('published_at', $attributes)) {
            $news->published_at = $attributes['published_at']
                ? Carbon::parse($attributes['published_at'])
                : null;
        }

        $this->newsRepository->save($news);

        Log::debug('NewsService: news updated.', [
            'news_id' => $news->getKey(),
        ]);

        return $news;
    }

    public function delete(int $id): void
    {
        Log::debug('NewsService: deleting news.', [
            'news_id' => $id,
        ]);

        $news = $this->newsRepository->find($id);

        if (! $news) {
            Log::debug('NewsService: news not found for deletion.', [
                'news_id' => $id,
            ]);

            throw new NewsNotFoundException;
        }

        $this->newsRepository->delete($news);

        Log::debug('NewsService: news deleted.', [
            'news_id' => $id,
        ]);
    }
}
