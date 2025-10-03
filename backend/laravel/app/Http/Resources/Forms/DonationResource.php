<?php

namespace App\Http\Resources\Forms;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonationResource extends JsonResource
{
    /**
     * @return array{id: int|string|null, reference_code: string|null, submitted_at: ?string}
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'reference_code' => $this->resource->reference_code,
            'submitted_at' => optional($this->resource->created_at)->toIso8601String(),
        ];
    }
}
