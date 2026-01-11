import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, RefreshCcw } from 'lucide-react';

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
            <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 shadow-md">
                <div className="relative z-10 md:flex md:items-center md:justify-between gap-8">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">New Security Scan</h2>
                        <p className="text-slate-500 max-w-md">
                            Enter a target URL below to instantly analyze its security posture and detect vulnerabilities.
                        </p>
                    </div>

                    <form onSubmit={handleScan} className="flex-1 max-w-xl md:ml-auto flex gap-3">
                        <div className="relative flex-grow group">
                            <input
                                type="url"
                                required
                                placeholder="https://example.com"
                                className="block w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-6 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5 whitespace-nowrap"
                        >
                            {loading ? (
                                'Starting...'
                            ) : (
                                <>
                                    <Plus className="h-5 w-5 mr-2" />
                                    Start Scan
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Recent Scans List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold text-slate-900">Recent Scans</h3>
                    <button
                        onClick={fetchScans}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Refresh List"
                    >
                        <RefreshCcw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <ul className="divide-y divide-slate-100">
                        {scans.length === 0 ? (
                            <li className="px-6 py-12 text-center">
                                <p className="text-slate-400 text-lg">No scans found yet</p>
                                <p className="text-slate-500 text-sm mt-1">Start a new scan above to get started</p>
                            </li>
                        ) : (
                            scans.map((scan) => (
                                <li key={scan.id} className="group">
                                    <Link to={`/scans/${scan.id}`} className="block hover:bg-slate-50 transition-colors">
                                        <div className="px-6 py-5 flex items-center justify-between">
                                            <div className="min-w-0">
                                                <p className="text-base font-bold text-blue-600 group-hover:text-blue-700 truncate transition-colors">
                                                    {scan.target_url}
                                                </p>
                                                <p className="text-sm text-slate-500 mt-1 flex items-center">
                                                    Started on {new Date(scan.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center pl-4">
                                                <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-lg border 
                                            ${scan.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        scan.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                                                            'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                    {scan.status.toUpperCase()}
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
