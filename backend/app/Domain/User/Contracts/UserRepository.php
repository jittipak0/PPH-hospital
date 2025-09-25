<?php

declare(strict_types=1);

namespace App\Domain\User\Contracts;

use App\Domain\User\DTO\NewUserData;
use App\Domain\User\Entities\User;

interface UserRepository
{
    /**
     * ดึงรายชื่อผู้ใช้ทั้งหมด
     *
     * @return list<User>
     */
    public function all(): array;

    /**
     * สร้างผู้ใช้ใหม่และคืนข้อมูลที่ถูกบันทึก
     */
    public function create(NewUserData $data): User;

    /**
     * ค้นหาผู้ใช้ด้วยอีเมล
     */
    public function findByEmail(string $email): ?User;
}
