import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut } from 'lucide-react';

const Layout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#050505] font-sans text-slate-100">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                                <div className="p-1.5 bg-emerald-600 rounded-lg shadow-[0_0_15px_rgba(5,150,105,0.4)] group-hover:bg-emerald-500 transition-all duration-300">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-bold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                                    CyberSentinel
                                </span>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="ml-4 inline-flex items-center px-4 py-2 border border-white/10 text-sm font-medium rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
