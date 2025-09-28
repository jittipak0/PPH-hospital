<?php

namespace Tests\Feature\Forms;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MedicalRecordRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_submit_medical_record_request(): void
    {
        Storage::fake('local');

        $token = 'test-token';

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeaders([
                'X-CSRF-TOKEN' => $token,
                'X-Requested-With' => 'XMLHttpRequest',
                'Accept' => 'application/json',
            ])
            ->post('/api/forms/medical-record-request', [
                'full_name' => 'นายทดสอบ ระบบ',
                'hn' => 'AB1234',
                'citizen_id' => '1234567890123',
                'phone' => '0812345678',
                'email' => 'test@example.com',
                'address' => '123 หมู่ 4 แขวงสุขภาพดี เขตเมืองหลวง กรุงเทพมหานคร',
                'reason' => 'ต้องการใช้ข้อมูลประกอบการรักษาต่อเนื่อง',
                'consent' => '1',
                'idcard_file' => UploadedFile::fake()->create('idcard.pdf', 120, 'application/pdf'),
            ]);

        $response->assertCreated()->assertJsonStructure(['ok', 'id', 'message']);

        $this->assertDatabaseCount('medical_record_requests', 1);
        $record = \App\Models\MedicalRecordRequest::first();
        $this->assertNotNull($record);
        $this->assertSame('นายทดสอบ ระบบ', $record->full_name);
        $this->assertSame('AB1234', $record->hn);
        $this->assertSame('1234*******23', $record->citizen_id_masked);
        Storage::disk('local')->assertExists($record->idcard_path);
    }

    public function test_consent_is_required(): void
    {
        $token = 'test-token';

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeaders([
                'X-CSRF-TOKEN' => $token,
                'X-Requested-With' => 'XMLHttpRequest',
                'Accept' => 'application/json',
            ])
            ->postJson('/api/forms/medical-record-request', [
                'full_name' => 'นายทดสอบ ระบบ',
                'hn' => 'AB1234',
                'citizen_id' => '1234567890123',
                'phone' => '0812345678',
                'email' => 'test@example.com',
                'address' => '123 หมู่ 4 แขวงสุขภาพดี เขตเมืองหลวง กรุงเทพมหานคร',
                'reason' => 'ต้องการใช้ข้อมูลประกอบการรักษาต่อเนื่อง',
            ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['consent']);
    }
}
