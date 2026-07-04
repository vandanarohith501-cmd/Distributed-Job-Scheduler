import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Activity, Settings, Server, Play, Pause, RefreshCw, 
  Plus, CheckCircle, XCircle, Clock, Zap, Database
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [queues, setQueues] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const [metricsRes, queuesRes, jobsRes, workersRes] = await Promise.all([
        fetch('/api/metrics/'),
        fetch('/api/queues/'),
        fetch('/api/jobs/'),
        fetch('/api/workers/')
      ]);
      
      const metricsData = await metricsRes.json();
      setMetrics(metricsData);
      
      // Update chart history
      setChartData(prev => {
        const newData = [...prev, { 
          time: new Date().toLocaleTimeString().split(' ')[0], 
          running: metricsData.jobs.running,
          queued: metricsData.jobs.queued 
        }];
        return newData.slice(-15); // Keep last 15 ticks
      });

      const queuesData = await queuesRes.json();
      setQueues(queuesData.queues || []);

      const jobsData = await jobsRes.json();
      setJobs(jobsData.jobs || []);

      const workersData = await workersRes.json();
      setWorkers(workersData.workers || []);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRetryJob = async (jobId) => {
    toast.promise(
      fetch(`/api/jobs/${jobId}/retry/`, { method: 'POST' }),
      {
        loading: 'Retrying job...',
        success: 'Job sent back to queue!',
        error: 'Failed to retry job.',
      }
    );
    fetchData();
  };

  const handleToggleQueue = async (queue) => {
    const action = queue.is_paused ? 'Resumed' : 'Paused';
    toast.promise(
      fetch(`/api/queues/${queue.id}/toggle/`, { method: 'POST' }),
      {
        loading: `${queue.is_paused ? 'Resuming' : 'Pausing'} queue...`,
        success: `Queue ${action} successfully!`,
        error: `Failed to toggle queue.`,
      }
    );
    fetchData();
  };

  const handleCreateJob = async () => {
    const queue = queues[0];
    if (!queue) {
        toast.error("No active queues available!");
        return;
    }
    const jobNames = ["Process Video", "Generate Report", "Sync Database", "Send Emails", "Resize Images"];
    const randomName = jobNames[Math.floor(Math.random() * jobNames.length)];
    
    toast.promise(
      fetch('/api/jobs/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: randomName, queue_id: queue.id, payload: {} })
      }),
      {
        loading: 'Dispatching job...',
        success: 'New Job Dispatched!',
        error: 'Failed to create job.',
      }
    );
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 text-slate-200 font-sans selection:bg-indigo-500/30">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1E293B', color: '#fff', border: '1px solid #334155' } }} />
      
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Nexus Scheduler
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateJob}
          className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Dispatch Job
        </motion.button>
      </header>
      
      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <MetricCard icon={<Clock className="text-blue-400" />} title="Queued" value={metrics.jobs.queued} color="blue" />
          <MetricCard icon={<Zap className="text-amber-400" />} title="Running" value={metrics.jobs.running} color="amber" />
          <MetricCard icon={<CheckCircle className="text-emerald-400" />} title="Completed" value={metrics.jobs.completed} color="emerald" />
          <MetricCard icon={<XCircle className="text-rose-400" />} title="Failed" value={metrics.jobs.failed} color="rose" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Real-time Chart */}
          <section className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-indigo-400" />
              Throughput Overview
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRunning" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorQueued" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="queued" stroke="#3b82f6" fillOpacity={1} fill="url(#colorQueued)" strokeWidth={2} />
                  <Area type="monotone" dataKey="running" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRunning)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Job Executions Table */}
          <section className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                <Database className="w-5 h-5 text-indigo-400" />
                Recent Executions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="pb-4 pr-4">Job ID</th>
                    <th className="pb-4 pr-4">Task</th>
                    <th className="pb-4 pr-4">Queue</th>
                    <th className="pb-4 pr-4">Status</th>
                    <th className="pb-4 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {jobs.length === 0 && (
                    <tr><td colSpan="5" className="py-8 text-center text-slate-500 italic">No jobs found in the system.</td></tr>
                  )}
                  <AnimatePresence>
                    {jobs.map(j => (
                      <motion.tr 
                        key={j.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="py-4 pr-4 font-mono text-xs text-slate-500">{j.id.slice(0,8)}</td>
                        <td className="py-4 pr-4 text-slate-300 font-medium">{j.name}</td>
                        <td className="py-4 pr-4">
                          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 text-xs border border-slate-700">
                            {j.queue__name}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <StatusBadge state={j.state} />
                        </td>
                        <td className="py-4 pr-4 text-right">
                          {j.state === 'failed' && (
                             <button 
                               onClick={() => handleRetryJob(j.id)} 
                               className="opacity-0 group-hover:opacity-100 p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-all"
                               title="Retry Job"
                             >
                               <RefreshCw className="w-4 h-4" />
                             </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8">
          
          {/* Workers */}
          <section className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
              <Server className="w-5 h-5 text-indigo-400" />
              Active Workers
            </h2>
            <div className="flex flex-col gap-3">
              {workers.length === 0 && <p className="text-slate-500 text-sm italic">No worker nodes connected.</p>}
              {workers.map(w => (
                <div key={w.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-2.5 h-2.5 rounded-full ${w.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                      {w.is_active && <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-50"></div>}
                    </div>
                    <div>
                      <p className="font-mono text-sm text-slate-200">{w.hostname}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">Ping: {new Date(w.heartbeat__last_seen).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded-md text-slate-400 border border-slate-800">
                    {w.id.slice(0,4)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Queues */}
          <section className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
              <Settings className="w-5 h-5 text-indigo-400" />
              Queue Management
            </h2>
            <div className="flex flex-col gap-3">
              {queues.length === 0 && <p className="text-slate-500 text-sm italic">No queues found.</p>}
              {queues.map(q => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 relative overflow-hidden">
                  {q.is_paused && <div className="absolute inset-0 bg-rose-500/5 backdrop-blur-[1px] z-0 pointer-events-none"></div>}
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-slate-200">{q.name}</span>
                      <button 
                        onClick={() => handleToggleQueue(q)} 
                        className={`p-1.5 rounded-lg transition-colors ${
                          q.is_paused 
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                        }`}
                        title={q.is_paused ? 'Resume Queue' : 'Pause Queue'}
                      >
                        {q.is_paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex gap-4 text-xs font-medium">
                      <span className="bg-slate-900 px-2 py-1 rounded text-slate-400">Priority: {q.priority}</span>
                      <span className="bg-slate-900 px-2 py-1 rounded text-slate-400">Workers: {q.concurrency_limit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }) {
  const colorMap = {
    blue: 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] bg-blue-500/5',
    amber: 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-amber-500/5',
    emerald: 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-emerald-500/5',
    rose: 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)] bg-rose-500/5',
  };

  return (
    <div className={`p-5 rounded-2xl border ${colorMap[color]} backdrop-blur-md relative overflow-hidden`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-slate-900/50">
          {icon}
        </div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
      </div>
      <p className="text-3xl font-black text-white pl-1">{value}</p>
    </div>
  );
}

function StatusBadge({ state }) {
  const styles = {
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    running: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)] animate-pulse',
    failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]',
    queued: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${styles[state] || styles.queued}`}>
      {state}
    </span>
  );
}

export default App;