<?php

namespace App\Infrastructure\Persistence\Memory;

use App\Domain\News\Contracts\NewsRepository as NewsRepositoryContract;
use App\Models\News;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Illuminate\Pagination\Paginator as SimplePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class NewsRepository implements NewsRepositoryContract
{
    /**
     * @var array<int, array<string, mixed>>
     */
    protected array $records = [];

    public function setConnectionName(?string $connection): void
    {
        // No-op for in-memory adapter.
    }

    public function paginatePublished(int $perPage = 15, string $sort = '-published_at'): LengthAwarePaginator
    {
        $now = Carbon::now();
        $all = collect($this->records)
            ->filter(function (array $attributes) use ($now): bool {
                $publishedAt = Arr::get($attributes, 'published_at');

                return $publishedAt !== null && Carbon::parse($publishedAt) <= $now;
            })
            ->sort(function (array $a, array $b) use ($sort): int {
                $direction = Str::startsWith($sort, '-') ? -1 : 1;
                $column = ltrim($sort, '-');

                if (! in_array($column, ['published_at', 'created_at'], true)) {
                    $column = 'published_at';
                }

                $first = (string) Arr::get($a, $column, '');
                $second = (string) Arr::get($b, $column, '');

                $comparison = $first <=> $second;

                if ($comparison === 0) {
                    return (int) Arr::get($b, 'id', 0) <=> (int) Arr::get($a, 'id', 0);
                }

                return $direction * $comparison;
            })
            ->values();

        $currentPage = SimplePaginator::resolveCurrentPage();
        $results = $all
            ->forPage($currentPage, $perPage)
            ->map(fn (array $attributes) => $this->mapToModel($attributes))
            ->values();

        Log::debug('Memory news pagination requested.', [
            'per_page' => $perPage,
            'page' => $currentPage,
            'total' => $all->count(),
            'sort' => $sort,
        ]);

        return new Paginator(
            $results,
            $all->count(),
            $perPage,
            $currentPage,
            ['path' => SimplePaginator::resolveCurrentPath()]
        );
    }

    public function find(int $id): ?News
    {
        $record = $this->records[$id] ?? null;

        Log::debug('Memory news lookup requested.', [
            'news_id' => $id,
            'found' => $record !== null,
        ]);

        return $record ? $this->mapToModel($record) : null;
    }

    public function save(News $news): void
    {
        if (! $news->getKey()) {
            $news->setAttribute('id', $this->nextId());
            $news->setAttribute('created_at', Carbon::now()->toDateTimeString());
        }

        $news->setAttribute('updated_at', Carbon::now()->toDateTimeString());

        $attributes = $news->getAttributes();
        $this->records[$news->getKey()] = $attributes;

        Log::debug('News model stored in memory.', [
            'news_id' => $news->getKey(),
        ]);
    }

    public function delete(News $news): void
    {
        unset($this->records[$news->getKey()]);

        Log::debug('News model removed from memory.', [
            'news_id' => $news->getKey(),
        ]);
    }

    protected function mapToModel(array $attributes): News
    {
        $model = new News;
        $model->forceFill($attributes);
        $model->exists = true;

        return $model;
    }

    protected function nextId(): int
    {
        return empty($this->records)
            ? 1
            : (max(array_keys($this->records)) + 1);
    }
}
