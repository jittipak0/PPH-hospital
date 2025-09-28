<?php

return [
    'upload' => [
        'max_mb' => (int) env('FORM_UPLOAD_MAX_MB', 5),
        'max_kb' => (int) env('FORM_UPLOAD_MAX_MB', 5) * 1024,
        'allowed_mimes' => array_map('trim', explode(',', env('FORM_ALLOWED_MIME', 'application/pdf,image/jpeg,image/png'))),
        'allowed_extensions' => array_map('trim', explode(',', env('FORM_ALLOWED_EXT', 'pdf,jpg,jpeg,png'))),
    ],
];
