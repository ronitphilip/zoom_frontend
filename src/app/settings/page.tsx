import MainLayout from '@/components/layout/MainLayout'
import React from 'react'

const page = () => {
    return (
        <MainLayout>
            <div>
                <h2 className="text-xl font-bold text-blue-800">Zoom Account Settings</h2>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden h-168 flex flex-col justify-between mt-6">
                    <table className="w-full max-h-130">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No.</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Account ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">client Password</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Primary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 h-15 text-sm text-gray-900">1</td>
                                <td className="px-6 h-15 text-sm text-gray-900">account_id</td>
                                <td className="px-6 h-15 text-sm text-gray-900">client_id</td>
                                <td className="px-6 h-15 text-sm text-gray-900">client_pass</td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="primary"
                                            className="hidden"
                                        />
                                        <span className="w-5 h-5 inline-block border-2 border-gray-300 rounded-full relative transition-all duration-200 peer-checked:border-blue-600 peer-checked:bg-blue-600">
                                            <span className="absolute inset-0 rounded-full bg-white scale-50 peer-checked:scale-0 transition-transform duration-200"></span>
                                        </span>
                                    </label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    )
}

export default page