import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Upload, TrendingUp, TrendingDown, Wallet, Lightbulb, LayoutGrid, Eye, Bot, LineChart, BarChart } from 'lucide-react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

const MissionTracker = () => {
    const incomeChartRef = useRef(null);
    const expenseChartRef = useRef(null);

    useEffect(() => {
        // Destroy existing charts if they exist
        if (incomeChartRef.current && incomeChartRef.current.chart) {
            incomeChartRef.current.chart.destroy();
        }
        if (expenseChartRef.current && expenseChartRef.current.chart) {
            expenseChartRef.current.chart.destroy();
        }

        Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);
        
        // Income Trend Chart
        const incomeCtx = incomeChartRef.current.getContext('2d');
        incomeChartRef.current.chart = new Chart(incomeCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Income',
                    data: [3000, 3200, 3500, 3300, 3800, 4200],
                    borderColor: '#00f2ff',
                    backgroundColor: 'rgba(0, 242, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });

        // Expense Distribution Chart
        const expenseCtx = expenseChartRef.current.getContext('2d');
        expenseChartRef.current.chart = new Chart(expenseCtx, {
            type: 'bar',
            data: {
                labels: ['Housing', 'Food', 'Transport', 'Entertain.', 'Subscript.'],
                datasets: [{
                    label: 'Expenses',
                    data: [1200, 450, 300, 180, 120],
                    backgroundColor: ['#00f2ff', '#7BBF8B', '#EBC96D', '#FF6B6B', '#8A2BE2'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });

        return () => {
            if (incomeChartRef.current && incomeChartRef.current.chart) {
                incomeChartRef.current.chart.destroy();
            }
            if (expenseChartRef.current && expenseChartRef.current.chart) {
                expenseChartRef.current.chart.destroy();
            }
        };
    }, []);

    const liveFeedItems = [
        {
            type: 'expense',
            amount: 45,
            category: 'Transport',
            tag: 'Mobility',
            time: '2 min ago',
            aiTag: null
        },
        {
            type: 'income',
            amount: 1200,
            category: 'Client Project',
            tag: 'Freelance Income',
            time: '1 hour ago',
            aiTag: null
        },
        {
            type: 'expense',
            amount: 89.99,
            category: 'Amazon',
            tag: 'Shopping',
            time: '3 hours ago',
            aiTag: 'Irregular Expense'
        },
        {
            type: 'expense',
            amount: 15.99,
            category: 'Netflix',
            tag: 'Subscription',
            time: '5 hours ago',
            aiTag: 'Recurring Subscription'
        },
        {
            type: 'income',
            amount: 50,
            category: 'Side Hustle',
            tag: 'Passive Income',
            time: 'Yesterday',
            aiTag: null
        },
        {
            type: 'expense',
            amount: 75,
            category: 'Groceries',
            tag: 'Food',
            time: 'Yesterday',
            aiTag: null
        },
    ];

    return (
        <div className="min-h-screen bg-onyx text-white relative">
            <div className="financial-network"></div>
            
            {/* Main Container */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold neon-glow">Mission Tracker</h1>
                        <p className="text-gray-400">Live Financial Telemetry</p>
                    </div>
                    <div className="flex space-x-4">
                        <button className="px-4 py-2 rounded-lg glass-panel neon-border btn-hover-glow flex items-center">
                            <Plus className="h-5 w-5 mr-2" />
                            Add Entry
                        </button>
                        <button className="px-4 py-2 rounded-lg glass-panel neon-border btn-hover-glow flex items-center">
                            <Upload className="h-5 w-5 mr-2" />
                            Export
                        </button>
                    </div>
                </div>
                
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="glass-panel rounded-xl p-6 kpi-card neon-border">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm">Total Income</p>
                                <h2 className="text-3xl font-bold mt-2">$4,850</h2>
                            </div>
                            <div className="bg-green-900 bg-opacity-30 p-2 rounded-full">
                                <TrendingUp className="h-5 w-5 text-green-400" />
                            </div>
                        </div>
                        <p className="text-green-400 text-sm mt-4">+12% from last month</p>
                    </div>
                    
                    <div className="glass-panel rounded-xl p-6 kpi-card neon-border">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm">Total Expenses</p>
                                <h2 className="text-3xl font-bold mt-2">$2,670</h2>
                            </div>
                            <div className="bg-red-900 bg-opacity-30 p-2 rounded-full">
                                <TrendingDown className="h-5 w-5 text-red-400" />
                            </div>
                        </div>
                        <p className="text-red-400 text-sm mt-4">+5% from last month</p>
                    </div>
                    
                    <div className="glass-panel rounded-xl p-6 kpi-card neon-border">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm">Net Balance</p>
                                <h2 className="text-3xl font-bold mt-2">$2,180</h2>
                            </div>
                            <div className="bg-green-900 bg-opacity-30 p-2 rounded-full">
                                <Wallet className="h-5 w-5 text-green-400" />
                            </div>
                        </div>
                        <p className="text-green-400 text-sm mt-4">Savings rate: 45%</p>
                    </div>
                    
                    <div className="glass-panel rounded-xl p-6 kpi-card neon-border">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm">AI Insights</p>
                                <h2 className="text-xl font-bold mt-2">Optimize Subscriptions</h2>
                            </div>
                            <div className="bg-blue-900 bg-opacity-30 p-2 rounded-full">
                                <Lightbulb className="h-5 w-5 text-blue-400" />
                            </div>
                        </div>
                        <p className="text-blue-400 text-sm mt-4">Potential savings: $120/mo</p>
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Categories */}
                    <div className="lg:col-span-1 glass-panel rounded-xl p-6 neon-border">
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            <LayoutGrid className="h-6 w-6 mr-2 text-blue-400" />
                            Categories
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-900 bg-opacity-50">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                                    <span>Housing</span>
                                </div>
                                <span className="font-mono">$1,200</span>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-900 bg-opacity-50">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                                    <span>Food</span>
                                </div>
                                <span className="font-mono">$450</span>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-900 bg-opacity-50">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                                    <span>Transport</span>
                                </div>
                                <span className="font-mono">$300</span>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-900 bg-opacity-50">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                                    <span>Entertainment</span>
                                </div>
                                <span className="font-mono">$180</span>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-900 bg-opacity-50">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                                    <span>Subscriptions</span>
                                </div>
                                <span className="font-mono">$120</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column - Charts */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass-panel rounded-xl p-6 neon-border">
                                <h3 className="text-xl font-bold mb-6 flex items-center">
                                    <LineChart className="h-6 w-6 mr-2 text-blue-400" />
                                    Income Trend
                                </h3>
                                <div className="h-48">
                                    <canvas ref={incomeChartRef}></canvas>
                                </div>
                            </div>
                            <div className="glass-panel rounded-xl p-6 neon-border">
                                <h3 className="text-xl font-bold mb-6 flex items-center">
                                    <BarChart className="h-6 w-6 mr-2 text-purple-400" />
                                    Expense Distribution
                                </h3>
                                <div className="h-48">
                                    <canvas ref={expenseChartRef}></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionTracker;
