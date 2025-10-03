<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin array{news: iterable<int, mixed>, pagination: array{current_page: int, per_page: int, total: int, last_page: int}}
 */
class NewsListResource extends JsonResource
{
    /**
     * @return array{news: array<int, array{id: int|string|null, title: string|null, body: string|null, published_at: ?string}>, pagination: array{current_page: int, per_page: int, total: int, last_page: int}}
     */
    public function toArray(Request $request): array
    {
        $news = collect($this->resource['news'] ?? [])
            ->map(fn ($item) => NewsResource::make($item)->resolve($request))
            ->all();

        return [
            'news' => $news,
            'pagination' => $this->resource['pagination'] ?? [],
        ];
    }
}
