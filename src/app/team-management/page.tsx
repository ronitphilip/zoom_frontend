'use client'
import MainLayout from '@/components/layout/MainLayout'
import { Plus, Search, User } from 'lucide-react'
import React, { useState } from 'react'

const page = () => {
    const [isLoading, setIsLoading] = useState(false);

    const summaryMetrics = [
        { label: 'Total Interactions', value: '10', bgColor: 'bg-blue-100' },
        { label: 'Avg Handle Duration', value: '10 mins', bgColor: 'bg-orange-100' },
        { label: 'Most Common Channel', value: 'Voice', bgColor: 'bg-red-100' },
    ];
    return (
        <MainLayout>
            <div>
                <h2 className="text-xl font-bold text-blue-800">Manage Teams</h2>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
                    <div className="relative w-1/4 bg-white rounded-lg">
                        <input
                            type="text"
                            placeholder="Search teams or users"
                            className="w-full pl-10 py-1 border border-gray-300 rounded-lg shadow-sm outline-none transition-all"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button className="flex items-center px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 transition-all disabled:opacity-50"
                            onClick={()=> alert('Clicked')}
                        >
                            <Plus className="mr-2 h-5 w-5" /> Add User
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow mt-6">
                    <div className="flex flex-wrap divide-x divide-gray-200">
                        {summaryMetrics.map((metric, index) => (
                            <div key={index} className="flex-1 py-3 px-4">
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-md ${metric.bgColor} mr-3`}>
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">{metric.label}</p>
                                        <p className="text-xl font-bold text-gray-800">{metric.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex-1 py-2 px-4 bg-indigo-50">
                            <div className="flex items-center">
                                <div className="p-1.5 rounded-md bg-indigo-100 mr-3">
                                    <User size={16} />
                                </div>
                                <p className="text-sm font-medium text-indigo-700">All data (no filters applied)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
                    <div className="flex flex-col" style={{ height: 'calc(98vh - 230px)' }}>
                        <div className="overflow-auto flex-grow">
                            <table className="w-full divide-y divide-gray-200 text-xs">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50">
                                            No
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50">
                                            Team
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50">
                                            Employees
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td className="px-3 py-1.5 text-center text-sm text-gray-500">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : true ? (
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900" >
                                                1
                                            </td>
                                            <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900" >
                                                1
                                            </td>
                                            <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900" >
                                                1
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td className="px-3 py-1.5 text-center text-sm text-gray-500">
                                                No data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-500">
                                <span>Showing</span>
                                <select className="mx-2 border border-gray-300 rounded px-2 py-1 text-xs bg-white">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <span>records per page</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                    Previous
                                </button>
                                <span className="px-2 py-1 border border-blue-500 bg-blue-500 text-white rounded text-xs">1</span>
                                <button className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default page