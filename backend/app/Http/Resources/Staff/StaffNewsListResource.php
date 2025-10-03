<?php

namespace App\Http\Resources\Staff;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin array{news: iterable<int, mixed>, pagination: array{current_page: int, per_page: int, total: int, last_page: int}}
 */
class StaffNewsListResource extends JsonResource
{
    /**
     * @return array{news: array<int, array{id: int|string|null, title: string|null, summary: ?string, body: ?string, published_at: ?string, created_at: ?string, updated_at: ?string}>, pagination: array{current_page: int, per_page: int, total: int, last_page: int}}
     */
    public function toArray(Request $request): array
    {
        $news = collect($this->resource['news'] ?? [])
            ->map(fn ($item) => StaffNewsResource::make($item)->resolve($request))
            ->all();

        return [
            'news' => $news,
            'pagination' => $this->resource['pagination'] ?? [],
        ];
    }
}
