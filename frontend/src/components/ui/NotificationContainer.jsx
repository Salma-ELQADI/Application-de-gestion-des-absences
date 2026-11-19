import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const icons = {
  success: <CheckCircle size={18} className="text-green-500 shrink-0" />,
  error:   <XCircle size={18} className="text-red-500 shrink-0" />,
  info:    <Info size={18} className="text-[#5FA8D3] shrink-0" />,
  warning: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
};

const borders = {
  success: 'border-l-4 border-green-400',
  error:   'border-l-4 border-red-400',
  info:    'border-l-4 border-[#5FA8D3]',
  warning: 'border-l-4 border-amber-400',
};

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  if (!notifications.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`bg-white rounded-lg shadow-lg ${borders[n.type]} p-4 flex items-start gap-3
                      animate-slide-in pointer-events-auto`}
        >
          {icons[n.type]}
          <p className="text-sm text-gray-700 flex-1">{n.message}</p>
          <button
            onClick={() => removeNotification(n.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
