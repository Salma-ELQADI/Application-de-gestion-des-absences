<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDepartementRequest;
use App\Http\Requests\UpdateDepartementRequest;
use App\Models\Departement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    /**
     * Liste paginée des départements avec recherche.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Departement::withCount('filieres');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $departements = $query->orderBy('created_at', 'desc')
                              ->paginate($request->input('per_page', 10));

        return response()->json($departements, 200);
    }

    /**
     * Créer un département.
     */
    public function store(StoreDepartementRequest $request): JsonResponse
    {
        $departement = Departement::create($request->validated());

        return response()->json([
            'message' => 'Département créé avec succès.',
            'data' => $departement,
        ], 201);
    }

    /**
     * Consulter un département.
     */
    public function show(Departement $departement): JsonResponse
    {
        $departement->load('filieres');
        $departement->loadCount('filieres');

        return response()->json([
            'data' => $departement,
        ], 200);
    }

    /**
     * Mettre à jour un département.
     */
    public function update(UpdateDepartementRequest $request, Departement $departement): JsonResponse
    {
        $departement->update($request->validated());

        return response()->json([
            'message' => 'Département mis à jour avec succès.',
            'data' => $departement->fresh(),
        ], 200);
    }

    /**
     * Supprimer un département.
     * Bloqué si des filières y sont rattachées.
     */
    public function destroy(Departement $departement): JsonResponse
    {
        $filieresCount = $departement->filieres()->count();

        if ($filieresCount > 0) {
            return response()->json([
                'message' => "Impossible de supprimer ce département : il possède {$filieresCount} filière(s) rattachée(s). Veuillez d'abord supprimer ou réaffecter ces filières.",
                'filieres_count' => $filieresCount,
            ], 422);
        }

        $departement->delete();

        return response()->json([
            'message' => 'Département supprimé avec succès.',
        ], 200);
    }
}
