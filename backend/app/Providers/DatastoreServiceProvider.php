<?php

namespace App\Providers;

use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use RuntimeException;

class DatastoreServiceProvider extends ServiceProvider
{
    /**
     * Register services and bind repository interfaces to adapters.
     */
    public function register(): void
    {
        $config = config('datastore');

        $driver = $config['driver'] ?? 'eloquent';
        $connection = $config['connection'] ?? config('database.default');
        $repositories = $config['repositories'] ?? [];

        foreach ($repositories as $interface => $adapters) {
            $implementation = $adapters[$driver] ?? null;

            if (! $implementation) {
                throw new RuntimeException(sprintf(
                    'No datastore adapter registered for [%s] with driver [%s].',
                    $interface,
                    $driver,
                ));
            }

            $this->app->bind($interface, function ($app) use ($implementation, $connection, $interface, $driver) {
                try {
                    $instance = $app->make($implementation);
                } catch (BindingResolutionException $exception) {
                    Log::error('Failed to resolve datastore adapter.', [
                        'interface' => $interface,
                        'driver' => $driver,
                        'implementation' => $implementation,
                        'exception' => $exception->getMessage(),
                    ]);

                    throw $exception;
                }

                if (method_exists($instance, 'setConnectionName')) {
                    $instance->setConnectionName($connection);
                } elseif (method_exists($instance, 'setConnection')) {
                    $instance->setConnection($connection);
                }

                Log::debug('Datastore repository bound.', [
                    'interface' => $interface,
                    'driver' => $driver,
                    'connection' => $connection,
                    'implementation' => $implementation,
                ]);

                return $instance;
            });
        }
    }
}
