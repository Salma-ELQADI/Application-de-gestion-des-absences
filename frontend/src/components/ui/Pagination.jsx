import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page, last_page, from, to, total } = meta;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left  = Math.max(1, current_page - delta);
    const right = Math.min(last_page, current_page + delta);

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push('...');
    }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < last_page) {
      if (right < last_page - 1) pages.push('...');
      pages.push(last_page);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3">
      <p className="text-sm text-gray-500">
        Affichage de <span className="font-medium text-gray-700">{from}</span> à{' '}
        <span className="font-medium text-gray-700">{to}</span> sur{' '}
        <span className="font-medium text-gray-700">{total}</span> résultat(s)
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="p-2 rounded-lg text-gray-500 hover:bg-[#CAE9FF] hover:text-[#1B4965]
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Page précédente"
        >
          <ChevronLeft size={16} />
        </button>

        {getPages().map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                page === current_page
                  ? 'bg-[#5FA8D3] text-white'
                  : 'text-gray-600 hover:bg-[#CAE9FF] hover:text-[#1B4965]'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="p-2 rounded-lg text-gray-500 hover:bg-[#CAE9FF] hover:text-[#1B4965]
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Page suivante"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
