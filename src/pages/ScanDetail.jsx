import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const ScanDetail = () => {
    const { id } = useParams();
    const [scan, setScan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScan = async () => {
            try {
                const res = await api.get(`/scans/${id}`);
                setScan(res.data);
            } catch (err) {
                console.error("Failed to fetch scan details");
            } finally {
                setLoading(false);
            }
        };
        fetchScan();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-emerald-500 animate-pulse font-mono uppercase tracking-[0.2em]">Executing Data Recovery...</div>;
    if (!scan) return <div className="p-8 text-center text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">Data Packet Corrupted</div>;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link to="/" className="p-3 rounded-xl text-slate-400 hover:text-emerald-400 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/50 transition-all duration-300">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Technical Audit</h1>
                        <p className="text-sm font-mono text-emerald-500/70 mt-1">LOG_ID: {scan.id}</p>
                    </div>
                </div>
                <span className={`px-6 py-2 rounded-full text-xs font-black border tracking-[0.2em] uppercase
                    ${scan.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        scan.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                    {scan.status}
                </span>
            </div>

            {/* Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
                    <dt className="text-xs font-black text-slate-500 uppercase tracking-tighter">Target Destination</dt>
                    <dd className="mt-4 text-lg font-bold text-emerald-400 truncate break-all" title={scan.target_url}>
                        {scan.target_url}
                    </dd>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
                    <dt className="text-xs font-black text-slate-500 uppercase tracking-tighter">Anomalies Detected</dt>
                    <dd className="mt-4 text-3xl font-black text-white">
                        {scan.results ? scan.results.length : 0}
                    </dd>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
                    <dt className="text-xs font-black text-slate-500 uppercase tracking-tighter">Timestamp</dt>
                    <dd className="mt-4 text-lg font-bold text-slate-300">
                        {new Date(scan.created_at).toLocaleDateString()}
                    </dd>
                </div>
            </div>

            {/* Findings */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white px-4 tracking-tight">Vulnerability Database</h3>
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                    {scan.results.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 animate-pulse">
                                <AlertTriangle className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Security Integrity Verified</h3>
                            <p className="text-slate-500 mt-2 max-w-sm mx-auto">No known vulnerabilities detected in the passive analysis sweep.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {scan.results.map((res, idx) => (
                                <div key={idx} className="p-8 hover:bg-emerald-500/[0.03] transition-all duration-300">
                                    <div className="flex items-start gap-6">
                                        <div className={`mt-1 flex-shrink-0 p-3 rounded-2xl border
                                            ${res.severity === 'HIGH' || res.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                res.severity === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                            <AlertTriangle className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-4 mb-3">
                                                <h4 className="text-xl font-bold text-white leading-tight">{res.vulnerability_type}</h4>
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] border
                                                    ${res.severity === 'HIGH' || res.severity === 'CRITICAL' ? 'bg-red-500 text-black border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' :
                                                        res.severity === 'MEDIUM' ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' :
                                                            res.severity === 'LOW' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' :
                                                                'bg-slate-700 text-white border-slate-600'}`}>
                                                    {res.severity}
                                                </span>
                                            </div>
                                            <p className="text-slate-400 leading-relaxed text-base">{res.description}</p>
                                            {res.details && (
                                                <div className="mt-6 bg-black/60 rounded-2xl p-6 border border-white/5 font-mono">
                                                    <div className="flex items-center gap-2 mb-3 text-slate-500 text-xs font-black uppercase tracking-widest">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                        Technical Details
                                                    </div>
                                                    <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                                                        {res.details}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScanDetail;
