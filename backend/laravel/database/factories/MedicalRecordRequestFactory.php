<?php

namespace Database\Factories;

use App\Models\MedicalRecordRequest;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<MedicalRecordRequest>
 */
class MedicalRecordRequestFactory extends Factory
{
    protected $model = MedicalRecordRequest::class;

    public function definition(): array
    {
        $citizenId = $this->faker->numerify('#############');

        return [
            'full_name' => $this->faker->name(),
            'hn' => strtoupper($this->faker->bothify('??###')),
            'citizen_id_hash' => hash('sha256', $citizenId.config('app.key')),
            'citizen_id_masked' => Str::mask($citizenId, '*', 3, 6),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->safeEmail(),
            'address' => $this->faker->address(),
            'reason' => $this->faker->sentence(),
            'consent' => true,
            'idcard_path' => 'forms/'.$this->faker->uuid().'.pdf',
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => 'factory-agent',
        ];
    }
}
