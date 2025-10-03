<?php

namespace App\Http\Resources\Staff;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class StaffNewsResource extends JsonResource
{
    /**
     * @return array{id: int|string|null, title: string|null, summary: ?string, body: ?string, published_at: ?string, created_at: ?string, updated_at: ?string}
     */
    public function toArray(Request $request): array
    {
        $body = (string) ($this->resource->body ?? '');

        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'summary' => $body !== '' ? Str::limit($body, 120) : null,
            'body' => $this->resource->body,
            'published_at' => optional($this->resource->published_at)->toIso8601String(),
            'created_at' => optional($this->resource->created_at)->toIso8601String(),
            'updated_at' => optional($this->resource->updated_at)->toIso8601String(),
        ];
    }
}
