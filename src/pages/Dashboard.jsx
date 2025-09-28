import React from 'react';
import { Link } from 'react-router-dom';
import { Bolt, User, Coins, Waves, ChartLine, Bot, Rocket, GraduationCap, Vault, Shield, Activity } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="antialiased min-h-screen bg-deep-space text-white">
            {/* Top Navigation Bar */}
            <nav className="px-8 py-4 flex items-center justify-between bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center neon-border">
                        <Bolt className="text-white text-lg" />
                    </div>
                    <h1 className="text-2xl font-bold font-futuristic gradient-text">FlowFund OS</h1>
                </div>
                
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/vault" className="nav-link text-gray-300 hover:text-white transition">Vault</Link>
                    <Link to="/security-hub" className="nav-link text-gray-300 hover:text-white transition">Security Hub</Link>
                    <a href="#" className="nav-link text-gray-300 hover:text-white transition">Docs</a>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img src="https://via.placeholder.com/40" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-blue-500" />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
                    </div>
                    <span className="text-lg font-medium hidden md:block">Commander Nova</span>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold font-futuristic mb-4 neon-text">Welcome, Commander Nova!</h2>
                    <p className="text-lg text-gray-400">Your financial mission control awaits.</p>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="module-card p-6 rounded-xl flex items-center space-x-4">
                        <div className="module-icon w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                            <Coins className="text-white" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400">Net Worth</p>
                            <h3 className="text-2xl font-bold">$1,250,000</h3>
                        </div>
                    </div>
                    <div className="module-card p-6 rounded-xl flex items-center space-x-4">
                        <div className="module-icon w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                            <Waves className="text-white" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400">Cash Flow</p>
                            <h3 className="text-2xl font-bold">+$5,200/mo</h3>
                        </div>
                    </div>
                    <div className="module-card p-6 rounded-xl flex items-center space-x-4">
                        <div className="module-icon w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                            <ChartLine className="text-white" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400">Investments</p>
                            <h3 className="text-2xl font-bold">+18.5% YTD</h3>
                        </div>
                    </div>
                    <div className="module-card p-6 rounded-xl flex items-center space-x-4">
                        <div className="module-icon w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                            <Activity className="text-white" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400">Recent Activity</p>
                            <h3 className="text-2xl font-bold">5 new alerts</h3>
                        </div>
                    </div>
                </div>

                {/* Main Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Mission Tracker */}
                    <Link to="/mission-tracker" className="module-card p-8 rounded-xl text-center transform hover:scale-105 transition-all duration-300">
                        <div className="module-icon text-5xl mb-4">
                            <Bolt />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Mission Tracker</h3>
                        <p className="text-gray-400">Track your financial progress and goals.</p>
                    </Link>

                    {/* AutoPilot */}
                    <Link to="/auto-pilot" className="module-card p-8 rounded-xl text-center transform hover:scale-105 transition-all duration-300">
                        <div className="module-icon text-5xl mb-4">
                            <Bot />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">AutoPilot</h3>
                        <p className="text-gray-400">Automate your savings and investments.</p>
                    </Link>

                    {/* Growth Engine */}
                    <Link to="/growth-engine" className="module-card p-8 rounded-xl text-center transform hover:scale-105 transition-all duration-300">
                        <div className="module-icon text-5xl mb-4">
                            <Rocket />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Growth Engine</h3>
                        <p className="text-gray-400">Optimize your wealth generation strategies.</p>
                    </Link>

                    {/* Personal Academy */}
                    <Link to="/personal-academy" className="module-card p-8 rounded-xl text-center transform hover:scale-105 transition-all duration-300">
                        <div className="module-icon text-5xl mb-4">
                            <GraduationCap />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Personal Academy</h3>
                        <p className="text-gray-400">Expand your financial knowledge and skills.</p>
                    </Link>

                    {/* Vault */}
                    <Link to="/vault" className="module-card p-8 rounded-xl text-center transform hover:scale-105 transition-all duration-300">
                        <div className="module-icon text-5xl mb-4">
                            <Vault />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">The Vault</h3>
                        <p className="text-gray-400">Securely store your sensitive financial data.</p>
                    </Link>

                    {/* Security Hub */}
                    <Link to="/security-hub" className="module-card p-8 rounded-xl text-center transform hover:scale-105 transition-all duration-300">
                        <div className="module-icon text-5xl mb-4">
                            <Shield />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Security Hub</h3>
                        <p className="text-gray-400">Monitor and enhance your financial security.</p>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-800 mt-12">
                <p>&copy; 2023 FlowFund OS. All rights reserved.</p>
            </footer>

            <style jsx>{`
                .bg-deep-space {
                    background-color: #000814;
                }

                .font-futuristic {
                    font-family: 'Orbitron', sans-serif;
                }

                .gradient-text {
                    background: linear-gradient(45deg, #00f2ff, #8a2be2 );
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .neon-border {
                    border: 2px solid rgba(0, 242, 255, 0.5);
                    box-shadow: 0 0 10px rgba(0, 242, 255, 0.3);
                }

                .nav-link {
                    position: relative;
                }

                .nav-link:after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -2px;
                    left: 0;
                    background-color: #00f2ff;
                    transition: width 0.3s ease;
                }

                .nav-link:hover:after {
                    width: 100%;
                }

                .neon-text {
                    text-shadow: 0 0 8px #00f2ff, 0 0 12px #00f2ff, 0 0 16px #00f2ff;
                }

                .module-card {
                    background: rgba(10, 20, 40, 0.6);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(70, 130, 180, 0.3);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease-in-out;
                }

                .module-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 40px rgba(70, 130, 180, 0.5);
                }

                .module-icon {
                    background: linear-gradient(45deg, #4682b4, #8a2be2);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .glow-button {
                    box-shadow: 0 0 8px rgba(70, 130, 180, 0.6), 0 0 15px rgba(70, 130, 180, 0.4);
                }

                .pulse {
                    animation: pulse-animation 2s infinite;
                }

                @keyframes pulse-animation {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
