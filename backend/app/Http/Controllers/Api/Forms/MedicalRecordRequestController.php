<?php

namespace App\Http\Controllers\Api\Forms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forms\MedicalRecordRequestFormRequest;
use App\Models\MedicalRecordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Throwable;

class MedicalRecordRequestController extends Controller
{
    public function store(MedicalRecordRequestFormRequest $request): JsonResponse
    {
        Log::debug('Medical record request received', [
            'has_attachment' => $request->hasFile('idcard_file'),
            'ip_address' => $request->ip(),
        ]);

        $validated = $request->validated();
        $filePath = null;

        Log::debug('Medical record request validated', [
            'hn' => $validated['hn'],
            'consent' => (bool) $validated['consent'],
        ]);

        try {
            if ($request->hasFile('idcard_file')) {
                $file = $request->file('idcard_file');
                $this->assertUploadedFile($file);

                Log::debug('Storing medical record request attachment', [
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ]);

                $directory = 'private/forms/idcards';
                Storage::disk('local')->makeDirectory($directory);
                $fileName = Str::uuid()->toString() . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs($directory, $fileName, 'local');

                Log::debug('Medical record request attachment stored', [
                    'path' => $filePath,
                ]);
            }

            $citizenId = $validated['citizen_id'];

            Log::debug('Persisting medical record request', [
                'hn' => $validated['hn'],
                'has_attachment' => (bool) $filePath,
            ]);

            $record = DB::transaction(function () use ($validated, $citizenId, $filePath, $request) {
                return MedicalRecordRequest::create([
                    'full_name' => $validated['full_name'],
                    'hn' => $validated['hn'],
                    'citizen_id_hash' => hash('sha256', $citizenId . config('app.key')),
                    'citizen_id_masked' => $this->maskCitizenId($citizenId),
                    'phone' => $validated['phone'],
                    'email' => $validated['email'],
                    'address' => $validated['address'],
                    'reason' => $validated['reason'],
                    'consent' => (bool) $validated['consent'],
                    'idcard_path' => $filePath,
                    'ip_address' => $request->ip(),
                    'user_agent' => mb_substr((string) $request->userAgent(), 0, 512),
                ]);
            });

            Log::debug('Medical record request stored', [
                'request_id' => (string) $record->getKey(),
                'ip_address' => $record->ip_address,
                'has_attachment' => (bool) $filePath,
            ]);

            return response()->json([
                'ok' => true,
                'id' => (string) $record->getKey(),
                'message' => 'บันทึกคำขอเรียบร้อย เจ้าหน้าที่จะแจ้งผลภายใน 3-5 วันทำการ',
            ], 201);
        } catch (Throwable $exception) {
            if ($filePath) {
                Storage::disk('local')->delete($filePath);
            }

            Log::error('Failed to store medical record request', [
                'ip_address' => $request->ip(),
                'has_attachment' => (bool) $filePath,
                'exception' => $exception,
            ]);

            throw $exception;
        }
    }

    private function maskCitizenId(string $citizenId): string
    {
        return substr($citizenId, 0, 4) . str_repeat('*', 7) . substr($citizenId, -2);
    }

    private function assertUploadedFile(UploadedFile $file): void
    {
        $allowedMimes = config('forms.upload.allowed_mimes');
        $maxKilobytes = (int) config('forms.upload.max_kb');

        $mime = $file->getMimeType();
        if (! in_array($mime, $allowedMimes, true)) {
            throw ValidationException::withMessages([
                'idcard_file' => 'ประเภทไฟล์ไม่รองรับ กรุณาอัปโหลดเฉพาะ PDF, JPG หรือ PNG',
            ]);
        }

        if ($file->getSize() > $maxKilobytes * 1024) {
            throw ValidationException::withMessages([
                'idcard_file' => 'ไฟล์แนบต้องมีขนาดไม่เกิน ' . config('forms.upload.max_mb') . ' MB',
            ]);
        }
    }
}
