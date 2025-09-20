<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index()
    {
        return News::query()
            ->select(['id','title','published_at'])
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->paginate(20);
    }

    public function staffIndex(Request $request)
    {
        return News::query()
            ->select(['id','title','published_at','created_at','updated_at'])
            ->orderByDesc('id')
            ->paginate((int)($request->query('limit', 20)));
    }

    public function store(StoreNewsRequest $request)
    {
        $news = News::create($request->validated());
        return response()->json($news, 201);
    }

    public function update(UpdateNewsRequest $request, int $id)
    {
        $news = News::findOrFail($id);
        $news->update($request->validated());
        return response()->json($news);
    }

    public function destroy(int $id)
    {
        $news = News::findOrFail($id);
        $news->delete();
        return response()->json(['ok' => true]);
    }
}
