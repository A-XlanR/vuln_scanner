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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
    if (!scan) return <div className="p-8 text-center text-red-500">Scan not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Link to="/" className="text-gray-500 hover:text-gray-700 mr-4">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Scan Report</h1>
            </div>

            {/* Overview */}
            <div className="bg-white shadow rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <dt className="text-sm font-medium text-gray-500">Target URL</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{scan.target_url}</dd>
                </div>
                <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${scan.status === 'completed' ? 'bg-green-100 text-green-800' :
                                scan.status === 'failed' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'}`}>
                            {scan.status.toUpperCase()}
                        </span>
                    </dd>
                </div>
                <div>
                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{new Date(scan.created_at).toLocaleString()}</dd>
                </div>
            </div>

            {/* Findings */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Vulnerabilities Found</h3>
                </div>
                {scan.results.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        {scan.status === 'completed' ? "No vulnerabilities found! 🎉" : "Scan in progress or failed."}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {scan.results.map((res, idx) => (
                            <div key={idx} className="p-6 hover:bg-gray-50">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <AlertTriangle className={`h-6 w-6 
                                            ${res.severity === 'HIGH' || res.severity === 'CRITICAL' ? 'text-red-500' :
                                                res.severity === 'MEDIUM' ? 'text-yellow-500' : 'text-blue-500'}`} />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-lg font-bold text-gray-900">{res.vulnerability_type}</h4>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold
                                                ${res.severity === 'HIGH' || res.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                                                    res.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {res.severity}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-gray-600">{res.description}</p>
                                        {res.details && (
                                            <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-3 rounded">
                                                {res.details}
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
    );
};

export default ScanDetail;
