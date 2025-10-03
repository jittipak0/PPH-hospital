<?php

namespace Tests\Unit\Services\Forms;

use App\Domain\Forms\Contracts\MedicalRecordRequestRepository;
use App\Models\MedicalRecordRequest;
use App\Services\Forms\MedicalRecordRequestService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MedicalRecordRequestServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        config(['app.key' => 'base64:TESTKEY']);
    }

    public function test_submit_hashes_sensitive_fields_and_stores_file(): void
    {
        $repository = $this->createMock(MedicalRecordRequestRepository::class);

        $repository->expects($this->once())
            ->method('save')
            ->with($this->isInstanceOf(MedicalRecordRequest::class));

        $service = new MedicalRecordRequestService($repository);

        $record = $service->submit([
            'full_name' => 'Jane Doe',
            'hn' => 'AB123',
            'citizen_id' => '1234567890123',
            'phone' => '0812345678',
            'email' => 'jane@example.com',
            'address' => '123 Example Street',
            'reason' => 'Insurance purposes',
            'consent' => true,
            'idcard_file' => UploadedFile::fake()->create('idcard.pdf', 200, 'application/pdf'),
        ], '203.0.113.10', 'Mozilla/5.0');

        $this->assertInstanceOf(MedicalRecordRequest::class, $record);
        $this->assertSame(
            hash('sha256', '1234567890123'.config('app.key')),
            $record->citizen_id_hash
        );
        $this->assertStringContainsString('*', (string) $record->citizen_id_masked);
        $this->assertSame('203.0.113.10', $record->ip_address);
        $this->assertSame('Mozilla/5.0', $record->user_agent);
        $this->assertNotNull($record->idcard_path);
        Storage::disk('local')->assertExists($record->idcard_path);
    }
}
