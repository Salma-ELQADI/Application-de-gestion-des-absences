import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Search, Eye, Pencil, Trash2, Building2, X } from 'lucide-react';
import { departementService } from '../services/departementService';
import { useNotification } from '../contexts/NotificationContext';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { PageSpinner } from '../components/ui/Spinner';
import DepartementForm from '../components/departements/DepartementForm';
import DepartementDetail from '../components/departements/DepartementDetail';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function DepartementsPage() {
  const [data, setData]           = useState({ data: [], meta: null });
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);

  // Modals state
  const [modal, setModal] = useState({ type: null, item: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { error: notifError, success, warning } = useNotification();
  const searchTimeout = useRef(null);

  const fetchData = useCallback(async (p = page, s = search) => {
    setLoading(true);
    try {
      const result = await departementService.getAll({ page: p, search: s, per_page: 10 });
      // Laravel paginate() retourne la structure directement (current_page, data, last_page, etc.)
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
      notifError('Impossible de charger les départements.');
    } finally {
      setLoading(false);
    }
  }, [page, search, notifError]);

  useEffect(() => { fetchData(page, search); }, [page]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchData(1, val);
    }, 400);
  };

  const clearSearch = () => {
    setSearch('');
    setPage(1);
    fetchData(1, '');
  };

  const openCreate = () => setModal({ type: 'create', item: null });
  const openEdit   = (item) => setModal({ type: 'edit', item });
  const openView   = (item) => setModal({ type: 'view', item });
  const closeModal = () => setModal({ type: null, item: null });

  const handleFormSuccess = () => {
    closeModal();
    fetchData(page, search);
  };

  const confirmDelete = (item) => setDeleteTarget(item);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await departementService.delete(deleteTarget.id);
      success(`Le département "${deleteTarget.nom}" a été supprimé.`);
      setDeleteTarget(null);
      fetchData(page, search);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 422) {
        warning(msg || 'Ce département possède des filières. Supprimez-les d\'abord.');
      } else {
        notifError(msg || 'Erreur lors de la suppression.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* En-tête de page */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={18} className="text-[#5FA8D3]" />
              <h2 className="font-semibold text-[#1B4965]">Gestion des départements</h2>
            </div>
            <p className="text-sm text-gray-500">
              Créez, modifiez et gérez les départements de l'établissement.
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary shrink-0">
            <Plus size={16} />
            Ajouter un département
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="card p-0 overflow-hidden">
        {/* Barre de recherche */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Rechercher un département…"
              className="form-input pl-9 pr-8 py-2"
            />
            {search && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-8"><PageSpinner /></div>
        ) : data.data.length === 0 ? (
          <EmptyState
            title="Aucun département trouvé"
            description={search ? `Aucun résultat pour "${search}"` : "Créez votre premier département pour commencer."}
            action={
              !search && (
                <button onClick={openCreate} className="btn-primary">
                  <Plus size={16} /> Ajouter un département
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
                    <th className="table-header hidden md:table-cell">Description</th>
                    <th className="table-header hidden sm:table-cell w-32">Filières</th>
                    <th className="table-header hidden lg:table-cell w-36">Créé le</th>
                    <th className="table-header w-32 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((dept) => (
                    <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                      <td className="table-cell font-mono text-xs text-gray-500">#{dept.id}</td>
                      <td className="table-cell">
                        <span className="font-medium text-gray-800">{dept.nom}</span>
                      </td>
                      <td className="table-cell hidden md:table-cell max-w-xs">
                        <span className="text-gray-500 line-clamp-1">
                          {dept.description || <span className="italic text-gray-400">—</span>}
                        </span>
                      </td>
                      <td className="table-cell hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 bg-[#BEE9E8] text-[#1B4965] text-xs px-2 py-0.5 rounded-full font-medium">
                          {dept.filieres_count ?? 0} filière(s)
                        </span>
                      </td>
                      <td className="table-cell hidden lg:table-cell text-gray-500 text-xs">
                        {formatDate(dept.created_at)}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openView(dept)}
                            title="Consulter"
                            className="p-1.5 rounded-lg text-[#5FA8D3] hover:bg-[#CAE9FF] transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => openEdit(dept)}
                            title="Modifier"
                            className="p-1.5 rounded-lg text-[#62B6CB] hover:bg-[#BEE9E8] transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => confirmDelete(dept)}
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

            {/* Pagination */}
            <div className="px-4 border-t border-gray-100">
              <Pagination
                meta={data.meta}
                onPageChange={(p) => { setPage(p); fetchData(p, search); }}
              />
            </div>
          </>
        )}
      </div>

      {/* Modal Création */}
      <Modal
        isOpen={modal.type === 'create'}
        onClose={closeModal}
        title="Ajouter un département"
      >
        <DepartementForm onSuccess={handleFormSuccess} onCancel={closeModal} />
      </Modal>

      {/* Modal Modification */}
      <Modal
        isOpen={modal.type === 'edit'}
        onClose={closeModal}
        title="Modifier le département"
      >
        <DepartementForm
          departement={modal.item}
          onSuccess={handleFormSuccess}
          onCancel={closeModal}
        />
      </Modal>

      {/* Modal Consultation */}
      <Modal
        isOpen={modal.type === 'view'}
        onClose={closeModal}
        title="Détails du département"
      >
        <DepartementDetail departement={modal.item} />
        <div className="flex justify-end mt-4">
          <button onClick={closeModal} className="btn-secondary">Fermer</button>
        </div>
      </Modal>

      {/* Dialog de confirmation suppression */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Supprimer le département"
        message={`Êtes-vous sûr de vouloir supprimer le département "${deleteTarget?.nom}" ? Cette action est irréversible. Si ce département possède des filières, la suppression sera bloquée.`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}
