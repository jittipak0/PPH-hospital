<?php

namespace App\Http\Controllers\Api\Forms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forms\SatisfactionSurveyFormRequest;
use App\Models\SatisfactionSurvey;
use Illuminate\Http\JsonResponse;

class SatisfactionSurveyController extends Controller
{
    public function store(SatisfactionSurveyFormRequest $request): JsonResponse
    {
        $survey = SatisfactionSurvey::create([
            'score_overall' => $request->integer('score_overall'),
            'score_waittime' => $request->integer('score_waittime'),
            'score_staff' => $request->integer('score_staff'),
            'comment' => $request->input('comment'),
            'service_date' => $request->date('service_date'),
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 512),
        ]);

        return response()->json([
            'ok' => true,
            'id' => (string) $survey->getKey(),
            'message' => 'ขอบคุณสำหรับความคิดเห็นของคุณ โรงพยาบาลจะนำผลไปพัฒนาการให้บริการต่อไป',
        ], 201);
    }
}
