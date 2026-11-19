<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departement;
use App\Models\Filiere;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Statistiques du tableau de bord, calculées depuis la base de données.
     */
    public function stats(): JsonResponse
    {
        $totalDepartements = Departement::count();
        $totalFilieres = Filiere::count();

        $departementsAvecFilieres = Departement::has('filieres')->count();
        $departementsSansFilieres = Departement::doesntHave('filieres')->count();

        $derniersDepartements = Departement::withCount('filieres')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $dernieresFilieres = Filiere::with('departement')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_departements' => $totalDepartements,
                'total_filieres' => $totalFilieres,
                'departements_avec_filieres' => $departementsAvecFilieres,
                'departements_sans_filieres' => $departementsSansFilieres,
            ],
            'derniers_departements' => $derniersDepartements,
            'dernieres_filieres' => $dernieresFilieres,
        ], 200);
    }
}
