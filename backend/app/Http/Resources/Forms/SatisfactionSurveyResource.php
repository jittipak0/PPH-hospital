<?php

namespace App\Http\Resources\Forms;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SatisfactionSurveyResource extends JsonResource
{
    /**
     * @return array{id: int|string|null, submitted_at: ?string}
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'submitted_at' => optional($this->resource->created_at)->toIso8601String(),
        ];
    }
}
