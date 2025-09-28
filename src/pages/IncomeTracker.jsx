import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign, TrendingUp, Calendar, Briefcase, Clock, BarChart3, PieChart } from 'lucide-react';

const IncomeTracker = () => {
    const [incomes, setIncomes] = useState([
        { id: 1, source: 'Salary', amount: 4500, frequency: 'Monthly', nextPayment: '2025-10-01', color: 'from-green-500 to-emerald-500', icon: '💼' },
        { id: 2, source: 'Freelance', amount: 800, frequency: 'Weekly', nextPayment: '2025-09-25', color: 'from-blue-500 to-cyan-500', icon: '💻' },
        { id: 3, source: 'Investments', amount: 250, frequency: 'Monthly', nextPayment: '2025-10-05', color: 'from-purple-500 to-violet-500', icon: '📈' },
        { id: 4, source: 'Side Business', amount: 300, frequency: 'Bi-weekly', nextPayment: '2025-09-30', color: 'from-orange-500 to-red-500', icon: '🚀' }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingIncome, setEditingIncome] = useState(null);
    const [formData, setFormData] = useState({
        source: '',
        amount: '',
        frequency: 'Monthly',
        nextPayment: '',
        icon: '💼'
    });

    const frequencies = ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Annually'];
    const availableIcons = ['💼', '💻', '📈', '🚀', '🏦', '🎯', '💰', '🔧', '🎨', '📚', '🏠', '⚡', '🌟', '🎪', '🎵'];
    const colors = [
        'from-green-500 to-emerald-500',
        'from-blue-500 to-cyan-500',
        'from-purple-500 to-violet-500',
        'from-orange-500 to-red-500',
        'from-pink-500 to-rose-500',
        'from-indigo-500 to-blue-500',
        'from-yellow-500 to-amber-500',
        'from-teal-500 to-green-500'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newIncome = {
            id: editingIncome ? editingIncome.id : Date.now(),
            ...formData,
            amount: parseFloat(formData.amount),
            color: colors[Math.floor(Math.random() * colors.length)]
        };

        if (editingIncome) {
            setIncomes(incomes.map(inc => inc.id === editingIncome.id ? newIncome : inc));
        } else {
            setIncomes([...incomes, newIncome]);
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            source: '',
            amount: '',
            frequency: 'Monthly',
            nextPayment: '',
            icon: '💼'
        });
        setEditingIncome(null);
        setShowModal(false);
    };

    const handleEdit = (income) => {
        setEditingIncome(income);
        setFormData({
            source: income.source,
            amount: income.amount.toString(),
            frequency: income.frequency,
            nextPayment: income.nextPayment,
            icon: income.icon
        });
        setShowModal(true);
    };

    const handleDelete = (incomeId) => {
        setIncomes(incomes.filter(inc => inc.id !== incomeId));
    };

    const calculateMonthlyTotal = () => {
        return incomes.reduce((total, income) => {
            let monthlyAmount = income.amount;
            switch (income.frequency) {
                case 'Weekly':
                    monthlyAmount = income.amount * 4.33; // Average weeks per month
                    break;
                case 'Bi-weekly':
                    monthlyAmount = income.amount * 2.17; // Average bi-weeks per month
                    break;
                case 'Quarterly':
                    monthlyAmount = income.amount / 3;
                    break;
                case 'Annually':
                    monthlyAmount = income.amount / 12;
                    break;
                default: // Monthly
                    monthlyAmount = income.amount;
            }
            return total + monthlyAmount;
        }, 0);
    };

    const calculateAnnualTotal = () => {
        return calculateMonthlyTotal() * 12;
    };

    const getDaysUntilPayment = (nextPayment) => {
        const today = new Date();
        const paymentDate = new Date(nextPayment);
        const diffTime = paymentDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const AnimatedCounter = ({ value, prefix = '$', suffix = '' }) => {
        const [displayValue, setDisplayValue] = useState(0);

        useEffect(() => {
            const duration = 1500;
            const steps = 60;
            const increment = value / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setDisplayValue(value);
                    clearInterval(timer);
                } else {
                    setDisplayValue(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }, [value]);

        return (
            <span className="font-bold text-3xl">
                {prefix}{displayValue.toLocaleString()}{suffix}
            </span>
        );
    };

    const AnimatedBar = ({ income, maxAmount }) => {
        const [animatedWidth, setAnimatedWidth] = useState(0);
        const monthlyAmount = income.frequency === 'Weekly' ? income.amount * 4.33 :
                             income.frequency === 'Bi-weekly' ? income.amount * 2.17 :
                             income.frequency === 'Quarterly' ? income.amount / 3 :
                             income.frequency === 'Annually' ? income.amount / 12 :
                             income.amount;

        useEffect(() => {
            const timer = setTimeout(() => {
                setAnimatedWidth((monthlyAmount / maxAmount) * 100);
            }, 100);
            return () => clearTimeout(timer);
        }, [monthlyAmount, maxAmount]);

        return (
            <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full bg-gradient-to-r ${income.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${animatedWidth}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                    ${monthlyAmount.toFixed(0)}/month
                </div>
            </div>
        );
    };

    const monthlyTotal = calculateMonthlyTotal();
    const annualTotal = calculateAnnualTotal();
    const maxMonthlyAmount = Math.max(...incomes.map(income => {
        switch (income.frequency) {
            case 'Weekly': return income.amount * 4.33;
            case 'Bi-weekly': return income.amount * 2.17;
            case 'Quarterly': return income.amount / 3;
            case 'Annually': return income.amount / 12;
            default: return income.amount;
        }
    }));

    return (
        <div className="min-h-screen bg-deep-space text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] to-[#001f3f] opacity-100"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500/20 blur-xl animate-pulse"></div>
                    <div className="absolute top-2/3 right-1/3 w-48 h-48 rounded-full bg-emerald-500/10 blur-xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-teal-500/15 blur-xl animate-pulse"></div>
                </div>
            </div>

            <div className="relative container mx-auto px-4 py-12 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-4">
                        Income Flow Monitor
                    </h1>
                    <p className="text-gray-300 text-lg">Track all revenue streams and optimize your earning potential</p>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="space-themed-card rounded-xl p-6 text-center">
                        <TrendingUp className="text-green-400 mx-auto mb-3" size={32} />
                        <h3 className="text-lg font-bold text-white mb-2">Monthly Total</h3>
                        <AnimatedCounter value={monthlyTotal} />
                    </div>
                    <div className="space-themed-card rounded-xl p-6 text-center">
                        <BarChart3 className="text-emerald-400 mx-auto mb-3" size={32} />
                        <h3 className="text-lg font-bold text-white mb-2">Annual Projection</h3>
                        <AnimatedCounter value={annualTotal} />
                    </div>
                    <div className="space-themed-card rounded-xl p-6 text-center">
                        <Briefcase className="text-teal-400 mx-auto mb-3" size={32} />
                        <h3 className="text-lg font-bold text-white mb-2">Income Sources</h3>
                        <span className="font-bold text-3xl text-teal-400">{incomes.length}</span>
                    </div>
                </div>

                {/* Add New Income Button */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={() => setShowModal(true)}
                        className="glow-button bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all hover:scale-105"
                    >
                        <Plus size={20} />
                        Add Income Source
                    </button>
                </div>

                {/* Income Sources */}
                <div className="space-y-6 mb-8">
                    {incomes.map((income) => {
                        const daysUntilPayment = getDaysUntilPayment(income.nextPayment);
                        
                        return (
                            <div key={income.id} className="space-themed-card rounded-xl p-6 hover:scale-102 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${income.color} flex items-center justify-center text-2xl`}>
                                            {income.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{income.source}</h3>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <span className="text-sm">{income.frequency}</span>
                                                <span className="text-gray-600">•</span>
                                                <span className="text-sm">${income.amount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400">Next Payment</p>
                                            <p className="text-white font-semibold">{income.nextPayment}</p>
                                            <p className={`text-xs ${daysUntilPayment <= 7 ? 'text-green-400' : 'text-gray-400'}`}>
                                                {daysUntilPayment > 0 ? `${daysUntilPayment} days` : 'Overdue'}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(income)}
                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(income.id)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Animated Bar */}
                                <AnimatedBar income={income} maxAmount={maxMonthlyAmount} />
                            </div>
                        );
                    })}
                </div>

                {/* Income Breakdown */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-themed-card rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <PieChart className="text-green-400" />
                            Income Distribution
                        </h3>
                        <div className="space-y-3">
                            {incomes.map((income) => {
                                const monthlyAmount = income.frequency === 'Weekly' ? income.amount * 4.33 :
                                                   income.frequency === 'Bi-weekly' ? income.amount * 2.17 :
                                                   income.frequency === 'Quarterly' ? income.amount / 3 :
                                                   income.frequency === 'Annually' ? income.amount / 12 :
                                                   income.amount;
                                const percentage = ((monthlyAmount / monthlyTotal) * 100).toFixed(1);
                                
                                return (
                                    <div key={income.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded bg-gradient-to-r ${income.color}`}></div>
                                            <span className="text-gray-300">{income.source}</span>
                                        </div>
                                        <span className="text-white font-semibold">{percentage}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-themed-card rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar className="text-emerald-400" />
                            Upcoming Payments
                        </h3>
                        <div className="space-y-3">
                            {incomes
                                .sort((a, b) => getDaysUntilPayment(a.nextPayment) - getDaysUntilPayment(b.nextPayment))
                                .map((income) => {
                                    const daysUntil = getDaysUntilPayment(income.nextPayment);
                                    return (
                                        <div key={income.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded bg-gradient-to-r ${income.color}`}></div>
                                                <span className="text-gray-300">{income.source}</span>
                                            </div>
                                            <span className="text-white font-semibold">
                                                {daysUntil > 0 ? `in ${daysUntil} days` : 'Today'}
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="space-themed-card rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">
                            {editingIncome ? 'Edit Income Source' : 'Add New Income Source'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Source</label>
                                <input
                                    type="text"
                                    name="source"
                                    value={formData.source}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400"
                                    placeholder="e.g., Salary, Freelance, Investments"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Amount ($)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400"
                                    placeholder="e.g., 2500.00"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Frequency</label>
                                <select
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400"
                                    required
                                >
                                    {frequencies.map(freq => <option key={freq} value={freq}>{freq}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Next Payment Date</label>
                                <input
                                    type="date"
                                    name="nextPayment"
                                    value={formData.nextPayment}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Icon</label>
                                <select
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400"
                                >
                                    {availableIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="glow-button bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex-1 transition-all"
                                >
                                    {editingIncome ? 'Update Income' : 'Add Income'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="glow-button bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex-1 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .space-themed-card {
                    background: rgba(10, 20, 40, 0.6);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                }

                .glow-input {
                    background-color: #1a202c;
                    border: 1px solid #4a5568;
                    color: #e2e8f0;
                    transition: all 0.3s ease;
                }

                .glow-input:focus {
                    border-color: #10b981;
                    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
                }

                .glow-button {
                    box-shadow: 0 0 8px rgba(16, 185, 129, 0.6), 0 0 15px rgba(16, 185, 129, 0.4);
                    transition: all 0.3s ease;
                }

                .glow-button:hover {
                    box-shadow: 0 0 12px rgba(16, 185, 129, 0.8), 0 0 20px rgba(16, 185, 129, 0.6);
                    transform: translateY(-2px);
                }

                .animate-pulse {
                    animation: pulse 4s infinite ease-in-out;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.2; }
                    50% { transform: scale(1.1); opacity: 0.4; }
                }
            `}</style>
        </div>
    );
};

export default IncomeTracker;
