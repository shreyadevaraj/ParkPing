import { ArrowRight, Shield, MessageSquare, Zap, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="text-2xl font-bold tracking-tighter cursor-pointer hover:opacity-80 transition-opacity">
                        ParkPing
                    </div>
                    <div className="space-x-4 flex items-center">
                        <Link to="/login" className="hidden md:inline-block">
                            <Button variant="secondary" className="px-5 py-2.5 text-sm">Login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="px-5 py-2.5 text-sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto text-center relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gray-50 rounded-full blur-3xl -z-10 opacity-60"></div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-sm font-medium text-gray-600 mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live in Beta 1.0
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9] text-black">
                        A polite ping to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-black to-gray-500">
                            clear your way.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                        The privacy-first notification system. vehicle owners get pinged instantly without sharing phone numbers.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <Link to="/login">
                            <Button className="px-10 py-4 text-lg hover:scale-105">
                                Get Your QR Code <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>

                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 bg-gray-50 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why ParkPing?</h2>
                            <p className="text-gray-500 max-w-xl mx-auto">Designed for privacy conscious communities and modern parking management.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <Feature
                                icon={<Shield className="w-6 h-6" />}
                                title="100% Private"
                                desc="Your phone number is masked. We bridge the connection securely without exposing personal data."
                            />
                            <Feature
                                icon={<Zap className="w-6 h-6" />}
                                title="Instant Alerts"
                                desc="Notifications are delivered instantly via SMS or mock-call API. No latency."
                            />
                            <Feature
                                icon={<Smartphone className="w-6 h-6" />}
                                title="Zero Spam"
                                desc="Built-in rate limiting ensures you only get notified when it matters. No abuse allowed."
                            />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 border-t border-gray-200 text-center text-gray-400 text-sm">
                    © 2026 ParkPing Inc. Built for the modern city.
                </footer>
            </main>
        </div>
    );
}

function Feature({ icon, title, desc }) {
    return (
        <div className="group p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="font-bold text-xl mb-3 tracking-tight">{title}</h3>
            <p className="text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}
