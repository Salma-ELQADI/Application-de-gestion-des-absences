import { BookOpen, Calendar, FileText, Hash } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function DepartementDetail({ departement }) {
  if (!departement) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <Hash size={16} className="text-[#5FA8D3] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Identifiant</p>
            <p className="text-sm font-medium text-gray-800">#{departement.id}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <FileText size={16} className="text-[#5FA8D3] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Nom</p>
            <p className="text-sm font-medium text-gray-800">{departement.nom}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <FileText size={16} className="text-[#5FA8D3] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Description</p>
            <p className="text-sm text-gray-700">
              {departement.description || <span className="text-gray-400 italic">Aucune description</span>}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <BookOpen size={16} className="text-[#5FA8D3] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Filières rattachées</p>
            <p className="text-sm font-medium text-gray-800">
              {departement.filieres_count ?? departement.filieres?.length ?? '—'} filière(s)
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar size={16} className="text-[#5FA8D3] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Date de création</p>
            <p className="text-sm text-gray-700">{formatDate(departement.created_at)}</p>
          </div>
        </div>

        {departement.updated_at !== departement.created_at && (
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar size={16} className="text-[#5FA8D3] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Dernière modification</p>
              <p className="text-sm text-gray-700">{formatDate(departement.updated_at)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
