import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Zap, Users, FileText } from 'lucide-react';
import { Input, Button } from '../components/ui';
import Logo from '../components/Logo';

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
        <div className="min-h-screen flex bg-slate-900 text-white">
            {/* Left Side - Hero */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

                {/* Animated Glow Effects */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse-glow"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"></div>

                <div className="z-10 text-center px-12 max-w-lg">
                    <div className="flex justify-center mb-6 animate-slide-up">
                        <Logo showText={false} className="h-24 w-24" />
                    </div>
                    <h1 className="text-6xl font-bold mb-6 gradient-text-neon animate-slide-up">
                        SyncSpace
                    </h1>
                    <p className="text-2xl text-gray-300 mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        Where Teams Sync, Projects Thrive
                    </p>

                    {/* Feature Highlights */}
                    <div className="space-y-6 text-left">
                        <div className="flex items-start gap-4 glass-strong p-4 rounded-xl animate-slide-up" style={{ animationDelay: '200ms' }}>
                            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Real-time Collaboration</h3>
                                <p className="text-sm text-gray-400">Work together seamlessly with live updates</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 glass-strong p-4 rounded-xl animate-slide-up" style={{ animationDelay: '300ms' }}>
                            <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                <Users className="h-6 w-6 text-secondary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Team Management</h3>
                                <p className="text-sm text-gray-400">Organize projects with powerful Kanban boards</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 glass-strong p-4 rounded-xl animate-slide-up" style={{ animationDelay: '400ms' }}>
                            <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Document Editing</h3>
                                <p className="text-sm text-gray-400">Collaborate on docs in real-time</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full space-y-8 animate-fade-in">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                        <p className="mt-2 text-gray-400">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="bg-danger/10 border border-danger/50 text-danger p-3 rounded-lg text-sm animate-slide-down">
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input
                                type="email"
                                label="Email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="h-5 w-5" />}
                                required
                            />

                            <Input
                                type="password"
                                label="Password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock className="h-5 w-5" />}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-slate-700 rounded bg-slate-800 cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400 cursor-pointer">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="w-full"
                        >
                            Sign in
                        </Button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
