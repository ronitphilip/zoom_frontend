'use client';
import MainLayout from '@/components/layout/MainLayout';
import Modal from '@/components/layout/Modal';
import { Headers } from '@/services/commonAPI';
import { deleteUserAPI, fetchAllRolesAPI, fetchAllUsersAPI, updateUserAPI } from '@/services/userAPI';
import { RegisterRequestBody, UserAttributes } from '@/types/userTypes';
import { RoleAttributes } from '@/utils/decryptRole';
import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { registerAPI } from '@/services/authAPI';

interface FormData {
  name: string;
  email: string;
  password?: string;
  role: string;
}

const getHeaders = (): Headers => {
  const token = typeof window !== 'undefined' && sessionStorage.getItem('tk')
    ? JSON.parse(sessionStorage.getItem('tk')!)
    : null;
  return { Authorization: `Bearer ${token || ''}` };
};

const useUserManagement = () => {
  const [allUsers, setAllUsers] = useState<UserAttributes[]>([]);
  const [allRoles, setAllRoles] = useState<RoleAttributes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const headers = getHeaders();

    try {
      const [usersResult, rolesResult] = await Promise.all([
        fetchAllUsersAPI(headers),
        fetchAllRolesAPI(headers),
      ]);

      if (usersResult.success && usersResult.data) {
        setAllUsers(usersResult.data);
      } else {
        setError('Failed to fetch users');
      }

      if (rolesResult.success && rolesResult.data) {
        setAllRoles(rolesResult.data);
      } else {
        setError((prev) => prev || 'Failed to fetch roles');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { allUsers, allRoles, loading, error, refetch: fetchData };
};

const Page = () => {
  const { allUsers, allRoles, loading, error, refetch } = useUserManagement();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserAttributes | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', role: '', password: '' });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 10;

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter ? user.role?.role === selectedRoleFilter : true;
    return matchesSearch && matchesRole;
  });

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage, totalUsers);
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRoleFilter]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openEditModal = (user: UserAttributes) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role?.role || '',
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: UserAttributes) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({ name: '', email: '', role: '', password: '' });
    setIsCreateModalOpen(true);
  };

  const handleEdit = async () => {
    if (!selectedUser) {
      alert('No user selected');
      return;
    }

    const matchedRole = allRoles.find((r) => r.role === formData.role);
    if (!matchedRole) {
      alert('Selected role is invalid');
      return;
    }

    setIsSaving(true);
    try {
      const updateBody = {
        name: formData.name,
        email: formData.email,
        roleId: matchedRole.id,
      };
      const result = await updateUserAPI(String(selectedUser.id), updateBody, getHeaders());

      if (result.success) {
        alert('User updated successfully');
        setIsEditModalOpen(false);
        refetch();
      } else {
        alert(result.error || 'Unable to update user');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    const matchedRole = allRoles.find((r) => r.role === formData.role);
    if (!matchedRole) {
      alert('Selected role is invalid');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Name and email are required');
      return;
    }

    setIsSaving(true);
    try {
      const reqBody: RegisterRequestBody = {
        name: formData.name,
        email: formData.email,
        roleId: matchedRole?.id,
        password: formData.password || 'password123',
      };
      const result = await registerAPI(reqBody);
      if (result.success) {
        alert('User created successfully');
        setIsCreateModalOpen(false);
        refetch();
      } else {
        alert(result.error || 'Unable to create user');
      }
    } catch (err) {
      console.error('Create error:', err);
      alert('Failed to create user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) {
      alert('No user selected');
      return;
    }

    setIsSaving(true);
    try {
      const result = await deleteUserAPI({ userId: selectedUser.id }, getHeaders());
      if (result.success) {
        alert('User deleted successfully');
        setIsDeleteModalOpen(false);
        refetch();
      } else {
        alert(result.error || 'Unable to delete user');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete user');
    } finally {
      setIsSaving(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-100">
        <h2 className="text-xl font-bold text-blue-800 mb-3">Manage Users</h2>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search users by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openCreateModal}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              <Plus className="mr-2 h-5 w-5" /> Add User
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRoleFilter('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedRoleFilter === '' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                All Roles
              </button>
              {allRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleFilter(role.role)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedRoleFilter === role.role ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {role.role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-155 flex flex-col justify-between">
          <table className="w-full max-h-140">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No.</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {error}
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.role?.role || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-3">
                        <button
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
                          onClick={() => openEditModal(user)}
                          disabled={isSaving}
                          aria-label={`Edit user ${user.name}`}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                          onClick={() => openDeleteModal(user)}
                          disabled={isSaving}
                          aria-label={`Delete user ${user.name}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="h-15 flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {endIndex} of {totalUsers} users
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Edit */}
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} heading="Edit User">
          <div className="space-y-6">
            <div className="group">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-blue-600">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isSaving}
                placeholder="Enter name"
              />
            </div>
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-blue-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isSaving}
                placeholder="Enter email"
              />
            </div>
            <div className="group">
              <label htmlFor="role" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-blue-600">
                Role
              </label>
              <select
                id="role"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iNyIgdmlld0JveD0iMCAwIDEyIDciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTIgMSIgc3Ryb2tlPSIjNjBEOUI5IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] bg-[length:12px_7px] bg-[right_1rem_center] bg-no-repeat"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={isSaving}
              >
                <option value="">-- Select Role --</option>
                {allRoles.map((role) => (
                  <option key={role.id} value={role.role}>
                    {role.role}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </Modal>

        {/* Create */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} heading="Create User">
          <div className="space-y-6">
            <div className="group">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-blue-600">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isSaving}
                placeholder="Enter name"
              />
            </div>
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-blue-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isSaving}
                placeholder="Enter email"
              />
            </div>
            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-blue-600">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isSaving}
                placeholder="Enter password"
              />
            </div>
            <div className="group">
              <label htmlFor="role" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-blue-600">
                Role
              </label>
              <select
                id="role"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iNyIgdmlld0JveD0iMCAwIDEyIDciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTIgMSIgc3Ryb2tlPSIjNjBEOUI5IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] bg-[length:12px_7px] bg-[right_1rem_center] bg-no-repeat"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={isSaving}
              >
                <option value="">-- Select Role --</option>
                {allRoles.map((role) => (
                  <option key={role.id} value={role.role}>
                    {role.role}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-5 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </div>
        </Modal>

        {/* Delete */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} heading="Confirm Delete">
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete <span className="font-semibold">{selectedUser?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all disabled:opacity-50"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default Page;