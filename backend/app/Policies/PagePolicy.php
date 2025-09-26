<?php

namespace App\Policies;

use App\Models\Page;
use App\Models\User;

class PagePolicy
{
    public function view(?User $user, Page $page): bool
    {
        if ($page->status === 'published') {
            return true;
        }

        return $user !== null;
    }
}
