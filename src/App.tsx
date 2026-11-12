import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TreePine, Map, BarChart3, PieChartIcon, Table, Filter,
  FileText, Layers, Activity, AlertTriangle, CheckCircle, Clock,
  Satellite, Eye, BookOpen, ChevronDown, ChevronUp, Info
} from 'lucide-react';
import {
  forestActs, totalArea, dzzArea, visualArea, dzzShare,
  approvedShare, disputedShare, normDocs, normIndicators,
  ForestAct
} from './data/forestData';

type TabType = 'dashboard' | 'architecture' | 'norms' | 'report';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [quarterFilter, setQuarterFilter] = useState<string>('all');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const filteredActs = useMemo(() => {
    return forestActs.filter(act => {
      if (methodFilter !== 'all' && act.method !== methodFilter) return false;
      if (statusFilter !== 'all' && act.status !== statusFilter) return false;
      if (quarterFilter !== 'all' && act.quarter !== Number(quarterFilter)) return false;
      return true;
    });
  }, [methodFilter, statusFilter, quarterFilter]);

  const filteredTotalArea = filteredActs.reduce((sum, a) => sum + a.area, 0);
  const filteredDzzArea = filteredActs.filter(a => a.method === 'ДЗЗ').reduce((sum, a) => sum + a.area, 0);
  const filteredApproved = filteredActs.filter(a => a.status === 'Прошёл').length;
  const filteredDisputed = filteredActs.filter(a => a.status === 'На оспаривании').length;

  // Данные для графиков
  const methodData = [
    { name: 'ДЗЗ', value: dzzArea, fill: '#3b82f6' },
    { name: 'Визуальный', value: visualArea, fill: '#f97316' },
  ];

  const causeData = [
    { name: 'Лесной пожар 2004 г.', value: 4, fill: '#ef4444' },
    { name: 'Межвидовая конкуренция', value: 1, fill: '#eab308' },
    { name: 'Без причины', value: 2, fill: '#6b7280' },
  ];

  const quarters = [...new Set(forestActs.map(a => a.quarter))].sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
      {/* Header */}
      <header className="border-b border-emerald-700/30 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-emerald-100">Цифровой двойник лесничества</h1>
                <p className="text-xs text-emerald-400">Закаменское лесничество · Б1.О.02 Цифровые технологии и ИИ</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              <span>Журнал ЛПО 2023 · Обновлено: 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-emerald-700/20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'dashboard' as TabType, label: 'BI-дашборд', icon: BarChart3 },
              { id: 'architecture' as TabType, label: 'Архитектура', icon: Layers },
              { id: 'norms' as TabType, label: 'Нормативная база', icon: BookOpen },
              { id: 'report' as TabType, label: 'Отчёт', icon: FileText },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-900/20'
                    : 'border-transparent text-slate-400 hover:text-emerald-300 hover:border-emerald-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardView
                filteredActs={filteredActs}
                filteredTotalArea={filteredTotalArea}
                filteredDzzArea={filteredDzzArea}
                filteredApproved={filteredApproved}
                filteredDisputed={filteredDisputed}
                methodFilter={methodFilter}
                statusFilter={statusFilter}
                quarterFilter={quarterFilter}
                setMethodFilter={setMethodFilter}
                setStatusFilter={setStatusFilter}
                setQuarterFilter={setQuarterFilter}
                methodData={methodData}
                causeData={causeData}
                quarters={quarters}
              />
            </motion.div>
          )}

          {activeTab === 'architecture' && (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ArchitectureView />
            </motion.div>
          )}

          {activeTab === 'norms' && (
            <motion.div
              key="norms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NormsView expandedSection={expandedSection} setExpandedSection={setExpandedSection} />
            </motion.div>
          )}

          {activeTab === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReportView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-700/20 bg-slate-900/80 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs text-slate-400">
            <div>
              <p><strong className="text-emerald-300">Прослеживаемость:</strong> Источник — Журнал ЛПО 2023 (записи 250, 251, 326–330)</p>
              <p>Нормативная база: Регламент № 236-р · Форма акта ЛПО (Приказ № 97)</p>
            </div>
            <div className="text-right">
              <p>Направление: 35.04.01 Лесное дело</p>
              <p>Профиль: ГИС в лесном хозяйстве</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// =================== DASHBOARD VIEW ===================
function DashboardView({
  filteredActs, filteredTotalArea, filteredDzzArea, filteredApproved, filteredDisputed,
  methodFilter, statusFilter, quarterFilter,
  setMethodFilter, setStatusFilter, setQuarterFilter,
  methodData, causeData, quarters
}: {
  filteredActs: ForestAct[];
  filteredTotalArea: number;
  filteredDzzArea: number;
  filteredApproved: number;
  filteredDisputed: number;
  methodFilter: string;
  statusFilter: string;
  quarterFilter: string;
  setMethodFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
  setQuarterFilter: (v: string) => void;
  methodData: { name: string; value: number; fill: string }[];
  causeData: { name: string; value: number; fill: string }[];
  quarters: number[];
}) {
  const filteredDzzShare = filteredTotalArea > 0 ? (filteredDzzArea / filteredTotalArea) * 100 : 0;
  const filteredApprovedShare = filteredActs.length > 0 ? (filteredApproved / filteredActs.length) * 100 : 0;
  const filteredDisputedShare = filteredActs.length > 0 ? (filteredDisputed / filteredActs.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-emerald-300">Фильтры</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="all">Все способы ЛПО</option>
            <option value="ДЗЗ">ДЗЗ (дистанционное)</option>
            <option value="Визуальный">Визуальный</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="all">Все статусы</option>
            <option value="Прошёл">Прошёл</option>
            <option value="На оспаривании">На оспаривании</option>
          </select>
          <select
            value={quarterFilter}
            onChange={(e) => setQuarterFilter(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="all">Все кварталы</option>
            {quarters.map(q => (
              <option key={q} value={q}>Квартал {q}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={<Map className="w-5 h-5" />}
          title="Площадь обследования"
          value={`${filteredTotalArea.toFixed(1)} га`}
          subtitle={`${filteredActs.length} актов`}
          color="emerald"
        />
        <KPICard
          icon={<Satellite className="w-5 h-5" />}
          title="Доля ДЗЗ"
          value={`${filteredDzzShare.toFixed(1)}%`}
          subtitle={`${filteredDzzArea.toFixed(1)} га дистанционно`}
          color="blue"
        />
        <KPICard
          icon={<CheckCircle className="w-5 h-5" />}
          title="Доля в срок"
          value={`${filteredApprovedShare.toFixed(1)}%`}
          subtitle={`${filteredApproved} из ${filteredActs.length} актов`}
          color="green"
        />
        <KPICard
          icon={<AlertTriangle className="w-5 h-5" />}
          title="На оспаривании"
          value={`${filteredDisputedShare.toFixed(1)}%`}
          subtitle={`${filteredDisputed} актов`}
          color="amber"
        />
      </div>

      {/* Map + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-emerald-300">Карта кварталов</h3>
          </div>
          <div className="relative bg-slate-900/60 rounded-lg p-4 min-h-[300px]">
            <div className="grid grid-cols-3 gap-3">
              {filteredActs.map(act => (
                <motion.div
                  key={act.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`rounded-lg p-3 border-2 ${
                    act.method === 'ДЗЗ'
                      ? 'bg-blue-900/40 border-blue-500/60'
                      : 'bg-orange-900/40 border-orange-500/60'
                  } ${act.status === 'На оспаривании' ? 'ring-2 ring-amber-400/50' : ''}`}
                >
                  <div className="text-center">
                    <div className="text-xs text-slate-400">Кв.</div>
                    <div className="text-lg font-bold text-white">{act.quarter}</div>
                    <div className="text-xs text-slate-300">{act.area} га</div>
                    <div className={`text-xs mt-1 ${act.method === 'ДЗЗ' ? 'text-blue-300' : 'text-orange-300'}`}>
                      {act.method === 'ДЗЗ' ? '🛰 ДЗЗ' : '👁 Визуал.'}
                    </div>
                    {act.status === 'На оспаривании' && (
                      <div className="text-xs text-amber-400 mt-1">⚠ Оспарив.</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-slate-300">ДЗЗ</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-orange-500"></div>
                <span className="text-slate-300">Визуальный</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border-2 border-amber-400"></div>
                <span className="text-slate-300">На оспаривании</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-emerald-300">Площадь по способам ЛПО</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={methodData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} unit=" га" />
              <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#d1fae5' }}
                formatter={(value: number) => [`${value.toFixed(1)} га`, 'Площадь']}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {methodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-400 mt-2 text-center">
            99,5% площади обследовано дистанционно (ДЗЗ)
          </p>
        </div>
      </div>

      {/* Pie Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-4">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-emerald-300">Распределение по причинам повреждений</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={causeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={{ stroke: '#6b7280' }}
              >
                {causeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#d1fae5' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Table className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-emerald-300">Перечень актов ЛПО</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-2 px-2 text-slate-400 font-medium">№</th>
                  <th className="text-left py-2 px-2 text-slate-400 font-medium">Кв.</th>
                  <th className="text-left py-2 px-2 text-slate-400 font-medium">Площадь</th>
                  <th className="text-left py-2 px-2 text-slate-400 font-medium">Способ</th>
                  <th className="text-left py-2 px-2 text-slate-400 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filteredActs.map(act => (
                  <tr key={act.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-2 px-2 text-white">{act.actNumber}</td>
                    <td className="py-2 px-2 text-white">{act.quarter}</td>
                    <td className="py-2 px-2 text-white">{act.area} га</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        act.method === 'ДЗЗ' ? 'bg-blue-900/50 text-blue-300' : 'bg-orange-900/50 text-orange-300'
                      }`}>
                        {act.method}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        act.status === 'Прошёл' ? 'bg-green-900/50 text-green-300' : 'bg-amber-900/50 text-amber-300'
                      }`}>
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Management Conclusions */}
      <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-emerald-300">Управленческие выводы</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ConclusionCard
            number={1}
            title="Высокая доля ДЗЗ"
            text="99,5% площади обследовано дистанционно. Необходимо верифицировать результаты ДЗЗ полевыми обследованиями на контрольных участках."
            norm="Приказ № 156"
          />
          <ConclusionCard
            number={2}
            title="Доля актов на оспаривании"
            text="28,6% актов находятся на оспаривании. Требуется проверка процедур согласования и актуализации данных в реестрах ГЛПМ."
            norm="Регламент № 236-р"
          />
          <ConclusionCard
            number={3}
            title="Преобладание пожарных повреждений"
            text="4 из 7 актов связаны с лесным пожаром 2004 г. Необходимо усилить меры профилактики и мониторинга пост-пожарного восстановления."
            norm="Постановление № 2047"
          />
        </div>
      </div>
    </div>
  );
}

// =================== KPI CARD ===================
function KPICard({ icon, title, value, subtitle, color }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: 'from-emerald-600 to-emerald-800 border-emerald-500/40',
    blue: 'from-blue-600 to-blue-800 border-blue-500/40',
    green: 'from-green-600 to-green-800 border-green-500/40',
    amber: 'from-amber-600 to-amber-800 border-amber-500/40',
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`bg-gradient-to-br ${colorMap[color]} rounded-xl border p-4 shadow-lg`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="text-white/80">{icon}</div>
        <span className="text-xs text-white/70 font-medium">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/60 mt-1">{subtitle}</div>
    </motion.div>
  );
}

// =================== CONCLUSION CARD ===================
function ConclusionCard({ number, title, text, norm }: {
  number: number;
  title: string;
  text: string;
  norm: string;
}) {
  return (
    <div className="bg-slate-700/40 rounded-lg p-3 border border-slate-600/50">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">{number}</span>
        <span className="text-sm font-semibold text-emerald-200">{title}</span>
      </div>
      <p className="text-xs text-slate-300 mb-2">{text}</p>
      <div className="text-xs text-emerald-400/70">
        <Info className="w-3 h-3 inline mr-1" />
        Норматив: {norm}
      </div>
    </div>
  );
}

// =================== ARCHITECTURE VIEW ===================
function ArchitectureView() {
  const levels = [
    {
      level: 4,
      title: 'ПРЕДСТАВЛЕНИЕ (BI-дашборд)',
      color: 'from-emerald-600 to-emerald-800',
      borderColor: 'border-emerald-500/50',
      items: [
        'KPI: площадь, доля в срок, доля на оспаривании',
        'Карта кварталов с цветовой индикацией',
        'Динамика по годам · Топ причин · Фильтры по способу ЛПО',
      ],
    },
    {
      level: 3,
      title: 'ИНТЕЛЛЕКТ (упрощённо)',
      color: 'from-blue-600 to-blue-800',
      borderColor: 'border-blue-500/50',
      items: [
        'Агрегация по способам ЛПО',
        'Расчёт доли в срок',
        'Сопоставление с нормативами (Регламент № 236-р)',
        'Связка «причина → мероприятие»',
      ],
    },
    {
      level: 2,
      title: 'ДАННЫЕ',
      color: 'from-purple-600 to-purple-800',
      borderColor: 'border-purple-500/50',
      items: [
        'Журнал ЛПО 2023 (7 записей по Закаменскому)',
        'Слой границ лесничества',
        'Справочник причин повреждений',
        'Справочник статусов актов',
      ],
    },
    {
      level: 1,
      title: 'ИСТОЧНИКИ',
      color: 'from-slate-600 to-slate-800',
      borderColor: 'border-slate-500/50',
      items: [
        'Журнал ЛПО 2023 (Excel)',
        'Открытые слои ГИС',
        'Данные о пожарах 2004 г. (исторические)',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-6">
        <h2 className="text-xl font-bold text-emerald-200 mb-2">Архитектура цифрового двойника</h2>
        <p className="text-sm text-slate-300 mb-6">
          Упрощённая четырёхуровневая архитектура учебного цифрового двойника Закаменского лесничества
          (авторская разработка на основе лекции 4.2 и концепции DFCT)
        </p>

        <div className="space-y-3">
          {levels.map((level, idx) => (
            <motion.div
              key={level.level}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.15 }}
              className={`bg-gradient-to-r ${level.color} rounded-xl border ${level.borderColor} p-4`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-sm">
                  {level.level}
                </span>
                <h3 className="text-sm font-bold text-white">{level.title}</h3>
              </div>
              <ul className="ml-11 space-y-1">
                {level.items.map((item, i) => (
                  <li key={i} className="text-xs text-white/80 flex items-start gap-2">
                    <span className="text-white/50 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              {idx < levels.length - 1 && (
                <div className="flex justify-center mt-3">
                  <div className="w-0.5 h-4 bg-white/30"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* DFCT Properties */}
      <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-6">
        <h3 className="text-lg font-bold text-emerald-200 mb-4">Свойства DFCT в мини-проекте</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { prop: 'Stable ID', desc: 'Стабильный ID выдела/акта (номер акта)' },
            { prop: 'Versioned state', desc: 'Версия данных (дата обновления, статус акта)' },
            { prop: 'Explicit uncertainty', desc: 'Явное указание источника и периода данных' },
            { prop: 'Reproducible lineage', desc: 'Прослеживаемость: журнал → дашборд → вывод' },
            { prop: 'Monitoring-to-action', desc: 'Связка «причина повреждения → рекомендуемое мероприятие»' },
            { prop: 'Persistent identity', desc: 'Квартал/выдел как единица идентификации' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-700/40 rounded-lg p-3 border border-slate-600/50">
              <div className="text-sm font-semibold text-emerald-300">{item.prop}</div>
              <div className="text-xs text-slate-300 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature: DZZ vs Visual */}
      <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-6">
        <h3 className="text-lg font-bold text-emerald-200 mb-4">Особенность Закаменского лесничества</h3>
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-200">
            Подавляющая доля площади обследована методом ДЗЗ (6 439 из 6 474 га).
            Цифровой двойник явно различает способ ЛПО и показывает, что большие площади —
            результат дистанционного анализа, а не полевых измерений.
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Satellite className="w-3 h-3 text-blue-400" />
              <span className="text-blue-300">ДЗЗ — 6 439 га (99,5%)</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-orange-400" />
              <span className="text-orange-300">Визуальный — 34,9 га (0,5%)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =================== NORMS VIEW ===================
function NormsView({ expandedSection, setExpandedSection }: {
  expandedSection: string | null;
  setExpandedSection: (v: string | null) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-6">
        <h2 className="text-xl font-bold text-emerald-200 mb-2">Нормативная база</h2>
        <p className="text-sm text-slate-300 mb-6">
          Документы, регулирующие лесопатологический мониторинг и требования к цифровому двойнику
        </p>

        <div className="space-y-3">
          {normDocs.map(doc => (
            <motion.div
              key={doc.id}
              className="bg-slate-700/40 rounded-lg border border-slate-600/50 overflow-hidden"
            >
              <button
                onClick={() => setExpandedSection(expandedSection === doc.id ? null : doc.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-700/50 text-emerald-300 flex items-center justify-center text-xs font-bold">
                    №{doc.id}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-white">{doc.title}</div>
                    <div className="text-xs text-slate-400">{doc.regulation}</div>
                  </div>
                </div>
                {expandedSection === doc.id ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <AnimatePresence>
                {expandedSection === doc.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 border-t border-slate-600/50 pt-3">
                      <div className="text-xs text-slate-300">
                        <strong className="text-emerald-300">Требования для цифрового двойника:</strong>
                        <p className="mt-1">{doc.requirement}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Normative Indicators Table */}
      <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-6">
        <h3 className="text-lg font-bold text-emerald-200 mb-4">Нормативно значимые показатели</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-2 px-3 text-slate-400 font-medium">Показатель</th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">Нормативный источник</th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">Отображение в дашборде</th>
              </tr>
            </thead>
            <tbody>
              {normIndicators.map((ind, i) => (
                <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-2 px-3 text-white">{ind.indicator}</td>
                  <td className="py-2 px-3 text-slate-300">{ind.source}</td>
                  <td className="py-2 px-3 text-emerald-300">{ind.display}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* What it means for Digital Twin */}
      <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-6">
        <h3 className="text-lg font-bold text-emerald-200 mb-4">Что это означает для цифрового двойника</h3>
        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-sm text-emerald-100">
            Цифровой двойник лесничества не может быть «просто дашбордом». Он должен отражать
            нормативно значимые показатели и обеспечивать <strong>прослеживаемость (lineage)</strong> —
            возможность доказать, на основании каких данных и в какие сроки был сделан вывод.
          </p>
          <p className="text-sm text-emerald-100 mt-3">
            Для учебного мини-проекта достаточно упрощённой версии:
          </p>
          <ul className="text-sm text-emerald-100 mt-2 ml-4 space-y-1 list-disc">
            <li>Стабильный ID выдела/акта</li>
            <li>Версия данных (дата обновления)</li>
            <li>Явное указание источника и периода</li>
            <li>Связка «мониторинг → рекомендуемое мероприятие»</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// =================== REPORT VIEW ===================
function ReportView() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-6">
        <h2 className="text-xl font-bold text-emerald-200 mb-4">Отчёт по мини-проекту</h2>
        <p className="text-sm text-slate-300 mb-6">
          Структура отчёта для защиты самостоятельной работы
        </p>

        <div className="space-y-4">
          {[
            {
              num: '1',
              title: 'Титульный лист',
              content: 'Дисциплина: Б1.О.02 Цифровые технологии, ИИ и анализ данных. Направление: 35.04.01 Лесное дело, профиль «ГИС в лесном хозяйстве». Тестовое лесничество: Закаменское.',
            },
            {
              num: '2',
              title: 'Характеристика Закаменского лесничества',
              content: 'Выбрано как лесничество с наибольшей суммарной площадью обследования в журнале ЛПО 2023 — около 6 474 га. Из них более 6 439 га — дистанционное зондирование Земли (ДЗЗ). 7 записей в журнале, 3 участковых лесничества.',
            },
            {
              num: '3',
              title: 'Обзор нормативных документов',
              content: 'Приказ № 156 (порядок ГЛПМ), Приказ № 706 (реестры ГЛПМ), Регламент № 236-р (сроки актуализации), Приказ № 97 (форма акта ЛПО), Постановление № 2047 (санитарная безопасность). Каждый документ определяет конкретные требования к данным.',
            },
            {
              num: '4',
              title: 'Исходные данные (Таблица 2)',
              content: '7 записей: акты № 250, 251, 326–330. Суммарная площадь — 6 473,9 га. ДЗЗ — 6 439 га (99,5%), визуальный — 34,9 га (0,5%). 5 актов прошли, 2 на оспаривании.',
            },
            {
              num: '5',
              title: 'Нормативно значимые показатели (Таблица 3)',
              content: '6 показателей: площадь повреждённых насаждений, доля актов в срок, число на оспаривании, распределение по причинам, площадь по способам ЛПО, привязка к кварталам.',
            },
            {
              num: '6',
              title: 'Архитектура (Рисунок 1)',
              content: '4 уровня: Источники → Данные → Интеллект → Представление. Акцент на различие ДЗЗ/визуального ЛПО. Свойства DFCT: stable ID, versioned state, explicit uncertainty, lineage, monitoring-to-action.',
            },
            {
              num: '7',
              title: 'Дашборд (Таблица 4)',
              content: '6+ виджетов: 4 KPI-карточки, карта кварталов, столбчатая диаграмма, круговая диаграмма, таблица актов, фильтры. Прослеживаемость в подвале.',
            },
            {
              num: '8',
              title: 'Управленческие выводы',
              content: '1) Высокая доля ДЗЗ — нужна верификация полевыми методами. 2) 28,6% на оспаривании — проверка процедур. 3) Преобладание пожарных повреждений — усиление профилактики.',
            },
            {
              num: '9',
              title: 'Ограничения проекта',
              content: 'Данные по одному лесничеству и одному году; отсутствие реального IoT-потока; упрощённая модель неопределённости; всего 7 записей — ограничивает статистическую мощность.',
            },
          ].map((section, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-700/40 rounded-lg p-4 border border-slate-600/50"
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold shrink-0">
                  {section.num}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-emerald-200">{section.title}</h4>
                  <p className="text-xs text-slate-300 mt-1">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Control Questions */}
      <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-6">
        <h3 className="text-lg font-bold text-emerald-200 mb-4">Контрольные вопросы к защите</h3>
        <div className="space-y-4">
          {[
            {
              q: 'Почему выбрано Закаменское лесничество?',
              a: 'Наибольшая суммарная площадь — 6 474 га. 99,5% — ДЗЗ. Показательно для демонстрации работы с большими площадями и разными способами ЛПО.',
            },
            {
              q: 'Какие документы регулируют мониторинг?',
              a: 'Приказ № 156 (ГЛПМ), № 706 (реестры), Регламент № 236-р (сроки), Приказ № 97 (форма акта). Вместе формируют нормативный контур.',
            },
            {
              q: 'Почему «доля в срок» — нормативный показатель?',
              a: 'Регламент № 236-р устанавливает регламентированные сроки. Нарушение → устаревание данных → решения по неактуальной информации. Для Закаменского — 71,4%.',
            },
            {
              q: 'Как отражено различие ДЗЗ и визуального?',
              a: 'Отдельный фильтр «Способ ЛПО» и цветовая индикация (синий — ДЗЗ, оранжевый — визуальный). Пользователь понимает, что 6 439 га — дешифрирование снимков.',
            },
            {
              q: 'Какие ограничения нужно указать?',
              a: 'Одно лесничество, один год; нет IoT-потока; упрощённая неопределённость; нет версионности; 7 записей — ограничивает статистику. Демонстрирует принципы, не является производственным.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-slate-700/40 rounded-lg p-4 border border-slate-600/50">
              <div className="text-sm font-semibold text-emerald-300 mb-2">
                <span className="text-white">Вопрос:</span> {item.q}
              </div>
              <div className="text-xs text-slate-300">
                <span className="text-emerald-400">Ответ:</span> {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-6">
        <h3 className="text-lg font-bold text-emerald-200 mb-4">Источники</h3>
        <ol className="space-y-2 text-xs text-slate-300 list-decimal ml-4">
          <li>Приказ Минприроды России от 05.04.2017 № 156 «Об утверждении Порядка осуществления ГЛПМ»</li>
          <li>Приказ Рослесхоза от 31.05.2023 № 706 «Об утверждении порядка ведения реестров ГЛПМ»</li>
          <li>Приказ ФБУ «Рослесозащита» от 08.09.2023 № 236-р «Об утверждении Регламента ведения реестров ГЛПМ»</li>
          <li>Постановление Правительства РФ от 09.12.2020 № 2047 «Об утверждении Правил санитарной безопасности в лесах»</li>
          <li>Приказ Минприроды России от 24.02.2026 № 97 «Об утверждении порядка проведения ЛПО и формы акта»</li>
          <li>Lopatin E., Pitkanen T.P., Sikanen L. Digital Forest Carbon Twin framework. Environmental Challenges, 2026</li>
          <li>Журнал регистрации актов ЛПО 2023 (записи 250, 251, 326–330)</li>
        </ol>
      </div>
    </div>
  );
}

export default App;
