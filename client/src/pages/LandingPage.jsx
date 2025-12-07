import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowRight, Zap, Shield, Globe, Layers, Cpu, Users, Code, Activity, BarChart3, Lock, Sparkles } from 'lucide-react';
import { Button } from '../components/ui';
import Logo from '../components/Logo';

const LandingPage = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-100 font-sans">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow animation-delay-1000"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            </div>

            <FloatingNav />

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 px-4">
                <div className="max-w-7xl mx-auto text-center relative">
                    {/* Floating HUD Elements - Left */}
                    <motion.div style={{ y: y1, opacity }} className="absolute -left-12 top-20 hidden lg:block">
                        <GlassCard className="p-4 flex items-center gap-3 w-48">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                <Code size={20} />
                            </div>
                            <div className="text-left">
                                <div className="text-xs text-gray-400">System Status</div>
                                <div className="text-sm font-bold text-green-400">All Systems Go</div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Floating HUD Elements - Right */}
                    <motion.div style={{ y: y2, opacity }} className="absolute -right-12 top-40 hidden lg:block">
                        <GlassCard className="p-4 w-56">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-400">Active Users</span>
                                <span className="text-xs font-bold text-cyan-400">+24%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "75%" }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                                />
                            </div>
                        </GlassCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="text-sm font-medium text-cyan-100 tracking-wide">SYNCSPACE v2.0 IS LIVE</span>
                    </motion.div>

                    <div className="mb-8 min-h-[120px] flex flex-col items-center justify-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-6xl md:text-8xl font-bold tracking-tight font-display text-white"
                        >
                            Collaborate in the <br />
                            <div className="relative inline-block mt-2">
                                <motion.span
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent overflow-hidden whitespace-nowrap pb-4"
                                >
                                    Future of Work
                                </motion.span>
                                <span className="opacity-0 pb-4">Future of Work</span>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                    className="absolute right-[-4px] top-0 bottom-4 w-[4px] bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                                />
                            </div>
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed"
                    >
                        Experience seamless project management with AI-driven insights, real-time collaboration, and a workspace designed for high-performance teams.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link to="/register">
                            <Button size="lg" className="w-full sm:w-auto min-w-[180px] text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)]">
                                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <a href="#features" className="w-full sm:w-auto">
                            <Button variant="secondary" size="lg" className="w-full min-w-[180px] text-lg border-white/10 hover:border-cyan-500/50">
                                Explore Features
                            </Button>
                        </a>
                    </motion.div>

                    {/* 3D Dashboard Preview */}
                    <div className="mt-24 relative mx-auto max-w-6xl perspective-1000">
                        <motion.div
                            initial={{ rotateX: 20, opacity: 0, scale: 0.9 }}
                            animate={{ rotateX: 0, opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                            className="relative z-10"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20 animate-pulse-slow"></div>
                            <div className="relative rounded-xl border border-white/10 bg-slate-900/90 backdrop-blur-xl overflow-hidden shadow-2xl">
                                <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                    </div>
                                    <div className="flex-1 text-center">
                                        <div className="inline-block px-4 py-1 rounded-full bg-black/40 text-[10px] text-gray-400 font-mono border border-white/5">
                                            syncspace.app/dashboard
                                        </div>
                                    </div>
                                </div>
                                <div className="aspect-[16/9] bg-slate-900/50 p-8 grid grid-cols-12 gap-6">
                                    {/* Mock UI Elements */}
                                    <div className="col-span-3 space-y-4">
                                        <div className="h-8 w-3/4 bg-white/10 rounded animate-pulse"></div>
                                        <div className="space-y-2">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="h-10 w-full bg-white/5 rounded border border-white/5"></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-9 space-y-6">
                                        <div className="flex justify-between">
                                            <div className="h-10 w-1/3 bg-white/10 rounded"></div>
                                            <div className="flex gap-2">
                                                <div className="h-10 w-10 bg-cyan-500/20 rounded-full"></div>
                                                <div className="h-10 w-10 bg-purple-500/20 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-32 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/5 p-4">
                                                    <div className="h-8 w-8 bg-white/10 rounded-full mb-4"></div>
                                                    <div className="h-4 w-1/2 bg-white/10 rounded"></div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-48 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden">
                                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/10 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-6 pb-4 gap-2 h-full">
                                                {[40, 70, 45, 90, 60, 75, 50, 80, 65, 85].map((h, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ height: 0 }}
                                                        whileInView={{ height: `${h}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                        className="w-full bg-cyan-500/30 rounded-t-sm hover:bg-cyan-400/50 transition-colors"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Spotlight Features Section */}
            <section className="relative z-10 py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold mb-6 font-display"
                        >
                            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Velocity</span>
                        </motion.h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Every interaction is designed to be instantaneous. No loading spinners, no waiting. Just pure flow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SpotlightCard
                            icon={<Zap className="text-yellow-400" />}
                            title="Lightning Fast"
                            description="Built on the edge with zero-latency synchronization. Your data is everywhere, instantly."
                        />
                        <SpotlightCard
                            icon={<Users className="text-cyan-400" />}
                            title="Real-time Presence"
                            description="See who's working on what with live cursors and instant state updates."
                        />
                        <SpotlightCard
                            icon={<Shield className="text-green-400" />}
                            title="Military-Grade Security"
                            description="End-to-end encryption ensures your intellectual property remains yours alone."
                        />
                        <SpotlightCard
                            icon={<Code className="text-purple-400" />}
                            title="Developer API"
                            description="Extensible by design. Build custom workflows and integrations with our robust API."
                        />
                        <SpotlightCard
                            icon={<Cpu className="text-blue-400" />}
                            title="AI Copilot"
                            description="Smart suggestions and automated task management powered by advanced LLMs."
                        />
                        <SpotlightCard
                            icon={<Globe className="text-pink-400" />}
                            title="Global Edge Network"
                            description="Deployed across 35+ regions for sub-50ms latency worldwide."
                        />
                    </div>
                </div>
            </section>

            {/* Holographic CTA Section */}
            <section className="relative z-10 py-32 overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-2xl p-16 overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <h2 className="relative text-4xl md:text-6xl font-bold mb-8 font-display text-white">
                            Ready to <span className="text-cyan-400">Sync</span>?
                        </h2>
                        <p className="relative text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Join the workspace of the future. No credit card required for the starter plan.
                        </p>

                        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register">
                                <Button size="lg" className="min-w-[200px] text-lg shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)]">
                                    Get Started Now
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Minimalist Footer */}
            <footer className="relative z-10 border-t border-white/5 py-12 bg-slate-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Logo />
                    </div>
                    <div className="flex gap-8 text-sm text-gray-400">
                        <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a>
                    </div>
                    <div className="text-sm text-gray-500">
                        © 2024 SyncSpace Inc.
                    </div>
                </div>
                {/* Watermark */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[20vw] font-bold text-white/[0.02] pointer-events-none select-none whitespace-nowrap overflow-hidden">
                    SYNCSPACE
                </div>
            </footer>
        </div>
    );
};

// --- Subcomponents ---

const FloatingNav = () => {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        return scrollY.onChange((latest) => {
            const direction = latest > lastScrollY.current ? "down" : "up";
            if (latest < 100) {
                setVisible(true);
            } else {
                setVisible(direction === "up");
            }
            lastScrollY.current = latest;
        });
    }, [scrollY]);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: visible ? 0 : -100 }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl"
        >
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl shadow-black/50">
                <Logo />
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    <a href="#about" className="hover:text-white transition-colors">About</a>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block">
                        Sign In
                    </Link>
                    <Link to="/register">
                        <Button size="sm" className="rounded-full px-6 shadow-none border border-white/10 bg-white/5 hover:bg-white/10">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};

const GlassCard = ({ children, className = "" }) => (
    <div className={`bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl ${className}`}>
        {children}
    </div>
);

const SpotlightCard = ({ icon, title, description }) => {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const position = { x: 0, y: 0 };
    const opacity = 0; // Handled by CSS/Motion for simplicity or useMotionTemplate

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        divRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        divRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative group rounded-2xl border border-white/10 bg-slate-900/50 overflow-hidden"
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(6,182,212,0.15), transparent 40%)`
                }}
            />
            <div className="relative p-8 h-full flex flex-col">
                <div className="mb-4 p-3 rounded-xl bg-white/5 w-fit border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                    {icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white font-display group-hover:text-cyan-400 transition-colors">{title}</h3>
                <p className="text-gray-400 leading-relaxed flex-grow">
                    {description}
                </p>
            </div>
        </motion.div>
    );
};

export default LandingPage;
