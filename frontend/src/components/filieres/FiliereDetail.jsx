import { Building2, Calendar, FileText, Hash, Tag } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function FiliereDetail({ filiere }) {
  if (!filiere) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        <Hash size={16} className="text-[#5FA8D3] mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Identifiant</p>
          <p className="text-sm font-medium text-gray-800">#{filiere.id}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        <FileText size={16} className="text-[#5FA8D3] mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Nom</p>
          <p className="text-sm font-medium text-gray-800">{filiere.nom}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        <Tag size={16} className="text-[#5FA8D3] mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Code</p>
          <span className="text-sm font-mono font-bold bg-[#BEE9E8] text-[#1B4965] px-2 py-0.5 rounded">
            {filiere.code}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        <Building2 size={16} className="text-[#5FA8D3] mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Département</p>
          <p className="text-sm font-medium text-gray-800">
            {filiere.departement?.nom || '—'}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        <Calendar size={16} className="text-[#5FA8D3] mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Date de création</p>
          <p className="text-sm text-gray-700">{formatDate(filiere.created_at)}</p>
        </div>
      </div>
    </div>
  );
}
