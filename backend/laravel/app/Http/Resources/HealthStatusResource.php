<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin array<string, mixed>
 */
class HealthStatusResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array{ok: bool, app: array{name: string|null, environment: string|null, version: string}, services: array{
     *     database: array{status: string, connection: string|null},
     *     queue: array{status: string, connection: string|null},
     *     storage: array{status: string, disk: string|null}
     * }}
     */
    public function toArray(Request $request): array
    {
        return [
            'ok' => $this->resource['ok'],
            'app' => $this->resource['app'],
            'services' => $this->resource['services'],
        ];
    }
}
