import React from 'react';
import { Brain, ChartLine, SlidersHorizontal, Bot, Projector, Shield, Wallet, PiggyBank, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AutoPilot = () => {
    return (
        <div className="min-h-screen bg-void text-lux antialiased">
            {/* Main Container */}
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Header */}
                <header className="flex flex-col items-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                        <div className="engine-core w-16 h-16 rounded-full flex items-center justify-center mr-4">
                            <div className="turbine-blade w-12 h-12 rounded-full relative">
                                <div className="absolute inset-0 rounded-full border-2 border-lux opacity-30"></div>
                                <div className="absolute inset-1 rounded-full border-2 border-lux opacity-20"></div>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-plasma to-ion bg-clip-text text-transparent">
                            AutoPilot Engine
                        </h1>
                    </div>
                    <p className="text-lux/80 text-lg md:text-xl text-center max-w-2xl">
                        Your Financial AI Navigator • Set-it-and-forget-it money movement powered by quantum algorithms
                    </p>
                </header>
                
                {/* Main Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel - Modules */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Smart Save Module */}
                        <div className="glass-capsule rounded-2xl p-6 transition-all duration-300 module-card">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-plasma/20 flex items-center justify-center mr-4">
                                        <Brain className="text-plasma text-xl" />
                                    </div>
                                    <h2 className="text-2xl font-semibold">Smart Save</h2>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-plasma/10 text-plasma text-sm font-medium">ACTIVE</span>
                            </div>
                            <p className="text-lux/70 mb-6">
                                AI analyzes your spending patterns and automatically saves optimal amounts without affecting your lifestyle.
                            </p>
                            <div className="bg-nebula rounded-xl p-4 mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-lux/60">This month's savings</span>
                                    <span className="font-medium text-plasma">$1,247.50</span>
                                </div>
                                <div className="w-full bg-cosmic rounded-full h-2.5">
                                    <div className="bg-gradient-to-r from-plasma to-quantum h-2.5 rounded-full" style={{ width: '78%' }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-lux/50 mt-1">
                                    <span>0%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <div>
                                    <span className="text-lux/60">Pattern detected:</span>
                                    <span className="text-lux ml-2">Weekend spending +12%</span>
                                </div>
                                <button className="text-plasma hover:text-ion flex items-center">
                                    <SlidersHorizontal className="mr-1" size={16} /> Adjust
                                </button>
                            </div>
                        </div>
                        
                        {/* Auto Invest Module */}
                        <div className="glass-capsule rounded-2xl p-6 transition-all duration-300 module-card">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-quantum/20 flex items-center justify-center mr-4">
                                        <ChartLine className="text-quantum text-xl" />
                                    </div>
                                    <h2 className="text-2xl font-semibold">Auto Invest</h2>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-quantum/10 text-quantum text-sm font-medium">ACTIVE</span>
                            </div>
                            <p className="text-lux/70 mb-6">
                                Intelligent distribution across ETF, crypto, and alternative investments based on your risk profile and goals.
                            </p>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-nebula rounded-xl p-3 text-center">
                                    <div className="text-xs text-lux/60 mb-1">ETF Portfolio</div>
                                    <div className="text-lg font-medium text-plasma">42%</div>
                                    <div className="text-xs text-lux/50">+2.1% this week</div>
                                </div>
                                <div className="bg-nebula rounded-xl p-3 text-center">
                                    <div className="text-xs text-lux/60 mb-1">Crypto Assets</div>
                                    <div className="text-lg font-medium text-quantum">28%</div>
                                    <div className="text-xs text-lux/50">+5.7% this week</div>
                                </div>
                                <div className="bg-nebula rounded-xl p-3 text-center">
                                    <div className="text-xs text-lux/60 mb-1">Alternative</div>
                                    <div className="text-lg font-medium text-ion">30%</div>
                                    <div className="text-xs text-lux/50">+1.3% this week</div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-lux/60">Current strategy:</span>
                                    <span className="text-lux ml-2">Balanced Growth</span>
                                </div>
                                <button className="text-quantum hover:text-ion flex items-center">
                                    <Bot className="mr-1" size={16} /> Optimize
                                </button>
                            </div>
                        </div>
                        
                        {/* Allocation Flowchart */}
                        <div className="glass-capsule rounded-2xl p-6">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                <Projector className="text-plasma mr-3" />
                                Allocation Flow
                            </h2>
                            <div className="relative">
                                <svg viewBox="0 0 600 200" className="w-full h-auto">
                                    {/* Flow lines */}
                                    <path d="M50,100 Q150,50 250,100 T450,100" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="4" fill="none" />
                                    <path className="allocation-path" d="M50,100 Q150,50 250,100 T450,100" stroke="url(#gradient)" strokeWidth="4" fill="none" />
                                    
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#7c3aed" />
                                            <stop offset="100%" stopColor="#a78bfa" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Nodes */}
                                    <g className="glow">
                                        <circle cx="50" cy="100" r="20" fill="#0f172a" stroke="#7c3aed" strokeWidth="2" />
                                        <text x="50" y="105" textAnchor="middle" fill="#f5f3ff" fontSize="12">Income</text>
                                    </g>
                                    
                                    <g className="glow">
                                        <circle cx="250" cy="100" r="20" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
                                        <text x="250" y="105" textAnchor="middle" fill="#f5f3ff" fontSize="12">Save</text>
                                    </g>
                                    
                                    <g className="glow">
                                        <circle cx="450" cy="100" r="20" fill="#0f172a" stroke="#a78bfa" strokeWidth="2" />
                                        <text x="450" y="105" textAnchor="middle" fill="#f5f3ff" fontSize="12">Invest</text>
                                    </g>
                                    
                                    <g className="glow">
                                        <circle cx="550" cy="100" r="20" fill="#0f172a" stroke="#7c3aed" strokeWidth="2" />
                                        <text x="550" y="105" textAnchor="middle" fill="#f5f3ff" fontSize="12">Vault</text>
                                    </g>
                                </svg>
                                
                                <div className="flex justify-between mt-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-nebula rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Wallet className="text-plasma" />
                                        </div>
                                        <span className="text-sm">Income</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-nebula rounded-full flex items-center justify-center mx-auto mb-2">
                                            <PiggyBank className="text-quantum" />
                                        </div>
                                        <span className="text-sm">Smart Save</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-nebula rounded-full flex items-center justify-center mx-auto mb-2">
                                            <ChartLine className="text-ion" />
                                        </div>
                                        <span className="text-sm">Auto Invest</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-nebula rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Lock className="text-plasma" />
                                        </div>
                                        <span className="text-sm">Secure Vault</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Panel */}
                    <div className="space-y-8">
                        {/* Goals Panel */}
                        <div className="glass-capsule rounded-2xl p-6">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                <Shield className="text-ion mr-3" />
                                Goals Progress
                            </h2>
                            
                            <div className="space-y-4">
                                {/* Emergency Fund */}
                                <div className="bg-nebula rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-plasma/10 flex items-center justify-center mr-3">
                                                <Shield className="text-plasma text-sm" />
                                            </div>
                                            <span className="font-medium">Emergency Fund</span>
                                        </div>
                                        <span className="text-xs bg-plasma/10 text-plasma px-2 py-1 rounded">3 months</span>
                                    </div>
                                    <div className="w-full bg-cosmic rounded-full h-2 mb-1">
                                        <div className="bg-plasma h-2 rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-lux/60">
                                        <span>$3,900/$6,000</span>
                                        <span>65%</span>
                                    </div>
                                </div>
                                
                                {/* Investment Portfolio */}
                                <div className="bg-nebula rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-quantum/10 flex items-center justify-center mr-3">
                                                <ChartLine className="text-quantum text-sm" />
                                            </div>
                                            <span className="font-medium">Investment Portfolio</span>
                                        </div>
                                        <span className="text-xs bg-quantum/10 text-quantum px-2 py-1 rounded">5 years</span>
                                    </div>
                                    <div className="w-full bg-cosmic rounded-full h-2 mb-1">
                                        <div className="bg-quantum h-2 rounded-full" style={{ width: '40%' }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-lux/60">
                                        <span>$20,000/$50,000</span>
                                        <span>40%</span>
                                    </div>
                                </div>
                                
                                {/* Debt Reduction */}
                                <div className="bg-nebula rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-ion/10 flex items-center justify-center mr-3">
                                                <Wallet className="text-ion text-sm" />
                                            </div>
                                            <span className="font-medium">Debt Reduction</span>
                                        </div>
                                        <span className="text-xs bg-ion/10 text-ion px-2 py-1 rounded">2 years</span>
                                    </div>
                                    <div className="w-full bg-cosmic rounded-full h-2 mb-1">
                                        <div className="bg-ion h-2 rounded-full" style={{ width: '80%' }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-lux/60">
                                        <span>$8,000/$10,000</span>
                                        <span>80%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* AI Assistant Chat */}
                        <div className="glass-capsule rounded-2xl p-6">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                <Bot className="text-plasma mr-3" />
                                AI Co-Pilot Chat
                            </h2>
                            <div className="space-y-4 h-64 overflow-y-auto scrollbar-hide mb-4">
                                {/* Example Chat Messages */}
                                <div className="flex justify-start">
                                    <div className="bg-nebula text-lux p-3 rounded-lg max-w-[80%]">
                                        Hello, how can I help you manage your finances today?
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-plasma/20 text-lux p-3 rounded-lg max-w-[80%]">
                                        What's my current investment performance?
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="bg-nebula text-lux p-3 rounded-lg max-w-[80%]">
                                        Your investment portfolio is up 3.5% this quarter, primarily driven by strong performance in tech ETFs.
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <input 
                                    type="text" 
                                    placeholder="Ask your AI Co-Pilot..."
                                    className="flex-grow bg-cosmic border border-nebula rounded-l-lg px-4 py-2 text-lux focus:outline-none focus:border-plasma"
                                />
                                <button className="bg-plasma hover:bg-ion text-white px-4 py-2 rounded-r-lg transition-colors">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .bg-void {
                    background-color: #0a0a1a;
                }

                .text-lux {
                    color: #e0e7ff;
                }

                .font-futuristic {
                    font-family: 'Orbitron', sans-serif;
                }

                .bg-plasma {
                    background-color: #7c3aed;
                }

                .text-plasma {
                    color: #7c3aed;
                }

                .bg-quantum {
                    background-color: #8b5cf6;
                }

                .text-quantum {
                    color: #8b5cf6;
                }

                .bg-ion {
                    background-color: #a78bfa;
                }

                .text-ion {
                    color: #a78bfa;
                }

                .bg-nebula {
                    background-color: #1e1e3a;
                }

                .bg-cosmic {
                    background-color: #2a2a4a;
                }

                .engine-core {
                    background: radial-gradient(circle, #7c3aed 0%, #a78bfa 100%);
                    box-shadow: 0 0 20px rgba(124, 58, 237, 0.8), 0 0 40px rgba(167, 139, 250, 0.6);
                    animation: pulse-glow 3s infinite alternate;
                }

                .turbine-blade {
                    border: 2px solid #e0e7ff;
                    animation: spin 10s linear infinite;
                }

                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.8), 0 0 40px rgba(167, 139, 250, 0.6); }
                    100% { box-shadow: 0 0 30px rgba(124, 58, 237, 1), 0 0 60px rgba(167, 139, 250, 0.8); }
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .glass-capsule {
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(124, 58, 237, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                }

                .module-card:hover {
                    border-color: #a78bfa;
                    box-shadow: 0 8px 40px rgba(167, 139, 250, 0.5);
                }

                .allocation-path {
                    stroke-dasharray: 10;
                    animation: flow-animation 5s linear infinite;
                }

                @keyframes flow-animation {
                    from { stroke-dashoffset: 100; }
                    to { stroke-dashoffset: 0; }
                }

                .glow {
                    filter: drop-shadow(0 0 3px rgba(124, 58, 237, 0.8));
                }
            `}</style>
        </div>
    );
};

export default AutoPilot;
