import React from 'react'

const ZoomUX = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-green-800 mb-2">ZoomPhone User Experience</h3>
      
      {/* Connection Success Rate */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-green-50 to-white border-b">
          <h4 className="text-sm font-medium text-green-800">First-Call Connection Success</h4>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
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
                <span className="text-base font-bold text-green-700">98%</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Success Rate</div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-500">Failed</span>
                <span className="text-base font-semibold text-red-600">24</span>
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
            <span className="text-base font-semibold">8.2 sec</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Median</span>
            <span className="text-base font-semibold">6.5 sec</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">90th Percentile</span>
            <span className="text-base font-semibold">15.3 sec</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Target</span>
              <div className="flex items-center">
                <span className="text-base font-semibold text-green-700 mr-1">10 sec</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Client Usage */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-green-50 to-white border-b">
          <h4 className="text-sm font-medium text-green-800">Client Usage</h4>
        </div>
        <div className="p-3">
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Desktop Client</span>
              <span className="text-sm font-medium">68%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Mobile App</span>
              <span className="text-sm font-medium">24%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Desk Phone</span>
              <span className="text-sm font-medium">8%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '8%' }}></div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Calls</span>
              <span className="text-base font-semibold">1,248</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZoomUX