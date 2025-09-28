import React, { useState } from 'react';
import { User, Mail, Crown, Edit, Lock, Trash2, Upload, Camera, Shield, Star } from 'lucide-react';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'Alex Thompson',
        email: 'alex.thompson@flowfund.com',
        membershipLevel: 'Elite',
        joinDate: 'March 2023',
        profilePicture: null
    });

    const [editData, setEditData] = useState({ ...profileData });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...profileData });
    };

    const handleSave = () => {
        setProfileData({ ...editData });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({ ...profileData });
        setIsEditing(false);
    };

    const handlePasswordChange = () => {
        // Handle password change logic here
        setShowPasswordModal(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleDeleteAccount = () => {
        // Handle account deletion logic here
        setShowDeleteConfirm(false);
    };

    const handleProfilePictureUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditData({ ...editData, profilePicture: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-deep-space text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] to-[#001f3f] opacity-100"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
                    <div className="absolute top-2/3 right-1/3 w-48 h-48 rounded-full bg-purple-500/10 blur-xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-cyan-500/15 blur-xl animate-pulse"></div>
                </div>
            </div>

            <div className="relative container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
                        Profile Command Center
                    </h1>
                    <p className="text-gray-300 text-lg">Manage your FlowFund account and preferences</p>
                </div>

                {/* Main Profile Card */}
                <div className="space-themed-card rounded-2xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Profile Picture Section */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-1">
                                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                                    {(isEditing ? editData.profilePicture : profileData.profilePicture) ? (
                                        <img 
                                            src={isEditing ? editData.profilePicture : profileData.profilePicture} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <User className="text-gray-400 text-4xl" />
                                    )}
                                </div>
                            </div>
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                                    <Camera className="text-white text-sm" />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleProfilePictureUpload}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="mb-6">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        className="glow-input text-3xl font-bold bg-transparent border-b-2 border-blue-400 focus:outline-none focus:border-purple-400 transition-colors"
                                    />
                                ) : (
                                    <h2 className="text-3xl font-bold text-white mb-2">{profileData.name}</h2>
                                )}
                                
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                    <Crown className="text-yellow-400" />
                                    <span className="text-yellow-400 font-semibold">{profileData.membershipLevel} Member</span>
                                </div>
                                
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                                    <Mail className="text-blue-400" />
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                            className="glow-input bg-transparent border-b border-gray-600 focus:outline-none focus:border-blue-400 transition-colors"
                                        />
                                    ) : (
                                        <span>{profileData.email}</span>
                                    )}
                                </div>
                                
                                <p className="text-gray-400 mt-2">Member since {profileData.joinDate}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                {!isEditing ? (
                                    <>
                                        <button 
                                            onClick={handleEdit}
                                            className="glow-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all"
                                        >
                                            <Edit size={16} />
                                            Edit Profile
                                        </button>
                                        <button 
                                            onClick={() => setShowPasswordModal(true)}
                                            className="glow-button bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all"
                                        >
                                            <Lock size={16} />
                                            Change Password
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            onClick={handleSave}
                                            className="glow-button bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-all"
                                        >
                                            Save Changes
                                        </button>
                                        <button 
                                            onClick={handleCancel}
                                            className="glow-button bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Membership & Upgrade Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-themed-card rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Star className="text-yellow-400" />
                            <h3 className="text-xl font-bold">Membership Status</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-300">Current Plan:</span>
                                <span className="text-yellow-400 font-semibold">{profileData.membershipLevel}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Next Billing:</span>
                                <span className="text-white">April 15, 2024</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Status:</span>
                                <span className="text-green-400">Active</span>
                            </div>
                        </div>
                        <button className="glow-button bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 py-2 rounded-lg mt-4 w-full hover:from-yellow-500 hover:to-orange-600 transition-all">
                            Upgrade Plan
                        </button>
                    </div>

                    <div className="space-themed-card rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-blue-400" />
                            <h3 className="text-xl font-bold">Security Settings</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Two-Factor Auth:</span>
                                <span className="text-green-400">Enabled</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Login Alerts:</span>
                                <span className="text-green-400">Enabled</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Data Encryption:</span>
                                <span className="text-green-400">Active</span>
                            </div>
                        </div>
                        <button className="glow-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg mt-4 w-full transition-all">
                            Security Settings
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="space-themed-card rounded-xl p-6 border border-red-500/30">
                    <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                        <Trash2 />
                        Danger Zone
                    </h3>
                    <p className="text-gray-300 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all border border-red-400"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="space-themed-card rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Change Password</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="glow-input w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button 
                                onClick={() => setShowPasswordModal(false)}
                                className="glow-button bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handlePasswordChange}
                                className="glow-button bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="space-themed-card rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-red-400 mb-4">Confirm Account Deletion</h3>
                        <p className="text-gray-300 mb-6">
                            Are you absolutely sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button 
                                onClick={() => setShowDeleteConfirm(false)}
                                className="glow-button bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteAccount}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
                            >
                                Delete Account
                            </button>
                        </div>
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

export default Profile;
