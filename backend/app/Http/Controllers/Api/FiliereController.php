<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFiliereRequest;
use App\Http\Requests\UpdateFiliereRequest;
use App\Models\Filiere;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FiliereController extends Controller
{
    /**
     * Liste paginée des filières avec recherche et filtre par département.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Filiere::with('departement');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('departement_id')) {
            $query->where('departement_id', $request->input('departement_id'));
        }

        $filieres = $query->orderBy('created_at', 'desc')
                          ->paginate($request->input('per_page', 10));

        return response()->json($filieres, 200);
    }

    /**
     * Créer une filière.
     */
    public function store(StoreFiliereRequest $request): JsonResponse
    {
        $filiere = Filiere::create($request->validated());
        $filiere->load('departement');

        return response()->json([
            'message' => 'Filière créée avec succès.',
            'data' => $filiere,
        ], 201);
    }

    /**
     * Consulter une filière.
     */
    public function show(Filiere $filiere): JsonResponse
    {
        $filiere->load('departement');

        return response()->json([
            'data' => $filiere,
        ], 200);
    }

    /**
     * Mettre à jour une filière.
     */
    public function update(UpdateFiliereRequest $request, Filiere $filiere): JsonResponse
    {
        $filiere->update($request->validated());
        $filiere->load('departement');

        return response()->json([
            'message' => 'Filière mise à jour avec succès.',
            'data' => $filiere->fresh(['departement']),
        ], 200);
    }

    /**
     * Supprimer une filière.
     */
    public function destroy(Filiere $filiere): JsonResponse
    {
        $filiere->delete();

        return response()->json([
            'message' => 'Filière supprimée avec succès.',
        ], 200);
    }
}
