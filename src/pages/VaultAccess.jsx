import React, { useState, useEffect } from 'react';
import { Lock, Projector, Target, ChartPie, BookOpen, Download, Filter, DollarSign, Briefcase, Bot, Book, FileText, Search, MessageSquare } from 'lucide-react';

const Vault = () => {
    const [vaultOpen, setVaultOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All Assets');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Simulate vault opening animation
        const timer = setTimeout(() => {
            setVaultOpen(true);
        }, 1500); // Adjust time as needed for animation
        return () => clearTimeout(timer);
    }, []);

    const assets = [
        {
            id: 1,
            title: 'FlowFund Command Center',
            description: 'Complete financial dashboard with cash flow tracking, net worth calculator, and investment monitoring.',
            type: 'Notion',
            category: 'Finance',
            updated: 'Jun 2023',
            icon: <Projector className="text-5xl text-neon" />,
            typeIcon: <FileText size={16} />,
            size: '12.4MB'
        },
        {
            id: 2,
            title: 'Financial Goal Tracker',
            description: 'Smart spreadsheet that visualizes your financial milestones with automatic progress tracking.',
            type: 'Excel',
            category: 'Finance',
            updated: 'Lifetime Updates',
            icon: <Target className="text-5xl text-plasma" />,
            typeIcon: <FileText size={16} />,
            size: '3.2MB'
        },
        {
            id: 3,
            title: 'Business Expense Analyzer',
            description: 'Automated tool that categorizes expenses, identifies tax deductions, and forecasts cash flow.',
            type: 'Sheets',
            category: 'Business',
            updated: 'New',
            icon: <ChartPie className="text-5xl text-cyber" />,
            typeIcon: <FileText size={16} />,
            size: '5.7MB'
        },
        {
            id: 4,
            title: '30-Day Wealth Blueprint',
            description: 'Step-by-step guide to building wealth through smart habits, investments, and income streams.',
            type: 'PDF + ePub',
            category: 'eBook',
            updated: '156 pages',
            icon: <BookOpen className="text-5xl text-purple-400" />,
            typeIcon: <FileText size={16} />,
            size: '8.1MB'
        },
        {
            id: 5,
            title: 'AI Investment Advisor',
            description: 'Personalized AI recommendations for optimizing your investment portfolio and maximizing returns.',
            type: 'Web App',
            category: 'AI Tools',
            updated: 'Beta',
            icon: <Bot className="text-5xl text-red-400" />,
            typeIcon: <FileText size={16} />,
            size: 'N/A'
        },
        {
            id: 6,
            title: 'Cash Flow Mastery Course',
            description: 'Comprehensive video course on managing cash flow, budgeting, and building financial resilience.',
            type: 'Video',
            category: 'Finance',
            updated: '10 Modules',
            icon: <Video className="text-5xl text-green-400" />,
            typeIcon: <FileText size={16} />,
            size: '2.5GB'
        }
    ];

    const filteredAssets = assets.filter(asset => {
        const matchesCategory = selectedCategory === 'All Assets' || asset.category === selectedCategory;
        const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              asset.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-vault text-platinum antialiased font-rajdhani">
            {/* Vault Door Animation */}
            {!vaultOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50 vault-door animate-vault-open-reverse">
                    <div className="relative w-full max-w-2xl h-96 mx-auto">
                        {/* Vault Door */}
                        <div className="absolute inset-0 vault-glass rounded-lg border-2 border-neon/30 flex flex-col items-center justify-center p-8">
                            <div className="relative w-32 h-32 mb-8">
                                {/* Vault Wheel */}
                                <div className="absolute inset-0 rounded-full border-4 border-neon/50 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full border-2 border-neon/30 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center">
                                            <Lock className="text-neon text-2xl" />
                                        </div>
                                    </div>
                                </div>
                                {/* Spinning Gears */}
                                <div className="absolute -top-2 -left-2 w-8 h-8">
                                    <Lock className="text-neon/60 text-xl animate-spin" style={{ animationDuration: '4s' }} />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8">
                                    <Lock className="text-neon/60 text-xl animate-spin" style={{ animationDuration: '6s' }} />
                                </div>
                            </div>
                            
                            <h2 className="text-4xl font-bold text-neon mb-4">SECURE VAULT</h2>
                            
                            {/* Access Panel */}
                            <div className="relative w-full max-w-xs bg-black/30 rounded-lg p-4 border border-neon/20 mb-6">
                                <div className="absolute inset-0 overflow-hidden rounded-lg">
                                    <div className="scan-line absolute top-0 left-0 right-0 h-8 opacity-70 animate-scan"></div>
                                </div>
                                
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-neon/80">ACCESS CODE:</span>
                                    <span className="text-xs text-neon flex items-center">
                                        <span className="inline-block w-2 h-2 bg-neon rounded-full mr-1"></span>
                                        VERIFIED
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-4 gap-2 mb-3">
                                    <div className="h-2 bg-neon/50 rounded-sm"></div>
                                    <div className="h-2 bg-neon/50 rounded-sm"></div>
                                    <div className="h-2 bg-neon/50 rounded-sm"></div>
                                    <div className="h-2 bg-neon/50 rounded-sm"></div>
                                </div>
                                
                                <div className="text-center text-neon/70 text-sm">
                                    INITIALIZING SECURE CONNECTION...
                                </div>
                            </div>
                            
                            <p className="text-neon/60 text-sm">Loading premium assets...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className={`container mx-auto px-4 py-12 max-w-7xl relative ${vaultOpen ? '' : 'hidden'}`}>
                {/* Hero Section */}
                <section className="mb-16 text-center">
                    <div className="inline-block px-6 py-2 rounded-full bg-neon/10 border border-neon/20 mb-6">
                        <span className="text-neon font-medium">PREMIUM MEMBER ACCESS</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon to-cyber mb-4">
                        VAULT ACCESS
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        All premium assets at your fingertips. Download exclusive templates, dashboards, and resources.
                    </p>
                </section>
                
                {/* Filter Controls */}
                <div className="mb-12 vault-glass rounded-xl p-6">
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                        <button 
                            className={`category-chip px-4 py-2 rounded-full ${selectedCategory === 'All Assets' ? 'bg-neon/20 text-neon border-neon/20' : 'bg-glass hover:bg-neon/10 text-gray-300 border-gray-700'} transition-all`}
                            onClick={() => setSelectedCategory('All Assets')}
                        >
                            <Filter className="inline-block mr-2" size={16} />All Assets
                        </button>
                        <button 
                            className={`category-chip px-4 py-2 rounded-full ${selectedCategory === 'Finance' ? 'bg-neon/20 text-neon border-neon/20' : 'bg-glass hover:bg-neon/10 text-gray-300 border-gray-700'} transition-all`}
                            onClick={() => setSelectedCategory('Finance')}
                        >
                            <DollarSign className="inline-block mr-2" size={16} />Finance
                        </button>
                        <button 
                            className={`category-chip px-4 py-2 rounded-full ${selectedCategory === 'Business' ? 'bg-plasma/20 text-plasma border-plasma/20' : 'bg-glass hover:bg-plasma/10 text-gray-300 border-gray-700'} transition-all`}
                            onClick={() => setSelectedCategory('Business')}
                        >
                            <Briefcase className="inline-block mr-2" size={16} />Business
                        </button>
                        <button 
                            className={`category-chip px-4 py-2 rounded-full ${selectedCategory === 'AI Tools' ? 'bg-cyber/20 text-cyber border-cyber/20' : 'bg-glass hover:bg-cyber/10 text-gray-300 border-gray-700'} transition-all`}
                            onClick={() => setSelectedCategory('AI Tools')}
                        >
                            <Bot className="inline-block mr-2" size={16} />AI Tools
                        </button>
                        <button 
                            className={`category-chip px-4 py-2 rounded-full ${selectedCategory === 'eBook' ? 'bg-purple-500/20 text-purple-400 border-purple-500/20' : 'bg-glass hover:bg-purple-500/10 text-gray-300 border-gray-700'} transition-all`}
                            onClick={() => setSelectedCategory('eBook')}
                        >
                            <Book className="inline-block mr-2" size={16} />eBooks
                        </button>
                    </div>
                    <div className="relative w-full max-w-md mx-auto">
                        <input 
                            type="text" 
                            placeholder="Search assets..." 
                            className="w-full p-3 pl-10 rounded-lg bg-darkglass border border-neon/20 text-platinum focus:outline-none focus:ring-2 focus:ring-neon/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neon/60" size={20} />
                    </div>
                </div>
                
                {/* Asset Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {filteredAssets.map(asset => (
                        <div key={asset.id} className="asset-card vault-glass rounded-xl overflow-hidden border border-gray-800 transition-all duration-300">
                            <div className="relative overflow-hidden">
                                <div className={`asset-thumbnail h-48 flex items-center justify-center transition-all
                                    ${asset.category === 'Finance' && asset.type === 'Notion' ? 'bg-gradient-to-br from-neon/10 to-cyber/10' : ''}
                                    ${asset.category === 'Finance' && asset.type === 'Excel' ? 'bg-gradient-to-br from-plasma/10 to-purple-500/10' : ''}
                                    ${asset.category === 'Business' ? 'bg-gradient-to-br from-cyber/10 to-green-500/10' : ''}
                                    ${asset.category === 'eBook' ? 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10' : ''}
                                    ${asset.category === 'AI Tools' ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10' : ''}
                                    ${asset.category === 'Finance' && asset.type === 'Video' ? 'bg-gradient-to-br from-green-500/10 to-blue-500/10' : ''}
                                `}>
                                    {asset.icon}
                                </div>
                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs
                                    ${asset.type === 'Notion' ? 'bg-neon/20 text-neon' : ''}
                                    ${asset.type === 'Excel' ? 'bg-plasma/20 text-plasma' : ''}
                                    ${asset.type === 'Sheets' ? 'bg-cyber/20 text-cyber' : ''}
                                    ${asset.type === 'PDF + ePub' ? 'bg-purple-500/20 text-purple-400' : ''}
                                    ${asset.type === 'Web App' ? 'bg-red-500/20 text-red-400' : ''}
                                    ${asset.type === 'Video' ? 'bg-green-500/20 text-green-400' : ''}
                                `}>
                                    {asset.typeIcon} {asset.type}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-2">
                                    <h3 className="text-xl font-semibold">{asset.title}</h3>
                                </div>
                                <p className="text-gray-400 mb-4">
                                    {asset.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`px-2 py-1 rounded-full text-xs
                                        ${asset.category === 'Finance' ? 'bg-neon/10 text-neon' : ''}
                                        ${asset.category === 'Business' ? 'bg-gray-700/50 text-gray-300' : ''}
                                        ${asset.category === 'AI Tools' ? 'bg-cyber/10 text-cyber' : ''}
                                        ${asset.category === 'eBook' ? 'bg-purple-500/10 text-purple-400' : ''}
                                    `}>
                                        {asset.category}
                                    </span>
                                    <span className="px-2 py-1 rounded-full bg-gray-800 text-gray-300 text-xs">{asset.updated}</span>
                                </div>
                                <button className={`w-full py-3 rounded-lg font-medium border transition-colors flex items-center justify-center
                                    ${asset.category === 'Finance' && asset.type === 'Notion' ? 'bg-neon/10 hover:bg-neon/20 text-neon border-neon/20' : ''}
                                    ${asset.category === 'Finance' && asset.type === 'Excel' ? 'bg-plasma/10 hover:bg-plasma/20 text-plasma border-plasma/20' : ''}
                                    ${asset.category === 'Business' ? 'bg-cyber/10 hover:bg-cyber/20 text-cyber border-cyber/20' : ''}
                                    ${asset.category === 'eBook' ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/20' : ''}
                                    ${asset.category === 'AI Tools' ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20' : ''}
                                    ${asset.category === 'Finance' && asset.type === 'Video' ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/20' : ''}
                                `}>
                                    <Download className="mr-2" size={20} /> Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-800 mt-12">
                    <p>&copy; 2023 FlowFund Vault. All rights reserved.</p>
                </footer>
            </div>

            <style jsx>{`
                .bg-vault {
                    background-color: #0a0a1a;
                }

                .text-platinum {
                    color: #e0e0e0;
                }

                .text-neon {
                    color: #00f2ff;
                }

                .text-plasma {
                    color: #8a2be2;
                }

                .text-cyber {
                    color: #00bcd4;
                }

                .darkglass {
                    background-color: rgba(15, 23, 42, 0.7);
                }

                .vault-door {
                    animation: vaultOpen 1.5s forwards;
                }

                @keyframes vaultOpen {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; visibility: hidden; }
                }

                @keyframes vaultOpenReverse {
                    0% { transform: scale(1.5); opacity: 0; visibility: hidden; }
                    100% { transform: scale(1); opacity: 1; visibility: visible; }
                }

                .vault-glass {
                    background: rgba(10, 20, 40, 0.6);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(0, 242, 255, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                }

                .scan-line {
                    background: linear-gradient(to bottom, transparent, rgba(0, 242, 255, 0.8), transparent);
                    animation: scan 2s infinite linear;
                }

                @keyframes scan {
                    0% { top: -100%; }
                    100% { top: 100%; }
                }

                .asset-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 40px rgba(0, 242, 255, 0.5);
                }

                .asset-thumbnail {
                    background-color: rgba(15, 23, 42, 0.7);
                }
            `}</style>
        </div>
    );
};

export default Vault;
