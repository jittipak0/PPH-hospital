<?php

namespace App\Http\Controllers\Staff;

use App\Domain\News\Exceptions\NewsNotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\News\NewsIndexRequest;
use App\Http\Requests\News\NewsStoreRequest;
use App\Http\Requests\News\NewsUpdateRequest;
use App\Http\Resources\Staff\StaffNewsListResource;
use App\Http\Resources\Staff\StaffNewsResource;
use App\Services\News\NewsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index(NewsIndexRequest $request, NewsService $service): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));

        Log::debug('StaffNewsController@index: request received.', [
            'route' => 'api.staff.news.index',
        ]);

        Log::debug('StaffNewsController@index: validating request.', [
            'route' => 'api.staff.news.index',
        ]);

        $validated = $request->validated();

        Log::debug('StaffNewsController@index: validation passed.', [
            'route' => 'api.staff.news.index',
            'params' => $validated,
        ]);

        $perPage = (int) ($validated['per_page'] ?? 10);
        $sort = (string) ($validated['sort'] ?? '-published_at');

        Log::debug('StaffNewsController@index: calling news service.', [
            'route' => 'api.staff.news.index',
            'per_page' => $perPage,
            'sort' => $sort,
        ]);

        $paginator = $service->listForStaff($perPage, $sort);

        Log::debug('StaffNewsController@index: serializing response.', [
            'route' => 'api.staff.news.index',
            'records' => $paginator->count(),
        ]);

        $resource = StaffNewsListResource::make([
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

        Log::debug('StaffNewsController@index: response ready.', [
            'route' => 'api.staff.news.index',
            'status' => $response->status(),
        ]);

        return $response;
    }

    public function store(NewsStoreRequest $request, NewsService $service): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));

        Log::debug('StaffNewsController@store: request received.', [
            'route' => 'api.staff.news.store',
        ]);

        Log::debug('StaffNewsController@store: validating request.', [
            'route' => 'api.staff.news.store',
        ]);

        $validated = $request->validated();

        Log::debug('StaffNewsController@store: validation passed.', [
            'route' => 'api.staff.news.store',
            'title' => $validated['title'],
            'published_at' => $validated['published_at'] ?? null,
            'body_preview' => Str::limit((string) ($validated['body'] ?? ''), 80),
        ]);

        Log::debug('StaffNewsController@store: calling news service.', [
            'route' => 'api.staff.news.store',
        ]);

        $news = $service->create($validated);

        Log::debug('StaffNewsController@store: serializing response.', [
            'route' => 'api.staff.news.store',
            'news_id' => $news->getKey(),
        ]);

        $resource = StaffNewsResource::make($news)->additional([
            'meta' => [
                'request_id' => $requestId,
            ],
        ]);

        $response = $resource->response()->setStatusCode(201);

        Log::debug('StaffNewsController@store: response ready.', [
            'route' => 'api.staff.news.store',
            'status' => $response->status(),
        ]);

        return $response;
    }

    public function update(NewsUpdateRequest $request, NewsService $service, int $news): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));

        Log::debug('StaffNewsController@update: request received.', [
            'route' => 'api.staff.news.update',
            'news_id' => $news,
        ]);

        Log::debug('StaffNewsController@update: validating request.', [
            'route' => 'api.staff.news.update',
            'news_id' => $news,
        ]);

        $validated = $request->validated();

        Log::debug('StaffNewsController@update: validation passed.', [
            'route' => 'api.staff.news.update',
            'news_id' => $news,
            'fields' => array_keys($validated),
        ]);

        try {
            Log::debug('StaffNewsController@update: calling news service.', [
                'route' => 'api.staff.news.update',
                'news_id' => $news,
            ]);

            $updated = $service->update($news, $validated);
        } catch (NewsNotFoundException $exception) {
            Log::debug('StaffNewsController@update: news not found.', [
                'route' => 'api.staff.news.update',
                'news_id' => $news,
            ]);

            return response()->json([
                'error' => [
                    'message' => $exception->getMessage(),
                ],
                'meta' => [
                    'request_id' => $requestId,
                ],
            ], 404);
        }

        Log::debug('StaffNewsController@update: serializing response.', [
            'route' => 'api.staff.news.update',
            'news_id' => $updated->getKey(),
        ]);

        $resource = StaffNewsResource::make($updated)->additional([
            'meta' => [
                'request_id' => $requestId,
            ],
        ]);

        $response = $resource->response();

        Log::debug('StaffNewsController@update: response ready.', [
            'route' => 'api.staff.news.update',
            'status' => $response->status(),
        ]);

        return $response;
    }

    public function destroy(Request $request, NewsService $service, int $news): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));

        Log::debug('StaffNewsController@destroy: request received.', [
            'route' => 'api.staff.news.destroy',
            'news_id' => $news,
        ]);

        try {
            Log::debug('StaffNewsController@destroy: calling news service.', [
                'route' => 'api.staff.news.destroy',
                'news_id' => $news,
            ]);

            $service->delete($news);
        } catch (NewsNotFoundException $exception) {
            Log::debug('StaffNewsController@destroy: news not found.', [
                'route' => 'api.staff.news.destroy',
                'news_id' => $news,
            ]);

            return response()->json([
                'error' => [
                    'message' => $exception->getMessage(),
                ],
                'meta' => [
                    'request_id' => $requestId,
                ],
            ], 404);
        }

        Log::debug('StaffNewsController@destroy: response ready.', [
            'route' => 'api.staff.news.destroy',
            'news_id' => $news,
        ]);

        return response()->json(null, 204);
    }
}
