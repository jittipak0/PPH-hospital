<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Application\User\CreateUser;
use App\Application\User\ListUsers;
use App\Domain\User\Entities\User as UserEntity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class UserController extends Controller
{
    public function __construct(
        private readonly ListUsers $listUsers,
        private readonly CreateUser $createUser,
    ) {
    }

    public function index(): JsonResponse
    {
        $users = $this->listUsers->handle();

        return response()->json([
            'data' => array_map(fn (UserEntity $user): array => $this->toArray($user), $users),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = $this->createUser->handle(
            $validated['name'],
            $validated['email'],
            $validated['password'],
        );

        return response()->json([
            'data' => $this->toArray($user),
        ], 201);
    }

    /**
     * @return array{id:int,name:string,email:string}
     */
    private function toArray(UserEntity $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ];
    }
}
