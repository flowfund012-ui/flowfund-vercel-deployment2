import React, { useEffect, useRef } from 'react';
import { Rocket, Menu, ArrowRight, ChevronDown, LineChart, Bot, Zap, GraduationCap, Vault, Shield } from 'lucide-react'; // ADDED LUCIDE IMPORTS

const LandingPage = () => {
    const starsContainerRef = useRef(null);

    useEffect(() => {
        const createStar = () => {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = `${Math.random() * 3 + 1}px`;
            star.style.height = star.style.width;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.setProperty('--duration', `${Math.random() * 5 + 5}s`);
            star.style.setProperty('--opacity', `${Math.random() * 0.5 + 0.5}`);
            starsContainerRef.current.appendChild(star);

            setTimeout(() => {
                star.remove();
            }, parseFloat(star.style.getPropertyValue('--duration')) * 1000);
        };

        const interval = setInterval(createStar, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="antialiased">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center glow-box">
                                    <Rocket className="text-white" /> {/* REPLACED i tag */}
                                </div>
                                <span className="ml-3 font-futuristic text-xl text-white glow-text">FlowFund</span>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                <a href="#home" className="nav-link text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
                                <a href="#features" className="nav-link text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Mission Control</a>
                                <a href="#pricing" className="nav-link text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Access Portal</a>
                                <a href="#about" className="nav-link text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
                                <a href="#faq" className="nav-link text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">FAQ</a>
                                <a href="#contact" className="nav-link text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</a>
                            </div>
                        </div>
                        <div className="md:hidden">
                            <button id="mobile-menu-button" className="text-gray-300 hover:text-white focus:outline-none">
                                <Menu className="text-xl" /> {/* REPLACED i tag */}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Mobile menu */}
                <div id="mobile-menu" className="hidden md:hidden bg-gray-900">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="#home" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Home</a>
                        <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Mission Control</a>
                        <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Access Portal</a>
                        <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">About</a>
                        <a href="#faq" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">FAQ</a>
                        <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Contact</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="hero-bg min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
                {/* Stars background */}
                <div ref={starsContainerRef} id="stars-container" className="absolute inset-0 overflow-hidden"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center z-10">
                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 text-xs font-futuristic rounded-full text-blue-400 bg-blue-900 bg-opacity-50 uppercase tracking-wider">
                            Version 2.0.1
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-futuristic font-bold mb-6 glow-text">
                        <span className="block">Welcome to</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">FlowFund Command Center</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
                        Command Your Financial Future. <span className="text-blue-400">Effortlessly.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="#pricing" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-futuristic rounded-lg glow-box hover:from-blue-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center">
                            Launch Now <ArrowRight className="ml-2" /> {/* REPLACED i tag */}
                        </a>
                        <a href="#features" className="px-8 py-4 border border-blue-500 text-blue-400 font-futuristic rounded-lg hover:bg-blue-900 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                            Explore Features
                        </a>
                    </div>
                    
                    <div className="mt-24 scroll-indicator">
                        <a href="#features" className="text-gray-400 hover:text-white">
                            <ChevronDown className="text-2xl animate-bounce" /> {/* REPLACED i tag */}
                        </a>
                    </div>
                </div>
                
                {/* Animated dashboard preview */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent z-10"></div>
                <div className="absolute -bottom-20 left-0 right-0 flex justify-center z-0 opacity-70">
                    <div className="relative w-full max-w-4xl h-64">
                        <div className="absolute inset-0 bg-blue-900 bg-opacity-20 rounded-t-3xl backdrop-filter backdrop-blur-lg border-t border-l border-r border-blue-800 border-opacity-50"></div>
                        <div className="absolute top-4 left-4 right-4 bottom-4 border border-blue-800 border-opacity-30 rounded-xl flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-4 w-full p-4">
                                <div className="h-8 bg-blue-900 bg-opacity-40 rounded animate-pulse"></div>
                                <div className="h-8 bg-blue-900 bg-opacity-40 rounded animate-pulse delay-100"></div>
                                <div className="h-8 bg-blue-900 bg-opacity-40 rounded animate-pulse delay-200"></div>
                                <div className="h-16 bg-blue-900 bg-opacity-30 rounded animate-pulse delay-300"></div>
                                <div className="h-16 bg-blue-900 bg-opacity-30 rounded animate-pulse delay-400"></div>
                                <div className="h-16 bg-blue-900 bg-opacity-30 rounded animate-pulse delay-500"></div>
                                <div className="col-span-3 h-24 bg-blue-900 bg-opacity-20 rounded-lg animate-pulse delay-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Control (Features) */}
            <section id="features" className="py-24 bg-black relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-futuristic font-bold mb-4 glow-text">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Mission Control</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Your complete financial command center with cutting-edge modules designed for absolute control.
                        </p>
                    </div>
                    
                    <div className="dashboard-grid">
                        {/* Module 1 */}
                        <div className="module-card rounded-xl p-8">
                            <div className="feature-icon">
                                <LineChart /> {/* REPLACED i tag */}
                            </div>
                            <h3 className="text-2xl font-futuristic font-bold mb-3">Mission Tracker</h3>
                            <p className="text-gray-400 mb-4">
                                Real-time income & expense tracking with predictive analytics and smart categorization.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-blue-400 bg-blue-900 bg-opacity-30">Automated</span>
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-purple-400 bg-purple-900 bg-opacity-30">AI-Powered</span>
                            </div>
                        </div>
                        
                        {/* Module 2 */}
                        <div className="module-card rounded-xl p-8">
                            <div className="feature-icon">
                                <Bot /> {/* REPLACED i tag */}
                            </div>
                            <h3 className="text-2xl font-futuristic font-bold mb-3">AutoPilot</h3>
                            <p className="text-gray-400 mb-4">
                                Automated savings, investment rebalancing, and bill management for true financial freedom.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-blue-400 bg-blue-900 bg-opacity-30">Set & Forget</span>
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-purple-400 bg-purple-900 bg-opacity-30">Intelligent</span>
                            </div>
                        </div>
                        
                        {/* Module 3 */}
                        <div className="module-card rounded-xl p-8">
                            <div className="feature-icon">
                                <Zap /> {/* REPLACED i tag */}
                            </div>
                            <h3 className="text-2xl font-futuristic font-bold mb-3">Growth Engine</h3>
                            <p className="text-gray-400 mb-4">
                                Advanced tools for optimizing investment portfolios and maximizing wealth generation.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-blue-400 bg-blue-900 bg-opacity-30">Optimization</span>
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-purple-400 bg-purple-900 bg-opacity-30">High-Yield</span>
                            </div>
                        </div>
                        
                        {/* Module 4 */}
                        <div className="module-card rounded-xl p-8">
                            <div className="feature-icon">
                                <GraduationCap /> {/* REPLACED i tag */}
                            </div>
                            <h3 className="text-2xl font-futuristic font-bold mb-3">Personal Academy</h3>
                            <p className="text-gray-400 mb-4">
                                Exclusive courses, guides, and resources to expand your financial knowledge and skills.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-blue-400 bg-blue-900 bg-opacity-30">Exclusive</span>
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-purple-400 bg-purple-900 bg-opacity-30">On-Demand</span>
                            </div>
                        </div>
                        
                        {/* Module 5 */}
                        <div className="module-card rounded-xl p-8">
                            <div className="feature-icon">
                                <Vault /> {/* REPLACED i tag */}
                            </div>
                            <h3 className="text-2xl font-futuristic font-bold mb-3">The Vault</h3>
                            <p className="text-gray-400 mb-4">
                                Military-grade encryption for storing sensitive financial documents and passwords.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-blue-400 bg-blue-900 bg-opacity-30">Encrypted</span>
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-purple-400 bg-purple-900 bg-opacity-30">Secure</span>
                            </div>
                        </div>
                        
                        {/* Module 6 */}
                        <div className="module-card rounded-xl p-8">
                            <div className="feature-icon">
                                <Shield /> {/* REPLACED i tag */}
                            </div>
                            <h3 className="text-2xl font-futuristic font-bold mb-3">Security Hub</h3>
                            <p className="text-gray-400 mb-4">
                                Real-time security monitoring and alerts for all connected financial accounts.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-blue-400 bg-blue-900 bg-opacity-30">Real-Time</span>
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-purple-400 bg-purple-900 bg-opacity-30">Proactive</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Access Portal (Pricing) */}
            <section id="pricing" className="py-24 bg-black relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-futuristic font-bold mb-4 glow-text">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Access Portal</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Choose your mission level. All plans include a 7-day free trial.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Plan 1: Starter */}
                        <div className="pricing-card">
                            <h3 className="text-2xl font-futuristic font-bold mb-4">Starter</h3>
                            <p className="text-5xl font-bold mb-6">$29<span className="text-xl text-gray-400">/mo</span></p>
                            <ul className="space-y-3 text-left mb-8">
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Mission Tracker</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Budget Planner</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Savings Goals</li>
                                <li className="flex items-center"><i className="fas fa-times-circle text-red-400 mr-3"></i> AutoPilot Automation</li>
                                <li className="flex items-center"><i className="fas fa-times-circle text-red-400 mr-3"></i> Growth Engine</li>
                                <li className="flex items-center"><i className="fas fa-times-circle text-red-400 mr-3"></i> The Vault</li>
                            </ul>
                            <a href="#" className="w-full block text-center px-6 py-3 bg-blue-600 text-white font-futuristic rounded-lg hover:bg-blue-500 transition">Start 7-Day Trial</a>
                        </div>
                        
                        {/* Plan 2: Business */}
                        <div className="pricing-card popular">
                            <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Most Popular</div>
                            <h3 className="text-2xl font-futuristic font-bold mb-4">Business+</h3>
                            <p className="text-5xl font-bold mb-6">$49<span className="text-xl text-gray-400">/mo</span></p>
                            <ul className="space-y-3 text-left mb-8">
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Everything in Starter</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> AutoPilot Automation</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Growth Engine</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Personal Academy</li>
                                <li className="flex items-center"><i className="fas fa-times-circle text-red-400 mr-3"></i> The Vault</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Priority Support</li>
                            </ul>
                            <a href="#" className="w-full block text-center px-6 py-3 bg-purple-600 text-white font-futuristic rounded-lg hover:bg-purple-500 transition">Go Business</a>
                        </div>
                        
                        {/* Plan 3: Premium */}
                        <div className="pricing-card">
                            <h3 className="text-2xl font-futuristic font-bold mb-4">Premium</h3>
                            <p className="text-5xl font-bold mb-6">$297<span className="text-xl text-gray-400">/lifetime</span></p>
                            <ul className="space-y-3 text-left mb-8">
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Everything in Business+</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> The Vault</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Lifetime Updates</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Exclusive Templates</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> VIP Support</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Early Access</li>
                            </ul>
                            <a href="#" className="w-full block text-center px-6 py-3 border border-gray-600 text-gray-300 font-futuristic rounded-lg hover:bg-gray-800 transition">Go Premium</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-black relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-futuristic font-bold mb-4 glow-text">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Our Mission</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Empowering you to achieve financial mastery with intelligence and precision.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <i className="fas fa-lightbulb text-5xl text-blue-400 mb-4"></i>
                            <h3 className="text-2xl font-futuristic font-bold mb-2">Innovation</h3>
                            <p className="text-gray-400">
                                We constantly evolve, integrating the latest AI and financial technologies to keep you ahead.
                            </p>
                        </div>
                        <div className="text-center">
                            <i className="fas fa-lock text-5xl text-purple-400 mb-4"></i>
                            <h3 className="text-2xl font-futuristic font-bold mb-2">Security</h3>
                            <p className="text-gray-400">
                                Your data is protected with military-grade encryption and rigorous security protocols.
                            </p>
                        </div>
                        <div className="text-center">
                            <i className="fas fa-users text-5xl text-green-400 mb-4"></i>
                            <h3 className="text-2xl font-futuristic font-bold mb-2">Community</h3>
                            <p className="text-gray-400">
                                Join a thriving community of financial commanders on the path to wealth generation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-black border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="text-lg font-futuristic font-bold mb-4 glow-text">FlowFund</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
                                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-futuristic font-bold mb-4 glow-text">Features</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-white transition">Mission Tracker</a></li>
                                <li><a href="#features" className="hover:text-white transition">AutoPilot</a></li>
                                <li><a href="#features" className="hover:text-white transition">Growth Engine</a></li>
                                <li><a href="#features" className="hover:text-white transition">The Vault</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-futuristic font-bold mb-4 glow-text">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-futuristic font-bold mb-4 glow-text">Connect</h4>
                            <div className="flex space-x-4 text-2xl">
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="text-gray-400 hover:text-blue-600 transition"><i className="fab fa-linkedin-in"></i></a>
                                <a href="#" className="text-gray-400 hover:text-red-600 transition"><i className="fab fa-youtube"></i></a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-12 text-center text-gray-500 text-sm">
                        <p>&copy; 2023 FlowFund Command Center. All rights reserved. Built for the future of finance.</p>
                    </div>
                </div>
            </footer>

            {/* Styles for Landing Page */}
            <style jsx>{`
                .antialiased {
                    background-color: #000;
                }
                .hero-bg {
                    background-color: #000814;
                    background-image: radial-gradient(circle at 50% 50%, rgba(2, 132, 199, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
                }
                .font-futuristic {
                    font-family: 'Orbitron', sans-serif;
                }
                .glow-text {
                    text-shadow: 0 0 5px rgba(0, 242, 255, 0.5), 0 0 10px rgba(138, 43, 226, 0.5);
                }
                .glow-box {
                    box-shadow: 0 0 8px rgba(0, 242, 255, 0.5);
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
                .star {
                    position: absolute;
                    background: white;
                    border-radius: 50%;
                    opacity: var(--opacity);
                    animation: twinkle var(--duration) infinite alternate;
                }
                @keyframes twinkle {
                    0% { opacity: var(--opacity); }
                    50% { opacity: 0.2; }
                    100% { opacity: var(--opacity); }
                }
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
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
                .feature-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    background: linear-gradient(45deg, #00f2ff, #8a2be2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    color: transparent;
                }
                .pricing-card {
                    position: relative;
                    background: rgba(10, 20, 40, 0.8);
                    border: 1px solid rgba(70, 130, 180, 0.5);
                    padding: 2rem;
                    border-radius: 1rem;
                    text-align: center;
                    transition: all 0.3s ease-in-out;
                }
                .pricing-card.popular {
                    border-color: #8a2be2;
                    box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
