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
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Start New Scan</h2>
                <form onSubmit={handleScan} className="flex gap-4">
                    <input
                        type="url"
                        required
                        placeholder="Enter target URL (e.g., https://example.com)"
                        className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Starting...' : <><Plus className="h-4 w-4 mr-2" /> Start Scan</>}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Scans</h3>
                    <button onClick={fetchScans} className="text-gray-500 hover:text-blue-600">
                        <RefreshCcw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                <ul className="divide-y divide-gray-200">
                    {scans.length === 0 ? (
                        <li className="px-6 py-4 text-gray-500 text-center">No scans found. Start one above!</li>
                    ) : (
                        scans.map((scan) => (
                            <li key={scan.id}>
                                <Link to={`/scans/${scan.id}`} className="block hover:bg-gray-50">
                                    <div className="px-6 py-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-600 truncate">{scan.target_url}</p>
                                            <p className="text-sm text-gray-500">Started: {new Date(scan.created_at).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${scan.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    scan.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
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
    );
};

export default Dashboard;
