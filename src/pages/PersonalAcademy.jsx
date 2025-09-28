import React from 'react';
import { Brain, Map, Sprout, GraduationCap, Briefcase, Coins, Box, Video, Trophy, FileText, Book, Star, Award, Medal, Clock } from 'lucide-react';

const PersonalAcademy = () => {
    return (
        <div className="min-h-screen bg-onyx text-platinum antialiased">
            {/* Main Container */}
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Header */}
                <header className="flex flex-col items-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mr-4">
                            <Brain className="text-teal text-2xl" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal to-sapphire bg-clip-text text-transparent">
                            Financial Intelligence Hub
                        </h1>
                    </div>
                    <p className="text-platinum/80 text-lg md:text-xl text-center max-w-2xl">
                        Your personalized learning terminal for mastering money at every stage
                    </p>
                </header>
                
                {/* Learning Paths */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center">
                        <Map className="text-emerald mr-3" />
                        Choose Your Learning Path
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Beginner Blueprint */}
                        <div className="learning-terminal rounded-2xl p-6 transition-all duration-300 path-card">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center mr-4">
                                    <Sprout className="text-teal text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold">Beginner Blueprint</h3>
                            </div>
                            <p className="text-platinum/70 mb-4">
                                Master the fundamentals of personal finance, budgeting, and debt management.
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-platinum/60">
                                    <Clock className="inline-block mr-1" size={12} />
                                    <span>8 modules</span>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-teal/10 hover:bg-teal/20 text-teal font-medium transition-colors">
                                    Start Path
                                </button>
                            </div>
                        </div>
                        
                        {/* Student Survival */}
                        <div className="learning-terminal rounded-2xl p-6 transition-all duration-300 path-card">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center mr-4">
                                    <GraduationCap className="text-emerald text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold">Student Survival</h3>
                            </div>
                            <p className="text-platinum/70 mb-4">
                                Budgeting for students, managing loans, and building credit while in school.
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-platinum/60">
                                    <Clock className="inline-block mr-1" size={12} />
                                    <span>6 modules</span>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-emerald/10 hover:bg-emerald/20 text-emerald font-medium transition-colors">
                                    Start Path
                                </button>
                            </div>
                        </div>
                        
                        {/* Business Finance Mastery */}
                        <div className="learning-terminal rounded-2xl p-6 transition-all duration-300 path-card">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-sapphire/10 flex items-center justify-center mr-4">
                                    <Briefcase className="text-sapphire text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold">Business Finance</h3>
                            </div>
                            <p className="text-platinum/70 mb-4">
                                Accounting, cash flow management, and financial planning for entrepreneurs.
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-platinum/60">
                                    <Clock className="inline-block mr-1" size={12} />
                                    <span>10 modules</span>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-sapphire/10 hover:bg-sapphire/20 text-sapphire font-medium transition-colors">
                                    Start Path
                                </button>
                            </div>
                        </div>
                        
                        {/* Passive Income Playbook */}
                        <div className="learning-terminal rounded-2xl p-6 transition-all duration-300 path-card">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mr-4">
                                    <Coins className="text-gold text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold">Passive Income</h3>
                            </div>
                            <p className="text-platinum/70 mb-4">
                                Build wealth through investments, royalties, and automated income streams.
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-platinum/60">
                                    <Lock className="inline-block mr-1" size={12} />
                                    <span>Complete Beginner first</span>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-slate/20 text-platinum/50 font-medium cursor-not-allowed">
                                    Locked
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Features Grid */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center">
                        <Box className="text-teal mr-3" />
                        Learning Features
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Video Courses */}
                        <div className="learning-terminal rounded-2xl p-6 border border-slate/30 transition-all duration-300 feature-card">
                            <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center mb-4">
                                <Video className="text-teal text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Video Courses</h3>
                            <p className="text-platinum/70 text-sm">
                                200+ expert-led video lessons with interactive exercises
                            </p>
                        </div>
                        
                        {/* Daily Challenges */}
                        <div className="learning-terminal rounded-2xl p-6 border border-slate/30 transition-all duration-300 feature-card">
                            <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center mb-4">
                                <Trophy className="text-emerald text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Daily Challenges</h3>
                            <p className="text-platinum/70 text-sm">
                                Bite-sized missions to apply what you learn
                            </p>
                        </div>
                        
                        {/* Certification */}
                        <div className="learning-terminal rounded-2xl p-6 border border-slate/30 transition-all duration-300 feature-card">
                            <div className="w-12 h-12 rounded-full bg-sapphire/10 flex items-center justify-center mb-4">
                                <FileText className="text-sapphire text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Certification</h3>
                            <p className="text-platinum/70 text-sm">
                                Earn verifiable credentials for completed paths
                            </p>
                        </div>
                        
                        {/* Knowledge Vault */}
                        <div className="learning-terminal rounded-2xl p-6 border border-slate/30 transition-all duration-300 feature-card">
                            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                                <Book className="text-gold text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Knowledge Vault</h3>
                            <p className="text-platinum/70 text-sm">
                                Searchable library of templates, scripts, and resources
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Current Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Featured Course */}
                    <div className="lg:col-span-2 learning-terminal rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold flex items-center">
                                <Star className="text-gold mr-3" />
                                Featured Course
                            </h2>
                            <div className="text-xs bg-emerald/10 text-emerald px-3 py-1 rounded-full">
                                AI Recommended
                            </div>
                        </div>
                        
                        <div className="video-container rounded-xl mb-4 flex items-center justify-center">
                            <Video className="text-white text-4xl" />
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-2">Budget Mastery</h3>
                        <p className="text-platinum/80 mb-4">
                            Learn the 50/30/20 rule, zero-based budgeting, and how to automate your finances for stress-free money management.
                        </p>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-platinum/60">
                                <Clock className="inline-block mr-2" size={16} />
                                <span>2h 15m • 12 lessons</span>
                            </div>
                            <button className="px-4 py-2 rounded-lg bg-teal/10 hover:bg-teal/20 text-teal font-medium transition-colors">
                                Start Learning
                            </button>
                        </div>
                    </div>
                    
                    {/* Progress & Badges */}
                    <div className="learning-terminal rounded-2xl p-6">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <Award className="text-gold mr-3" />
                            Your Progress
                        </h2>
                        
                        {/* Progress Rings */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex flex-col items-center">
                                <div className="relative w-20 h-20 mb-2">
                                    <svg className="w-full h-full" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="15" fill="none" stroke="#1e293b" strokeWidth="3"></circle>
                                        <circle cx="18" cy="18" r="15" fill="none" stroke="#2dd4bf" strokeWidth="3" strokeDasharray="80 100" strokeDashoffset="0" className="progress-ring"></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-teal">80%</div>
                                </div>
                                <span className="text-xs text-center">Beginner Path</span>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <div className="relative w-20 h-20 mb-2">
                                    <svg className="w-full h-full" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="15" fill="none" stroke="#1e293b" strokeWidth="3"></circle>
                                        <circle cx="18" cy="18" r="15" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="45 100" strokeDashoffset="0" className="progress-ring"></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-sapphire">45%</div>
                                </div>
                                <span className="text-xs text-center">Student Path</span>
                            </div>
                        </div>
                        
                        {/* Badges */}
                        <h3 className="font-medium mb-3 flex items-center">
                            <Medal className="text-gold mr-2" />
                            Earned Badges
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="badge-card bg-slate rounded-xl p-3 text-center">
                                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-2">
                                    <Medal className="text-gold" />
                                </div>
                                <span className="text-xs">Budget Master</span>
                            </div>
                            <div className="badge-card bg-slate rounded-xl p-3 text-center">
                                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-2">
                                    <Medal className="text-gold" />
                                </div>
                                <span className="text-xs">Debt Destroyer</span>
                            </div>
                            <div className="badge-card bg-slate rounded-xl p-3 text-center">
                                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-2">
                                    <Medal className="text-gold" />
                                </div>
                                <span className="text-xs">Investor Initiate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-6 text-platinum/60 text-sm border-t border-slate mt-12">
                <p>&copy; 2023 FlowFund Academy. All rights reserved.</p>
            </footer>

            <style jsx>{`
                .bg-onyx {
                    background-color: #0a0a1a;
                }

                .text-platinum {
                    color: #e0e0e0;
                }

                .text-teal {
                    color: #2dd4bf;
                }

                .text-emerald {
                    color: #34d399;
                }

                .text-sapphire {
                    color: #3b82f6;
                }

                .text-gold {
                    color: #fbbf24;
                }

                .bg-teal\/10 {
                    background-color: rgba(45, 212, 191, 0.1);
                }

                .bg-emerald\/10 {
                    background-color: rgba(52, 211, 153, 0.1);
                }

                .bg-sapphire\/10 {
                    background-color: rgba(59, 130, 246, 0.1);
                }

                .bg-gold\/10 {
                    background-color: rgba(251, 191, 36, 0.1);
                }

                .bg-slate\/20 {
                    background-color: rgba(30, 41, 59, 0.2);
                }

                .bg-slate {
                    background-color: #1e293b;
                }

                .learning-terminal {
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(45, 212, 191, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                }

                .path-card:hover {
                    border-color: #34d399;
                    box-shadow: 0 8px 40px rgba(52, 211, 153, 0.5);
                }

                .feature-card:hover {
                    border-color: #60a5fa;
                    box-shadow: 0 8px 40px rgba(96, 165, 250, 0.5);
                }

                .video-container {
                    background-color: #1e293b;
                    height: 200px;
                    border: 1px solid #2dd4bf;
                }

                .progress-ring {
                    transform: rotate(-90deg);
                    transform-origin: 50% 50%;
                }

                .badge-card {
                    border: 1px solid #fbbf24;
                    box-shadow: 0 0 8px rgba(251, 191, 36, 0.4);
                }
            `}</style>
        </div>
    );
};

export default PersonalAcademy;
