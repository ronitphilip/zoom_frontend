import { Download, Filter, RefreshCcw } from 'lucide-react'
import React from 'react'

interface CommonProps {
    title: string;
    startDate: string;
    endDate: string;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
    fetchCallLogs: () => void;
}

const CommonHeader: React.FC<CommonProps> = ({ title, startDate, endDate, setStartDate, setEndDate, fetchCallLogs }) => {
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-bold text-blue-800">{title}</h2>

                <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
                        <Download size={16} className='mr-2' />
                        Excel
                    </button>

                    <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
                        <Download size={16} className='mr-2' />
                        CSV
                    </button>

                    <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
                        <Download size={16} className='mr-2' />
                        PDF
                    </button>

                    <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
                        <RefreshCcw size={16} className='mr-2' />
                        Refresh
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow w-full p-4 mt-6">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">From:</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e)=>setStartDate(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">To:</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e)=>setEndDate(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="h-8 border-l border-gray-300 mx-2"></div>
                            <div className="flex items-center space-x-1 text-gray-700">
                                <Filter size={18} />
                                <span className="text-sm font-medium">Filters</span>
                            </div>
                            <div className="h-8 border-l border-gray-300 mx-2"></div>
                        </div>
                    </div>

                    <button
                    onClick={fetchCallLogs}
                        className="mt-4 sm:mt-0 px-4 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 border border-blue-600 shadow-sm"
                    >
                        Generate Report
                    </button>
                </div>
            </div>
        </>
    )
}

export default CommonHeader