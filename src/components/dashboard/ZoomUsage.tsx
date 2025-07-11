import { zoomDataAttributes } from '@/services/dashboardAPI';
import { formatDurationToHours } from '@/utils/formatters';
import React from 'react'

interface DashProps {
  data: zoomDataAttributes | undefined;
}

const ZoomUsage = ({data}: DashProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-blue-800 mb-2">ZoomPhone Usage</h3>
      
      {/* Call Minutes Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-white border-b">
          <h4 className="text-sm font-medium text-blue-800">Total Call Minutes</h4>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Inbound</span>
            <span className="text-base font-semibold">{data?.inbound_call_minutes? formatDurationToHours(data.inbound_call_minutes) : '0'} hrs</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Outbound</span>
            <span className="text-base font-semibold">{data?.outbound_call_minutes? formatDurationToHours(data.outbound_call_minutes) : '0'} hrs</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total</span>
              <span className="text-base font-bold text-blue-700">{data?.total_call_minutes? formatDurationToHours(data.total_call_minutes) : '0'} hrs</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call Duration Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-white border-b">
          <h4 className="text-sm font-medium text-blue-800">Average Call Duration</h4>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Inbound</span>
            <span className="text-base font-semibold">{data?.avg_inbound_call_duration? formatDurationToHours(data.avg_inbound_call_duration) : '0'} hrs</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Outbound</span>
            <span className="text-base font-semibold">{data?.avg_outbound_call_duration? formatDurationToHours(data.avg_outbound_call_duration) : '0'} hrs</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Overall</span>
              <span className="text-base font-bold text-blue-700">{data?.avg_call_duration? formatDurationToHours(data.avg_call_duration) : '0'} hrs</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Peak Concurrent Calls */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-white border-b">
          <h4 className="text-sm font-medium text-blue-800">Peak Concurrent Calls</h4>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Peak Count</span>
            <span className="text-base font-bold text-blue-700">24</span>
          </div>
          <div className="text-sm text-gray-400 mb-2">Peak: 10:15 AM - 11:00 AM</div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Average</span>
              <span className="text-base font-semibold text-blue-600">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZoomUsage