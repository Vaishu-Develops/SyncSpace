import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Input, Button } from '../components/ui';
import Logo from '../components/Logo';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow animation-delay-1000"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-20"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10 px-4"
            >
                <div className="mb-8 text-center">
                    <Link to="/" className="inline-block mb-6 hover:scale-105 transition-transform duration-300">
                        <Logo className="h-12 w-12 mx-auto" />
                    </Link>
                    <h2 className="text-3xl font-bold font-display mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Enter your credentials to access your workspace.</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 flex items-center gap-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            {error}
                        </motion.div>
                    )}

                    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="group/input">
                                <Input
                                    type="email"
                                    label="Email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<Mail className="h-5 w-5 group-focus-within/input:text-cyan-400 transition-colors" />}
                                    autoComplete="email"
                                    required
                                    variant="glass"
                                />
                            </div>

                            <div className="group/input">
                                <Input
                                    type="password"
                                    label="Password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={<Lock className="h-5 w-5 group-focus-within/input:text-cyan-400 transition-colors" />}
                                    autoComplete="current-password"
                                    required
                                    variant="glass"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500/20 focus:ring-offset-0 transition-all"
                                />
                                <span className="ml-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                            </label>

                            <a href="#" className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            loading={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] border-none text-lg font-bold tracking-wide"
                        >
                            Sign In <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </form>

                    <div className="mt-8 text-center relative z-10">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
