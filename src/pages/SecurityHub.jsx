import React, { useState, useEffect } from 'react';
import { Shield, Home, UserCog, Lock, List, Bot, CheckCircle, EyeOff, Fingerprint, Key, Clock, Wifi, AlertTriangle, Cpu, Globe, Cloud, Zap, Bell, Search, BarChart, Activity, ShieldCheck, ShieldOff, HardDrive, Server, RefreshCcw, WifiOff, MessageSquare } from 'lucide-react';

const SecurityHub = () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const loadingInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(loadingInterval);
                    setLoading(false);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
        return () => clearInterval(loadingInterval);
    }, []);

    const handleScroll = () => {
        const sections = ['hero', 'privacy', 'encryption', 'logs', 'ai'];
        for (const sectionId of sections) {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    setActiveSection(sectionId);
                    break;
                }
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
                <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-8 relative overflow-hidden">
                        <div className="absolute inset-0 rounded-full border-4 border-cyberblue/50 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full border-2 border-cyberblue/30 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-cyberblue/10 flex items-center justify-center">
                                    <Shield className="text-cyberblue text-2xl animate-pulse-glow" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 overflow-hidden rounded-full">
                            <div className="scan-line absolute top-0 left-0 right-0 h-8 opacity-70 animate-scan"></div>
                        </div>
                    </div>
                    
                    <div className="text-cyberblue text-xl mb-2">FlowFund OS</div>
                    <div className="text-3xl font-bold text-white mb-4">SECURITY HUB</div>
                    <div className="w-64 h-1 bg-gray-800 mx-auto mb-2 overflow-hidden">
                        <div className="h-full bg-cyberblue" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="text-gray-400 text-sm">Initializing fortress protocols...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-roboto-mono bg-fortress text-e2e8f0 overflow-x-hidden scroll-smooth">
            <div className="flex flex-col lg:flex-row">
                {/* Side Navigation */}
                <nav className="hidden lg:block w-64 bg-fortress h-screen sticky top-0 border-r border-gray-800/50 py-8 px-4">
                    <div className="flex items-center mb-8 px-4">
                        <div className="w-10 h-10 rounded-lg bg-cyberblue/10 flex items-center justify-center mr-3">
                            <Shield className="text-cyberblue" />
                        </div>
                        <h1 className="text-xl font-bold">Security Hub</h1>
                    </div>
                    
                    <div className="space-y-1 mb-8">
                        <a href="#hero" className={`nav-pill block px-4 py-2 rounded text-gray-300 hover:text-white ${activeSection === 'hero' ? 'active' : ''}`}>
                            <Home className="inline-block mr-3" size={16} /> Security Overview
                        </a>
                        <a href="#privacy" className={`nav-pill block px-4 py-2 rounded text-gray-300 hover:text-white ${activeSection === 'privacy' ? 'active' : ''}`}>
                            <UserCog className="inline-block mr-3" size={16} /> Privacy Controls
                        </a>
                        <a href="#encryption" className={`nav-pill block px-4 py-2 rounded text-gray-300 hover:text-white ${activeSection === 'encryption' ? 'active' : ''}`}>
                            <Lock className="inline-block mr-3" size={16} /> Encryption Engine
                        </a>
                        <a href="#logs" className={`nav-pill block px-4 py-2 rounded text-gray-300 hover:text-white ${activeSection === 'logs' ? 'active' : ''}`}>
                            <List className="inline-block mr-3" size={16} /> Security Logs
                        </a>
                        <a href="#ai" className={`nav-pill block px-4 py-2 rounded text-gray-300 hover:text-white ${activeSection === 'ai' ? 'active' : ''}`}>
                            <Bot className="inline-block mr-3" size={16} /> AI Auditor
                        </a>
                    </div>
                    
                    <div className="absolute bottom-8 left-0 right-0 px-4">
                        <div className="cyber-glass rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 rounded-md bg-green-500/10 flex items-center justify-center mr-2">
                                    <CheckCircle className="text-green-400 text-sm" />
                                </div>
                                <span className="text-sm">All systems secure</span>
                            </div>
                            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full progress-bar rounded-full" style={{ width: '98%' }}></div>
                            </div>
                        </div>
                    </div>
                </nav>
                
                {/* Main Content */}
                <div className="flex-1">
                    {/* Hero Section */}
                    <section id="hero" className="min-h-screen flex items-center justify-center scroll-section" style={{ background: 'radial-gradient(circle at center, #050a17 0%, #0c1a3a 100%)' }}>
                        <div className="container mx-auto px-6 py-24 text-center">
                            <div className="inline-block px-6 py-2 rounded-full bg-cyberblue/10 border border-cyberblue/20 mb-6 animate-fade-in">
                                <span className="text-cyberblue font-medium">FORTRESS MODE ACTIVE</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyberblue to-green-400 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                YOUR FINANCIAL FORTRESS
                            </h1>
                            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                                Where privacy meets power. FlowFund's Security Hub isn't just safe — it's impenetrable. 
                                Designed with military-grade architecture, encrypted layers, and zero-compromise access protocols.
                            </p>
                            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                                <button className="px-8 py-4 rounded-lg bg-cyberblue/10 hover:bg-cyberblue/20 text-cyberblue font-medium border border-cyberblue/20 transition-all transform hover:scale-105 mr-4">
                                    <ShieldCheck className="inline-block mr-2" size={20} /> Run Security Scan
                                </button>
                                <button className="px-8 py-4 rounded-lg bg-transparent hover:bg-gray-800/50 text-white font-medium border border-gray-700 transition-all transform hover:scale-105">
                                    <ShieldOff className="inline-block mr-2" size={20} /> Lockdown Mode
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-20 max-w-6xl mx-auto">
                                <div className="cyber-glass rounded-xl p-6 fortress-feature relative animate-fade-in" style={{ animationDelay: '0.8s' }}>
                                    <div className="w-12 h-12 rounded-full bg-cyberblue/10 flex items-center justify-center mb-4 mx-auto lock-icon">
                                        <Lock className="text-cyberblue" />
                                    </div>
                                    <h3 className="font-bold mb-2">End-to-End Encryption</h3>
                                    <p className="text-sm text-gray-400">Bank-level security across all data points</p>
                                </div>
                                
                                <div className="cyber-glass rounded-xl p-6 fortress-feature relative animate-fade-in" style={{ animationDelay: '1s' }}>
                                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 mx-auto lock-icon">
                                        <Wifi className="text-purple-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">Private Access</h3>
                                    <p className="text-sm text-gray-400">Your login, your IP, your key</p>
                                </div>
                                
                                <div className="cyber-glass rounded-xl p-6 fortress-feature relative animate-fade-in" style={{ animationDelay: '1.2s' }}>
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 mx-auto lock-icon">
                                        <Bot className="text-blue-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">AI Monitoring</h3>
                                    <p className="text-sm text-gray-400">Real-time alerts and threat detection</p>
                                </div>
                                
                                <div className="cyber-glass rounded-xl p-6 fortress-feature relative animate-fade-in" style={{ animationDelay: '1.4s' }}>
                                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 mx-auto lock-icon">
                                        <HardDrive className="text-green-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">Decentralized Vault</h3>
                                    <p className="text-sm text-gray-400">Your data. Your control</p>
                                </div>
                                
                                <div className="cyber-glass rounded-xl p-6 fortress-feature relative animate-fade-in" style={{ animationDelay: '1.6s' }}>
                                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 mx-auto lock-icon">
                                        <Lock className="text-red-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">Auto Lockdown</h3>
                                    <p className="text-sm text-gray-400">Instant session timeout protection</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Privacy Dashboard */}
                    <section id="privacy" className="min-h-screen flex items-center scroll-section py-20">
                        <div className="container mx-auto px-6">
                            <div className="cyber-glass rounded-2xl overflow-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className="p-12 fortress-wall">
                                        <div className="flex items-center mb-8">
                                            <div className="w-14 h-14 rounded-lg bg-cyberblue/10 flex items-center justify-center mr-4">
                                                <UserCog className="text-cyberblue text-xl" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-bold mb-1">Privacy Dashboard</h2>
                                                <p className="text-cyberblue">Your personal control center</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-md bg-cyberblue/10 flex items-center justify-center mr-3">
                                                        <EyeOff className="text-cyberblue" />
                                                    </div>
                                                    <span>Stealth Mode</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyberblue/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyberblue"></div>
                                                </label>
                                            </div>
                                            
                                            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-md bg-green-500/10 flex items-center justify-center mr-3">
                                                        <Key className="text-green-400" />
                                                    </div>
                                                    <span>Two-Factor Authentication</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-400/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                                </label>
                                            </div>
                                            
                                            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-md bg-red-500/10 flex items-center justify-center mr-3">
                                                        <Fingerprint className="text-red-400" />
                                                    </div>
                                                    <span>Biometric Login</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-400/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                                </label>
                                            </div>
                                            
                                            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-md bg-yellow-500/10 flex items-center justify-center mr-3">
                                                        <Clock className="text-yellow-400" />
                                                    </div>
                                                    <span>Auto Logout (5 min)</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-12 flex flex-col justify-center items-center text-center bg-fortress-wall-light">
                                        <ShieldCheck className="text-green-400 text-6xl mb-4" />
                                        <h3 className="text-2xl font-bold mb-2">Your Privacy, Our Priority</h3>
                                        <p className="text-gray-400 max-w-md">We employ advanced privacy protocols to ensure your financial data remains confidential and secure at all times.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Encryption Engine */}
                    <section id="encryption" className="min-h-screen flex items-center scroll-section py-20">
                        <div className="container mx-auto px-6">
                            <div className="cyber-glass rounded-2xl overflow-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className="p-12 fortress-wall">
                                        <div className="flex items-center mb-8">
                                            <div className="w-14 h-14 rounded-lg bg-cyberblue/10 flex items-center justify-center mr-4">
                                                <Lock className="text-cyberblue text-xl" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-bold mb-1">Encryption Engine</h2>
                                                <p className="text-cyberblue">Unbreakable data protection</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-md bg-cyberblue/10 flex items-center justify-center mr-3">
                                                        <Globe className="text-cyberblue" />
                                                    </div>
                                                    <span>Global Data Encryption</span>
                                                </div>
                                                <span className="text-green-400">Active</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-md bg-purple-500/10 flex items-center justify-center mr-3">
                                                        <Cloud className="text-purple-400" />
                                                    </div>
                                                    <span>Cloud Storage Encryption</span>
                                                </div>
                                                <span className="text-green-400">Active</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-md bg-yellow-500/10 flex items-center justify-center mr-3">
                                                        <Zap className="text-yellow-400" />
                                                    </div>
                                                    <span>Real-time Transaction Encryption</span>
                                                </div>
                                                <span className="text-green-400">Active</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-md bg-red-500/10 flex items-center justify-center mr-3">
                                                        <Bell className="text-red-400" />
                                                    </div>
                                                    <span>Encryption Breach Alerts</span>
                                                </div>
                                                <span className="text-green-400">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-12 flex flex-col justify-center items-center text-center bg-fortress-wall-light">
                                        <Lock className="text-cyberblue text-6xl mb-4" />
                                        <h3 className="text-2xl font-bold mb-2">Unbreakable Security</h3>
                                        <p className="text-gray-400 max-w-md">Our multi-layered encryption protocols ensure that your financial data is always protected against unauthorized access.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Security Logs */}
                    <section id="logs" className="min-h-screen flex items-center scroll-section py-20">
                        <div className="container mx-auto px-6">
                            <div className="cyber-glass rounded-2xl overflow-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className="p-12 fortress-wall">
                                        <div className="flex items-center mb-8">
                                            <div className="w-14 h-14 rounded-lg bg-cyberblue/10 flex items-center justify-center mr-4">
                                                <List className="text-cyberblue text-xl" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-bold mb-1">Security Logs</h2>
                                                <p className="text-cyberblue">Transparent activity monitoring</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <Clock className="text-gray-500 mr-3" size={16} />
                                                    <div>
                                                        <p className="text-sm">Login from new device</p>
                                                        <p className="text-xs text-gray-500">IP: 192.168.1.100 | Device: Chrome on Windows | Time: 2023-09-25 10:30 AM</p>
                                                    </div>
                                                </div>
                                                <span className="text-green-400 text-xs">SUCCESS</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <AlertTriangle className="text-yellow-400 mr-3" size={16} />
                                                    <div>
                                                        <p className="text-sm">Failed login attempt</p>
                                                        <p className="text-xs text-gray-500">IP: 203.0.113.45 | Device: Safari on iOS | Time: 2023-09-25 09:15 AM</p>
                                                    </div>
                                                </div>
                                                <span className="text-yellow-400 text-xs">WARNING</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <RefreshCcw className="text-gray-500 mr-3" size={16} />
                                                    <div>
                                                        <p className="text-sm">Password changed</p>
                                                        <p className="text-xs text-gray-500">IP: 192.168.1.100 | Device: Chrome on Windows | Time: 2023-09-24 03:00 PM</p>
                                                    </div>
                                                </div>
                                                <span className="text-green-400 text-xs">SUCCESS</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <WifiOff className="text-red-400 mr-3" size={16} />
                                                    <div>
                                                        <p className="text-sm">Unauthorized access attempt</p>
                                                        <p className="text-xs text-gray-500">IP: 198.51.100.22 | Device: Unknown | Time: 2023-09-24 11:00 AM</p>
                                                    </div>
                                                </div>
                                                <span className="text-red-400 text-xs">CRITICAL</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-12 flex flex-col justify-center items-center text-center bg-fortress-wall-light">
                                        <BarChart className="text-cyberblue text-6xl mb-4" />
                                        <h3 className="text-2xl font-bold mb-2">Full Transparency</h3>
                                        <p className="text-gray-400 max-w-md">Monitor all account activity in real-time with detailed logs and alerts for suspicious behavior.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* AI Auditor */}
                    <section id="ai" className="min-h-screen flex items-center scroll-section py-20">
                        <div className="container mx-auto px-6">
                            <div className="cyber-glass rounded-2xl overflow-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className="p-12 fortress-wall">
                                        <div className="flex items-center mb-8">
                                            <div className="w-14 h-14 rounded-lg bg-cyberblue/10 flex items-center justify-center mr-4">
                                                <Bot className="text-cyberblue text-xl" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-bold mb-1">AI Auditor</h2>
                                                <p className="text-cyberblue">Intelligent threat detection</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-md bg-cyberblue/10 flex items-center justify-center mr-3">
                                                        <Cpu className="text-cyberblue" />
                                                    </div>
                                                    <span>Behavioral Anomaly Detection</span>
                                                </div>
                                                <span className="text-green-400">Active</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-md bg-purple-500/10 flex items-center justify-center mr-3">
                                                        <Activity className="text-purple-400" />
                                                    </div>
                                                    <span>Predictive Threat Intelligence</span>
                                                </div>
                                                <span className="text-green-400">Active</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-md bg-yellow-500/10 flex items-center justify-center mr-3">
                                                        <MessageSquare className="text-yellow-400" />
                                                    </div>
                                                    <span>Automated Incident Response</span>
                                                </div>
                                                <span className="text-green-400">Active</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-md bg-red-500/10 flex items-center justify-center mr-3">
                                                        <ShieldOff className="text-red-400" />
                                                    </div>
                                                    <span>Vulnerability Scanning</span>
                                                </div>
                                                <span className="text-green-400">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-12 flex flex-col justify-center items-center text-center bg-fortress-wall-light">
                                        <Bot className="text-cyberblue text-6xl mb-4" />
                                        <h3 className="text-2xl font-bold mb-2">Intelligent Protection</h3>
                                        <p className="text-gray-400 max-w-md">Our AI-powered auditor continuously monitors your account for anomalies and proactively defends against emerging threats.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-800 mt-12">
                        <p>&copy; 2023 FlowFund Security. All rights reserved.</p>
                    </footer>
                </div>
            </div>

            <style jsx>{`
                .font-roboto-mono {
                    font-family: 'Roboto Mono', monospace;
                }

                .bg-fortress {
                    background-color: #0a0a1a;
                }

                .text-e2e8f0 {
                    color: #e2e8f0;
                }

                .text-cyberblue {
                    color: #00bcd4;
                }

                .cyber-glass {
                    background: rgba(10, 20, 40, 0.6);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(0, 188, 212, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                }

                .nav-pill.active {
                    background-color: rgba(0, 188, 212, 0.1);
                    color: #00bcd4;
                }

                .nav-pill:hover {
                    background-color: rgba(0, 188, 212, 0.05);
                }

                .progress-bar {
                    background: linear-gradient(90deg, #00bcd4, #2dd4bf);
                }

                .animate-fade-in {
                    animation: fadeIn 1s ease-out forwards;
                    opacity: 0;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .scan-line {
                    background: linear-gradient(to bottom, transparent, rgba(0, 188, 212, 0.8), transparent);
                    animation: scan 2s infinite linear;
                }

                @keyframes scan {
                    0% { top: -100%; }
                    100% { top: 100%; }
                }

                .animate-pulse-glow {
                    animation: pulse-glow 2s infinite alternate;
                }

                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 10px rgba(0, 188, 212, 0.6), 0 0 20px rgba(0, 188, 212, 0.4); }
                    100% { box-shadow: 0 0 15px rgba(0, 188, 212, 0.8), 0 0 30px rgba(0, 188, 212, 0.6); }
                }

                .fortress-feature {
                    position: relative;
                    overflow: hidden;
                }

                .fortress-feature::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, rgba(0, 188, 212, 0.1), rgba(0, 188, 212, 0));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .fortress-feature:hover::before {
                    opacity: 1;
                }

                .fortress-feature .lock-icon {
                    transition: transform 0.3s ease;
                }

                .fortress-feature:hover .lock-icon {
                    transform: scale(1.1);
                }

                .fortress-wall {
                    background: linear-gradient(to right, #161b22, #0d1117);
                }

                .fortress-wall-light {
                    background: linear-gradient(to left, #161b22, #0d1117);
                }

                .scroll-section {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-top: 80px; /* Adjust for fixed header if any */
                    padding-bottom: 80px;
                }
            `}</style>
        </div>
    );
};

export default SecurityHub;
