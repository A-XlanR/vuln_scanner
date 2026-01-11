import React, { useState, useEffect } from 'react';
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
        // Poll for updates if running? For now just once.
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-400 animate-pulse">Loading analysis...</div>;
    if (!scan) return <div className="p-8 text-center text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">Scan not found</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">Security Report</h1>
                        <p className="text-sm text-slate-500 mt-1">Scan ID: #{scan.id}</p>
                    </div>
                </div>
                <span className={`px-4 py-1.5 rounded-lg text-sm font-bold border tracking-wide
                    ${scan.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                        scan.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {scan.status.toUpperCase()}
                </span>
            </div>

            {/* Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <dt className="text-sm font-semibold text-slate-500">Target URL</dt>
                    <dd className="mt-2 text-lg font-bold text-blue-600 truncate" title={scan.target_url}>
                        {scan.target_url}
                    </dd>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <dt className="text-sm font-semibold text-slate-500">Vulnerabilities Detected</dt>
                    <dd className="mt-2 text-2xl font-bold text-slate-900">
                        {scan.results ? scan.results.length : 0}
                    </dd>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <dt className="text-sm font-semibold text-slate-500">Scan Date</dt>
                    <dd className="mt-2 text-lg font-bold text-slate-900">
                        {new Date(scan.created_at).toLocaleDateString()}
                    </dd>
                </div>
            </div>

            {/* Findings */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 px-2">Detailed Findings</h3>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    {scan.results.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
                                <AlertTriangle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No Vulnerabilities Found!</h3>
                            <p className="text-slate-500 mt-2">The scan completed without detecting any issues.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {scan.results.map((res, idx) => (
                                <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 flex-shrink-0 p-2 rounded-lg
                                            ${res.severity === 'HIGH' || res.severity === 'CRITICAL' ? 'bg-red-50 text-red-600' :
                                                res.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                            <AlertTriangle className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-4">
                                                <h4 className="text-lg font-bold text-slate-900 leading-tight">{res.vulnerability_type}</h4>
                                                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider
                                                    ${res.severity === 'HIGH' || res.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                        res.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                                    {res.severity}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-slate-600 leading-relaxed">{res.description}</p>
                                            {res.details && (
                                                <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200 overflow-x-auto">
                                                    <pre className="text-xs text-slate-700 font-mono whitespace-pre-wrap">
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
