import { Headers } from '@/services/commonAPI';
import { fetchAbandonedCallsAPI } from '@/services/queueAPI';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Download, RefreshCcw } from 'lucide-react';

interface AbandonedCall {
  engagementId: string;
  direction: string;
  consumerNumber: string | null;
  consumerId: string | null;
  consumerDisplayName: string | null;
  startTime: string;
  waitingDuration: number;
  channel: string;
  queueName: string;
  queueWaitType: string;
}

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

  const [calls, setCalls] = useState<AbandonedCall[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedQueue, setSelectedQueue] = useState('all');
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [allDirections, setAllDirections] = useState<string[]>(['inbound', 'outbound']);
  const [isLoading, setIsLoading] = useState(false);

  const uniqueQueues = Array.from(new Set(calls.map(record => record.queueName)))
    .map(queueName => ({
      id: queueName,
      name: queueName,
    }))

  useEffect(() => {
    fetchReports();
  }, [rowsPerPage]);

  const fetchReports = async (pageNum: number = 1, pageToken: string | null = null) => {
    setIsLoading(true);

    try {
      const token = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
      const header: Headers = { Authorization: `Bearer ${token}` };
      const reqBody = {
        from: startDate,
        to: endDate,
        count: rowsPerPage,
        page: pageNum,
        nextPageToken: pageToken,
        queue: selectedQueue === 'all' ? null : selectedQueue,
        direction: selectedDirection === 'all' ? null : selectedDirection,
      };

      const result = await fetchAbandonedCallsAPI(reqBody, header);

      if (result.success) {
        setCalls(result.data.reports || []);
        setNextPageToken(result.data.nextPageToken || null);
        setTotalRecords(result.data.totalRecords || 0);
        setPage(pageNum);
      } else {
        console.error('Invalid API response:', result);
        setCalls([]);
        setNextPageToken(null);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setCalls([]);
      setNextPageToken(null);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadExcel = () => {
    if (!calls || calls.length === 0) {
      console.error('No data available for export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(calls);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    const colWidths = Object.keys(calls[0] || {}).map((key) => ({
      wch: Math.max(key.length, ...calls.map((row: any) => String(row[key]).length))
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, 'abandoned_call_report.xlsx', { bookType: 'xlsx', type: 'binary' });
  };

  const downloadCSV = () => {
    if (!calls || calls.length === 0) {
      console.error('No data available for export');
      return;
    }

    const csv = Papa.unparse(calls);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'abandoned_call_report.csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  // Calculate summary metrics
  const totalAbandoned = calls.length;
  const avgWaitTime = calls.length > 0
    ? Math.round(calls.reduce((sum, call) => sum + call.waitingDuration, 0) / calls.length)
    : 0;
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Pagination logic
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  return (
    <div className="space-y-6">
      {/* Page header with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-800">Abandoned Calls</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={downloadExcel}
            className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
          >
            <Download size={16} className="mr-2" />Excel
          </button>
          <button
            onClick={downloadCSV}
            className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
          >
            <Download size={16} className="mr-2" />CSV
          </button>
          <button
            className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
          >
            <Download size={16} className="mr-2" />PDF
          </button>
          <button
            onClick={() => fetchReports(1, null)}
            className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
          >
            <RefreshCcw size={16} className="mr-2" />Refresh
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="text-sm font-medium">Filters</span>
              </div>
              <div className="h-8 border-l border-gray-300 mx-2"></div>
            </div>

            {/* Queue Filter */}
            <div className="relative inline-block w-44">
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={selectedQueue}
                  onChange={(e) => setSelectedQueue(e.target.value)}
                >
                  <option value="all">All Queues</option>
                  {uniqueQueues.map(queue => (
                    <option key={queue.id} value={queue.id}>
                      {queue.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-600">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Agent Filter */}
            <div className="relative inline-block w-44">
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={selectedDirection}
                  onChange={(e) => setSelectedDirection(e.target.value)}
                >
                  <option value="all">All Directions</option>
                  {allDirections.map((direction, idx) => (
                    <option key={idx} value={direction}>{direction.charAt(0).toUpperCase() + direction.slice(1)}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-600">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => fetchReports(1, null)}
            className="mt-4 sm:mt-0 px-4 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 border border-blue-600 shadow-sm"
          >
            Generate Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex flex-wrap divide-x divide-gray-200">
          <div className="flex-1 py-3 px-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-blue-100 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Total Abandoned</p>
                <p className="text-xl font-bold text-gray-800">{totalAbandoned}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 py-3 px-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-orange-100 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-orange-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Avg Wait Time</p>
                <p className="text-xl font-bold text-gray-800">{formatDuration(avgWaitTime)}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 py-3 px-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-red-100 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Abandonment Rate</p>
                <p className="text-xl font-bold text-gray-800">N/A</p>
              </div>
            </div>
          </div>
          <div className="flex-1 py-2 px-4 bg-indigo-50">
            <div className="flex items-center">
              <div className="p-1.5 rounded-md bg-indigo-100 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <div className="w-full">
                <div className="grid grid-rows-4 gap-0 text-xs">
                  {startDate && endDate && (
                    <div className="flex items-center">
                      <span className="text-indigo-600">Date:</span>
                      <span className="font-medium text-indigo-900 ml-1">
                        {new Date(startDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}{' '}
                        -{' '}
                        {new Date(endDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="text-indigo-600">Queue:</span>
                    <span className="font-medium text-indigo-900 ml-1 truncate max-w-[150px]">
                      {selectedQueue === 'all'
                        ? 'All Queues'
                        : uniqueQueues.find(queue => queue.id === selectedQueue)?.name || selectedQueue}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-indigo-600">Direction:</span>
                    <span className="font-medium text-indigo-900 ml-1 truncate max-w-[150px]">
                      {selectedDirection === 'all' ? 'All Directions' : selectedDirection.charAt(0).toUpperCase() + selectedDirection.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table content */}
      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        <div className="flex flex-col" style={{ height: 'calc(98vh - 320px)' }}>
          {/* Table header */}
          <div className="bg-gray-50">
            <table className="w-full table-fixed divide-y divide-gray-200 text-xs">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-50 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Engagement ID
                  </th>
                  <th
                    scope="col"
                    className="w-25 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Direction
                  </th>
                  <th
                    scope="col"
                    className="w-1/6 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Consumer Number
                  </th>
                  <th
                    scope="col"
                    className="w-1/6 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Consumer Name
                  </th>
                  <th
                    scope="col"
                    className="w-1/6 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    className="w-1/6 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Wait Duration
                  </th>
                  <th
                    scope="col"
                    className="w-1/6 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Queue Name
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Table body */}
          <div className="overflow-y-auto flex-grow">
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : calls.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No data available</div>
            ) : (
              <table className="w-full table-fixed divide-y divide-gray-200 text-xs">
                <tbody className="bg-white divide-y divide-gray-200">
                  {calls.map((call) => (
                    <tr key={call.engagementId} className="hover:bg-gray-50">
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 w-50">
                        {call.engagementId}
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 w-25">
                        {call.direction}
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                        {call.consumerNumber || 'N/A'}
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                        {call.consumerDisplayName || call.consumerId || 'N/A'}
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                        {new Date(call.startTime).toLocaleString()}
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                        {formatDuration(call.waitingDuration)}
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                        {call.queueName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination controls */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <span>Showing</span>
              <select
                className="mx-2 border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                  setNextPageToken(null);
                  fetchReports(1, null);
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
                disabled={page === 1}
                onClick={() => {
                  const prevPage = page - 1;
                  setPage(prevPage);
                  fetchReports(prevPage, null);
                }}
              >
                Previous
              </button>
              <span className="px-2 py-1 border border-blue-500 bg-blue-500 text-white rounded text-xs">
                {page} of {totalPages}
              </span>
              <button
                className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={page * rowsPerPage >= totalRecords || !nextPageToken}
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchReports(nextPage, nextPageToken);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}