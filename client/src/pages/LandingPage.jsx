import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Globe, Layers, Cpu, Users } from 'lucide-react';
import { Button } from '../components/ui';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-primary/30 selection:text-primary-foreground">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] animate-pulse-slow delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/10 rounded-full blur-[128px]"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <span className="text-white font-bold">S</span>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                SyncSpace
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" size="sm" className="shadow-lg shadow-primary/25">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 lg:pt-32 lg:pb-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up">
                        <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                        <span className="text-sm font-medium text-gray-300">v2.0 is now live</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 animate-fade-in-up delay-100">
                        Collaborate in the <br />
                        <span className="text-primary">Future of Work</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 animate-fade-in-up delay-200">
                        Experience seamless project management with AI-driven insights, real-time collaboration, and a workspace designed for high-performance teams.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                        <Link to="/register">
                            <Button size="lg" className="w-full sm:w-auto min-w-[160px] shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                                Start for Free <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link to="/demo">
                            <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[160px] bg-white/5 border-white/10 hover:bg-white/10">
                                Watch Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Hero Image / Dashboard Preview */}
                    <div className="mt-20 relative mx-auto max-w-5xl animate-fade-in-up delay-500">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30"></div>
                        <div className="relative rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            <img
                                src="/dashboard-preview.png"
                                alt="SyncSpace Dashboard"
                                className="w-full rounded-2xl opacity-90"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/1200x800/1e293b/white?text=Dashboard+Preview';
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 py-24 bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to ship faster</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Powerful features integrated into a unified platform. Stop switching between apps and start getting work done.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="h-6 w-6 text-yellow-400" />}
                            title="Lightning Fast"
                            description="Built on modern tech stack for instant interactions and zero lag."
                        />
                        <FeatureCard
                            icon={<Users className="h-6 w-6 text-primary" />}
                            title="Real-time Collaboration"
                            description="Work together with your team in real-time with live cursors and updates."
                        />
                        <FeatureCard
                            icon={<Shield className="h-6 w-6 text-green-400" />}
                            title="Enterprise Security"
                            description="Bank-grade encryption and advanced permission controls for your data."
                        />
                        <FeatureCard
                            icon={<Layers className="h-6 w-6 text-purple-400" />}
                            title="Seamless Integration"
                            description="Connect with your favorite tools and automate your workflow."
                        />
                        <FeatureCard
                            icon={<Cpu className="h-6 w-6 text-blue-400" />}
                            title="AI Powered"
                            description="Smart suggestions and automated task management to boost productivity."
                        />
                        <FeatureCard
                            icon={<Globe className="h-6 w-6 text-pink-400" />}
                            title="Global Infrastructure"
                            description="Deployed on edge networks for low latency access from anywhere."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-12 overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-3xl"></div>

                        <h2 className="relative text-3xl md:text-4xl font-bold mb-6">
                            Ready to transform your workflow?
                        </h2>
                        <p className="relative text-gray-400 mb-8 max-w-xl mx-auto">
                            Join thousands of teams who have switched to SyncSpace for a better, faster, and more collaborative workspace.
                        </p>
                        <Link to="/register" className="relative inline-block">
                            <Button size="lg" className="shadow-xl shadow-primary/20 hover:shadow-primary/40">
                                Get Started Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-12 bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-white text-xs font-bold">S</span>
                        </div>
                        <span className="font-semibold text-gray-300">SyncSpace</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        © 2024 SyncSpace Inc. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
        <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed">
            {description}
        </p>
    </div>
);

export default LandingPage;
