<?php

namespace App\Services\Forms;

use App\Models\DonationSubmission;
use App\Models\MedicalRecordRequest;
use App\Models\SatisfactionSurvey;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FormSubmissionService
{
    public function createMedicalRecordRequest(array $data, UploadedFile $idCardFile): MedicalRecordRequest
    {
        $citizenId = $data['citizen_id'];
        $filePath = $this->storeFile($idCardFile, 'medical-record-requests');

        return MedicalRecordRequest::create([
            'full_name' => $data['full_name'],
            'hn' => $data['hn'],
            'citizen_id_hash' => hash('sha256', $citizenId),
            'citizen_id_last4' => substr($citizenId, -4),
            'phone' => $data['phone'],
            'email' => $data['email'],
            'address' => $data['address'],
            'reason' => $data['reason'],
            'consent' => (bool) $data['consent'],
            'idcard_path' => $filePath,
        ]);
    }

    public function createDonation(array $data): DonationSubmission
    {
        return DonationSubmission::create([
            'donor_name' => $data['donor_name'],
            'amount' => $data['amount'],
            'channel' => $data['channel'],
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'wants_receipt' => (bool) $data['wants_receipt'],
            'consent' => (bool) $data['consent'],
            'notes' => $data['notes'] ?? null,
        ]);
    }

    public function createSatisfactionSurvey(array $data): SatisfactionSurvey
    {
        return SatisfactionSurvey::create([
            'full_name' => $data['full_name'],
            'hn' => $data['hn'] ?? null,
            'service_date' => $data['service_date'],
            'service_type' => $data['service_type'],
            'rating' => $data['rating'],
            'feedback' => $data['feedback'] ?? null,
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'consent' => (bool) $data['consent'],
        ]);
    }

    private function storeFile(UploadedFile $file, string $directory): string
    {
        $safeName = Str::uuid()->toString() . '.' . $file->getClientOriginalExtension();
        return Storage::disk('local')->putFileAs('private/forms/' . $directory, $file, $safeName);
    }
}
