'use client'
import React, { useState, useEffect } from 'react';
import { AgentTraceRecord } from '@/types/avayaReportTypes';
import { fetchAgentReportAPI } from '@/services/reportAPI';
import { Headers } from '@/services/commonAPI';

interface AgentTraceReportProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

export default function AgentTraceReport({
  startDate,
  endDate,
  setStartDate,
  setEndDate
}: AgentTraceReportProps) {
  const [selectedQueue, setSelectedQueue] = useState('all');
  const [selectedUsername, setSelectedUsername] = useState('all');
  const [reportData, setReportData] = useState<AgentTraceRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    time: true,
    queue: true,
    handleDuration: true,
    holdDuration: true,
    wrapUpDuration: true,
    channel: true,
    direction: true,
    callingParty: true,
    transferInitiatedCount: true,
    transferCompletedCount: true,
    userName: true,
    status: true,
    subStatus: true,
    duration: true,
    viewInteraction: true
  });

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const reqBody = {
        from: startDate,
        to: endDate
      };
      const headers: Headers = {
        authorization: `Bearer ${JSON.parse(sessionStorage.getItem('tk') || '"tk')}`
      };
      const response = await fetchAgentReportAPI(reqBody, headers);
      if (response.success) {
        setReportData(response.data);
      } else {
        setError('Failed to fetch report data');
      }
    } catch (err) {
      setError('An error occurred while fetching the report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);
  console.log(reportData);

  const handleViewInteraction = (record: AgentTraceRecord) => {
    console.log('Viewing interaction:', record);
  };

  const uniqueQueues = Array.from(new Set(reportData.map(item => item.queue))).filter(Boolean);
  const uniqueUsernames = Array.from(new Set(reportData.map(item => item.user_name))).filter(Boolean);

  // Calculate pagination
  const filteredData = reportData.filter(record =>
    (selectedQueue === 'all' || record.queue === selectedQueue) &&
    (selectedUsername === 'all' || record.user_name === selectedUsername)
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-800">Agent Trace by Location Report</h2>
        <div className="flex flex-wrap gap-2">
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
          <div className="relative">
            <button
              onClick={() => setShowColumnMenu(!showColumnMenu)}
              className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Columns
            </button>
            {showColumnMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="p-2 max-h-96 overflow-y-auto">
                  {Object.entries(visibleColumns).map(([column, isVisible]) => (
                    <label key={column} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => setVisibleColumns(prev => ({
                          ...prev,
                          [column]: !prev[column as keyof typeof prev]
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {column.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={fetchReportData}
            className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
          >
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
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">From:</span>
              <input
                type="date"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">To:</span>
              <input
                type="date"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
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
            <div className="relative inline-block w-44">
              <select
                className="block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={selectedQueue}
                onChange={(e) => setSelectedQueue(e.target.value)}
              >
                <option value="all" className="text-gray-500">All Queues</option>
                {uniqueQueues.map((queue, idx) => (
                  <option key={idx} value={queue}>{queue}</option>
                ))}
              </select>
            </div>

            <div className="relative inline-block w-44">
              <select
                className="block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={selectedUsername}
                onChange={(e) => setSelectedUsername(e.target.value)}
              >
                <option value="all" className="text-gray-500">All Users</option>
                {uniqueUsernames.map((name, idx) => (
                  <option key={idx} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={fetchReportData}
            className="mt-4 sm:mt-0 px-4 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 border border-blue-600 shadow-sm"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center text-gray-600">Loading report data...</div>
      )}
      {error && (
        <div className="text-center text-red-600">{error}</div>
      )}

      {/* Compact Summary Section */}
      {!loading && !error && (
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
                  <p className="text-xs font-medium text-gray-500">Total Interactions</p>
                  <p className="text-xl font-bold text-gray-800">{reportData.length}</p>
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
                  <p className="text-xs font-medium text-gray-500">Avg Handle Duration</p>
                  <p className="text-xl font-bold text-gray-800">
                    {Math.round(reportData.reduce((sum, r) => sum + (r.handle_duration || 0), 0) / (reportData.length || 1))}s
                  </p>
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
                  <p className="text-xs font-medium text-gray-500">Most Common Channel</p>
                  <p className="text-xl font-bold text-gray-800">
                    {reportData.length > 0 ?
                      Object.entries(
                        reportData.reduce((acc, r) => {
                          acc[r.channel] = (acc[r.channel] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).reduce((a, b) => a[1] > b[1] ? a : b)[0] : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 py-2 px-4 bg-indigo-50">
              <div className="flex items-center">
                <div className="p-1.5 rounded-md bg-indigo-100 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <div className="w-full">
                  {(selectedQueue === 'all' && selectedUsername === 'all') ? (
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
                      {selectedQueue !== 'all' && (
                        <div className="flex items-center">
                          <span className="text-indigo-600">Queue:</span>
                          <span className="font-medium text-indigo-900 ml-1">{selectedQueue}</span>
                        </div>
                      )}
                      {selectedUsername !== 'all' && (
                        <div className="flex items-center">
                          <span className="text-indigo-600">Agent:</span>
                          <span className="font-medium text-indigo-900 ml-1">{selectedUsername}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden w-full">
          <div className="flex flex-col" style={{ height: "calc(98vh - 320px)" }}>
            <div className="overflow-auto flex-grow">
              <table className="w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.date && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                        Date
                      </th>
                    )}
                    {visibleColumns.time && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                        Time
                      </th>
                    )}
                    {visibleColumns.queue && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Queue
                      </th>
                    )}
                    {visibleColumns.handleDuration && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Handle Duration
                      </th>
                    )}
                    {visibleColumns.holdDuration && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Hold Duration
                      </th>
                    )}
                    {visibleColumns.wrapUpDuration && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Wrap Up Duration
                      </th>
                    )}
                    {visibleColumns.channel && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Channel
                      </th>
                    )}
                    {visibleColumns.direction && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Direction
                      </th>
                    )}
                    {visibleColumns.callingParty && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[150px] sticky top-0 bg-gray-50">
                        Calling Party
                      </th>
                    )}
                    {visibleColumns.transferInitiatedCount && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Transfer Initiated
                      </th>
                    )}
                    {visibleColumns.transferCompletedCount && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Transfer Completed
                      </th>
                    )}
                    {visibleColumns.userName && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        User Name
                      </th>
                    )}
                    {visibleColumns.status && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Status
                      </th>
                    )}
                    {visibleColumns.subStatus && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Sub Status
                      </th>
                    )}
                    {visibleColumns.duration && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Duration
                      </th>
                    )}
                    {visibleColumns.viewInteraction && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                        View
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {visibleColumns.date && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[100px]">{record.date}</td>
                      )}
                      {visibleColumns.time && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[100px]">{record.time}</td>
                      )}
                      {visibleColumns.queue && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.queue}</td>
                      )}
                      {visibleColumns.handleDuration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.handle_duration}s</td>
                      )}
                      {visibleColumns.holdDuration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.hold_duration}s</td>
                      )}
                      {visibleColumns.wrapUpDuration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.wrap_up_duration}s</td>
                      )}
                      {visibleColumns.channel && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.channel}</td>
                      )}
                      {visibleColumns.direction && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.direction}</td>
                      )}
                      {visibleColumns.callingParty && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[150px]">{record.calling_party}</td>
                      )}
                      {visibleColumns.transferInitiatedCount && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.transfer_initiated_count}</td>
                      )}
                      {visibleColumns.transferCompletedCount && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.transfer_completed_count}</td>
                      )}
                      {visibleColumns.userName && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.user_name}</td>
                      )}
                      {visibleColumns.status && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.status}</td>
                      )}
                      {visibleColumns.subStatus && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.sub_status}</td>
                      )}
                      {visibleColumns.duration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.duration}s</td>
                      )}
                      {visibleColumns.viewInteraction && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[100px]">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleViewInteraction(record)}
                          >
                            View
                          </button>
                        </td>
                      )}
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
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>records per page</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              <span className="px-2 py-1 border border-blue-500 bg-blue-500 text-white rounded text-xs">
                {currentPage}
              </span>
              <button
                className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}