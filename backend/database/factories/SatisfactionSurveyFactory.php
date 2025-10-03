<?php

namespace Database\Factories;

use App\Models\SatisfactionSurvey;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SatisfactionSurvey>
 */
class SatisfactionSurveyFactory extends Factory
{
    protected $model = SatisfactionSurvey::class;

    public function definition(): array
    {
        return [
            'score_overall' => $this->faker->numberBetween(1, 5),
            'score_waittime' => $this->faker->numberBetween(1, 5),
            'score_staff' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->optional()->sentence(),
            'service_date' => $this->faker->date(),
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => 'factory-agent',
        ];
    }
}
