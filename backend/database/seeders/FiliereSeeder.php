<?php

namespace Database\Seeders;

use App\Models\Departement;
use App\Models\Filiere;
use Illuminate\Database\Seeder;

class FiliereSeeder extends Seeder
{
    /**
     * Données de démonstration — ne pas utiliser comme données réelles de l'établissement.
     */
    public function run(): void
    {
        $filieres = [
            // Informatique
            ['nom' => 'Génie Logiciel', 'code' => 'GL', 'departement' => 'Informatique'],
            ['nom' => 'Réseaux et Télécommunications', 'code' => 'RT', 'departement' => 'Informatique'],
            ['nom' => 'Intelligence Artificielle', 'code' => 'IA', 'departement' => 'Informatique'],
            ['nom' => 'Systèmes d\'Information', 'code' => 'SI', 'departement' => 'Informatique'],

            // Mathématiques
            ['nom' => 'Mathématiques Appliquées', 'code' => 'MA', 'departement' => 'Mathématiques'],
            ['nom' => 'Statistiques et Data Science', 'code' => 'SDS', 'departement' => 'Mathématiques'],

            // Physique
            ['nom' => 'Physique des Matériaux', 'code' => 'PM', 'departement' => 'Physique'],

            // Génie Civil
            ['nom' => 'Construction et Bâtiment', 'code' => 'CB', 'departement' => 'Génie Civil'],
            ['nom' => 'Géotechnique', 'code' => 'GEO', 'departement' => 'Génie Civil'],

            // Électronique
            ['nom' => 'Électronique Industrielle', 'code' => 'EI', 'departement' => 'Électronique'],
            ['nom' => 'Systèmes Embarqués', 'code' => 'SE', 'departement' => 'Électronique'],
        ];

        foreach ($filieres as $data) {
            $departement = Departement::where('nom', $data['departement'])->first();

            if ($departement) {
                Filiere::firstOrCreate(
                    ['code' => $data['code']],
                    [
                        'nom' => $data['nom'],
                        'code' => $data['code'],
                        'departement_id' => $departement->id,
                    ]
                );
            }
        }

        $this->command->info(count($filieres) . ' filière(s) de démonstration insérées.');
    }
}
