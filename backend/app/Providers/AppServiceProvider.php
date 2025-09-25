<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use InvalidArgumentException;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $config = config('datastore');

        if (!is_array($config)) {
            return;
        }

        $driver = $config['driver'] ?? 'eloquent';
        $connection = $config['connection'] ?? config('database.default');
        $map = $config['map'] ?? [];

        if (!is_array($map)) {
            return;
        }

        foreach ($map as $abstract => $implementations) {
            if (!is_array($implementations) || !array_key_exists($driver, $implementations)) {
                throw new InvalidArgumentException("No datastore adapter configured for driver [{$driver}] and abstraction [{$abstract}].");
            }

            $concrete = $implementations[$driver];

            $this->app->bind($abstract, function ($app) use ($driver, $concrete, $connection) {
                $parameters = [];

                if ($driver === 'eloquent') {
                    if (!is_string($connection) || $connection === '') {
                        throw new InvalidArgumentException('Datastore connection name must be a non-empty string.');
                    }

                    if (!is_array(config("database.connections.{$connection}"))) {
                        throw new InvalidArgumentException("Database connection [{$connection}] is not defined.");
                    }

                    $parameters['connection'] = $connection;
                }

                return $app->make($concrete, $parameters);
            });
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
