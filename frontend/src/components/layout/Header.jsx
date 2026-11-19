import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const breadcrumbMap = {
  '/dashboard':          [{ label: 'Tableau de bord' }],
  '/departements':       [{ label: 'Départements', to: '/departements' }],
  '/filieres':           [{ label: 'Filières', to: '/filieres' }],
};

function getTitle(pathname) {
  const map = {
    '/dashboard': 'Tableau de bord',
    '/departements': 'Gestion des départements',
    '/filieres': 'Gestion des filières',
  };
  return map[pathname] || 'Administration';
}

export default function Header() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const breadcrumbs = breadcrumbMap[pathname] || [];
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4 lg:pl-6 pl-16">
      <div>
        {/* Fil d'Ariane */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <Link to="/dashboard" className="flex items-center hover:text-[#5FA8D3] transition-colors">
            <Home size={12} />
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight size={12} />
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-[#5FA8D3] transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-gray-700 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Titre */}
        <h1 className="text-lg font-bold text-[#1B4965]">{getTitle(pathname)}</h1>
      </div>

      {/* Profil admin */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-500">Administrateur</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#5FA8D3] flex items-center justify-center text-white text-sm font-bold">
          {initials}
        </div>
      </div>
    </header>
  );
}
