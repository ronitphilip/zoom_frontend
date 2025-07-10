import { Calendar } from 'lucide-react'
import React, { useState } from 'react'

const DashboardOverview = () => {

  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-06-30");

  return (
    <>
      <div className='flex justify-between items-center mb-5'>
        <h1 className='dash-heading'>Dashboard Overview</h1>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
            <span className="text-sm text-gray-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
          </div>
          <button className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700">
            Generate Report
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Total Calls</h4>
          <p className="text-xl font-bold mt-1">100</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Inbound</h4>
          <p className="text-xl font-bold mt-1 text-green-600">80</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Outbound</h4>
          <p className="text-xl font-bold mt-1 text-blue-600">20</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Missed</h4>
          <p className="text-xl font-bold mt-1 text-red-600">0</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Abandoned</h4>
          <p className="text-xl font-bold mt-1 text-orange-600">4</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Avg. Duration</h4>
          <p className="text-xl font-bold mt-1">20</p>
        </div>
      </div>
    </>
  )
}

export default DashboardOverview