<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Departement extends Model
{
    use HasFactory;

    protected $table = 'departements';

    protected $fillable = [
        'nom',
        'description',
    ];

    /**
     * Un département possède plusieurs filières.
     */
    public function filieres(): HasMany
    {
        return $this->hasMany(Filiere::class, 'departement_id');
    }
}
