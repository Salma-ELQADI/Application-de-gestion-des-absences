import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { isAuthenticated, login, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (globalError) setGlobalError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'L\'adresse email est obligatoire.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email invalide.';
    if (!form.password) newErrors.password = 'Le mot de passe est obligatoire.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    setLoading(true);
    try {
      await login(form.email, form.password);
      // La navigation est gérée par le Navigate ci-dessus
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        Object.entries(data.errors).forEach(([k, msgs]) => { mapped[k] = msgs[0]; });
        setErrors(mapped);
      } else {
        setGlobalError(data?.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche décoratif */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B4965] flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5FA8D3]/20 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#62B6CB]/10 rounded-full translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#5FA8D3] rounded-2xl mb-6 shadow-lg">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Gestion des Absences
          </h1>
          <p className="text-[#BEE9E8] text-lg mb-8 leading-relaxed">
            Plateforme d'administration académique
          </p>
          <div className="flex flex-col gap-2 text-left max-w-xs">
            {[
              'Gestion des départements et filières',
              'Suivi des absences en temps réel',
              'Rapports et statistiques détaillés',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[#BEE9E8] text-sm">
                <div className="w-1.5 h-1.5 bg-[#62B6CB] rounded-full" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panneau droit — Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-[#1B4965] rounded-xl">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-[#1B4965]">Gestion des Absences</p>
              <p className="text-xs text-gray-500">Administration</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#1B4965]">Connexion</h2>
              <p className="text-sm text-gray-500 mt-1">Connectez-vous à votre espace administrateur</p>
            </div>

            {/* Erreur globale */}
            {globalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 animate-fade-in">
                {globalError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="form-label">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@exemple.com"
                    autoComplete="email"
                    className={`form-input pl-9 ${errors.email ? 'form-input-error' : ''}`}
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="form-label">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`form-input pl-9 pr-10 ${errors.password ? 'form-input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion…
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Se connecter
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              Accès réservé aux administrateurs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
