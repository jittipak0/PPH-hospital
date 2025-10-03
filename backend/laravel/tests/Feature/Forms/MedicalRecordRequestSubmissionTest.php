<?php

namespace Tests\Feature\Forms;

use App\Models\MedicalRecordRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MedicalRecordRequestSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_submission_persists_request_and_stores_file(): void
    {
        Storage::fake('local');
        Session::start();
        $token = Session::token();

        $file = UploadedFile::fake()->create('idcard.pdf', 200, 'application/pdf');

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeader('X-CSRF-TOKEN', $token)
            ->withHeader('X-Requested-With', 'XMLHttpRequest')
            ->postJson('/api/forms/medical-record-request', [
                'full_name' => 'Jane Doe',
                'hn' => 'AB123',
                'citizen_id' => '1234567890123',
                'phone' => '0812345678',
                'email' => 'jane@example.com',
                'address' => '123 Example Street',
                'reason' => 'Personal use',
                'consent' => 'yes',
                'idcard_file' => $file,
            ]);

        $response->assertCreated();
        $response->assertJsonStructure([
            'data' => ['id', 'submitted_at'],
            'meta' => ['request_id'],
        ]);

        $recordId = $response->json('data.id');
        $record = MedicalRecordRequest::find($recordId);
        $this->assertNotNull($record);
        $this->assertNotNull($record->idcard_path);
        $this->assertEquals(
            hash('sha256', '1234567890123'.config('app.key')),
            $record->citizen_id_hash,
        );
        $this->assertTrue(str_contains($record->citizen_id_masked, '*'));

        Storage::disk('local')->assertExists($record->idcard_path);
    }
}
