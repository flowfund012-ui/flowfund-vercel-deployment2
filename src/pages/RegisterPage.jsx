import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Rocket, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setIsLoading(true);
        setErrors({});
        
        try {
            // Simulate registration process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setIsSuccess(true);
            
            // Redirect to dashboard after successful registration
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({ general: 'Registration failed. Please try again.' });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-deep-space">
            {/* Galaxy Background */}
            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#001f3f] to-[#0d1b2a] opacity-100"></div>
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>
                    <div className="absolute top-2/3 right-1/4 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-48 h-48 rounded-full bg-cyan-500/20 blur-3xl animate-pulse"></div>
                </div>
                {/* Animated Stars */}
                <div className="stars-container absolute inset-0">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="star absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                            <Rocket className="text-white text-2xl" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-2">
                            JOIN THE FUTURE
                        </h1>
                        <p className="text-gray-300 text-lg">Create your FlowFund account</p>
                    </div>

                    {/* Registration Form */}
                    <div className="space-themed-card rounded-2xl p-8 backdrop-blur-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="text-blue-400" size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className={`glow-input block w-full pl-10 pr-3 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                                            errors.username ? 'border-red-500' : 'border-gray-700 focus:border-blue-400'
                                        }`}
                                        placeholder="Choose a username"
                                    />
                                </div>
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="text-blue-400" size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`glow-input block w-full pl-10 pr-3 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                                            errors.email ? 'border-red-500' : 'border-gray-700 focus:border-blue-400'
                                        }`}
                                        placeholder="your@email.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="text-blue-400" size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`glow-input block w-full pl-10 pr-10 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                                            errors.password ? 'border-red-500' : 'border-gray-700 focus:border-blue-400'
                                        }`}
                                        placeholder="Create a strong password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="text-gray-400 hover:text-blue-400 transition-colors" size={20} />
                                        ) : (
                                            <Eye className="text-gray-400 hover:text-blue-400 transition-colors" size={20} />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="text-blue-400" size={20} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`glow-input block w-full pl-10 pr-10 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                                            errors.confirmPassword ? 'border-red-500' : 'border-gray-700 focus:border-blue-400'
                                        }`}
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="text-gray-400 hover:text-blue-400 transition-colors" size={20} />
                                        ) : (
                                            <Eye className="text-gray-400 hover:text-blue-400 transition-colors" size={20} />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {/* General Error */}
                            {errors.general && (
                                <div className="text-center">
                                    <p className="text-sm text-red-400">{errors.general}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || isSuccess}
                                className="futuristic-button w-full py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center disabled:opacity-75"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        <span>INITIALIZING...</span>
                                    </>
                                ) : isSuccess ? (
                                    <>
                                        <CheckCircle className="mr-2" size={20} />
                                        <span>WELCOME ABOARD!</span>
                                    </>
                                ) : (
                                    <>
                                        <span>LAUNCH MY ACCOUNT</span>
                                        <ArrowRight className="ml-2" size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Security Features */}
                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Shield size={16} className="text-green-400" />
                                    <span>256-bit Encryption</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle size={16} className="text-blue-400" />
                                    <span>Secure Servers</span>
                                </div>
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="text-center mt-6">
                            <p className="text-gray-400">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-400 hover:underline">
                                    Log In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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

                .futuristic-button {
                    background: linear-gradient(90deg, #00f2ff, #8a2be2);
                    color: white;
                    box-shadow: 0 0 8px rgba(0, 242, 255, 0.6), 0 0 15px rgba(138, 43, 226, 0.4);
                }

                .futuristic-button:hover {
                    background: linear-gradient(90deg, #8a2be2, #00f2ff);
                    box-shadow: 0 0 12px rgba(0, 242, 255, 0.8), 0 0 20px rgba(138, 43, 226, 0.6);
                    transform: translateY(-2px);
                }

                .animate-pulse {
                    animation: pulse 4s infinite ease-in-out;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.2; }
                    50% { transform: scale(1.1); opacity: 0.4; }
                }

                .animate-twinkle {
                    animation: twinkle 4s infinite ease-in-out;
                }

                @keyframes twinkle {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default RegisterPage;
