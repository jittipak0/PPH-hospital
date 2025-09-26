<?php

declare(strict_types=1);

namespace App\Providers;

use App\Application\Forms\FormSubmissionService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use InvalidArgumentException;
use League\CommonMark\MarkdownConverter;
use League\CommonMark\MarkdownConverterInterface;

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

        $this->app->singleton(FormSubmissionService::class, function ($app) {
            return new FormSubmissionService((string) config('mail.notify_email'));
        });

        $this->app->singleton(MarkdownConverterInterface::class, fn () => new MarkdownConverter());
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('public-forms', function (Request $request) {
            return Limit::perMinute(20)->by($request->ip());
        });
    }
}
