import { zoomDataAttributes } from '@/services/dashboardAPI';
import React from 'react'

interface DashProps {
  data: zoomDataAttributes | undefined;
}

const ZoomUX = ({ data }: DashProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-green-800 mb-2">ZoomPhone User Experience</h3>

      {/* Connection Success Rate */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-green-50 to-white border-b">
          <h4 className="text-sm font-medium text-green-800">First-Call Connection Success</h4>
        </div>
        <div className="py-3 px-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm text-gray-500">Success Rate</div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-500">Failed</span>
                <span className="text-base font-semibold text-red-600">{data?.abandoned_calls ? parseInt(data.abandoned_calls) + parseInt(data.missed_calls) : '0'}</span>
              </div>
            </div>
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 36 36" className="h-16 w-16 stroke-current">
                <path
                  className="text-gray-200"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  className="text-green-500"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="98, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-bold text-green-700">{data?.call_success_rate ? data.call_success_rate : '0'}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Speed to Answer */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-green-50 to-white border-b">
          <h4 className="text-sm font-medium text-green-800">Speed to Answer</h4>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Average</span>
            <span className="text-base font-semibold">{data?.avg_speed_to_answer ? data.avg_speed_to_answer : '0'} s</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Least</span>
            <span className="text-base font-semibold">{data?.min_speed_to_answer ? data.min_speed_to_answer : '0'} s</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Maximum</span>
            <span className="text-base font-semibold">{data?.max_speed_to_answer ? data.max_speed_to_answer : '0'} s</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Target</span>
              <div className="flex items-center">
                <span className="text-base font-semibold text-green-700 mr-1">10 sec</span>
                {data?.avg_speed_to_answer && parseFloat(data.avg_speed_to_answer) < 10 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Usage */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-green-50 to-white border-b">
          <h4 className="text-sm font-medium text-green-800">Channel Usage</h4>
        </div>
        <div className="p-3">
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Voice</span>
              <span className="text-sm font-medium">{data?.voice_channel_percentage ? data.voice_channel_percentage : '0'} %</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: data?.voice_channel_percentage ? `${parseInt(data.voice_channel_percentage)}%` : 0 }}></div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Video</span>
              <span className="text-sm font-medium">{data?.video_channel_percentage ? data.video_channel_percentage : '0'} %</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: data?.video_channel_percentage ? `${parseInt(data.video_channel_percentage)}%` : 0 }}></div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Message</span>
              <span className="text-sm font-medium">{data?.chat_channel_percentage ? data.chat_channel_percentage : '0'} %</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: data?.chat_channel_percentage ? `${parseInt(data.chat_channel_percentage)}%` : 0 }}></div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium">{data?.email_channel_percentage ? data.email_channel_percentage : '0'} %</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: data?.email_channel_percentage ? `${parseInt(data.email_channel_percentage)}%` : 0 }}></div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Channels Used</span>
              <span className="text-base font-semibold">{data?.total_channel_count ? data.total_channel_count : '0'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZoomUX