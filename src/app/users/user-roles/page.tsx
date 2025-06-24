'use client';

import MainLayout from '@/components/layout/MainLayout';
import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '@/components/layout/Modal';
import { Role, Permission } from '@/types/roleTypes';
import { fetchAllRolesAPI, createRoleAPI, addRolePermissionsAPI, deleteRoleAPI } from '@/services/userAPI';
import { Headers } from '@/services/commonAPI';
import PermissionTree from '@/components/filters/PermissionTree';

const FEATURES = ['overview', 'historicalReports', 'realTime', 'userManagement'] as const;
export type Feature = typeof FEATURES[number];

const ACTIONS: { [key in Feature]: string[] } = {
  overview: ['view'],
  historicalReports: ['agentReports', 'queueReports', 'flowReports', 'otherReports',],
  realTime: ['currentCalls', 'agentStatus'],
  userManagement: ['manageuser', 'managerole']
};

const Page = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<Role>({ id: '', role: '', permissions: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllRoles();
  }, []);

  const fetchAllRoles = async () => {
    setLoading(true);
    const token = typeof window !== 'undefined' && sessionStorage.getItem('tk')
      ? JSON.parse(sessionStorage.getItem('tk')!)
      : null;

    const header: Headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await fetchAllRolesAPI(header);
      if (result.success) {
        const transformedRoles = result.data.map((role: any) => {
          let permissions: Permission | null = null;
          if (role.permissions && role.permissions !== 'null' && typeof role.permissions === 'object') {
            permissions = {};
            Object.entries(role.permissions).forEach(([feature, actions]) => {
              if (Array.isArray(actions)) {
                const validActions = actions.filter((action: string) =>
                  ACTIONS[feature as Feature]?.includes(action),
                );
                if (validActions.length > 0) {
                  permissions![feature] = validActions;
                }
              }
            });
            if (Object.keys(permissions).length === 0) {
              permissions = null;
            }
          }
          return {
            ...role,
            id: String(role.id),
            permissions,
          };
        });
        setRoles(transformedRoles);
      }
    } catch (err) {
      console.log('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (feature: Feature, action: string) => {
    setFormData((prev) => {
      const newPermissions = { ...prev.permissions || {} };
      if (!newPermissions[feature]) {
        newPermissions[feature] = [];
      }
      if (newPermissions[feature].includes(action)) {
        newPermissions[feature] = newPermissions[feature].filter((a) => a !== action);
        if (newPermissions[feature].length === 0) {
          delete newPermissions[feature];
        }
      } else {
        newPermissions[feature] = [...newPermissions[feature], action];
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const isRoleNameValid = (roleName: string, excludeId?: string | number) => {
    if (!roleName.trim()) return 'Role name is required';
    if (roles.some((role) => role.role.toLowerCase() === roleName.toLowerCase() && role.id !== excludeId)) {
      return 'Role name must be unique';
    }
    return '';
  };

  const handleSaveRole = async () => {
    const error = isRoleNameValid(formData.role, editingRole?.id);
    if (error) {
      alert(error);
      return;
    }

    const token = typeof window !== 'undefined' && sessionStorage.getItem('tk')
      ? JSON.parse(sessionStorage.getItem('tk')!)
      : null;

    const header: Headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      if (editingRole) {
        const reqBody = {
          roleId: editingRole.id,
          permissions: formData.permissions
        }
        await addRolePermissionsAPI(reqBody, header);
      } else {
        await createRoleAPI(formData, header);
      }
      await fetchAllRoles();
      setIsOpen(false);
      setEditingRole(null);
      setFormData({ id: '', role: '', permissions: {} });
    } catch (err) {
      console.log('Error saving role:', err);
      alert('Failed to save role');
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({
      ...role,
      permissions: role.permissions || {},
    });
    setIsOpen(true);
  };

  const handleDeleteRole = async (id: string | number, roleName: string) => {
    if (!confirm(`Are you sure you want to delete ${roleName}?`)) return;

    const token = typeof window !== 'undefined' && sessionStorage.getItem('tk')
      ? JSON.parse(sessionStorage.getItem('tk')!)
      : null;

    if (!token) {
      alert('No authentication token found. Please log in.');
      return;
    }

    const headers: Headers = {
      Authorization: `Bearer ${token}`
    };

    try {
      const result = await deleteRoleAPI({ roleId: id }, headers);
      console.log('Delete Role Response:', result);
      if (result.success) {
        await fetchAllRoles();
      } else {
        alert(result.error || 'Failed to delete role');
      }
    } catch (err) {
      console.log('Error deleting role:', err);
      alert('Failed to delete role');
    }
  };

  return (
    <MainLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-800">User Roles</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors"
            onClick={() => {
              setFormData({ id: '', role: '', permissions: {} });
              setEditingRole(null);
              setIsOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Role
          </button>
        </div>

        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setEditingRole(null);
            setFormData({ id: '', role: '', permissions: {} });
          }}
          heading={editingRole ? 'Edit Role' : 'Add Role'}
        >
          <div className="space-y-6 p-6">
            <div className="group">
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-blue-600"
              >
                Role Name
              </label>
              <input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                placeholder="Enter role name"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">Permissions</h3>
              <div className="max-h-96 overflow-y-auto p-3 border border-gray-200 rounded-lg shadow-sm">
                {FEATURES.map((feature) => (
                  <PermissionTree
                    key={feature}
                    feature={feature}
                    actions={ACTIONS[feature]}
                    selectedActions={formData.permissions || {}}
                    toggle={togglePermission}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                className="px-5 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
                onClick={() => {
                  setIsOpen(false)
                  setEditingRole(null)
                  setFormData({ id: '', role: '', permissions: {} })
                }}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
                onClick={handleSaveRole}
              >
                {editingRole ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </Modal>

        <div className="bg-white rounded-lg shadow overflow-hidden w-full">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    Loading roles...
                  </td>
                </tr>
              ) : roles.length > 0 ? (
                roles.map((role) => (
                  <tr key={role.id} className='hover:bg-gray-50'>
                    <td className="px-6 py-4 whitespace-nowrap">{role.role.toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {role.permissions ? (
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(role.permissions).map((feature) => (
                            <span
                              key={feature}
                              className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full capitalize"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No permissions</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditRole(role)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteRole(role.id, role.role)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No roles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Page;