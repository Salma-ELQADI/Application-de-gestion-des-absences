import { useState, useEffect } from 'react';
import { departementService } from '../../services/departementService';
import { useNotification } from '../../contexts/NotificationContext';

const initialForm = { nom: '', description: '' };

export default function DepartementForm({ departement, onSuccess, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { success, error: notifError } = useNotification();

  const isEdit = !!departement;

  useEffect(() => {
    if (departement) {
      setForm({ nom: departement.nom || '', description: departement.description || '' });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [departement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nom.trim()) errs.nom = 'Le nom est obligatoire.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    setLoading(true);
    try {
      const payload = { nom: form.nom.trim(), description: form.description.trim() || null };
      if (isEdit) {
        await departementService.update(departement.id, payload);
        success('Département mis à jour avec succès.');
      } else {
        await departementService.create(payload);
        success('Département créé avec succès.');
      }
      onSuccess();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        Object.entries(data.errors).forEach(([k, msgs]) => { mapped[k] = msgs[0]; });
        setErrors(mapped);
      } else {
        notifError(data?.message || 'Une erreur est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Nom */}
      <div>
        <label htmlFor="nom" className="form-label">
          Nom du département <span className="text-red-500">*</span>
        </label>
        <input
          id="nom"
          type="text"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          placeholder="Ex : Informatique"
          className={`form-input ${errors.nom ? 'form-input-error' : ''}`}
        />
        {errors.nom && <p className="form-error">{errors.nom}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="form-label">
          Description <span className="text-gray-400 text-xs">(facultative)</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Description du département…"
          className={`form-input resize-none ${errors.description ? 'form-input-error' : ''}`}
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
          Annuler
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enregistrement…
            </span>
          ) : (
            isEdit ? 'Mettre à jour' : 'Enregistrer'
          )}
        </button>
      </div>
    </form>
  );
}
