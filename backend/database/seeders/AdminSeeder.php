<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@gestion-absences.ma'],
            [
                'name' => 'Administrateur',
                'email' => 'admin@gestion-absences.ma',
                'password' => Hash::make('Admin@1234'),
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Compte administrateur créé :');
        $this->command->info('  Email    : admin@gestion-absences.ma');
        $this->command->info('  Mot de passe : Admin@1234');
    }
}
