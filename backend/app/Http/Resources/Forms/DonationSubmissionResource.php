<?php

namespace App\Http\Resources\Forms;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\DonationSubmission */
class DonationSubmissionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'donor_name' => $this->donor_name,
            'amount' => $this->amount,
            'channel' => $this->channel,
            'phone' => $this->phone,
            'email' => $this->email,
            'wants_receipt' => $this->wants_receipt,
            'notes' => $this->notes,
            'submitted_at' => $this->created_at?->toAtomString(),
        ];
    }
}
