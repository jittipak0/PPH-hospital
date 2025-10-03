<?php

namespace App\Domain\News\Contracts;

use App\Models\News;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface NewsRepository
{
    public function paginatePublished(int $perPage = 15): LengthAwarePaginator;

    public function find(int $id): ?News;

    public function save(News $news): void;

    public function delete(News $news): void;
}
