<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    /**
     * @return array{id: int|string|null, title: string|null, body: string|null, published_at: ?string}
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'body' => $this->resource->body,
            'published_at' => optional($this->resource->published_at)->toIso8601String(),
        ];
    }
}
