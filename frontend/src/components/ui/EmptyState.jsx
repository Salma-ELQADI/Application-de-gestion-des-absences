import { FolderOpen } from 'lucide-react';

export default function EmptyState({ title = 'Aucun résultat', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-[#CAE9FF] rounded-full mb-4">
        <FolderOpen size={32} className="text-[#5FA8D3]" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-4 max-w-xs">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
