import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Filter, Calendar, Tag, DollarSign, Search, XCircle, CheckCircle, ArrowRight } from 'lucide-react';

const ExpenseManager = () => {
    const [expenses, setExpenses] = useState([
        { id: 1, category: 'Food', amount: 55.75, note: 'Groceries at SpaceMart', date: '2025-09-18', tagColor: 'bg-green-500/20 text-green-400' },
        { id: 2, category: 'Transport', amount: 120.00, note: 'Fuel for lunar rover', date: '2025-09-17', tagColor: 'bg-blue-500/20 text-blue-400' },
        { id: 3, category: 'Entertainment', amount: 30.50, note: 'Virtual reality game', date: '2025-09-17', tagColor: 'bg-purple-500/20 text-purple-400' },
        { id: 4, category: 'Utilities', amount: 75.00, note: 'Hydroponics energy bill', date: '2025-09-16', tagColor: 'bg-yellow-500/20 text-yellow-400' },
        { id: 5, category: 'Food', amount: 25.00, note: 'Lunch at AstroCafe', date: '2025-09-16', tagColor: 'bg-green-500/20 text-green-400' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        note: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterDate, setFilterDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Healthcare', 'Education', 'Other'];
    const categoryColors = {
        'Food': 'bg-green-500/20 text-green-400',
        'Transport': 'bg-blue-500/20 text-blue-400',
        'Entertainment': 'bg-purple-500/20 text-purple-400',
        'Utilities': 'bg-yellow-500/20 text-yellow-400',
        'Shopping': 'bg-pink-500/20 text-pink-400',
        'Healthcare': 'bg-red-500/20 text-red-400',
        'Education': 'bg-indigo-500/20 text-indigo-400',
        'Other': 'bg-gray-500/20 text-gray-400',
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newExpense = {
            id: editingExpense ? editingExpense.id : Date.now(),
            ...formData,
            amount: parseFloat(formData.amount),
            tagColor: categoryColors[formData.category] || categoryColors['Other']
        };

        if (editingExpense) {
            setExpenses(expenses.map(exp => exp.id === editingExpense.id ? newExpense : exp));
        } else {
            setExpenses([...expenses, newExpense]);
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            category: '',
            amount: '',
            note: '',
            date: new Date().toISOString().split('T')[0],
        });
        setEditingExpense(null);
        setShowModal(false);
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setFormData({
            category: expense.category,
            amount: expense.amount.toString(),
            note: expense.note,
            date: expense.date,
        });
        setShowModal(true);
    };

    const handleDelete = (expenseId) => {
        setExpenses(expenses.filter(exp => exp.id !== expenseId));
    };

    const filteredExpenses = expenses.filter(expense => {
        const matchesCategory = filterCategory === 'All' || expense.category === filterCategory;
        const matchesDate = !filterDate || expense.date === filterDate;
        const matchesSearch = !searchTerm || 
                              expense.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              expense.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesDate && matchesSearch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <div className="min-h-screen bg-deep-space text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] to-[#001f3f] opacity-100"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-red-500/20 blur-xl animate-pulse"></div>
                    <div className="absolute top-2/3 right-1/3 w-48 h-48 rounded-full bg-orange-500/10 blur-xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-pink-500/15 blur-xl animate-pulse"></div>
                </div>
            </div>

            <div className="relative container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent mb-4">
                        Expense Command Log
                    </h1>
                    <p className="text-gray-300 text-lg">Track every credit outflow with precision and clarity</p>
                </div>

                {/* Add New Expense Button */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={() => setShowModal(true)}
                        className="glow-button bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all hover:scale-105"
                    >
                        <Plus size={20} />
                        Log New Expense
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="space-themed-card rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                        <select
                            id="filterCategory"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-400"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="filterDate" className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                        <input
                            type="date"
                            id="filterDate"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="text-gray-400" size={20} />
                            </div>
                            <input
                                type="text"
                                id="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="glow-input w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-400"
                                placeholder="Search notes or categories"
                            />
                        </div>
                    </div>
                </div>

                {/* Total Expenses Summary */}
                <div className="space-themed-card rounded-xl p-6 mb-8 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <DollarSign className="text-red-400" />
                        Total Expenses
                    </h3>
                    <p className="text-3xl font-bold text-red-400">${totalExpenses.toFixed(2)}</p>
                </div>

                {/* Expense List */}
                <div className="space-y-4">
                    {filteredExpenses.length === 0 ? (
                        <div className="space-themed-card rounded-xl p-6 text-center text-gray-400">
                            <XCircle size={48} className="mx-auto mb-4 text-gray-600" />
                            <p className="text-lg">No expenses found matching your criteria.</p>
                        </div>
                    ) : (
                        filteredExpenses.map(expense => (
                            <div key={expense.id} className="space-themed-card rounded-xl p-6 flex items-center justify-between hover:scale-102 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${expense.tagColor} bg-opacity-30`}>
                                        <Tag size={20} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-white">{expense.note || 'No note'}</p>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <span>{expense.category}</span>
                                            <span className="text-gray-600">•</span>
                                            <span>{expense.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-xl font-bold text-red-400">-${expense.amount.toFixed(2)}</p>
                                    <button
                                        onClick={() => handleEdit(expense)}
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(expense.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="space-themed-card rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">
                            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-400"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Amount ($)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-400"
                                    placeholder="e.g., 50.00"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Note</label>
                                <input
                                    type="text"
                                    name="note"
                                    value={formData.note}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-400"
                                    placeholder="e.g., Dinner with friends"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-400"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="glow-button bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex-1 transition-all"
                                >
                                    {editingExpense ? 'Update Expense' : 'Add Expense'}
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
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                }

                .glow-input {
                    background-color: #1a202c;
                    border: 1px solid #4a5568;
                    color: #e2e8f0;
                    transition: all 0.3s ease;
                }

                .glow-input:focus {
                    border-color: #ef4444;
                    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5);
                }

                .glow-button {
                    box-shadow: 0 0 8px rgba(239, 68, 68, 0.6), 0 0 15px rgba(239, 68, 68, 0.4);
                    transition: all 0.3s ease;
                }

                .glow-button:hover {
                    box-shadow: 0 0 12px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.6);
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

export default ExpenseManager;
