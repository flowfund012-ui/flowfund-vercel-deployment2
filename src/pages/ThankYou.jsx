import React, { useState, useEffect } from 'react';
import { CheckCircle, Gauge, FileText, LineChart, Sprout, Coins, Rocket, Lightbulb, Bookmark, Mail, HelpCircle, ArrowRight, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
    const [memberSinceDate, setMemberSinceDate] = useState('');
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        setMemberSinceDate(today.toLocaleDateString('en-US', options));
    }, []);

    const handleDownload = (e) => {
        e.preventDefault();
        setDownloading(true);
        setTimeout(() => {
            // In a real scenario, this would trigger the actual download
            setDownloading(false);
        }, 3500);
    };

    return (
        <div className="min-h-screen font-inter bg-royal text-e2e8f0 overflow-x-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] to-[#001f3f] opacity-100"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gold/20 blur-xl animate-pulse"></div>
                    <div className="absolute top-2/3 left-1/3 w-48 h-48 rounded-full bg-blue-500/10 blur-xl animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-purple-500/10 blur-xl animate-pulse"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
                <div className="elite-glass rounded-2xl w-full max-w-2xl overflow-hidden transition-all duration-300">
                    {/* Confirmation Header */}
                    <div className="bg-gradient-to-r from-[#001f3f] to-[#0a1128] p-8 text-center border-b border-gold/10">
                        <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-full h-full" viewBox="0 0 52 52">
                                <circle className="checkmark-circle" fill="none" stroke="#FFD700" strokeWidth="4" cx="26" cy="26" r="25"/>
                                <path className="checkmark-check" fill="none" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold gold-gradient mb-2">WELCOME TO FLOWFUND ELITE</h1>
                        <p className="text-lg text-gray-300">✅ Your Purchase is Confirmed</p>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-8">
                        <div className="mb-8 text-center">
                            <p className="text-lg text-gray-300 mb-6">You've just unlocked access to the most next-generation financial ecosystem ever built.</p>
                            
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-gold/50 transition-colors">
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
                                        <Gauge className="text-gold text-xl" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Your Command Center</h3>
                                    <p className="text-gray-400 mb-4">Access your personalized financial dashboard</p>
                                    <Link to="/dashboard" className="btn-gold inline-block py-2 px-6 rounded-lg text-gray-900 font-medium transition-all duration-300">
                                        Launch Dashboard <ArrowRight className="inline-block ml-2" size={16} />
                                    </Link>
                                </div>
                                
                                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-gold/50 transition-colors">
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
                                        <FileText className="text-gold text-xl" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Elite Onboarding Kit</h3>
                                    <p className="text-gray-400 mb-4">Download your exclusive resources</p>
                                    <button onClick={handleDownload} className="btn-gold inline-block py-2 px-6 rounded-lg text-gray-900 font-medium transition-all duration-300">
                                        {downloading ? (
                                            <><Loader2 className="inline-block mr-2 animate-spin" size={16} /> PREPARING...</>
                                        ) : (
                                            <><Download className="inline-block mr-2" size={16} /> Download PDF</>
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="bg-gray-900/30 p-6 rounded-xl border border-gray-800 mb-8">
                                <h3 className="text-xl font-semibold text-white mb-4 text-center">You're not just a buyer — you're now part of a movement.</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 mb-2 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                                            <LineChart className="text-gold" />
                                        </div>
                                        <span className="text-sm text-gray-300">Track</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 mb-2 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                                            <Sprout className="text-gold" />
                                        </div>
                                        <span className="text-sm text-gray-300">Grow</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 mb-2 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                                            <Coins className="text-gold" />
                                        </div>
                                        <span className="text-sm text-gray-300">Automate</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 mb-2 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                                            <Rocket className="text-gold" />
                                        </div>
                                        <span className="text-sm text-gray-300">Invest</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-xl bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-800 mt-8">
                                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                                    <Lightbulb className="text-gold mr-2" />
                                    Pro Tip
                                </h4>
                                <p className="text-gray-300 mb-4">
                                    Bookmark this page & whitelist our email (<span className="text-gold">noreply@flowfundelite.com</span>) 
                                    for lifetime updates, tools & exclusive bonuses.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <a href="#" className="text-sm text-gold hover:underline flex items-center">
                                        <Bookmark className="mr-1" size={16} /> Bookmark this page
                                    </a>
                                    <a href="#" className="text-sm text-gold hover:underline flex items-center">
                                        <Mail className="mr-1" size={16} /> Whitelist instructions
                                    </a>
                                    <a href="#" className="text-sm text-gold hover:underline flex items-center">
                                        <HelpCircle className="mr-1" size={16} /> Get help
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="px-8 py-4 bg-gray-900/30 border-t border-gray-800/50 text-center">
                            <div className="flex flex-wrap items-center justify-center gap-4 mb-3">
                                <a href="#" className="text-xs text-gray-400 hover:text-gold transition-colors">Support Center</a>
                                <a href="#" className="text-xs text-gray-400 hover:text-gold transition-colors">Community</a>
                                <a href="#" className="text-xs text-gray-400 hover:text-gold transition-colors">Terms</a>
                                <a href="#" className="text-xs text-gray-400 hover:text-gold transition-colors">Privacy</a>
                            </div>
                            <p className="text-xs text-gray-500">FlowFund Elite v4.2 • © 2023 FlowFund Systems. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
