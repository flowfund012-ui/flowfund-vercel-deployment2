import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Edit, Trash2, PieChart, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Calculator } from 'lucide-react';

const BudgetPlanner = () => {
    const [monthlyIncome, setMonthlyIncome] = useState(5000);
    const [budgetCategories, setBudgetCategories] = useState([
        { id: 1, name: 'Housing', planned: 1500, actual: 1450, color: 'from-blue-500 to-blue-600', icon: '🏠' },
        { id: 2, name: 'Food & Dining', planned: 600, actual: 720, color: 'from-green-500 to-green-600', icon: '🍽️' },
        { id: 3, name: 'Transportation', planned: 400, actual: 380, color: 'from-purple-500 to-purple-600', icon: '🚗' },
        { id: 4, name: 'Entertainment', planned: 300, actual: 450, color: 'from-pink-500 to-pink-600', icon: '🎬' },
        { id: 5, name: 'Utilities', planned: 200, actual: 185, color: 'from-yellow-500 to-yellow-600', icon: '⚡' },
        { id: 6, name: 'Healthcare', planned: 250, actual: 200, color: 'from-red-500 to-red-600', icon: '🏥' },
        { id: 7, name: 'Savings', planned: 1000, actual: 800, color: 'from-emerald-500 to-emerald-600', icon: '💰' }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        planned: '',
        actual: '',
        icon: '📊'
    });

    const availableIcons = ['🏠', '🍽️', '🚗', '🎬', '⚡', '🏥', '💰', '🛒', '👕', '📚', '🎯', '💡', '🎮', '✈️', '📱'];
    const colors = [
        'from-blue-500 to-blue-600',
        'from-green-500 to-green-600',
        'from-purple-500 to-purple-600',
        'from-pink-500 to-pink-600',
        'from-yellow-500 to-yellow-600',
        'from-red-500 to-red-600',
        'from-emerald-500 to-emerald-600',
        'from-indigo-500 to-indigo-600',
        'from-orange-500 to-orange-600'
    ];

    const totalPlanned = budgetCategories.reduce((sum, cat) => sum + cat.planned, 0);
    const totalActual = budgetCategories.reduce((sum, cat) => sum + cat.actual, 0);
    const remainingBudget = monthlyIncome - totalPlanned;
    const actualRemaining = monthlyIncome - totalActual;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newCategory = {
            id: editingCategory ? editingCategory.id : Date.now(),
            ...formData,
            planned: parseFloat(formData.planned),
            actual: parseFloat(formData.actual) || 0,
            color: colors[Math.floor(Math.random() * colors.length)]
        };

        if (editingCategory) {
            setBudgetCategories(budgetCategories.map(cat => 
                cat.id === editingCategory.id ? newCategory : cat
            ));
        } else {
            setBudgetCategories([...budgetCategories, newCategory]);
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            planned: '',
            actual: '',
            icon: '📊'
        });
        setEditingCategory(null);
        setShowModal(false);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            planned: category.planned.toString(),
            actual: category.actual.toString(),
            icon: category.icon
        });
        setShowModal(true);
    };

    const handleDelete = (categoryId) => {
        setBudgetCategories(budgetCategories.filter(cat => cat.id !== categoryId));
    };

    const getVarianceStatus = (planned, actual) => {
        const variance = ((actual - planned) / planned) * 100;
        if (variance > 10) return { status: 'over', color: 'text-red-400', icon: TrendingUp };
        if (variance < -10) return { status: 'under', color: 'text-green-400', icon: TrendingDown };
        return { status: 'on-track', color: 'text-blue-400', icon: CheckCircle };
    };

    const AnimatedBar = ({ planned, actual, color, maxValue }) => {
        const [animatedPlanned, setAnimatedPlanned] = useState(0);
        const [animatedActual, setAnimatedActual] = useState(0);

        useEffect(() => {
            const timer = setTimeout(() => {
                setAnimatedPlanned((planned / maxValue) * 100);
                setAnimatedActual((actual / maxValue) * 100);
            }, 100);
            return () => clearTimeout(timer);
        }, [planned, actual, maxValue]);

        return (
            <div className="relative h-8 bg-gray-800 rounded-lg overflow-hidden">
                {/* Planned Budget Bar */}
                <div 
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${color} opacity-50 transition-all duration-1000 ease-out`}
                    style={{ width: `${animatedPlanned}%` }}
                />
                {/* Actual Spending Bar */}
                <div 
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out delay-300`}
                    style={{ width: `${animatedActual}%` }}
                />
                {/* Labels */}
                <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-semibold text-white">
                    <span>Planned: ${planned}</span>
                    <span>Actual: ${actual}</span>
                </div>
            </div>
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

            <div className="relative container mx-auto px-4 py-12 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">
                        Budget Command Center
                    </h1>
                    <p className="text-gray-300 text-lg">Master your monthly finances with intelligent budget planning</p>
                </div>

                {/* Income & Summary Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="space-themed-card rounded-xl p-6 text-center">
                        <DollarSign className="text-green-400 mx-auto mb-3" size={32} />
                        <h3 className="text-lg font-bold text-white mb-2">Monthly Income</h3>
                        <div className="flex items-center justify-center">
                            <input
                                type="number"
                                value={monthlyIncome}
                                onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                                className="glow-input bg-transparent text-2xl font-bold text-center border-b border-green-400 focus:outline-none focus:border-green-300 w-32"
                            />
                        </div>
                    </div>

                    <div className="space-themed-card rounded-xl p-6 text-center">
                        <Calculator className="text-blue-400 mx-auto mb-3" size={32} />
                        <h3 className="text-lg font-bold text-white mb-2">Planned Budget</h3>
                        <p className="text-2xl font-bold text-blue-400">${totalPlanned.toLocaleString()}</p>
                    </div>

                    <div className="space-themed-card rounded-xl p-6 text-center">
                        <TrendingUp className="text-purple-400 mx-auto mb-3" size={32} />
                        <h3 className="text-lg font-bold text-white mb-2">Actual Spending</h3>
                        <p className="text-2xl font-bold text-purple-400">${totalActual.toLocaleString()}</p>
                    </div>

                    <div className="space-themed-card rounded-xl p-6 text-center">
                        {actualRemaining >= 0 ? (
                            <CheckCircle className="text-green-400 mx-auto mb-3" size={32} />
                        ) : (
                            <AlertTriangle className="text-red-400 mx-auto mb-3" size={32} />
                        )}
                        <h3 className="text-lg font-bold text-white mb-2">Remaining</h3>
                        <p className={`text-2xl font-bold ${actualRemaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${Math.abs(actualRemaining).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Add Category Button */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={() => setShowModal(true)}
                        className="glow-button bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all hover:scale-105"
                    >
                        <Plus size={20} />
                        Add Budget Category
                    </button>
                </div>

                {/* Budget Categories */}
                <div className="space-y-6 mb-8">
                    {budgetCategories.map((category) => {
                        const variance = getVarianceStatus(category.planned, category.actual);
                        const VarianceIcon = variance.icon;
                        const maxValue = Math.max(...budgetCategories.map(c => Math.max(c.planned, c.actual)));

                        return (
                            <div key={category.id} className="space-themed-card rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl`}>
                                            {category.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{category.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <VarianceIcon className={variance.color} size={16} />
                                                <span className={`text-sm ${variance.color}`}>
                                                    {variance.status === 'over' && 'Over Budget'}
                                                    {variance.status === 'under' && 'Under Budget'}
                                                    {variance.status === 'on-track' && 'On Track'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Animated Bar Chart */}
                                <AnimatedBar 
                                    planned={category.planned}
                                    actual={category.actual}
                                    color={category.color}
                                    maxValue={maxValue}
                                />

                                {/* Variance Details */}
                                <div className="flex justify-between items-center mt-3 text-sm">
                                    <span className="text-gray-400">
                                        Variance: ${Math.abs(category.actual - category.planned)}
                                    </span>
                                    <span className={variance.color}>
                                        {(((category.actual - category.planned) / category.planned) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Budget Overview Chart */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-themed-card rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <PieChart className="text-blue-400" />
                            Budget Allocation
                        </h3>
                        <div className="space-y-3">
                            {budgetCategories.map((category) => {
                                const percentage = ((category.planned / totalPlanned) * 100).toFixed(1);
                                return (
                                    <div key={category.id} className="flex items-center justify-between">
                                        <div className={`w-4 h-4 rounded bg-gradient-to-r ${category.color}`}></div>
                                        <span className="text-gray-300">{category.name}</span>
                                        <span className="text-white font-semibold">{percentage}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-themed-card rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="text-green-400" />
                            Budget Health
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Budget Utilization:</span>
                                <span className="text-white font-semibold">
                                    {((totalActual / totalPlanned) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Categories Over Budget:</span>
                                <span className="text-red-400 font-semibold">
                                    {budgetCategories.filter(cat => getVarianceStatus(cat.planned, cat.actual).status === 'over').length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Categories Under Budget:</span>
                                <span className="text-green-400 font-semibold">
                                    {budgetCategories.filter(cat => getVarianceStatus(cat.planned, cat.actual).status === 'under').length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">On Track Categories:</span>
                                <span className="text-blue-400 font-semibold">
                                    {budgetCategories.filter(cat => getVarianceStatus(cat.planned, cat.actual).status === 'on-track').length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="space-themed-card rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">
                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                                    placeholder="e.g., Groceries"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Planned Amount ($)</label>
                                <input
                                    type="number"
                                    name="planned"
                                    value={formData.planned}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                                    placeholder="500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Actual Amount ($)</label>
                                <input
                                    type="number"
                                    name="actual"
                                    value={formData.actual}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Icon</label>
                                <select
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                                >
                                    {availableIcons.map(icon => (
                                        <option key={icon} value={icon}>{icon}</option>
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
                                    {editingCategory ? 'Save Changes' : 'Add Category'}
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

export default BudgetPlanner;
