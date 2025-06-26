'use client'
import MainLayout from '@/components/layout/MainLayout'
import Modal from '@/components/layout/Modal'
import { TeamAttributes, TeamMemeber } from '@/types/teamTypes'
import { Plus, Search, User } from 'lucide-react'
import React, { useState, useEffect, useMemo } from 'react'
import { fetchTeamssAPI, createTeamssAPI, updateTeamsAPI, deleteTeamsAPI } from '@/services/teamAPI'
import { Headers } from '@/services/commonAPI'

const page = () => {
    const [teamName, setTeamName] = useState<string>('');
    const [teamMembers, setTeamMembers] = useState<TeamMemeber[]>([]);
    const [teamData, setTeamData] = useState<TeamAttributes[]>([]);
    const [userData, setUserData] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [editingTeam, setEditingTeam] = useState<TeamAttributes | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const token = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;

    const summaryMetrics = useMemo(() => [
        { 
            label: 'Total Teams', 
            value: teamData.length.toString(), 
            bgColor: 'bg-blue-100' 
        },
        { 
            label: 'Total Employees', 
            value: new Set(teamData.flatMap(team => team.team_members?.map(m => m.name) || [])).size.toString(), 
            bgColor: 'bg-orange-100' 
        },
        { 
            label: 'Largest Team Size', 
            value: Math.max(...teamData.map(team => team.team_members?.length || 0), 0).toString(), 
            bgColor: 'bg-green-100' 
        },
    ], [teamData]);

    const fetchTeams = async () => {
        setIsLoading(true);
        try {
            const headers: Headers = {
                authorization: `Bearer ${token}`
            };
            const reqBody: Headers = {
                authorization: `Bearer ${token}`
            };
            const response = await fetchTeamssAPI(headers, reqBody);
            setTeamData(response.data?.teams || []);
            setUserData(response.data?.users || []);
        } catch (error) {
            console.error('Error fetching teams:', error);
            alert('Failed to fetch teams. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamName.trim()) {
            alert('Team name is required');
            return;
        }
        try {
            const headers: Headers = {
                authorization: `Bearer ${token}`
            };
            const reqBody: TeamAttributes = {
                team_name: teamName.trim(),
                team_members: teamMembers
            };
            await createTeamssAPI(headers, reqBody);
            setTeamName('');
            setTeamMembers([]);
            setIsCreateModalOpen(false);
            await fetchTeams();
        } catch (error) {
            console.error('Error creating team:', error);
            alert('Failed to create team. Please try again.');
        }
    };

    const handleUpdateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamName.trim()) {
            alert('Team name is required');
            return;
        }
        if (!editingTeam?.id) {
            alert('Invalid team ID');
            return;
        }
        try {
            const headers: Headers = {
                authorization: `Bearer ${token}`
            };
            const reqBody = {
                team_name: teamName.trim(),
                team_members: teamMembers
            };
            await updateTeamsAPI(headers, editingTeam.id.toString(), reqBody);
            setTeamName('');
            setTeamMembers([]);
            setIsCreateModalOpen(false);
            setEditingTeam(null);
            await fetchTeams();
        } catch (error) {
            console.error('Error updating team:', error);
            alert('Failed to update team. Please try again.');
        }
    };

    const handleDeleteTeam = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this team?')) return;
        try {
            const headers: Headers = {
                authorization: `Bearer ${token}`
            };
            await deleteTeamsAPI(headers, { id });
            await fetchTeams();
        } catch (error) {
            console.error('Error deleting team:', error);
            alert('Failed to delete team. Please try again.');
        }
    };

    const handleEditClick = (team: TeamAttributes) => {
        setEditingTeam(team);
        setTeamName(team.team_name);
        setTeamMembers(team.team_members || []);
        setIsCreateModalOpen(true);
    };

    const handleAddUser = (user: string) => {
        if (!teamMembers.some(member => member.name === user)) {
            setTeamMembers([...teamMembers, { name: user }]);
        }
    };

    const handleRemoveUser = (user: string) => {
        setTeamMembers(teamMembers.filter(member => member.name !== user));
    };

    // Enhanced search functionality
    const filteredTeams = useMemo(() => {
        if (!searchTerm.trim()) return teamData;
        const lowerSearch = searchTerm.toLowerCase();
        return teamData.filter(team =>
            team.team_name.toLowerCase().includes(lowerSearch) ||
            team.team_members?.some(member => 
                member?.name?.toLowerCase().includes(lowerSearch)
            )
        );
    }, [teamData, searchTerm]);

    useEffect(() => {
        if (token) {
            fetchTeams();
        }
    }, [token]);

    return (
        <MainLayout>
            <div>
                <h2 className="text-xl font-bold text-blue-800">Manage Teams</h2>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
                    <div className="relative w-full sm:w-1/3">
                        <input
                            type="text"
                            placeholder="Search teams or members"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    <button
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                        onClick={() => {
                            setEditingTeam(null);
                            setTeamName('');
                            setTeamMembers([]);
                            setIsCreateModalOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-5 w-5" /> Add Team
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow mt-6">
                    <div className="flex flex-wrap divide-x divide-gray-200">
                        {summaryMetrics.map((metric, index) => (
                            <div key={index} className="flex-1 py-4 px-6">
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-md ${metric.bgColor} mr-3`}>
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                                        <p className="text-xl font-bold text-gray-800">{metric.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
                    <div className="flex flex-col" style={{ height: 'calc(100vh - 270px)' }}>
                        <div className="overflow-auto flex-grow">
                            <table className="w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Team
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Members
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : filteredTeams.length > 0 ? (
                                        filteredTeams.map((team, index) => (
                                            <tr key={team.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{team.team_name}</td>
                                                <td className="px-6 py-4">
                                                    {team.team_members?.map(member => member.name).join(', ') || 'No members'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-800 mr-4"
                                                        onClick={() => handleEditClick(team)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-800"
                                                        onClick={() => handleDeleteTeam(team.id || 0)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                                No teams found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                                <span>Showing</span>
                                <select className="mx-2 border border-gray-300 rounded px-3 py-1 bg-white">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <span>records per page</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                    Previous
                                </button>
                                <span className="px-3 py-1 border border-blue-500 bg-blue-500 text-white rounded">1</span>
                                <button className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    isOpen={isCreateModalOpen}
                    onClose={() => {
                        setIsCreateModalOpen(false);
                        setEditingTeam(null);
                        setTeamName('');
                        setTeamMembers([]);
                    }}
                    heading={editingTeam ? 'Edit Team' : 'Create Team'}
                >
                    <form onSubmit={editingTeam ? handleUpdateTeam : handleCreateTeam} className="space-y-6">
                        <div>
                            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                                Team Name
                            </label>
                            <input
                                id="teamName"
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                placeholder="Enter team name"
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Select Team Members
                            </label>
                            <div className="mt-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-3">
                                {userData.length > 0 ? (
                                    userData.map((user, index) => (
                                        <div key={index} className="flex items-center p-2 hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                id={`user-${index}`}
                                                checked={teamMembers.some(member => member.name === user)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        handleAddUser(user);
                                                    } else {
                                                        handleRemoveUser(user);
                                                    }
                                                }}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor={`user-${index}`} className="ml-3 text-sm text-gray-900">
                                                {user}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No users available</p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setEditingTeam(null);
                                    setTeamName('');
                                    setTeamMembers([]);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                disabled={!teamName.trim()}
                            >
                                {editingTeam ? 'Update Team' : 'Create Team'}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </MainLayout>
    )
}

export default page