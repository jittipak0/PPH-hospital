<?php

declare(strict_types=1);

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
        $datastore = (array) config('datastore');
        $map = $datastore['map'] ?? [];

        if (! is_array($map)) {
            return;
        }

        foreach ($map as $abstract => $implementations) {
            if (! is_array($implementations)) {
                continue;
            }

            $this->app->bind($abstract, function ($app) use ($abstract, $implementations) {
                $driver = (string) config('datastore.driver', 'eloquent');
                $connection = (string) config('datastore.connection', config('database.default'));

                if (! isset($implementations[$driver])) {
                    throw new InvalidArgumentException(
                        sprintf('ไม่พบ adapter สำหรับ %s (%s)', $abstract, $driver)
                    );
                }

                $implementation = $implementations[$driver];
                $parameters = [];

                if ($driver === 'eloquent') {
                    $parameters['connectionName'] = $connection;
                }

                return $app->make($implementation, $parameters);
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
