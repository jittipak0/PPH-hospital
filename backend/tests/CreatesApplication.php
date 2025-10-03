<?php

namespace Tests;

use Illuminate\Foundation\Application;

trait CreatesApplication
{
    public function createApplication(): Application
    {
        $basePath = dirname(__DIR__);

        if (! file_exists($basePath.'/.env') && file_exists($basePath.'/.env.example')) {
            copy($basePath.'/.env.example', $basePath.'/.env');
        }

        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

        return $app;
    }
}
