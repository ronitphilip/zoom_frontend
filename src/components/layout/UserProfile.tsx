import React, { useState } from 'react';
import { Mail, UserCircle, Lock, X } from 'lucide-react';
import { resetPasswordAPI } from '@/services/userAPI';
import { Headers } from '@/services/commonAPI';
import { useRouter } from 'next/navigation';

interface UserProfileProps {
    onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const user = JSON.parse(sessionStorage.getItem('user') || '"user"')

    const handleResetPassword = async () => {
        setError('');
        setSuccess('');
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }
        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long.');
            return;
        }

        try {
            const token = sessionStorage.getItem('tk');
            if (!token) return alert('Credentials not found, try login in again!');

            const reqBody = {
                currentPassword: currentPassword,
                newPassword: newPassword
            }
            const header: Headers = {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
            const result = await resetPasswordAPI(reqBody, header);
            if (result.success) {
                setSuccess('Password reset successfully.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                result.error && setError(result.error)
            }
        } catch (err) {
            alert('Something went wrong!');
            console.log(err);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear()
        router.push('/')
    }

    return (
        <div className="h-screen w-96 fixed right-0 z-20 py-4 transition-transform duration-300 ease-in-out transform translate-x-0 animate-slide-in">
            <div className="bg-blue-600 rounded-l-2xl h-full p-6 text-white flex flex-col shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">User Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-blue-200 hover:text-white transition-colors rounded-full p-1 hover:bg-blue-700/40 border-2"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1">
                    <div className="flex justify-center">
                        <UserCircle size={60} />
                    </div>
                    <p className="text-center mt-2 text-2xl font-bold">{user?.name || 'User'}</p>
                    <p className="flex justify-center items-center text-sm text-blue-200 mt-1">
                        <Mail size={16} className="me-2" />
                        {user?.email || 'user@sysgrate.com'}
                    </p>
                    <div className="mt-8 bg-blue-700/30 rounded-2xl p-5">
                        <h3 className="text-lg font-medium mb-4">Reset Password</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-blue-200 mb-1 block">Current Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
                                    <input
                                        type="password"
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full bg-blue-800/50 text-white placeholder-blue-400 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-blue-200 mb-1 block">New Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-blue-800/50 text-white placeholder-blue-400 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-blue-200 mb-1 block">Confirm Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-blue-800/50 text-white placeholder-blue-400 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            {success && <p className="text-green-400 text-sm">{success}</p>}
                            <button
                                onClick={handleResetPassword}
                                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg transition-colors font-medium text-sm"
                            >
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-700 hover:bg-red-600 text-white py-2 rounded-lg transition-colors font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-in-out forwards;
                }
            `}</style>
        </div>
    );
};

export default UserProfile;