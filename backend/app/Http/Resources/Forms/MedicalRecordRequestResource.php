<?php

namespace App\Http\Resources\Forms;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\MedicalRecordRequest */
class MedicalRecordRequestResource extends JsonResource
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
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'reason' => $this->reason,
            'citizen_id_last4' => $this->citizen_id_last4,
            'submitted_at' => $this->created_at?->toAtomString(),
        ];
    }
}
