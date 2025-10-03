<?php

namespace Database\Factories;

use App\Models\HealthRiderApplication;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HealthRiderApplication>
 */
class HealthRiderApplicationFactory extends Factory
{
    protected $model = HealthRiderApplication::class;

    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'hn' => strtoupper($this->faker->bothify('??###')),
            'address' => $this->faker->address(),
            'district' => $this->faker->citySuffix(),
            'province' => $this->faker->state(),
            'zipcode' => $this->faker->postcode(),
            'phone' => $this->faker->phoneNumber(),
            'line_id' => $this->faker->userName(),
            'consent' => true,
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => 'factory-agent',
        ];
    }
}
