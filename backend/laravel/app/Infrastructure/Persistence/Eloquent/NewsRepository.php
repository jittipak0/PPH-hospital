<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\News\Contracts\NewsRepository as NewsRepositoryContract;
use App\Models\News;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class NewsRepository implements NewsRepositoryContract
{
    protected ?string $connection = null;

    public function setConnectionName(?string $connection): void
    {
        $this->connection = $connection;
    }

    public function connectionName(): ?string
    {
        return $this->connection;
    }

    public function paginatePublished(int $perPage = 15, string $sort = '-published_at'): LengthAwarePaginator
    {
        $query = $this->query()
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());

        $direction = Str::startsWith($sort, '-') ? 'desc' : 'asc';
        $column = ltrim($sort, '-');

        if (! in_array($column, ['published_at', 'created_at'], true)) {
            $column = 'published_at';
        }

        $query->orderBy($column, $direction);

        if ($column !== 'id') {
            $query->orderByDesc('id');
        }

        Log::debug('News pagination requested.', [
            'connection' => $this->connection,
            'per_page' => $perPage,
            'page' => Paginator::resolveCurrentPage(),
            'sort' => $sort,
        ]);

        return $query->paginate($perPage);
    }

    public function find(int $id): ?News
    {
        Log::debug('News lookup requested.', [
            'connection' => $this->connection,
            'news_id' => $id,
        ]);

        return $this->query()->find($id);
    }

    public function save(News $news): void
    {
        if ($this->connection) {
            $news->setConnection($this->connection);
        }

        $news->save();

        Log::debug('News model persisted.', [
            'connection' => $this->connection,
            'news_id' => $news->getKey(),
        ]);
    }

    public function delete(News $news): void
    {
        if ($this->connection) {
            $news->setConnection($this->connection);
        }

        $newsId = $news->getKey();
        $news->delete();

        Log::debug('News model removed.', [
            'connection' => $this->connection,
            'news_id' => $newsId,
        ]);
    }

    protected function query(): Builder
    {
        return $this->connection
            ? News::on($this->connection)
            : News::query();
    }
}
