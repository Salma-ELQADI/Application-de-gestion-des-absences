<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DepartementController;
use App\Http\Controllers\Api\FiliereController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes API — Gestion des Absences
|--------------------------------------------------------------------------
*/

// Routes publiques (authentification)
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées par Sanctum
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Tableau de bord
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Départements
    Route::apiResource('departements', DepartementController::class);

    // Filières
    Route::apiResource('filieres', FiliereController::class);

    // Liste des départements pour la liste déroulante (filières)
    Route::get('/departements-list', function () {
        $departements = \App\Models\Departement::select('id', 'nom')
            ->orderBy('nom')
            ->get();

        return response()->json(['data' => $departements], 200);
    });
});
