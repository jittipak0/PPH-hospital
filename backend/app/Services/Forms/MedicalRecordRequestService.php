<?php

namespace App\Services\Forms;

use App\Domain\Forms\Contracts\MedicalRecordRequestRepository;
use App\Models\MedicalRecordRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MedicalRecordRequestService
{
    public function __construct(private readonly MedicalRecordRequestRepository $repository) {}

    /**
     * @param  array{
     *     full_name: string,
     *     hn: string,
     *     citizen_id: string,
     *     phone: string,
     *     email?: ?string,
     *     address: string,
     *     reason?: ?string,
     *     consent: bool,
     *     idcard_file?: ?UploadedFile,
     * }  $payload
     */
    public function submit(array $payload, string $ipAddress, ?string $userAgent): MedicalRecordRequest
    {
        Log::debug('MedicalRecordRequestService: submission received.', [
            'has_file' => isset($payload['idcard_file']),
        ]);

        $citizenId = $payload['citizen_id'];
        $payload['citizen_id_hash'] = hash('sha256', $citizenId.config('app.key'));
        $payload['citizen_id_masked'] = Str::mask($citizenId, '*', 3, 6);
        unset($payload['citizen_id']);

        $payload['consent'] = (bool) $payload['consent'];
        $payload['ip_address'] = $ipAddress;
        $payload['user_agent'] = $userAgent;

        $file = $payload['idcard_file'] ?? null;
        unset($payload['idcard_file']);

        $record = new MedicalRecordRequest($payload);

        if ($file instanceof UploadedFile) {
            $record->idcard_path = $this->storeAttachment($file);
        }

        $this->repository->save($record);

        Log::debug('MedicalRecordRequestService: submission stored.', [
            'record_id' => $record->getKey(),
            'has_file' => $record->idcard_path !== null,
        ]);

        return $record;
    }

    protected function storeAttachment(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension());
        $hashedName = hash('sha256', Str::uuid()->toString().microtime(true));
        $filename = $extension ? $hashedName.'.'.$extension : $hashedName;

        $path = $file->storeAs('forms/medical-records', $filename, 'local');

        Log::debug('MedicalRecordRequestService: attachment stored.', [
            'hash' => $hashedName,
            'size_bytes' => $file->getSize(),
            'mime' => $file->getMimeType(),
        ]);

        return $path;
    }
}
