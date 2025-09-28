import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Simulate authentication process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Call the actual sign in function
            await signIn(email, password);
            
            setIsSuccess(true);
            
            // Redirect to dashboard after successful login
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-royal">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] to-[#001f3f] opacity-100"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gold/20 blur-xl animate-pulse"></div>
                    <div className="absolute top-2/3 left-1/3 w-48 h-48 rounded-full bg-blue-500/10 blur-xl animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-purple-500/10 blur-xl animate-pulse"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
                <div className="vault-glass rounded-2xl w-full max-w-md overflow-hidden transition-all duration-300 transform hover:scale-[1.01]">
                    {/* Vault Header */}
                    <div className="bg-gradient-to-r from-[#001f3f] to-[#0a1128] p-8 text-center border-b border-gold/10">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
                            <i className="fas fa-lock-open text-gold text-3xl"></i>
                        </div>
                        <h1 className="text-3xl font-bold gold-gradient mb-2">ACCESS THE VAULT</h1>
                        <p className="text-sm text-gray-400">Welcome back, Financial Architect</p>
                    </div>
                    
                    {/* Login Form */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">FlowFund ID</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-user-shield text-gold/60"></i>
                                    </div>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-glow block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-0" 
                                        placeholder="your@flowfund.id"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Encryption Key</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-key text-gold/60"></i>
                                    </div>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        id="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-glow block w-full pl-10 pr-10 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-0" 
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-gray-500 hover:text-gold cursor-pointer`}></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <input 
                                        id="remember" 
                                        type="checkbox" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-gold focus:ring-gold/50"
                                    />
                                    <label htmlFor="remember" className="ml-2 text-sm text-gray-400">Trust this device</label>
                                </div>
                                <Link to="/forgot-password" className="text-sm text-gold hover:underline">Recover access</Link>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isLoading || isSuccess}
                                className="btn-gold w-full py-3 px-4 rounded-lg text-gray-900 font-bold transition-all duration-300 flex items-center justify-center disabled:opacity-75"
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        <span>AUTHENTICATING...</span>
                                    </>
                                ) : isSuccess ? (
                                    <>
                                        <i className="fas fa-check mr-2"></i>
                                        <span>ACCESS GRANTED</span>
                                    </>
                                ) : (
                                    <>
                                        <span>UNLOCK COMMAND CENTER</span>
                                        <i className="fas fa-arrow-right ml-2"></i>
                                    </>
                                )}
                            </button>
                        </form>
                        
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-800"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-900 text-gray-500">OR CONTINUE WITH</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                type="button" 
                                className="flex items-center justify-center py-2 px-4 bg-gray-900/50 hover:bg-gray-800/50 rounded-lg border border-gray-800 text-gray-300 transition-colors"
                            >
                                <i className="fab fa-google text-red-400 mr-2"></i>
                                <span>Google</span>
                            </button>
                            <button 
                                type="button" 
                                className="flex items-center justify-center py-2 px-4 bg-gray-900/50 hover:bg-gray-800/50 rounded-lg border border-gray-800 text-gray-300 transition-colors"
                            >
                                <i className="fab fa-apple text-gray-300 mr-2"></i>
                                <span>Apple</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Security Footer */}
                    <div className="px-8 py-4 bg-gray-900/30 border-t border-gray-800/50 text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <div className="security-badge flex items-center text-xs bg-green-900/20 text-green-400 px-2 py-1 rounded">
                                <i className="fas fa-shield-alt mr-1"></i>
                                <span>Military-Grade Encryption</span>
                            </div>
                            <div className="security-badge flex items-center text-xs bg-blue-900/20 text-blue-400 px-2 py-1 rounded">
                                <i className="fas fa-user-secret mr-1"></i>
                                <span>Zero Tracking</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">
                            By continuing, you agree to our{' '}
                            <Link to="/terms" className="text-gold hover:underline">Terms</Link>
                            {' '}and{' '}
                            <Link to="/privacy" className="text-gold hover:underline">Privacy Policy</Link>
                        </p>
                    </div>
                </div>
                
                {/* Watermark */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-xs text-gray-600">FlowFund OS v4.2 • Secure Access Portal</p>
                </div>
            </div>

            <style jsx>{`
                .vault-glass {
                    background: rgba(0, 31, 63, 0.3);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 215, 0, 0.15);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                }
                
                .gold-gradient {
                    background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }
                
                .input-glow:focus {
                    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
                }
                
                .btn-gold {
                    background: linear-gradient(135deg, #ffd700 0%, #daa520 100%);
                    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
                }
                
                .btn-gold:hover {
                    background: linear-gradient(135deg, #daa520 0%, #b8860b 100%);
                    transform: translateY(-2px);
                }
                
                .security-badge {
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% { opacity: 0.8; }
                    50% { opacity: 1; }
                    100% { opacity: 0.8; }
                }
                
                .text-gold {
                    color: #ffd700;
                }
                
                .bg-gold\\/20 {
                    background-color: rgba(255, 215, 0, 0.2);
                }
                
                .bg-gold\\/10 {
                    background-color: rgba(255, 215, 0, 0.1);
                }
                
                .border-gold\\/20 {
                    border-color: rgba(255, 215, 0, 0.2);
                }
                
                .border-gold\\/10 {
                    border-color: rgba(255, 215, 0, 0.1);
                }
                
                .bg-royal {
                    background-color: #0a1128;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
