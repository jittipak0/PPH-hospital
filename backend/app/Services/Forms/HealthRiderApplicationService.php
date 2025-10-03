<?php

namespace App\Services\Forms;

use App\Domain\Forms\Contracts\HealthRiderApplicationRepository;
use App\Models\HealthRiderApplication;
use Illuminate\Support\Facades\Log;

class HealthRiderApplicationService
{
    public function __construct(private readonly HealthRiderApplicationRepository $repository) {}

    /**
     * @param  array{
     *     full_name: string,
     *     hn?: ?string,
     *     address: string,
     *     district: string,
     *     province: string,
     *     zipcode: string,
     *     phone: string,
     *     line_id?: ?string,
     *     consent: bool,
     * }  $payload
     */
    public function submit(array $payload, string $ipAddress, ?string $userAgent): HealthRiderApplication
    {
        Log::debug('HealthRiderApplicationService: submission received.');

        $application = new HealthRiderApplication([
            'full_name' => $payload['full_name'],
            'hn' => $payload['hn'] ?? null,
            'address' => $payload['address'],
            'district' => $payload['district'],
            'province' => $payload['province'],
            'zipcode' => $payload['zipcode'],
            'phone' => $payload['phone'],
            'line_id' => $payload['line_id'] ?? null,
            'consent' => (bool) $payload['consent'],
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        $this->repository->save($application);

        Log::debug('HealthRiderApplicationService: submission stored.', [
            'application_id' => $application->getKey(),
        ]);

        return $application;
    }
}
