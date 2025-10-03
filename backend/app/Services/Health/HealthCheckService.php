<?php

namespace App\Services\Health;

use Illuminate\Contracts\Filesystem\Factory as FilesystemFactory;
use Illuminate\Contracts\Queue\Factory as QueueFactory;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

class HealthCheckService
{
    public function __construct(
        private readonly DatabaseManager $databaseManager,
        private readonly QueueFactory $queueFactory,
        private readonly FilesystemFactory $filesystemFactory,
    ) {}

    /**
     * @return array{
     *     ok: bool,
     *     app: array{name: string|null, environment: string|null, version: string},
     *     services: array{
     *         database: array{status: string, connection: string|null},
     *         queue: array{status: string, connection: string|null},
     *         storage: array{status: string, disk: string|null}
     *     }
     * }
     */
    public function check(): array
    {
        Log::debug('HealthCheckService: gathering system status.');

        $appInfo = [
            'name' => config('app.name'),
            'environment' => config('app.env'),
            'version' => $this->applicationVersion(),
        ];

        $database = $this->checkDatabase();
        $queue = $this->checkQueue();
        $storage = $this->checkStorage();

        $overallOk = $database['status'] === 'ok'
            && $queue['status'] === 'ok'
            && $storage['status'] === 'ok';

        Log::debug('HealthCheckService: status computed.', [
            'overall_ok' => $overallOk,
            'database_status' => $database['status'],
            'queue_status' => $queue['status'],
            'storage_status' => $storage['status'],
        ]);

        return [
            'ok' => $overallOk,
            'app' => $appInfo,
            'services' => [
                'database' => $database,
                'queue' => $queue,
                'storage' => $storage,
            ],
        ];
    }

    /**
     * @return array{status: string, connection: string|null}
     */
    protected function checkDatabase(): array
    {
        $connectionName = config('database.default');

        Log::debug('HealthCheckService: checking database connection.', [
            'connection' => $connectionName,
        ]);

        try {
            $connection = $this->databaseManager->connection($connectionName);
            $connection->select('select 1');

            Log::debug('HealthCheckService: database connection healthy.', [
                'connection' => $connectionName,
            ]);

            return [
                'status' => 'ok',
                'connection' => $connectionName,
            ];
        } catch (\Throwable $exception) {
            Log::warning('HealthCheckService: database connection failed.', [
                'connection' => $connectionName,
                'error' => $exception->getMessage(),
            ]);

            return [
                'status' => 'degraded',
                'connection' => $connectionName,
            ];
        }
    }

    /**
     * @return array{status: string, connection: string|null}
     */
    protected function checkQueue(): array
    {
        $connectionName = config('queue.default');

        Log::debug('HealthCheckService: checking queue connection.', [
            'connection' => $connectionName,
        ]);

        try {
            $this->queueFactory->connection($connectionName);

            Log::debug('HealthCheckService: queue connection healthy.', [
                'connection' => $connectionName,
            ]);

            return [
                'status' => 'ok',
                'connection' => $connectionName,
            ];
        } catch (\Throwable $exception) {
            Log::warning('HealthCheckService: queue connection failed.', [
                'connection' => $connectionName,
                'error' => $exception->getMessage(),
            ]);

            return [
                'status' => 'degraded',
                'connection' => $connectionName,
            ];
        }
    }

    /**
     * @return array{status: string, disk: string|null}
     */
    protected function checkStorage(): array
    {
        $disk = config('filesystems.default');

        Log::debug('HealthCheckService: checking storage disk.', [
            'disk' => $disk,
        ]);

        try {
            $this->filesystemFactory->disk($disk)->path('');

            Log::debug('HealthCheckService: storage disk healthy.', [
                'disk' => $disk,
            ]);

            return [
                'status' => 'ok',
                'disk' => $disk,
            ];
        } catch (\Throwable $exception) {
            Log::warning('HealthCheckService: storage disk failed.', [
                'disk' => $disk,
                'error' => $exception->getMessage(),
            ]);

            return [
                'status' => 'degraded',
                'disk' => $disk,
            ];
        }
    }

    protected function applicationVersion(): string
    {
        $version = (string) config('app.version');

        if ($version !== '') {
            return $version;
        }

        return Str::of(app()->version())
            ->whenContains('Laravel Framework', function (Stringable $stringable): Stringable {
                return $stringable->after('Laravel Framework');
            })
            ->trim()
            ->value();
    }
}
