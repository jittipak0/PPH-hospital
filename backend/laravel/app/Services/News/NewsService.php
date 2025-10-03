<?php

namespace App\Services\News;

use App\Domain\News\Contracts\NewsRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Log;

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
}
