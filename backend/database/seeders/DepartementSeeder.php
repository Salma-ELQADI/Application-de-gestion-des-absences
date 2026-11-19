<?php

namespace Database\Seeders;

use App\Models\Departement;
use Illuminate\Database\Seeder;

class DepartementSeeder extends Seeder
{
    /**
     * Données de démonstration — ne pas utiliser comme données réelles de l'établissement.
     */
    public function run(): void
    {
        $departements = [
            [
                'nom' => 'Informatique',
                'description' => 'Département dédié aux sciences informatiques, au développement logiciel et aux systèmes d\'information.',
            ],
            [
                'nom' => 'Mathématiques',
                'description' => 'Département de mathématiques pures et appliquées, statistiques et probabilités.',
            ],
            [
                'nom' => 'Physique',
                'description' => 'Département de physique fondamentale et appliquée.',
            ],
            [
                'nom' => 'Génie Civil',
                'description' => 'Département couvrant le génie civil, la construction et l\'infrastructure.',
            ],
            [
                'nom' => 'Électronique',
                'description' => 'Département d\'électronique, d\'électrotechnique et de systèmes embarqués.',
            ],
        ];

        foreach ($departements as $data) {
            Departement::firstOrCreate(['nom' => $data['nom']], $data);
        }

        $this->command->info(count($departements) . ' département(s) de démonstration insérés.');
    }
}
