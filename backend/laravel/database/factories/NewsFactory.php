<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\News>
 */
class NewsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->unique()->sentence(6),
            'body' => fake()->paragraphs(3, true),
            'published_at' => fake()->optional(0.3, null)->dateTimeBetween('-1 year', '+1 month'),
        ];
    }

    /**
     * Indicate that the news article is published immediately.
     */
    public function published(): static
    {
        return $this->state(fn () => [
            'published_at' => Carbon::now(),
        ]);
    }
}
