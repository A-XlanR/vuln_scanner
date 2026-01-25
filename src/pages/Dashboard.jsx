import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, RefreshCcw, Shield } from 'lucide-react';

const Dashboard = () => {
    const [scans, setScans] = useState([]);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchScans = async () => {
        try {
            setRefreshing(true);
            const res = await api.get('/scans/');
            setScans(res.data);
        } catch (err) {
            console.error("Failed to fetch scans");
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchScans();
        const interval = setInterval(fetchScans, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleScan = async (e) => {
        e.preventDefault();
        if (!url) return;
        try {
            setLoading(true);
            await api.post('/scans/', { target_url: url });
            setUrl('');
            fetchScans();
        } catch (err) {
            alert("Failed to start scan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-10 shadow-3xl backdrop-blur-xl">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px]" />
                <div className="relative z-10 md:flex md:items-center md:justify-between gap-12">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-4xl font-extrabold text-white mb-3">Initiate Audit</h2>
                        <p className="text-slate-400 max-w-sm leading-relaxed">
                            Deploy our passive scanning engine to analyze headers, cookie flags, and metadata.
                        </p>
                    </div>

                    <form onSubmit={handleScan} className="flex-1 max-w-xl md:ml-auto flex gap-4">
                        <div className="relative flex-grow group">
                            <input
                                type="url"
                                required
                                placeholder="https://target-service.com"
                                className="block w-full pl-5 pr-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all hover:bg-black/60 shadow-inner"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-8 py-4 border border-transparent text-sm font-bold rounded-2xl text-black bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5 whitespace-nowrap"
                        >
                            {loading ? (
                                <RefreshCcw className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Plus className="h-5 w-5 mr-2" />
                                    Scan Target
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Recent Scans List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-2xl font-bold text-white tracking-tight">Audit History</h3>
                    <button
                        onClick={fetchScans}
                        className="p-3 text-slate-400 hover:text-emerald-400 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/50 rounded-xl transition-all duration-300"
                        title="Refresh Data"
                    >
                        <RefreshCcw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
                    <ul className="divide-y divide-white/5">
                        {scans.length === 0 ? (
                            <li className="px-6 py-16 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
                                    <Shield className="h-10 w-10 text-slate-600" />
                                </div>
                                <p className="text-slate-400 text-xl font-medium">No telemetry found</p>
                                <p className="text-slate-600 text-sm mt-2">Start your first scan to populate the dashboard.</p>
                            </li>
                        ) : (
                            scans.map((scan) => (
                                <li key={scan.id} className="group">
                                    <Link to={`/scans/${scan.id}`} className="block hover:bg-emerald-500/[0.03] transition-all duration-300">
                                        <div className="px-8 py-6 flex items-center justify-between">
                                            <div className="min-w-0">
                                                <p className="text-lg font-bold text-emerald-500 group-hover:text-emerald-400 truncate transition-colors">
                                                    {scan.target_url}
                                                </p>
                                                <p className="text-sm text-slate-500 mt-1 flex items-center font-medium">
                                                    <span className="w-2 h-2 rounded-full bg-slate-600 mr-2"></span>
                                                    {new Date(scan.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center pl-6">
                                                <span className={`px-4 py-1.5 inline-flex text-xs font-black rounded-full border tracking-widest uppercase
                                            ${scan.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        scan.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                            'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                    {scan.status}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
