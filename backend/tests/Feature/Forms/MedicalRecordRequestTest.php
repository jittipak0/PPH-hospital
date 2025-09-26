<?php

namespace Tests\Feature\Forms;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MedicalRecordRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_persists_a_valid_request(): void
    {
        Storage::fake('local');

        $payload = [
            'full_name' => 'สมชาย ใจดี',
            'hn' => 'HN123456',
            'citizen_id' => '1234567890123',
            'phone' => '0812345678',
            'email' => 'patient@example.com',
            'address' => '123 หมู่ 4 ตำบลกลางเมือง อำเภอเมือง',
            'reason' => 'ต้องการสำเนาประวัติการรักษาเพื่อนำไปใช้ยื่นประกัน',
            'consent' => 'on',
            'idcard_file' => UploadedFile::fake()->create('idcard.pdf', 100, 'application/pdf'),
        ];

        $response = $this->postJson('/api/forms/medical-record-request', $payload);

        $response->assertCreated();
        $response->assertJsonStructure(['data' => ['id', 'full_name', 'citizen_id_last4', 'submitted_at']]);

        $this->assertDatabaseHas('medical_record_requests', [
            'full_name' => 'สมชาย ใจดี',
            'hn' => 'HN123456',
            'citizen_id_last4' => '0123',
            'email' => 'patient@example.com',
        ]);

        $record = \App\Models\MedicalRecordRequest::first();
        $this->assertNotNull($record);
        $this->assertEquals(hash('sha256', '1234567890123'), $record->citizen_id_hash);
        Storage::disk('local')->assertExists($record->idcard_path);
    }

    public function test_it_validates_required_fields(): void
    {
        $response = $this->postJson('/api/forms/medical-record-request', []);

        $response->assertStatus(422);
        $response->assertJsonStructure(['errors' => ['full_name', 'hn', 'citizen_id', 'idcard_file']]);
    }
}
