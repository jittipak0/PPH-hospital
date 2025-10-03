<?php

namespace Database\Factories;

use App\Models\Donation;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Donation>
 */
class DonationFactory extends Factory
{
    protected $model = Donation::class;

    public function definition(): array
    {
        return [
            'donor_name' => $this->faker->name(),
            'amount' => $this->faker->randomFloat(2, 100, 5000),
            'channel' => $this->faker->randomElement(['cash', 'bank', 'promptpay']),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->safeEmail(),
            'note' => $this->faker->sentence(),
            'reference_code' => Str::upper(Str::random(12)),
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => 'factory-agent',
        ];
    }
}
