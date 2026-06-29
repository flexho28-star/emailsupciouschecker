import React from 'react';
import { Shield, AlertTriangle, ShieldCheck, Activity, TrendingUp, RefreshCw } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface PredictResponse {
  id?: number;
  subject?: string;
  sender?: string;
  classification: string;
  confidence_score: number;
  risk_score: number;
  explanation: string;
  detected_indicators: Record<string, boolean>;
  highlighted_text: string;
  xai_keywords?: { word: string; weight: number; type: string }[];
  created_at?: string;
}

interface StatsData {
  total_scans: number;
  safe_count: number;
  suspicious_count: number;
  phishing_count: number;
  average_confidence: number;
  risk_distribution: Record<string, number>;
  recent_scans: PredictResponse[];
}

interface DashboardProps {
  stats: StatsData | null;
  loading: boolean;
  onRefresh: () => void;
  onSelectScan: (scan: PredictResponse) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, loading, onRefresh, onSelectScan }) => {
  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 text-cyber-blue animate-spin" />
        <p className="text-slate-400 font-mono text-sm">LOADING REAL-TIME CYBER THREAT DATA...</p>
      </div>
    );
  }

  // Data for Threat Level Pie Chart
  const pieData = [
    { name: 'Safe', value: stats.safe_count, color: '#05ffc4' },
    { name: 'Suspicious', value: stats.suspicious_count, color: '#f59e0b' },
    { name: 'Phishing', value: stats.phishing_count, color: '#ff3838' }
  ].filter(d => d.value > 0);

  // Fallback if no data
  const hasData = stats.total_scans > 0;
  const displayPieData = hasData ? pieData : [{ name: 'No Data', value: 1, color: '#1e293b' }];

  // Data for Risk Distribution Bar Chart
  const barData = Object.keys(stats.risk_distribution).map(key => ({
    range: key,
    count: stats.risk_distribution[key]
  }));

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Security Operations Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-mono">
            System Status: <span className="text-cyber-green">ACTIVE</span> | ML Engine: <span className="text-cyber-blue">ONLINE</span>
          </p>
        </div>
        <button 
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 hover:border-cyber-blue transition-all duration-300 font-mono text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          REFRESH FEED
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scanned */}
        <div className="glass-panel p-5 rounded-xl border-l-4 border-l-cyber-blue hover:shadow-neon-blue transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Scans</p>
              <h3 className="text-3xl font-bold mt-2 font-mono group-hover:text-cyber-blue transition-colors">
                {stats.total_scans}
              </h3>
            </div>
            <div className="p-2 bg-cyber-blue/10 rounded-lg text-cyber-blue">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500 font-mono">
            <TrendingUp className="w-3 h-3 mr-1 text-cyber-blue" />
            Active inspection stream
          </div>
        </div>

        {/* Safe */}
        <div className="glass-panel p-5 rounded-xl border-l-4 border-l-cyber-green hover:shadow-neon-green transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Safe Emails</p>
              <h3 className="text-3xl font-bold mt-2 font-mono text-cyber-green">
                {stats.safe_count}
              </h3>
            </div>
            <div className="p-2 bg-cyber-green/10 rounded-lg text-cyber-green">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500 font-mono">
            {stats.total_scans > 0 ? (
              <span>{((stats.safe_count / stats.total_scans) * 100).toFixed(0)}% of total traffic</span>
            ) : (
              <span>0% of total traffic</span>
            )}
          </div>
        </div>

        {/* Suspicious */}
        <div className="glass-panel p-5 rounded-xl border-l-4 border-l-cyber-yellow hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Suspicious</p>
              <h3 className="text-3xl font-bold mt-2 font-mono text-cyber-yellow">
                {stats.suspicious_count}
              </h3>
            </div>
            <div className="p-2 bg-cyber-yellow/10 rounded-lg text-cyber-yellow">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500 font-mono">
            <span>Needs verification</span>
          </div>
        </div>

        {/* Phishing */}
        <div className="glass-panel p-5 rounded-xl border-l-4 border-l-cyber-red hover:shadow-neon-red transition-all duration-300 group relative overflow-hidden">
          {stats.phishing_count > 0 && (
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-red/5 rounded-full blur-xl animate-pulse-slow pointer-events-none" />
          )}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Phishing Blocked</p>
              <h3 className="text-3xl font-bold mt-2 font-mono text-cyber-red">
                {stats.phishing_count}
              </h3>
            </div>
            <div className="p-2 bg-cyber-red/10 rounded-lg text-cyber-red">
              <Shield className="w-5 h-5 animate-pulse-slow" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500 font-mono">
            <span className="text-cyber-red font-semibold animate-pulse">CRITICAL THREATS ISOLATED</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Level Breakdown (Donut) */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between col-span-1 min-h-[320px]">
          <div>
            <h4 className="font-mono text-sm text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Threat Level Breakdown</span>
              <span className="text-xs text-slate-500">Average Confidence: {stats.average_confidence}%</span>
            </h4>
          </div>
          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {displayPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-mono text-white">{stats.total_scans}</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase">Total Scans</span>
            </div>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mt-2">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-cyber-green mb-1" />
              <span className="text-slate-400">Safe ({stats.safe_count})</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-cyber-yellow mb-1" />
              <span className="text-slate-400">Suspicious ({stats.suspicious_count})</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-cyber-red mb-1" />
              <span className="text-slate-400">Phishing ({stats.phishing_count})</span>
            </div>
          </div>
        </div>

        {/* Risk Score Distribution (Bar Chart) */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between col-span-2 min-h-[320px]">
          <div>
            <h4 className="font-mono text-sm text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Risk Score Distribution
            </h4>
          </div>
          <div className="h-52 w-100">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="range" stroke="#475569" fontSize={11} fontFamily="var(--font-mono)" />
                <YAxis stroke="#475569" fontSize={11} fontFamily="var(--font-mono)" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#1e293b', 
                    borderRadius: '8px', 
                    color: '#f8fafc',
                    fontFamily: 'var(--font-mono)' 
                  }} 
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => {
                    // Color bars differently based on risk range
                    let color = '#38bdf8'; // Safe (low risk)
                    if (entry.range === '41-60') color = '#fbbf24'; // Medium/Suspicious
                    if (entry.range === '61-80') color = '#f97316'; // High
                    if (entry.range === '81-100') color = '#ef4444'; // Extreme (Phishing)
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-[10px] text-slate-500 font-mono uppercase mt-2">
            Email Risk Rating (0 - 100 Score)
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h4 className="font-mono text-sm text-slate-300 uppercase tracking-wider">
            Recent Security Scans
          </h4>
          <span className="text-xs font-mono text-cyber-blue bg-cyber-blue/10 px-2 py-0.5 rounded-full border border-cyber-blue/20">
            Real-time feed
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800 text-xs font-mono text-slate-400 uppercase">
                <th className="p-4 pl-6">Subject / File</th>
                <th className="p-4">Sender</th>
                <th className="p-4">Date / Time</th>
                <th className="p-4">Risk Score</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {!hasData ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                    NO CYBER SCAN HISTORY RECORDED YET
                  </td>
                </tr>
              ) : (
                stats.recent_scans.map((scan) => {
                  let statusBadge = (
                    <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-cyber-green/10 text-cyber-green border border-cyber-green/20">
                      SAFE
                    </span>
                  );
                  if (scan.classification === 'Suspicious') {
                    statusBadge = (
                      <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/20">
                        SUSPICIOUS
                      </span>
                    );
                  } else if (scan.classification === 'Phishing') {
                    statusBadge = (
                      <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-cyber-red/10 text-cyber-red border border-cyber-red/20 animate-pulse">
                        PHISHING
                      </span>
                    );
                  }

                  return (
                    <tr key={scan.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="p-4 pl-6 font-medium max-w-xs truncate text-slate-200">
                        {scan.subject}
                      </td>
                      <td className="p-4 text-slate-400 max-w-xs truncate font-mono text-xs">
                        {scan.sender}
                      </td>
                      <td className="p-4 text-slate-500 font-mono text-xs">
                        {formatTime(scan.created_at)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                scan.risk_score > 60 ? 'bg-cyber-red' : scan.risk_score > 30 ? 'bg-cyber-yellow' : 'bg-cyber-green'
                              }`}
                              style={{ width: `${scan.risk_score}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs text-slate-400">{scan.risk_score}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {statusBadge}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={() => onSelectScan(scan)}
                          className="px-3 py-1 bg-slate-800 hover:bg-cyber-blue hover:text-black hover:shadow-neon-blue text-slate-300 font-mono text-xs rounded transition-all duration-300 border border-slate-700 hover:border-cyber-blue"
                        >
                          INVESTIGATE
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
