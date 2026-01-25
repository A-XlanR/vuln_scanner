import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, UserPlus } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await register(email, password);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Email might be taken.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[100px]" />
                <div className="absolute top-0 left-0 w-[50%] h-[50%] rounded-full bg-slate-900/40 blur-[100px]" />
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10 p-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/40 mb-6 shadow-2xl border border-white/10 backdrop-blur-xl">
                        <UserPlus className="w-8 h-8 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">
                        Create Account
                    </h2>
                    <p className="text-slate-400">
                        Join CyberSentinel today
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center">
                                <p className="text-red-400 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-inner"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-inner"
                                        placeholder="Min 8 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-black bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5"
                        >
                            Sign Up
                        </button>

                        <p className="text-center text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
