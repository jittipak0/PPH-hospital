<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageDetailResource;
use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use League\CommonMark\MarkdownConverterInterface;

class PageController extends Controller
{
    public function __construct(private readonly MarkdownConverterInterface $markdown)
    {
    }

    public function index(Request $request)
    {
        $query = Page::query();

        if (! $request->user()) {
            $query->published();
        }

        if ($request->filled('category')) {
            $query->where('category', $request->string('category')->toString());
        }

        $pages = $query->orderBy('title')->get();

        return PageResource::collection($pages);
    }

    public function show(Request $request, string $slug): PageDetailResource
    {
        $page = Page::where('slug', $slug)->firstOrFail();

        Gate::authorize('view', $page);

        $page->setAttribute('content_html', $this->markdown->convert($page->content_md)->getContent());

        return new PageDetailResource($page);
    }
}
