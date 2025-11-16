import React, { useEffect, useRef } from 'react';
import { Rocket, ArrowUp, Clock, Wallet, LineChart, Users, ChartPie, Tags, Projector, Flame, Bot, Lightbulb, Banknote, TrendingUp } from 'lucide-react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

const GrowthEngine = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (chartRef.current) {
            Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
            const ctx = chartRef.current.getContext("2d");
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [
                        {
                            label: 'Revenue',
                            data: [18000, 20000, 22000, 25000, 28000, 30000, 32000],
                            borderColor: '#2dd4bf',
                            backgroundColor: 'rgba(45, 212, 191, 0.2)',
                            fill: true,
                            tension: 0.4,
                        },
                        {
                            label: 'Expenses',
                            data: [10000, 11000, 12000, 13000, 14000, 15000, 16000],
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            fill: true,
                            tension: 0.4,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#e0f2fe',
                            },
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#e0f2fe',
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                            },
                        },
                        y: {
                            ticks: {
                                color: '#e0f2fe',
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                            },
                        },
                    },
                },
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-void text-mist antialiased">
            {/* Main Container */}
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Header */}
                <header className="flex flex-col items-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                        <div className="growth-radar w-16 h-16 rounded-full flex items-center justify-center mr-4">
                            <Rocket className="text-white text-2xl" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal to-emerald bg-clip-text text-transparent">
                            Growth Engine
                        </h1>
                    </div>
                    <p className="text-mist/80 text-lg md:text-xl text-center max-w-2xl">
                        Business Intelligence Command • AI-powered scaling for your revenue engine
                    </p>
                </header>
                
                {/* Quick KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* MRR */}
                    <div className="glass-panel rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-mist/80">Monthly Recurring Revenue</h3>
                            <div className="px-2 py-1 rounded-full bg-emerald/10 text-emerald text-xs font-medium">
                                <ArrowUp className="inline-block mr-1" size={12} /> 12.4%
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-teal mb-2">$24,589</div>
                        <div className="flex items-center text-xs text-mist/60">
                            <Clock className="inline-block mr-1" size={12} />
                            <span>Last 30 days</span>
                        </div>
                    </div>
                    
                    {/* Cash Runway */}
                    <div className="glass-panel rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-mist/80">Cash Runway</h3>
                            <div className="px-2 py-1 rounded-full bg-sapphire/10 text-sapphire text-xs font-medium">
                                <Clock className="inline-block mr-1" size={12} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-emerald mb-2">8.2 months</div>
                        <div className="flex items-center text-xs text-mist/60">
                            <Wallet className="inline-block mr-1" size={12} />
                            <span>$198,742 in bank</span>
                        </div>
                    </div>
                    
                    {/* Conversion Rate */}
                    <div className="glass-panel rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-mist/80">Conversion Rate</h3>
                            <div className="px-2 py-1 rounded-full bg-teal/10 text-teal text-xs font-medium">
                                <LineChart className="inline-block mr-1" size={12} /> 3.2%
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-sapphire mb-2">4.7%</div>
                        <div className="flex items-center text-xs text-mist/60">
                            <Users className="inline-block mr-1" size={12} />
                            <span>1,245 visitors</span>
                        </div>
                    </div>
                </div>
                
                {/* Tools Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center">
                        <Projector className="text-teal mr-3" />
                        Growth Tools
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Profit Optimizer */}
                        <div className="glass-panel rounded-2xl p-6 transition-all duration-300 tool-card">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center mr-4">
                                    <ChartPie className="text-teal text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold">Profit Optimizer</h3>
                            </div>
                            <p className="text-mist/70 mb-4">
                                AI analyzes your margins and suggests optimizations to increase profitability.
                            </p>
                            <div className="bg-ocean rounded-xl p-3 mb-3">
                                <div className="text-xs text-mist/60 mb-1">Top Suggestion</div>
                                <div className="text-sm font-medium text-teal">Reduce AWS costs by 18%</div>
                            </div>
                            <button className="w-full py-2 rounded-lg bg-teal/10 hover:bg-teal/20 text-teal font-medium transition-colors">
                                Optimize Now
                            </button>
                        </div>
                        
                        {/* Pricing Analyzer */}
                        <div className="glass-panel rounded-2xl p-6 transition-all duration-300 tool-card">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center mr-4">
                                    <Tags className="text-emerald text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold">Pricing Analyzer</h3>
                            </div>
                            <p className="text-mist/70 mb-4">
                                Compare your pricing against competitors and market benchmarks.
                            </p>
                            <div className="bg-ocean rounded-xl p-3 mb-3">
                                <div className="text-xs text-mist/60 mb-1">Opportunity</div>
                                <div className="text-sm font-medium text-emerald">Enterprise tier underpriced by 22%</div>
                            </div>
                            <button className="w-full py-2 rounded-lg bg-emerald/10 hover:bg-emerald/20 text-emerald font-medium transition-colors">
                                Analyze Pricing
                            </button>
                        </div>
                        
                        {/* Revenue Simulator */}
                        <div className="glass-panel rounded-2xl p-6 transition-all duration-300 tool-card">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-sapphire/10 flex items-center justify-center mr-4">
                                    <Projector className="text-sapphire text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold">Revenue Simulator</h3>
                            </div>
                            <p className="text-mist/70 mb-4">
                                Model different growth scenarios and their financial impact.
                            </p>
                            <div className="bg-ocean rounded-xl p-3 mb-3">
                                <div className="text-xs text-mist/60 mb-1">Projection</div>
                                <div className="text-sm font-medium text-sapphire">+$48K MRR with current conversion</div>
                            </div>
                            <button className="w-full py-2 rounded-lg bg-sapphire/10 hover:bg-sapphire/20 text-sapphire font-medium transition-colors">
                                Run Simulation
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Financial Heatmaps */}
                <div className="glass-panel rounded-2xl p-6 mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <Flame className="text-teal mr-3" />
                            Financial Heatmaps
                        </h2>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 rounded-full bg-ocean text-xs text-mist">Revenue</button>
                            <button className="px-3 py-1 rounded-full bg-ocean text-xs text-mist">Profit</button>
                            <button className="px-3 py-1 rounded-full bg-ocean text-xs text-mist">Costs</button>
                        </div>
                    </div>
                    <div className="relative h-64">
                        {/* Placeholder for heatmap visualization */}
                        <div className="absolute inset-0 flex items-center justify-center text-mist/50 text-lg">
                            [Interactive Heatmap Visualization Here]
                        </div>
                    </div>
                </div>

                {/* AI-Powered Insights */}
                <div className="glass-panel rounded-2xl p-6">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center">
                        <Bot className="text-emerald mr-3" />
                        AI-Powered Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-ocean rounded-xl p-4">
                            <h3 className="font-semibold text-lg mb-1">Customer Segmentation</h3>
                            <p className="text-mist/70">AI identifies key customer segments and their unique behaviors. Tailored marketing campaigns can increase engagement by 15%.</p>
                        </div>
                        <div className="bg-ocean rounded-xl p-4">
                            <h3 className="font-semibold text-lg mb-1">Churn Prediction</h3>
                            <p className="text-mist/70">Predicts customers likely to churn with 90% accuracy. Proactive interventions can save up to 10% of at-risk revenue.</p>
                        </div>
                        <div className="bg-ocean rounded-xl p-4">
                            <h3 className="font-semibold text-lg mb-1">High-Value Clients</h3>
                            <p className="text-mist/70">Identify and nurture clients with the highest lifetime value. Personalized outreach can increase retention by 20%.</p>
                        </div>
                        <div className="bg-ocean rounded-xl p-4">
                            <h3 className="font-semibold text-lg mb-1">At-Risk Customers</h3>
                            <p className="text-mist/70">Proactively engage with customers showing signs of churn. Targeted offers can reduce churn rate by 10%.</p>
                        </div>
                        <div className="bg-ocean rounded-xl p-4">
                            <h3 className="font-semibold text-lg mb-1">Growth Opportunities</h3>
                            <p className="text-mist/70">Discover segments ready for upsell or cross-sell. AI recommends product bundles based on their usage patterns.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrowthEngine;
