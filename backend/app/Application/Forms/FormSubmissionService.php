<?php

namespace App\Application\Forms;

use App\Mail\FormSubmissionNotification;
use App\Models\ArchiveRequest;
use App\Models\Donation;
use App\Models\FuelClaim;
use App\Models\MedicalRecordRequest;
use App\Models\SatisfactionSurvey;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FormSubmissionService
{
    public function __construct(private readonly ?string $notifyEmail = null)
    {
    }

    public function storeMedicalRecord(array $validated): MedicalRecordRequest
    {
        $files = [];

        if (! empty($validated['files'])) {
            foreach ($validated['files'] as $file) {
                if ($file instanceof UploadedFile) {
                    $files[] = $this->storeUpload($file);
                }
            }
        }

        $validated['files'] = $files;
        $validated['consent'] = (bool) ($validated['consent'] ?? false);

        $request = MedicalRecordRequest::create($validated);

        $this->notify('medical_record_request', [
            'id' => $request->getKey(),
            'submitted_at' => $request->created_at->toIso8601String(),
        ]);

        return $request;
    }

    public function storeFuelClaim(array $validated): FuelClaim
    {
        if (isset($validated['receipt']) && $validated['receipt'] instanceof UploadedFile) {
            $validated['receipt_path'] = $this->storeUpload($validated['receipt']);
        }

        unset($validated['receipt']);

        $claim = FuelClaim::create($validated);

        $this->notify('fuel_claim', [
            'id' => $claim->getKey(),
            'staff_id' => $claim->staff_id,
        ]);

        return $claim;
    }

    public function storeArchiveRequest(array $validated): ArchiveRequest
    {
        $request = ArchiveRequest::create($validated);

        $this->notify('archive_request', [
            'id' => $request->getKey(),
            'staff_id' => $request->staff_id,
        ]);

        return $request;
    }

    public function storeDonation(array $validated): Donation
    {
        $donation = Donation::create($validated);

        $this->notify('donation', [
            'id' => $donation->getKey(),
            'amount' => $donation->amount,
        ]);

        return $donation;
    }

    public function storeSatisfactionSurvey(array $validated): SatisfactionSurvey
    {
        $validated['contact_optin'] = (bool) ($validated['contact_optin'] ?? false);

        $survey = SatisfactionSurvey::create($validated);

        $this->notify('satisfaction_survey', [
            'id' => $survey->getKey(),
            'channel' => $survey->channel,
        ]);

        return $survey;
    }

    private function storeUpload(UploadedFile $file): string
    {
        $disk = Storage::disk('uploads');
        $path = sprintf('%s/%s.%s', now()->format('Y/m/d'), Str::uuid()->toString(), $file->getClientOriginalExtension());

        $disk->putFileAs(dirname($path), $file, basename($path));

        return $path;
    }

    private function notify(string $type, array $payload): void
    {
        if (empty($this->notifyEmail)) {
            return;
        }

        Mail::to($this->notifyEmail)->queue(new FormSubmissionNotification($type, $payload));
    }
}
