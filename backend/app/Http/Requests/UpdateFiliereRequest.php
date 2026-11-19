<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFiliereRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'code' => [
                'required',
                'string',
                'max:50',
                'regex:/^[A-Za-z0-9_\-]+$/',
                Rule::unique('filieres', 'code')->ignore($this->route('filiere')),
            ],
            'departement_id' => ['required', 'integer', 'exists:departements,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom de la filière est obligatoire.',
            'nom.max' => 'Le nom ne doit pas dépasser 255 caractères.',
            'code.required' => 'Le code de la filière est obligatoire.',
            'code.unique' => 'Ce code est déjà utilisé par une autre filière.',
            'code.regex' => 'Le code ne doit contenir que des lettres, chiffres, tirets et underscores.',
            'code.max' => 'Le code ne doit pas dépasser 50 caractères.',
            'departement_id.required' => 'Le département est obligatoire.',
            'departement_id.exists' => 'Le département sélectionné n\'existe pas.',
        ];
    }
}
