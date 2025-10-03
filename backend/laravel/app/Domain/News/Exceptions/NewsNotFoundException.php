<?php

namespace App\Domain\News\Exceptions;

use RuntimeException;

class NewsNotFoundException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('News article not found.');
    }
}
