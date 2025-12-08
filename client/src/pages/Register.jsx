import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { Input, Button } from '../components/ui';
import Logo from '../components/Logo';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    // Password strength calculation
    const passwordStrength = useMemo(() => {
        if (!password) return { level: 'none', score: 0, label: '' };

        let score = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };

        if (checks.length) score += 20;
        if (checks.uppercase) score += 20;
        if (checks.lowercase) score += 20;
        if (checks.number) score += 20;
        if (checks.special) score += 20;

        let level = 'weak';
        let label = 'Weak';
        let color = 'text-red-400';
        let barColor = 'bg-red-500';

        if (score >= 80) {
            level = 'strong';
            label = 'Strong';
            color = 'text-green-400';
            barColor = 'bg-green-500';
        } else if (score >= 60) {
            level = 'medium';
            label = 'Medium';
            color = 'text-yellow-400';
            barColor = 'bg-yellow-500';
        }

        return { level, score, label, color, barColor, checks };
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (passwordStrength.score < 60) {
            setError('Please use a stronger password');
            return;
        }

        setLoading(true);
        try {
            await register(name, email, password);
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
                className="w-full max-w-md relative z-10 px-4 py-8"
            >
                <div className="mb-8 text-center">
                    <Link to="/" className="inline-block mb-6 hover:scale-105 transition-transform duration-300">
                        <Logo className="h-12 w-12 mx-auto" />
                    </Link>
                    <h2 className="text-3xl font-bold font-display mb-2">Create Account</h2>
                    <p className="text-gray-400">Join the future of collaboration today.</p>
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

                    <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                        <div className="group/input">
                            <Input
                                type="text"
                                label="Full Name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={<User className="h-5 w-5 group-focus-within/input:text-cyan-400 transition-colors" />}
                                required
                                variant="glass"
                            />
                        </div>

                        <div className="group/input">
                            <Input
                                type="email"
                                label="Email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="h-5 w-5 group-focus-within/input:text-cyan-400 transition-colors" />}
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
                                required
                                variant="glass"
                            />

                            {/* Futuristic Password Strength */}
                            {password && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3 space-y-2"
                                >
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400">Security Level</span>
                                        <span className={`font-bold ${passwordStrength.color}`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${passwordStrength.score}%` }}
                                            className={`h-full ${passwordStrength.barColor} shadow-[0_0_10px_currentColor]`}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        {Object.entries(passwordStrength.checks).map(([key, valid]) => (
                                            <div key={key} className={`flex items-center gap-1.5 text-[10px] ${valid ? 'text-green-400' : 'text-gray-600'}`}>
                                                {valid ? <Check className="h-3 w-3" /> : <div className="h-1.5 w-1.5 rounded-full bg-gray-700" />}
                                                <span className="capitalize">{key}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="group/input">
                            <Input
                                type="password"
                                label="Confirm Password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                icon={<Lock className="h-5 w-5 group-focus-within/input:text-cyan-400 transition-colors" />}
                                error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
                                required
                                variant="glass"
                            />
                        </div>

                        <div className="flex items-center pt-2">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500/20 focus:ring-offset-0 transition-all"
                                />
                                <span className="ml-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                    I agree to the <a href="#" className="text-cyan-400 hover:underline">Terms</a> & <a href="#" className="text-cyan-400 hover:underline">Privacy</a>
                                </span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            loading={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] border-none text-lg font-bold tracking-wide"
                        >
                            Create Account <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </form>

                    <div className="mt-8 text-center relative z-10">
                        <p className="text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
