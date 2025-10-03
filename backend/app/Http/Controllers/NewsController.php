<?php

namespace App\Http\Controllers;

use App\Http\Requests\News\NewsIndexRequest;
use App\Http\Resources\NewsListResource;
use App\Services\News\NewsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;

class NewsController extends Controller
{
    public function index(NewsIndexRequest $request, NewsService $service): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));

        Log::debug('NewsController@index: request received.', [
            'route' => 'api.news.index',
        ]);

        Log::debug('NewsController@index: validating request.', [
            'route' => 'api.news.index',
        ]);

        $validated = $request->validated();

        Log::debug('NewsController@index: validation passed.', [
            'route' => 'api.news.index',
            'params' => $validated,
        ]);

        $perPage = (int) ($validated['per_page'] ?? 10);
        $sort = (string) ($validated['sort'] ?? '-published_at');

        Log::debug('NewsController@index: calling news service.', [
            'route' => 'api.news.index',
            'per_page' => $perPage,
            'sort' => $sort,
        ]);

        $paginator = $service->listPublished($perPage, $sort);

        Log::debug('NewsController@index: serializing response.', [
            'route' => 'api.news.index',
            'records' => $paginator->count(),
        ]);

        $resource = NewsListResource::make([
            'news' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ])->additional([
            'meta' => [
                'request_id' => $requestId,
            ],
        ]);

        $response = $resource->response();

        Log::debug('NewsController@index: response ready.', [
            'route' => 'api.news.index',
            'status' => $response->status(),
        ]);

        return $response;
    }
}
