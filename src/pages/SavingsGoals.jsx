import React, { useState, useEffect } from 'react';
import { Target, Plus, Edit, Trash2, Calendar, DollarSign, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const SavingsGoals = () => {
    const [goals, setGoals] = useState([
        {
            id: 1,
            title: 'Emergency Fund',
            targetAmount: 10000,
            currentAmount: 6500,
            deadline: '2024-12-31',
            category: 'Emergency',
            color: 'from-red-500 to-orange-500'
        },
        {
            id: 2,
            title: 'Dream Vacation',
            targetAmount: 5000,
            currentAmount: 2800,
            deadline: '2024-08-15',
            category: 'Travel',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 3,
            title: 'New Car',
            targetAmount: 25000,
            currentAmount: 8200,
            deadline: '2025-06-01',
            category: 'Transportation',
            color: 'from-purple-500 to-pink-500'
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        category: 'Savings'
    });

    const categories = ['Emergency', 'Travel', 'Transportation', 'Home', 'Education', 'Investment', 'Other'];
    const colors = [
        'from-red-500 to-orange-500',
        'from-blue-500 to-cyan-500',
        'from-purple-500 to-pink-500',
        'from-green-500 to-emerald-500',
        'from-yellow-500 to-amber-500',
        'from-indigo-500 to-blue-500',
        'from-pink-500 to-rose-500'
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
        
        const newGoal = {
            id: editingGoal ? editingGoal.id : Date.now(),
            ...formData,
            targetAmount: parseFloat(formData.targetAmount),
            currentAmount: parseFloat(formData.currentAmount) || 0,
            color: colors[Math.floor(Math.random() * colors.length)]
        };

        if (editingGoal) {
            setGoals(goals.map(goal => goal.id === editingGoal.id ? newGoal : goal));
        } else {
            setGoals([...goals, newGoal]);
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            title: '',
            targetAmount: '',
            currentAmount: '',
            deadline: '',
            category: 'Savings'
        });
        setEditingGoal(null);
        setShowModal(false);
    };

    const handleEdit = (goal) => {
        setEditingGoal(goal);
        setFormData({
            title: goal.title,
            targetAmount: goal.targetAmount.toString(),
            currentAmount: goal.currentAmount.toString(),
            deadline: goal.deadline,
            category: goal.category
        });
        setShowModal(true);
    };

    const handleDelete = (goalId) => {
        setGoals(goals.filter(goal => goal.id !== goalId));
    };

    const calculateProgress = (current, target) => {
        return Math.min((current / target) * 100, 100);
    };

    const getDaysRemaining = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const AnimatedProgressBar = ({ progress, color }) => {
        const [animatedProgress, setAnimatedProgress] = useState(0);

        useEffect(() => {
            const timer = setTimeout(() => {
                setAnimatedProgress(progress);
            }, 100);
            return () => clearTimeout(timer);
        }, [progress]);

        return (
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div 
                    className={`h-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out neon-glow`}
                    style={{ width: `${animatedProgress}%` }}
                />
            </div>
        );
    };

    const AnimatedCounter = ({ value, prefix = '$' }) => {
        const [displayValue, setDisplayValue] = useState(0);

        useEffect(() => {
            const duration = 1000;
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
            <span className="font-bold text-2xl">
                {prefix}{displayValue.toLocaleString()}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-deep-space text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] to-[#001f3f] opacity-100"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500/20 blur-xl animate-pulse"></div>
                    <div className="absolute top-2/3 right-1/3 w-48 h-48 rounded-full bg-blue-500/10 blur-xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-purple-500/15 blur-xl animate-pulse"></div>
                </div>
            </div>

            <div className="relative container mx-auto px-4 py-12 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">
                        Savings Goals Mission Control
                    </h1>
                    <p className="text-gray-300 text-lg">Track your financial targets and watch your dreams become reality</p>
                </div>

                {/* Add New Goal Button */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={() => setShowModal(true)}
                        className="glow-button bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all hover:scale-105"
                    >
                        <Plus size={20} />
                        Launch New Goal
                    </button>
                </div>

                {/* Goals Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {goals.map((goal) => {
                        const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                        const daysRemaining = getDaysRemaining(goal.deadline);
                        const isCompleted = progress >= 100;

                        return (
                            <div key={goal.id} className="space-themed-card rounded-xl p-6 hover:scale-105 transition-all duration-300">
                                {/* Goal Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${goal.color} flex items-center justify-center`}>
                                            {isCompleted ? (
                                                <CheckCircle className="text-white" size={24} />
                                            ) : (
                                                <Target className="text-white" size={24} />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                                            <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
                                                {goal.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(goal)}
                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(goal.id)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Progress Section */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300">Progress</span>
                                        <span className="text-white font-bold">{progress.toFixed(1)}%</span>
                                    </div>
                                    <AnimatedProgressBar progress={progress} color={goal.color} />
                                </div>

                                {/* Amount Section */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-center">
                                            <p className="text-gray-400 text-sm">Current</p>
                                            <AnimatedCounter value={goal.currentAmount} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-400 text-sm">Target</p>
                                            <span className="font-bold text-2xl text-gray-300">
                                                ${goal.targetAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Deadline Section */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Calendar size={16} />
                                        <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${daysRemaining < 30 ? 'text-red-400' : 'text-green-400'}`}>
                                        <Clock size={16} />
                                        <span>{daysRemaining > 0 ? `${daysRemaining} days` : 'Overdue'}</span>
                                    </div>
                                </div>

                                {/* Completion Badge */}
                                {isCompleted && (
                                    <div className="mt-4 text-center">
                                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                                            🎉 Goal Achieved!
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Summary Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-themed-card rounded-xl p-6 text-center">
                        <TrendingUp className="text-green-400 mx-auto mb-3" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2">Total Saved</h3>
                        <AnimatedCounter 
                            value={goals.reduce((sum, goal) => sum + goal.currentAmount, 0)} 
                        />
                    </div>
                    <div className="space-themed-card rounded-xl p-6 text-center">
                        <Target className="text-blue-400 mx-auto mb-3" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2">Total Target</h3>
                        <span className="font-bold text-2xl text-gray-300">
                            ${goals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
                        </span>
                    </div>
                    <div className="space-themed-card rounded-xl p-6 text-center">
                        <CheckCircle className="text-purple-400 mx-auto mb-3" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2">Completed Goals</h3>
                        <span className="font-bold text-2xl text-purple-400">
                            {goals.filter(goal => calculateProgress(goal.currentAmount, goal.targetAmount) >= 100).length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="space-themed-card rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">
                            {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Goal Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                                    placeholder="e.g., Emergency Fund"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Target Amount ($)</label>
                                <input
                                    type="number"
                                    name="targetAmount"
                                    value={formData.targetAmount}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                                    placeholder="10000"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Current Amount ($)</label>
                                <input
                                    type="number"
                                    name="currentAmount"
                                    value={formData.currentAmount}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Deadline</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button 
                                    type="button"
                                    onClick={resetForm}
                                    className="glow-button bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="glow-button bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    {editingGoal ? 'Save Changes' : 'Create Goal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .bg-deep-space {
                    background-color: #0a1128;
                }

                .space-themed-card {
                    background: rgba(10, 20, 40, 0.6);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(70, 130, 180, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                }

                .glow-input {
                    background-color: #1a202c;
                    border: 1px solid #4a5568;
                    color: #e2e8f0;
                    transition: all 0.3s ease;
                }

                .glow-input:focus {
                    border-color: #63b3ed;
                    box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.5);
                }

                .glow-button {
                    box-shadow: 0 0 8px rgba(70, 130, 180, 0.6), 0 0 15px rgba(70, 130, 180, 0.4);
                    transition: all 0.3s ease;
                }

                .glow-button:hover {
                    box-shadow: 0 0 12px rgba(70, 130, 180, 0.8), 0 0 20px rgba(70, 130, 180, 0.6);
                    transform: translateY(-2px);
                }

                .neon-glow {
                    box-shadow: 0 0 5px rgba(0, 255, 255, 0.7), 0 0 10px rgba(0, 255, 255, 0.5);
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

export default SavingsGoals;
