import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  LogOut,
  GraduationCap,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/departements',  icon: Building2,       label: 'Départements' },
  { to: '/filieres',      icon: BookOpen,         label: 'Filières' },
];

function NavItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
          isActive
            ? 'bg-[#5FA8D3] text-white shadow-sm'
            : 'text-[#BEE9E8] hover:bg-white/10 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={18} className="shrink-0" />
          <span className="flex-1">{label}</span>
          {isActive && <ChevronRight size={14} className="shrink-0" />}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { success } = useNotification();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    success('Vous avez été déconnecté avec succès.');
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  const SidebarContent = ({ onItemClick }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="p-2 bg-[#5FA8D3] rounded-lg">
          <GraduationCap size={22} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Gestion</p>
          <p className="text-[#62B6CB] text-xs">des Absences</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[#62B6CB] text-xs font-semibold uppercase tracking-wider px-3 mb-2">
          Navigation
        </p>
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={onItemClick} />
        ))}
      </nav>

      {/* User & Logout */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#62B6CB] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name || 'Admin'}</p>
            <p className="text-[#BEE9E8] text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                     text-[#BEE9E8] hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#1B4965] min-h-screen shadow-sidebar shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-[#1B4965] rounded-lg text-white shadow-lg"
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-[#1B4965] h-full shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-[#BEE9E8] hover:text-white transition-colors"
              aria-label="Fermer le menu"
            >
              <X size={20} />
            </button>
            <SidebarContent onItemClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
