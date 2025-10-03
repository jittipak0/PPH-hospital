<?php

namespace Tests\Unit\Services\Health;

use App\Services\Health\HealthCheckService;
use Illuminate\Contracts\Filesystem\Factory as FilesystemFactory;
use Illuminate\Contracts\Queue\Factory as QueueFactory;
use Illuminate\Contracts\Queue\Queue;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\DatabaseManager;
use Illuminate\Filesystem\FilesystemAdapter;
use RuntimeException;
use Tests\TestCase;

class HealthCheckServiceTest extends TestCase
{
    public function test_check_reports_ok_when_all_dependencies_work(): void
    {
        config([
            'database.default' => 'sqlite',
            'queue.default' => 'sync',
            'filesystems.default' => 'local',
            'app.name' => 'PPH Hospital API',
            'app.env' => 'testing',
            'app.version' => '1.0.0-test',
        ]);

        $databaseManager = $this->createMock(DatabaseManager::class);
        $connection = $this->createMock(ConnectionInterface::class);
        $connection->expects($this->once())->method('select')->with('select 1')->willReturn([]);
        $databaseManager->expects($this->once())->method('connection')->with('sqlite')->willReturn($connection);

        $queueFactory = $this->createMock(QueueFactory::class);
        $queueFactory->expects($this->once())->method('connection')->with('sync')->willReturn($this->createMock(Queue::class));

        $filesystemFactory = $this->createMock(FilesystemFactory::class);
        $filesystem = $this->createMock(FilesystemAdapter::class);
        $filesystem->expects($this->once())->method('path')->with('');
        $filesystemFactory->expects($this->once())->method('disk')->with('local')->willReturn($filesystem);

        $service = new HealthCheckService($databaseManager, $queueFactory, $filesystemFactory);

        $result = $service->check();

        $this->assertTrue($result['ok']);
        $this->assertSame('ok', $result['services']['database']['status']);
        $this->assertSame('ok', $result['services']['queue']['status']);
        $this->assertSame('ok', $result['services']['storage']['status']);
        $this->assertSame('1.0.0-test', $result['app']['version']);
    }

    public function test_check_marks_services_degraded_on_failures(): void
    {
        config([
            'database.default' => 'sqlite',
            'queue.default' => 'sync',
            'filesystems.default' => 'local',
        ]);

        $databaseManager = $this->createMock(DatabaseManager::class);
        $databaseManager->expects($this->once())
            ->method('connection')
            ->with('sqlite')
            ->willThrowException(new RuntimeException('connection refused'));

        $queueFactory = $this->createMock(QueueFactory::class);
        $queueFactory->expects($this->once())
            ->method('connection')
            ->with('sync')
            ->willThrowException(new RuntimeException('queue down'));

        $filesystemFactory = $this->createMock(FilesystemFactory::class);
        $filesystemFactory->expects($this->once())
            ->method('disk')
            ->with('local')
            ->willThrowException(new RuntimeException('fs unavailable'));

        $service = new HealthCheckService($databaseManager, $queueFactory, $filesystemFactory);

        $result = $service->check();

        $this->assertFalse($result['ok']);
        $this->assertSame('degraded', $result['services']['database']['status']);
        $this->assertSame('degraded', $result['services']['queue']['status']);
        $this->assertSame('degraded', $result['services']['storage']['status']);
    }
}
