import { useState, useEffect } from 'react';
import { filiereService } from '../../services/filiereService';
import { departementService } from '../../services/departementService';
import { useNotification } from '../../contexts/NotificationContext';

const initialForm = { nom: '', code: '', departement_id: '' };

export default function FiliereForm({ filiere, onSuccess, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [departements, setDepartements] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  const { success, error: notifError } = useNotification();
  const isEdit = !!filiere;

  useEffect(() => {
    departementService.getList()
      .then(setDepartements)
      .catch(() => notifError('Impossible de charger les départements.'))
      .finally(() => setLoadingDepts(false));
  }, []);

  useEffect(() => {
    if (filiere) {
      setForm({
        nom: filiere.nom || '',
        code: filiere.code || '',
        departement_id: filiere.departement_id ? String(filiere.departement_id) : '',
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [filiere]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nom.trim()) errs.nom = 'Le nom est obligatoire.';
    if (!form.code.trim()) errs.code = 'Le code est obligatoire.';
    if (!form.departement_id) errs.departement_id = 'Le département est obligatoire.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    setLoading(true);
    try {
      const payload = {
        nom: form.nom.trim(),
        code: form.code.trim().toUpperCase(),
        departement_id: parseInt(form.departement_id, 10),
      };
      if (isEdit) {
        await filiereService.update(filiere.id, payload);
        success('Filière mise à jour avec succès.');
      } else {
        await filiereService.create(payload);
        success('Filière créée avec succès.');
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
        <label htmlFor="f-nom" className="form-label">
          Nom de la filière <span className="text-red-500">*</span>
        </label>
        <input
          id="f-nom"
          type="text"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          placeholder="Ex : Génie Logiciel"
          className={`form-input ${errors.nom ? 'form-input-error' : ''}`}
        />
        {errors.nom && <p className="form-error">{errors.nom}</p>}
      </div>

      {/* Code */}
      <div>
        <label htmlFor="f-code" className="form-label">
          Code <span className="text-red-500">*</span>
        </label>
        <input
          id="f-code"
          type="text"
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Ex : GL"
          className={`form-input font-mono uppercase ${errors.code ? 'form-input-error' : ''}`}
        />
        {errors.code && <p className="form-error">{errors.code}</p>}
        <p className="text-xs text-gray-400 mt-1">Lettres, chiffres, tirets et underscores uniquement.</p>
      </div>

      {/* Département */}
      <div>
        <label htmlFor="f-dept" className="form-label">
          Département <span className="text-red-500">*</span>
        </label>
        <select
          id="f-dept"
          name="departement_id"
          value={form.departement_id}
          onChange={handleChange}
          disabled={loadingDepts}
          className={`form-input ${errors.departement_id ? 'form-input-error' : ''}`}
        >
          <option value="">— Sélectionner un département —</option>
          {departements.map((d) => (
            <option key={d.id} value={d.id}>{d.nom}</option>
          ))}
        </select>
        {errors.departement_id && <p className="form-error">{errors.departement_id}</p>}
        {loadingDepts && <p className="text-xs text-gray-400 mt-1">Chargement des départements…</p>}
        {!loadingDepts && departements.length === 0 && (
          <p className="text-xs text-amber-600 mt-1">Aucun département disponible. Créez d'abord un département.</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
          Annuler
        </button>
        <button type="submit" className="btn-primary" disabled={loading || loadingDepts}>
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
