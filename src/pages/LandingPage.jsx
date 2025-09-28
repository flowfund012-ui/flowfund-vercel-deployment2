import React, { useEffect, useRef } from 'react';

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
                                    <i className="fas fa-rocket text-white"></i>
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
                                <i className="fas fa-bars text-xl"></i>
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
                            Launch Now <i className="fas fa-arrow-right ml-2"></i>
                        </a>
                        <a href="#features" className="px-8 py-4 border border-blue-500 text-blue-400 font-futuristic rounded-lg hover:bg-blue-900 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                            Explore Features
                        </a>
                    </div>
                    
                    <div className="mt-24 scroll-indicator">
                        <a href="#features" className="text-gray-400 hover:text-white">
                            <i className="fas fa-chevron-down text-2xl animate-bounce"></i>
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
                                <i className="fas fa-chart-line"></i>
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
                                <i className="fas fa-robot"></i>
                            </div>
                            <h3 className="text-2xl font-futuristic font-bold mb-3">AutoPilot</h3>
                            <p className="text-gray-400 mb-4">
                                Set-it-and-forget-it savings & investment automation with intelligent allocation algorithms.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-blue-400 bg-blue-900 bg-opacity-30">Automated</span>
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-green-400 bg-green-900 bg-opacity-30">Smart</span>
                            </div>
                        </div>
                        
                        {/* Module 3 */}
                        <div className="module-card rounded-xl p-8">
                            <div className="feature-icon">
                                <i className="fas fa-bolt"></i>
                            </div>
                            <h3 className="text-2xl font-futuristic font-bold mb-3">Growth Engine</h3>
                            <p className="text-gray-400 mb-4">
                                Entrepreneur tools for scaling your business with financial insights and cash flow optimization.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-purple-400 bg-purple-900 bg-opacity-30">Pro Tools</span>
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-yellow-400 bg-yellow-900 bg-opacity-30">Scaling</span>
                            </div>
                        </div>
                        
                        {/* Module 4 */}
                        <div className="module-card rounded-xl p-8">
                            <div className="feature-icon">
                                <i className="fas fa-graduation-cap"></i>
                            </div>
                            <h3 className="text-2xl font-futuristic font-bold mb-3">Personal Academy</h3>
                            <p className="text-gray-400 mb-4">
                                Curated financial education, workshops, and expert insights tailored to your goals.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-green-400 bg-green-900 bg-opacity-30">Learn</span>
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-blue-400 bg-blue-900 bg-opacity-30">Grow</span>
                            </div>
                        </div>
                        
                        {/* Module 5 */}
                        <div className="module-card rounded-xl p-8">
                            <div className="feature-icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <h3 className="text-2xl font-futuristic font-bold mb-3">Security Hub</h3>
                            <p className="text-gray-400 mb-4">
                                Advanced encryption, fraud protection, and secure access protocols for peace of mind.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-red-400 bg-red-900 bg-opacity-30">Secure</span>
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-blue-400 bg-blue-900 bg-opacity-30">Protected</span>
                            </div>
                        </div>
                        
                        {/* Module 6 */}
                        <div className="module-card rounded-xl p-8">
                            <div className="feature-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <h3 className="text-2xl font-futuristic font-bold mb-3">The Vault</h3>
                            <p className="text-gray-400 mb-4">
                                Secure digital asset storage and management for cryptocurrencies and NFTs.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-purple-400 bg-purple-900 bg-opacity-30">Crypto</span>
                                <span className="px-3 py-1 text-xs font-futuristic rounded-full text-yellow-400 bg-yellow-900 bg-opacity-30">NFTs</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Access Portal (Pricing) */}
            <section id="pricing" className="py-24 bg-black relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-futuristic font-bold mb-4 glow-text">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Access Portal</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Choose your launch sequence. No hidden fees, just pure financial power.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Pricing Card 1 */}
                        <div className="price-card rounded-xl p-8 text-center border border-gray-700">
                            <h3 className="text-3xl font-futuristic font-bold mb-4 text-white">Explorer</h3>
                            <p className="text-gray-400 mb-6">For the curious voyager</p>
                            <p className="text-5xl font-futuristic font-bold text-white mb-6">$0<span className="text-xl text-gray-400">/month</span></p>
                            <ul className="text-left text-gray-300 space-y-3 mb-8">
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Basic Mission Tracker</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Limited AutoPilot</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Community Access</li>
                                <li className="flex items-center text-gray-500"><i className="fas fa-times-circle text-red-400 mr-3"></i> No Growth Engine</li>
                                <li className="flex items-center text-gray-500"><i className="fas fa-times-circle text-red-400 mr-3"></i> No Vault Access</li>
                            </ul>
                            <a href="/register" className="block w-full px-8 py-3 bg-blue-600 text-white font-futuristic rounded-lg glow-box hover:bg-blue-500 transition-all duration-300">
                                Start Free Mission
                            </a>
                        </div>

                        {/* Pricing Card 2 (Popular) */}
                        <div className="price-card rounded-xl p-8 text-center border-2 border-blue-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Popular</div>
                            <h3 className="text-3xl font-futuristic font-bold mb-4 text-white">Navigator</h3>
                            <p className="text-gray-400 mb-6">For the ambitious commander</p>
                            <p className="text-5xl font-futuristic font-bold text-white mb-6">$29<span className="text-xl text-gray-400">/month</span></p>
                            <ul className="text-left text-gray-300 space-y-3 mb-8">
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Advanced Mission Tracker</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Full AutoPilot</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Personal Academy</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Basic Growth Engine</li>
                                <li className="flex items-center text-gray-500"><i className="fas fa-times-circle text-red-400 mr-3"></i> No Vault Access</li>
                            </ul>
                            <a href="/register" className="block w-full px-8 py-3 bg-blue-600 text-white font-futuristic rounded-lg glow-box hover:bg-blue-500 transition-all duration-300">
                                Upgrade to Navigator
                            </a>
                        </div>

                        {/* Pricing Card 3 */}
                        <div className="price-card rounded-xl p-8 text-center border border-gray-700">
                            <h3 className="text-3xl font-futuristic font-bold mb-4 text-white">Cosmic Elite</h3>
                            <p className="text-gray-400 mb-6">For the ultimate financial architect</p>
                            <p className="text-5xl font-futuristic font-bold text-white mb-6">$99<span className="text-xl text-gray-400">/month</span></p>
                            <ul className="text-left text-gray-300 space-y-3 mb-8">
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> All Navigator Features</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Full Growth Engine</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Full Vault Access</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Dedicated Support</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-3"></i> Priority Access</li>
                            </ul>
                            <a href="/register" className="block w-full px-8 py-3 bg-blue-600 text-white font-futuristic rounded-lg glow-box hover:bg-blue-500 transition-all duration-300">
                                Go Cosmic Elite
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-black relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-futuristic font-bold mb-4 glow-text">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">About FlowFund</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Our mission: to empower you with unparalleled financial control and insight.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-3xl font-futuristic font-bold mb-6 text-white">The Future of Finance, Today.</h3>
                            <p className="text-gray-300 text-lg mb-6">
                                FlowFund was founded on the principle that managing your finances should be as intuitive and powerful as navigating a starship. We've built a platform that combines cutting-edge AI with a user-friendly interface to give you complete command over your financial universe.
                            </p>
                            <p className="text-gray-300 text-lg mb-6">
                                From automated savings to advanced investment strategies and secure digital asset management, FlowFund is your co-pilot on the journey to financial freedom. Our team of financial experts and tech innovators are constantly pushing the boundaries to bring you the most advanced tools available.
                            </p>
                            <a href="#contact" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-futuristic rounded-lg glow-box hover:bg-blue-500 transition-all duration-300">
                                Join Our Mission <i className="fas fa-arrow-right ml-2"></i>
                            </a>
                        </div>
                        <div className="relative w-full h-80 bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                            <img src="https://via.placeholder.com/600x400/0F172A/FFFFFF?text=FlowFund+Dashboard" alt="FlowFund Dashboard" className="w-full h-full object-cover opacity-70" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-blue-600 bg-opacity-70 flex items-center justify-center animate-pulse">
                                    <i className="fas fa-play text-white text-3xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 bg-black relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-futuristic font-bold mb-4 glow-text">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Frequently Asked Questions</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Navigating the cosmos of finance can bring questions. We've got answers.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="faq-item pb-4">
                            <button className="faq-question w-full text-left text-xl font-semibold text-white py-3 flex justify-between items-center">
                                What is FlowFund?
                                <i className="fas fa-chevron-down text-gray-400"></i>
                            </button>
                            <div className="faq-answer text-gray-400 mt-2 hidden">
                                FlowFund is an advanced financial automation platform designed to give you complete control over your financial life. It combines AI-powered tools for tracking, saving, investing, and securing your assets in a user-friendly, space-themed interface.
                            </div>
                        </div>
                        <div className="faq-item pb-4">
                            <button className="faq-question w-full text-left text-xl font-semibold text-white py-3 flex justify-between items-center">
                                How does AutoPilot work?
                                <i className="fas fa-chevron-down text-gray-400"></i>
                            </button>
                            <div className="faq-answer text-gray-400 mt-2 hidden">
                                AutoPilot uses intelligent algorithms to automate your savings and investments based on your financial goals and risk tolerance. You set your parameters, and AutoPilot works in the background to optimize your portfolio and savings contributions.
                            </div>
                        </div>
                        <div className="faq-item pb-4">
                            <button className="faq-question w-full text-left text-xl font-semibold text-white py-3 flex justify-between items-center">
                                Is my data secure with FlowFund?
                                <i className="fas fa-chevron-down text-gray-400"></i>
                            </button>
                            <div className="faq-answer text-gray-400 mt-2 hidden">
                                Yes, security is our top priority. FlowFund employs military-grade encryption, multi-factor authentication, and continuous threat monitoring to ensure your financial data and assets are protected at all times. Our Security Hub provides real-time insights into your account's safety.
                            </div>
                        </div>
                        <div className="faq-item pb-4">
                            <button className="faq-question w-full text-left text-xl font-semibold text-white py-3 flex justify-between items-center">
                                Can I access FlowFund on mobile devices?
                                <i className="fas fa-chevron-down text-gray-400"></i>
                            </button>
                            <div className="faq-answer text-gray-400 mt-2 hidden">
                                Absolutely! FlowFund is designed to be fully responsive and accessible across all devices, including smartphones and tablets. Our mobile-first approach ensures a seamless and intuitive experience whether you're on your desktop or on the go.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-black relative overflow-hidden contact-radar">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-futuristic font-bold mb-4 glow-text">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Contact Mission Control</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Ready to launch your financial journey? Our team is standing by.
                        </p>
                    </div>

                    <div className="max-w-xl mx-auto bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-lg border border-gray-800">
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">Name</label>
                                <input type="text" id="name" name="name" className="command-input w-full px-4 py-3 rounded-lg" placeholder="Your Name" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                                <input type="email" id="email" name="email" className="command-input w-full px-4 py-3 rounded-lg" placeholder="Your Email" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-gray-300 text-sm font-bold mb-2">Message</label>
                                <textarea id="message" name="message" rows="5" className="command-input w-full px-4 py-3 rounded-lg" placeholder="Your Message"></textarea>
                            </div>
                            <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white font-futuristic rounded-lg glow-box hover:bg-blue-500 transition-all duration-300">
                                Send Transmission <i className="fas fa-paper-plane ml-2"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg border-t border-gray-800 py-8 text-center text-gray-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p>&copy; 2023 FlowFund Systems. All rights reserved.</p>
                    <div className="flex justify-center space-x-6 mt-4">
                        <a href="#" className="hover:text-white transition-colors"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="hover:text-white transition-colors"><i className="fab fa-linkedin-in"></i></a>
                        <a href="#" className="hover:text-white transition-colors"><i className="fab fa-github"></i></a>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .hero-bg {
                    background: radial-gradient(ellipse at center, #001F54 0%, #000814 70% );
                }

                .glow-text {
                    text-shadow: 0 0 8px rgba(245, 249, 255, 0.6);
                }

                .glow-box {
                    box-shadow: 0 0 15px rgba(0, 102, 255, 0.5);
                }

                .glow-box:hover {
                    box-shadow: 0 0 25px rgba(0, 102, 255, 0.8);
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
                    background-color: #0066FF;
                    transition: width 0.3s ease;
                }

                .nav-link:hover:after {
                    width: 100%;
                }

                .star {
                    position: absolute;
                    background-color: #F5F9FF;
                    border-radius: 50%;
                    animation: twinkle var(--duration) infinite ease-in-out;
                    opacity: 0;
                }

                @keyframes twinkle {
                    0%, 100% { opacity: 0; }
                    50% { opacity: var(--opacity); }
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }

                .module-card {
                    transition: all 0.3s ease-in-out;
                    border: 1px solid rgba(176, 190, 197, 0.2);
                    background: rgba(0, 31, 84, 0.3);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
                }

                .module-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 40px rgba(70, 130, 180, 0.5);
                }

                .feature-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    background: linear-gradient(45deg, #4682b4, #8a2be2);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .pricing-card {
                    background: rgba(10, 20, 40, 0.6);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(70, 130, 180, 0.3);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease-in-out;
                }

                .pricing-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 40px rgba(70, 130, 180, 0.5);
                }

                .scroll-indicator {
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
