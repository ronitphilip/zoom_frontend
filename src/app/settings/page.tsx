'use client'
import MainLayout from '@/components/layout/MainLayout'
import { resetPasswordAPI } from '@/services/userAPI';
import { addUserAccountAPI, fetchZoomAccountsAPI, setPrimaryAccountAPI } from '@/services/zoomAPI';
import { Lock, LogOut, Mail, UserCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { ZoomAccount } from '@/types/zoomTypes';

const AccountManagement = () => {

    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [activeTab, setActiveTab] = useState('zoom');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [zoomAccounts, setZoomAccounts] = useState<ZoomAccount[]>([]);
    const [newAccountId, setNewAccountId] = useState('');
    const [newClientId, setNewClientId] = useState('');
    const [newClientPass, setNewClientPass] = useState('');
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchAccounts();
        const storedUser = sessionStorage.getItem('user');
        setUser(storedUser ? JSON.parse(storedUser) : { name: 'User', email: 'user@sysgrate.com' });
    }, []);

    const fetchAccounts = async () => {
        try {
            const token = sessionStorage.getItem('tk');
            if (!token) {
                alert('Credentials not found, try login in again!');
                router.push('/');
                return;
            }

            const header = {
                Authorization: `Bearer ${JSON.parse(token)}`
            };

            const reqBody = header;
            const result = await fetchZoomAccountsAPI(reqBody, header);
            if (result.success) {
                setZoomAccounts(result.data);
            } else {
                setFormError(result.error || 'Failed to fetch accounts');
            }
        } catch (err) {
            setFormError('Something went wrong while fetching accounts!');
            console.log(err);
        }
    };

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
            };
            const header = {
                Authorization: `Bearer ${JSON.parse(token)}`
            };
            const result = await resetPasswordAPI(reqBody, header);
            if (result.success) {
                setSuccess('Password reset successfully.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                result.error && setError(result.error);
            }
        } catch (err) {
            alert('Something went wrong!');
            console.log(err);
        }
    };

    const handleAddZoomAccount = async () => {
        setFormError('');
        setFormSuccess('');
        if (!newAccountId || !newClientId || !newClientPass) {
            setFormError('All fields are required.');
            return;
        }

        try {
            const token = sessionStorage.getItem('tk');
            if (!token) {
                alert('Credentials not found, try login in again!');
                router.push('/');
                return;
            }

            const reqBody = {
                account_id: newAccountId,
                client_id: newClientId,
                client_password: newClientPass
            };
            const header = {
                Authorization: `Bearer ${JSON.parse(token)}`
            };
            const result = await addUserAccountAPI(header, reqBody);
            if (result.success) {
                setFormSuccess('Zoom account added successfully.');
                setNewAccountId('');
                setNewClientId('');
                setNewClientPass('');
                await fetchAccounts();
            } else {
                setFormError(result.error || 'Failed to add account');
            }
        } catch (err) {
            setFormError('Something went wrong!');
            console.log(err);
        }
    };

    const handleSetPrimary = async (id: number) => {
        try {
            const token = sessionStorage.getItem('tk');
            if (!token) {
                alert('Credentials not found, try login in again!');
                router.push('/');
                return;
            }

            const reqBody = {
                accountId: id
            };
            const header = {
                Authorization: `Bearer ${JSON.parse(token)}`
            };
            const result = await setPrimaryAccountAPI(header, reqBody);
            if (result.success) {
                setFormSuccess('Primary account set successfully.');
                await fetchAccounts(); // Refresh accounts list
            } else {
                setFormError(result.error || 'Failed to set primary account');
            }
        } catch (err) {
            setFormError('Something went wrong!');
            console.log(err);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        router.push('/');
    };

    return (
        <MainLayout>
            <div>
                <div className='bg-white p-5 rounded-t-2xl flex justify-between items-center'>
                    <h2 className="text-xl font-bold text-blue-800">Account Management</h2>
                    <button onClick={handleLogout} className="text-red-600 cursor-pointer flex items-center">
                        Logout<LogOut size={18} className='ms-1' />
                    </button>
                </div>
                <div className='grid grid-cols-6 gap-6 mt-6'>
                    <div className='col-span-2'>
                        <div className='rounded-2xl p-6 bg-white shadow-lg h-[calc(100vh-12rem)] flex flex-col'>
                            <div className="flex justify-center">
                                <UserCircle size={60} className="text-blue-600" />
                            </div>
                            <p className="text-center mt-2 text-2xl font-bold text-blue-800">{user?.name || 'User'}</p>
                            <p className="flex justify-center items-center text-sm text-blue-600 mt-1">
                                <Mail size={16} className="me-2" />
                                {user?.email || 'user@sysgrate.com'}
                            </p>
                            <div className="mt-8 bg-gray-50 rounded-2xl p-5 flex-1">
                                <h3 className="text-lg font-medium mb-4 text-blue-800">Reset Password</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-blue-600 mb-1 block">Current Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                                            <input
                                                type="password"
                                                placeholder="Enter current password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-blue-600 mb-1 block">New Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                                            <input
                                                type="password"
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-blue-600 mb-1 block">Confirm Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                                            <input
                                                type="password"
                                                placeholder="Confirm new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    {error && <p className="text-red-400 text-sm">{error}</p>}
                                    {success && <p className="text-green-400 text-sm">{success}</p>}
                                    <button
                                        onClick={handleResetPassword}
                                        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg transition-colors font-medium text-sm mt-4"
                                    >
                                        Reset Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-4'>
                        <div className='rounded-2xl p-6 bg-white shadow-lg h-[calc(100vh-12rem)]'>
                            <div className="flex border-b border-gray-200 mb-6">
                                <button
                                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'zoom' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                                    onClick={() => setActiveTab('zoom')}
                                >
                                    Zoom Account Settings
                                </button>
                                <button
                                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'add' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                                    onClick={() => setActiveTab('add')}
                                >
                                    Add Account
                                </button>
                            </div>
                            {activeTab === 'zoom' ? (
                                <div className="overflow-auto h-[calc(100%-4rem)]">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No.</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Account ID</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client ID</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Primary</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {zoomAccounts.map(account => (
                                                <tr key={account.id}>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{account.id}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{account.account_id}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{account.client_id}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={account.primary}
                                                                onChange={() => handleSetPrimary(account.id)}
                                                                className="hidden peer"
                                                            />
                                                            <span className="w-5 h-5 inline-block border-2 border-gray-300 rounded bg-white relative transition-all duration-200 peer-checked:bg-blue-600 peer-checked:border-blue-600">
                                                                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold peer-checked:opacity-100 opacity-0">✓</span>
                                                            </span>
                                                        </label>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-2xl p-5 h-[calc(100%-4rem)]">
                                    <h3 className="text-lg font-medium mb-4 text-blue-800">Add New Zoom Account</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-blue-600 mb-1 block">Account ID</label>
                                            <input
                                                type="text"
                                                placeholder="Enter account ID"
                                                value={newAccountId}
                                                onChange={(e) => setNewAccountId(e.target.value)}
                                                className="w-full bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-blue-600 mb-1 block">Client ID</label>
                                            <input
                                                type="text"
                                                placeholder="Enter client ID"
                                                value={newClientId}
                                                onChange={(e) => setNewClientId(e.target.value)}
                                                className="w-full bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-blue-600 mb-1 block">Client Password</label>
                                            <input
                                                type="password"
                                                placeholder="Enter client password"
                                                value={newClientPass}
                                                onChange={(e) => setNewClientPass(e.target.value)}
                                                className="w-full bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        {formError && <p className="text-red-400 text-sm">{formError}</p>}
                                        {formSuccess && <p className="text-green-400 text-sm">{formSuccess}</p>}
                                        <button
                                            onClick={handleAddZoomAccount}
                                            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg transition-colors font-medium text-sm mt-4"
                                        >
                                            Add Account
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AccountManagement;