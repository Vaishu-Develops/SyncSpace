import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Check, X } from 'lucide-react';
import { Input, Button } from '../components/ui';
import Logo from '../components/Logo';

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
        let color = 'danger';

        if (score >= 80) {
            level = 'strong';
            label = 'Strong';
            color = 'success';
        } else if (score >= 60) {
            level = 'medium';
            label = 'Medium';
            color = 'warning';
        }

        return { level, score, label, color, checks };
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
        <div className="min-h-screen flex bg-slate-900 text-white">
            {/* Left Side - Hero */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

                {/* Animated Glow Effects */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-secondary/30 rounded-full blur-3xl animate-pulse-glow"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>

                <div className="z-10 text-center px-12">
                    <div className="flex justify-center mb-6 animate-slide-up">
                        <Logo showText={false} className="h-24 w-24" />
                    </div>
                    <h1 className="text-6xl font-bold mb-6 gradient-text-neon animate-slide-up">
                        SyncSpace
                    </h1>
                    <p className="text-2xl text-gray-300 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        Join the future of collaboration
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full space-y-8 animate-fade-in">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-white">Create an account</h2>
                        <p className="mt-2 text-gray-400">Start your journey with SyncSpace.</p>
                    </div>

                    {error && (
                        <div className="bg-danger/10 border border-danger/50 text-danger p-3 rounded-lg text-sm animate-slide-down">
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input
                                type="text"
                                label="Full Name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={<User className="h-5 w-5" />}
                                required
                            />

                            <Input
                                type="email"
                                label="Email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="h-5 w-5" />}
                                required
                            />

                            <div>
                                <Input
                                    type="password"
                                    label="Password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={<Lock className="h-5 w-5" />}
                                    required
                                />

                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="mt-2 space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-400">Password strength</span>
                                            <span className={`font-medium text-${passwordStrength.color}`}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${passwordStrength.color === 'success' ? 'bg-success' :
                                                    passwordStrength.color === 'warning' ? 'bg-warning' :
                                                        'bg-danger'
                                                    }`}
                                                style={{ width: `${passwordStrength.score}%` }}
                                            />
                                        </div>

                                        {/* Password Requirements */}
                                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                                            <div className={`flex items-center gap-1 ${passwordStrength.checks?.length ? 'text-success' : 'text-gray-500'}`}>
                                                {passwordStrength.checks?.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                                <span>8+ characters</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${passwordStrength.checks?.uppercase ? 'text-success' : 'text-gray-500'}`}>
                                                {passwordStrength.checks?.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                                <span>Uppercase</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${passwordStrength.checks?.lowercase ? 'text-success' : 'text-gray-500'}`}>
                                                {passwordStrength.checks?.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                                <span>Lowercase</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${passwordStrength.checks?.number ? 'text-success' : 'text-gray-500'}`}>
                                                {passwordStrength.checks?.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                                <span>Number</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Input
                                type="password"
                                label="Confirm Password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                icon={<Lock className="h-5 w-5" />}
                                error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-primary focus:ring-primary border-slate-700 rounded bg-slate-800 cursor-pointer"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-400 cursor-pointer">
                                I agree to the <a href="#" className="text-primary hover:underline">Terms</a> & <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="w-full"
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
