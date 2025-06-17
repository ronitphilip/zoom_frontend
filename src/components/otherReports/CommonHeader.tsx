import { Download, RefreshCcw } from 'lucide-react'
import React from 'react'

interface CommonProps {
    title: string
}

const CommonHeader: React.FC<CommonProps> = ({ title }) => {
    return (
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
    )
}

export default CommonHeader