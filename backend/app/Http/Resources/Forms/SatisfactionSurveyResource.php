<?php

namespace App\Http\Resources\Forms;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\SatisfactionSurvey */
class SatisfactionSurveyResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'hn' => $this->hn,
            'service_date' => $this->service_date?->toDateString(),
            'service_type' => $this->service_type,
            'rating' => $this->rating,
            'feedback' => $this->feedback,
            'phone' => $this->phone,
            'email' => $this->email,
            'submitted_at' => $this->created_at?->toAtomString(),
        ];
    }
}
