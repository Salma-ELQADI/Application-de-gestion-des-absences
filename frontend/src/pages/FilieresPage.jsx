import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Search, Eye, Pencil, Trash2, BookOpen, X, Filter } from 'lucide-react';
import { filiereService } from '../services/filiereService';
import { departementService } from '../services/departementService';
import { useNotification } from '../contexts/NotificationContext';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { PageSpinner } from '../components/ui/Spinner';
import FiliereForm from '../components/filieres/FiliereForm';
import FiliereDetail from '../components/filieres/FiliereDetail';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function FilieresPage() {
  const [data, setData]                     = useState({ data: [], meta: null });
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState('');
  const [filterDept, setFilterDept]         = useState('');
  const [page, setPage]                     = useState(1);
  const [departements, setDepartements]     = useState([]);
  const [modal, setModal]                   = useState({ type: null, item: null });
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [deleteLoading, setDeleteLoading]   = useState(false);

  const { error: notifError, success } = useNotification();
  const searchTimeout = useRef(null);

  // Charger les départements pour le filtre
  useEffect(() => {
    departementService.getList().then(setDepartements).catch(() => {});
  }, []);

  const fetchData = useCallback(async (p = page, s = search, d = filterDept) => {
    setLoading(true);
    try {
      const params = { page: p, per_page: 10 };
      if (s) params.search = s;
      if (d) params.departement_id = d;
      const result = await filiereService.getAll(params);
      setData({
        data: result.data,
        meta: {
          current_page: result.current_page,
          last_page: result.last_page,
          from: result.from,
          to: result.to,
          total: result.total,
        }
      });
    } catch {
      notifError('Impossible de charger les filières.');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterDept, notifError]);

  useEffect(() => { fetchData(page, search, filterDept); }, [page]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchData(1, val, filterDept);
    }, 400);
  };

  const handleFilterChange = (e) => {
    const val = e.target.value;
    setFilterDept(val);
    setPage(1);
    fetchData(1, search, val);
  };

  const clearFilters = () => {
    setSearch('');
    setFilterDept('');
    setPage(1);
    fetchData(1, '', '');
  };

  const openCreate  = () => setModal({ type: 'create', item: null });
  const openEdit    = (item) => setModal({ type: 'edit', item });
  const openView    = (item) => setModal({ type: 'view', item });
  const closeModal  = () => setModal({ type: null, item: null });

  const handleFormSuccess = () => {
    closeModal();
    fetchData(page, search, filterDept);
  };

  const confirmDelete = (item) => setDeleteTarget(item);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await filiereService.delete(deleteTarget.id);
      success(`La filière "${deleteTarget.nom}" a été supprimée.`);
      setDeleteTarget(null);
      fetchData(page, search, filterDept);
    } catch (err) {
      notifError(err.response?.data?.message || 'Erreur lors de la suppression.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const hasActiveFilters = search || filterDept;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* En-tête */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={18} className="text-[#62B6CB]" />
              <h2 className="font-semibold text-[#1B4965]">Gestion des filières</h2>
            </div>
            <p className="text-sm text-gray-500">
              Créez et gérez les filières rattachées aux départements.
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary shrink-0">
            <Plus size={16} />
            Ajouter une filière
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="card p-0 overflow-hidden">
        {/* Filtres */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
          {/* Recherche */}
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Rechercher une filière…"
              className="form-input pl-9 pr-8 py-2 w-full"
            />
            {search && (
              <button onClick={() => { setSearch(''); setPage(1); fetchData(1, '', filterDept); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filtre département */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterDept}
              onChange={handleFilterChange}
              className="form-input pl-8 py-2 pr-8 min-w-48"
            >
              <option value="">Tous les départements</option>
              {departements.map((d) => (
                <option key={d.id} value={d.id}>{d.nom}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-secondary py-2 text-xs">
              <X size={13} /> Effacer les filtres
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-8"><PageSpinner /></div>
        ) : data.data.length === 0 ? (
          <EmptyState
            title="Aucune filière trouvée"
            description={hasActiveFilters ? 'Aucun résultat pour ces critères.' : 'Créez votre première filière pour commencer.'}
            action={
              !hasActiveFilters && (
                <button onClick={openCreate} className="btn-primary">
                  <Plus size={16} /> Ajouter une filière
                </button>
              )
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header w-14">ID</th>
                    <th className="table-header">Nom</th>
                    <th className="table-header w-24">Code</th>
                    <th className="table-header hidden sm:table-cell">Département</th>
                    <th className="table-header hidden lg:table-cell w-36">Créé le</th>
                    <th className="table-header w-32 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((fil) => (
                    <tr key={fil.id} className="hover:bg-gray-50 transition-colors">
                      <td className="table-cell font-mono text-xs text-gray-500">#{fil.id}</td>
                      <td className="table-cell">
                        <span className="font-medium text-gray-800">{fil.nom}</span>
                      </td>
                      <td className="table-cell">
                        <span className="font-mono text-xs bg-[#BEE9E8] text-[#1B4965] px-2 py-0.5 rounded font-bold">
                          {fil.code}
                        </span>
                      </td>
                      <td className="table-cell hidden sm:table-cell">
                        <span className="text-sm text-gray-600 bg-[#CAE9FF] px-2 py-0.5 rounded text-xs">
                          {fil.departement?.nom || '—'}
                        </span>
                      </td>
                      <td className="table-cell hidden lg:table-cell text-gray-500 text-xs">
                        {formatDate(fil.created_at)}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openView(fil)}
                            title="Consulter"
                            className="p-1.5 rounded-lg text-[#5FA8D3] hover:bg-[#CAE9FF] transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => openEdit(fil)}
                            title="Modifier"
                            className="p-1.5 rounded-lg text-[#62B6CB] hover:bg-[#BEE9E8] transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => confirmDelete(fil)}
                            title="Supprimer"
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 border-t border-gray-100">
              <Pagination
                meta={data.meta}
                onPageChange={(p) => { setPage(p); fetchData(p, search, filterDept); }}
              />
            </div>
          </>
        )}
      </div>

      {/* Modal Création */}
      <Modal isOpen={modal.type === 'create'} onClose={closeModal} title="Ajouter une filière">
        <FiliereForm onSuccess={handleFormSuccess} onCancel={closeModal} />
      </Modal>

      {/* Modal Modification */}
      <Modal isOpen={modal.type === 'edit'} onClose={closeModal} title="Modifier la filière">
        <FiliereForm filiere={modal.item} onSuccess={handleFormSuccess} onCancel={closeModal} />
      </Modal>

      {/* Modal Consultation */}
      <Modal isOpen={modal.type === 'view'} onClose={closeModal} title="Détails de la filière">
        <FiliereDetail filiere={modal.item} />
        <div className="flex justify-end mt-4">
          <button onClick={closeModal} className="btn-secondary">Fermer</button>
        </div>
      </Modal>

      {/* Confirmation suppression */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Supprimer la filière"
        message={`Êtes-vous sûr de vouloir supprimer la filière "${deleteTarget?.nom}" (${deleteTarget?.code}) ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}
