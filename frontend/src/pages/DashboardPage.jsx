import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, BookOpen, CheckCircle, XCircle,
  ArrowRight, Calendar, TrendingUp
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { PageSpinner } from '../components/ui/Spinner';

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`p-3 ${bg} rounded-xl shrink-0`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-[#1B4965]">{value ?? '—'}</p>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardService.getStats()
      .then(setData)
      .catch(() => setError('Impossible de charger les statistiques.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const { stats, derniers_departements, dernieres_filieres } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Building2} label="Départements" value={stats.total_departements}
          color="text-[#5FA8D3]" bg="bg-[#CAE9FF]"
        />
        <StatCard
          icon={BookOpen} label="Filières" value={stats.total_filieres}
          color="text-[#62B6CB]" bg="bg-[#BEE9E8]"
        />
        <StatCard
          icon={CheckCircle} label="Dépts avec filières" value={stats.departements_avec_filieres}
          color="text-green-500" bg="bg-green-50"
        />
        <StatCard
          icon={XCircle} label="Dépts sans filière" value={stats.departements_sans_filieres}
          color="text-amber-500" bg="bg-amber-50"
        />
      </div>

      {/* Listes récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Derniers départements */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#5FA8D3]" />
              <h2 className="font-semibold text-[#1B4965]">Derniers départements</h2>
            </div>
            <Link
              to="/departements"
              className="flex items-center gap-1 text-xs text-[#5FA8D3] hover:text-[#1B4965] transition-colors"
            >
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>

          {derniers_departements.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Aucun département créé.</p>
          ) : (
            <div className="space-y-2">
              {derniers_departements.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-lg hover:bg-[#CAE9FF]/40 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{d.nom}</p>
                    <p className="text-xs text-gray-500">
                      {d.filieres_count} filière{d.filieres_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} />
                    {formatDate(d.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dernières filières */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#62B6CB]" />
              <h2 className="font-semibold text-[#1B4965]">Dernières filières</h2>
            </div>
            <Link
              to="/filieres"
              className="flex items-center gap-1 text-xs text-[#5FA8D3] hover:text-[#1B4965] transition-colors"
            >
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>

          {dernieres_filieres.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Aucune filière créée.</p>
          ) : (
            <div className="space-y-2">
              {dernieres_filieres.map((f) => (
                <div key={f.id} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-lg hover:bg-[#BEE9E8]/40 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{f.nom}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs bg-[#BEE9E8] text-[#1B4965] px-1.5 py-0.5 rounded font-mono">
                        {f.code}
                      </span>
                      <span className="text-xs text-gray-500">{f.departement?.nom}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} />
                    {formatDate(f.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
