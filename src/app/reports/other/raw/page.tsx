'use client';

import MainLayout from '@/components/layout/MainLayout'
import CommonHeader from '@/components/otherReports/CommonHeader'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react'

const page = () => {

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('')

  return (
    <MainLayout>
      <CommonHeader title={'Raw Call Data'} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-146 flex flex-col justify-between mt-6">
        <table className="w-full max-h-130">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No.</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Caller</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Caller No.</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Callee</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Callle No.</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Direction</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Result</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Time</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-2 text-sm text-gray-900">No.</td>
              <td className="px-6 py-2 text-sm text-gray-900">Caller</td>
              <td className="px-6 py-2 text-sm text-gray-900">Caller No.</td>
              <td className="px-6 py-2 text-sm text-gray-900">Callee</td>
              <td className="px-6 py-2 text-sm text-gray-900">Callle No.</td>
              <td className="px-6 py-2 text-sm text-gray-900">Direction</td>
              <td className="px-6 py-2 text-sm text-gray-900">Duration</td>
              <td className="px-6 py-2 text-sm text-gray-900">Result</td>
              <td className="px-6 py-2 text-sm text-gray-900">Start Time</td>
              <td className="px-6 py-2 text-sm text-gray-900">End Time</td>
            </tr>
          </tbody>
        </table>

        <div className="h-15 flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing 1 to 2 of 3
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex space-x-1">
              <button className="px-3 py-1 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white">
                page
              </button>
            </div>
            <button
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default page