import React, { useState } from 'react';

interface AbandonedCallsReportProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

export default function AbandonedCallsReport({
  startDate,
  endDate,
  setStartDate,
  setEndDate
}: AbandonedCallsReportProps) {
  const [extensionType, setExtensionType] = useState('all');
  const [specificExtension, setSpecificExtension] = useState('all');
  
  return (
    <div className="space-y-6">
      {/* Page header with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-800">Abandoned Calls</h2>
        
        <div className="flex flex-wrap gap-2">
          {/* Action buttons with blue styling */}
          <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Excel
          </button>
          
          <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </button>
          
          <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            PDF
          </button>
          
          <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      {/* Date and filters card */}
      <div className="bg-white rounded-lg shadow w-full p-4">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center space-x-4">
            {/* Date Range Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">From:</span>
              <div className="relative">
                <input
                  type="date"
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">To:</span>
              <div className="relative">
                <input
                  type="date"
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            {/* Filter Icon */}
            <div className="flex items-center">
              <div className="h-8 border-l border-gray-300 mx-2"></div>
              <div className="flex items-center space-x-1 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-sm font-medium">Filters</span>
              </div>
              <div className="h-8 border-l border-gray-300 mx-2"></div>
            </div>
            
            {/* Extension Type Filter - With visible label */}
            <div className="relative inline-block w-44">
              <div className="relative">
                <select 
                  className={`block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none ${!extensionType ? 'text-gray-500' : 'text-gray-900'}`}
                  value={extensionType || ""}
                  onChange={(e) => setExtensionType(e.target.value)}
                >
                  <option value="all" className="text-gray-500">Extension Type</option>
                  <option value="user">User</option>
                  <option value="callQueue">Call Queue</option>
                  <option value="autoReceptionist">Auto Receptionist</option>
                  <option value="commonArea">Common Area</option>
                  <option value="zoomRoom">Zoom Room</option>
                  <option value="ciscoRoom">Cisco/Polycom Room</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-600">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Specific Extension Filter - With visible label */}
            <div className="relative inline-block w-44">
              <div className="relative">
                <select 
                  className={`block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none ${!specificExtension ? 'text-gray-500' : 'text-gray-900'}`}
                  value={specificExtension || ""}
                  onChange={(e) => setSpecificExtension(e.target.value)}
                  disabled={extensionType === 'all'}
                >
                  <option value="all" className="text-gray-500">Specific Extension</option>
                  {extensionType === 'user' && (
                    <>
                      <option value="user1">John Smith</option>
                      <option value="user2">Jane Doe</option>
                      <option value="user3">Michael Brown</option>
                    </>
                  )}
                  {extensionType === 'callQueue' && (
                    <>
                      <option value="queue1">Sales Queue</option>
                      <option value="queue2">Support Queue</option>
                      <option value="queue3">Billing Queue</option>
                    </>
                  )}
                  {/* Add options for other extension types */}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-600">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Generate Report Button */}
          <button className="mt-4 sm:mt-0 px-4 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 border border-blue-600 shadow-sm">
            Generate Report
          </button>
        </div>
      </div>
      
      {/* Compact Summary Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex flex-wrap divide-x divide-gray-200">
          <div className="flex-1 py-3 px-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-blue-100 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Total Abandoned</p>
                <p className="text-xl font-bold text-gray-800">14</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 py-3 px-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-orange-100 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Avg Wait Time</p>
                <p className="text-xl font-bold text-gray-800">1m 42s</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 py-3 px-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-red-100 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Abandonment Rate</p>
                <p className="text-xl font-bold text-gray-800">7.5%</p>
              </div>
            </div>
          </div>
          
          {/* Filter Criteria Summary */}
          <div className="flex-1 py-2 px-4 bg-indigo-50">
            <div className="flex items-center">
              <div className="p-1.5 rounded-md bg-indigo-100 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <div className="w-full">
                {(extensionType === 'all' && specificExtension === 'all') ? (
                  <p className="text-sm font-medium text-indigo-700">All data (no filters applied)</p>
                ) : (
                  <div className="grid grid-rows-3 gap-0 text-xs">
                    {startDate && endDate && (
                      <div className="flex items-center">
                        <span className="text-indigo-600">Date:</span>
                        <span className="font-medium text-indigo-900 ml-1">
                          {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {extensionType !== 'all' && (
                      <div className="flex items-center">
                        <span className="text-indigo-600">Type:</span>
                        <span className="font-medium text-indigo-900 ml-1 truncate max-w-[150px]">
                          {extensionType === 'user' ? 'User' : 
                           extensionType === 'callQueue' ? 'Call Queue' : 
                           extensionType === 'autoReceptionist' ? 'Auto Receptionist' : 
                           extensionType === 'commonArea' ? 'Common Area' : 
                           extensionType === 'zoomRoom' ? 'Zoom Room' : 
                           extensionType === 'ciscoRoom' ? 'Cisco/Polycom Room' : extensionType}
                        </span>
                      </div>
                    )}
                    
                    {specificExtension !== 'all' && (
                      <div className="flex items-center">
                        <span className="text-indigo-600">Ext:</span>
                        <span className="font-medium text-indigo-900 ml-1 truncate max-w-[150px]">
                          {specificExtension === 'user1' ? 'John Smith' :
                           specificExtension === 'user2' ? 'Jane Doe' :
                           specificExtension === 'user3' ? 'Michael Brown' :
                           specificExtension === 'queue1' ? 'Sales Queue' :
                           specificExtension === 'queue2' ? 'Support Queue' :
                           specificExtension === 'queue3' ? 'Billing Queue' : specificExtension}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Table content with fine-tuned fixed height and scrollable body */}
      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        {/* Fixed height container with table - slightly reduced from previous */}
        <div className="flex flex-col" style={{ height: "calc(98vh - 320px)" }}>
          {/* Table header - fixed */}
          <div className="bg-gray-50">
            <table className="w-full table-fixed divide-y divide-gray-200 text-xs">
              <thead>
                <tr>
                  <th scope="col" className="w-1/6 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Call ID
                  </th>
                  <th scope="col" className="w-1/6 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Call Direction
                  </th>
                  <th scope="col" className="w-1/6 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Calling Party Number
                  </th>
                  <th scope="col" className="w-1/6 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th scope="col" className="w-1/6 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Call Duration
                  </th>
                  <th scope="col" className="w-1/6 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Abandonment Status
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          
          {/* Table body - scrollable */}
          <div className="overflow-y-auto flex-grow">
            <table className="w-full table-fixed divide-y divide-gray-200 text-xs">
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Sample data rows */}
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                    CALL-12345
                  </td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                    Inbound
                  </td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                    +1 (555) 123-4567
                  </td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                    2023-06-15 09:45:22
                  </td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                    00:02:15
                  </td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                    <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full bg-red-100 text-red-800">
                      Abandoned
                    </span>
                  </td>
                </tr>
                
                {/* Generate more sample rows */}
                {Array.from({ length: 25 }).map((_, index) => (
                  <tr key={`extra-row-${index}`} className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                      CALL-{12346 + index}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                      Inbound
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                      +1 (555) {Math.floor(100 + Math.random() * 900)}-{Math.floor(1000 + Math.random() * 9000)}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                      2023-06-15 {Math.floor(10 + Math.random() * 10)}:{Math.floor(10 + Math.random() * 50)}:{Math.floor(10 + Math.random() * 50)}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                      00:0{Math.floor(1 + Math.random() * 5)}:{Math.floor(10 + Math.random() * 50)}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                      <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full bg-red-100 text-red-800">
                        Abandoned
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination controls */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <span>Showing</span>
            <select 
              className="mx-2 border border-gray-300 rounded px-2 py-1 text-xs bg-white"
              defaultValue="10"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>records per page</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <span className="px-2 py-1 border border-blue-500 bg-blue-500 text-white rounded text-xs">
              1
            </span>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
