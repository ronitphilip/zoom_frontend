import React, { useEffect, useState } from 'react';
import { getAgentAbandonedReportAPI, refreshQueuesAPI } from '@/services/queueAPI';
import { Headers } from '@/services/commonAPI';
import { AlignJustify, Download, Filter, RefreshCcw } from 'lucide-react';
import { AgentAbandonedReport } from '@/types/agentQueueTypes';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

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
  setEndDate,
}: AbandonedCallsReportProps) {
  const [reportData, setReportData] = useState<AgentAbandonedReport[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState<string>('all');
  const [allAgents, setAllAgents] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    startTime: true,
    engagementId: true,
    direction: true,
    consumerNumber: true,
    consumerDisplayName: true,
    queueName: true,
    agentName: true,
    channel: true,
    queueWaitType: true,
    waitingDuration: true,
    voiceMail: true,
    transferCount: true,
  });

  const uniqueQueues = Array.from(new Set(reportData.map(record => record.queueId)))
    .map(queueId => {
      const record = reportData.find(r => r.queueId === queueId);
      return {
        id: queueId,
        name: record?.queueName || queueId
      };
    });

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  useEffect(() => {
    fetchReports(1, null);
  }, [itemsPerPage]);

  const fetchReports = async (page: number = 1, pageToken: string | null = null) => {
    const token = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
    if (!token) {
      console.error('No authentication token found');
      alert('Authentication token missing. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      const header: Headers = { Authorization: `Bearer ${token}` };
      const reqBody = {
        from: startDate,
        to: endDate,
        count: itemsPerPage,
        page,
        nextPageToken: pageToken,
        queueId: selectedQueue === 'all' ? undefined : selectedQueue,
        username: selectedAgent === 'all' ? undefined : selectedAgent
      };

      const result = await getAgentAbandonedReportAPI(reqBody, header);
      if (result.success) {
        setReportData(result.data.reports || []);
        setNextPageToken(result.data.nextPageToken || null);
        setAllAgents(result.data.agents || []);
        setTotalRecords(result.data.totalRecords || 0);
        setCurrentPage(page);
      } else {
        console.error('Invalid API response:', result);
        setReportData([]);
        setNextPageToken(null);
        setTotalRecords(0);
        alert('Invalid API response. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setReportData([]);
      setNextPageToken(null);
      setTotalRecords(0);
      alert('Failed to fetch reports. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshReports = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
      if (!token) {
        console.error('No authentication token found');
        alert('Authentication token missing. Please log in again.');
        return;
      }

      const header: Headers = { Authorization: `Bearer ${token}` };
      const reqBody = {
        from: startDate,
        to: endDate,
        count: itemsPerPage,
        page: 1,
        queueId: selectedQueue !== 'all' ? selectedQueue : undefined,
        username: selectedAgent !== 'all' ? selectedAgent : undefined
      };

      const result = await refreshQueuesAPI(reqBody, header);

      if (result.success) {
        fetchReports(1, null);
      } else {
        console.error('Invalid API response:', result);
        setReportData([]);
        setNextPageToken(null);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error('Error refreshing reports:', err);
      setReportData([]);
      setNextPageToken(null);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      fetchReports(prevPage, null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      fetchReports(nextPage, nextPageToken);
    }
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const downloadExcel = () => {
    if (!reportData || reportData.length === 0) {
      console.error('No data available for export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    const colWidths = Object.keys(reportData[0] || {}).map((key) => ({
      wch: Math.max(key.length, ...reportData.map((row: any) => String(row[key]).length))
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, 'call_profile_report.xlsx', { bookType: 'xlsx', type: 'binary' });
  };

  const downloadCSV = () => {
    if (!reportData || reportData.length === 0) {
      console.error('No data available for export');
      return;
    }

    const csv = Papa.unparse(reportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'call_profile_report.csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-800">Skill Call Profile</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={downloadExcel} className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
            <Download size={16} className="mr-2" />Excel
          </button>
          <button onClick={downloadCSV} className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
            <Download size={16} className="mr-2" />CSV
          </button>
          <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
            <Download size={16} className="mr-2" />PDF
          </button>
          <div className="relative">
            <button onClick={() => setShowColumnMenu(!showColumnMenu)} className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
              <AlignJustify size={16} className="mr-2" />Columns
            </button>
            {showColumnMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="p-2 max-h-96 overflow-y-auto">
                  {Object.entries(visibleColumns).map(([column, isVisible]) => (
                    <label key={column} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                      <input className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" type="checkbox"
                        checked={isVisible}
                        onChange={() => toggleColumn(column)}
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
          <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
            onClick={() => refreshReports()}
          >
            <RefreshCcw size={16} className='mr-2' />Refresh
          </button>
        </div>
      </div>

      {/* Date and Filters */}
      <div className="bg-white rounded-lg shadow w-full p-4">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">From:</span>
              <input type="date" className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">To:</span>
              <input type="date" className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <div className="h-8 border-l border-gray-300 mx-2"></div>
              <div className="flex items-center space-x-1 text-gray-700">
                <Filter size={18} /><span className="text-sm font-medium">Filters</span>
              </div>
              <div className="h-8 border-l border-gray-300 mx-2"></div>
              <div className="flex items-center space-x-2 px-3">
                <select
                  className="block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedAgent}
                  onChange={(e) => {
                    setSelectedAgent(e.target.value);
                    setCurrentPage(1);
                    setNextPageToken(null);
                  }}
                >
                  <option value="all" className="text-gray-500">All Agents</option>
                  {allAgents.map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                </select>
                <select
                  className="block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedQueue}
                  onChange={(e) => {
                    setSelectedQueue(e.target.value);
                    setCurrentPage(1);
                    setNextPageToken(null);
                  }}
                >
                  <option value="all">All Queues</option>
                  {uniqueQueues.map(queue => (
                    <option key={queue.id} value={queue.id}>
                      {queue.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentPage(1);
              setNextPageToken(null);
              fetchReports(1, null);
            }}
            className="mt-4 sm:mt-0 px-4 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 border border-blue-600 shadow-sm"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Summary Section */}
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
                <p className="text-xs font-medium text-gray-500">Total Abandoned Calls</p>
                <p className="text-xl font-bold text-gray-800">{reportData.length}</p>
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
                <p className="text-xs font-medium text-gray-500">Total Waiting Duration</p>
                <p className="text-xl font-bold text-gray-800">
                  {(() => {
                    const totalSeconds = reportData.reduce((acc, curr) => acc + (curr.waitingDuration || 0), 0);
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const secs = totalSeconds % 60;
                    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                  })()}
                </p>
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
                <p className="text-xs font-medium text-gray-500">Voice Mails</p>
                <p className="text-xl font-bold text-gray-800">
                  {reportData.reduce((acc, curr) => acc + (curr.voiceMail || 0), 0)}
                </p>
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <div className="w-full">
                <div className="grid grid-rows-3 gap-0 text-xs">
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
                    <span className="text-indigo-600">Agent:</span>
                    <span className="font-medium text-indigo-900 ml-1 truncate max-w-[150px]">
                      {selectedAgent === 'all' ? 'All Agents' : selectedAgent}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        <div className="flex flex-col" style={{ height: 'calc(98vh - 270px)' }}>
          <div className="overflow-auto flex-grow">
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : reportData.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No data available</div>
            ) : (
              <table className="w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.startTime && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[150px] sticky top-0 bg-gray-50">Start Time</th>
                    )}
                    {visibleColumns.engagementId && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Engagement ID</th>
                    )}
                    {visibleColumns.direction && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Direction</th>
                    )}
                    {visibleColumns.consumerNumber && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Consumer Number</th>
                    )}
                    {visibleColumns.consumerDisplayName && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Consumer Name</th>
                    )}
                    {visibleColumns.queueName && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Queue Name</th>
                    )}
                    {visibleColumns.agentName && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Agent Name</th>
                    )}
                    {visibleColumns.channel && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Channel</th>
                    )}
                    {visibleColumns.queueWaitType && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Queue Wait Type</th>
                    )}
                    {visibleColumns.waitingDuration && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Waiting Duration</th>
                    )}
                    {visibleColumns.voiceMail && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Voice Mail</th>
                    )}
                    {visibleColumns.transferCount && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Transfer Count</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {visibleColumns.startTime && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.startTime}
                        </td>
                      )}
                      {visibleColumns.engagementId && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.engagementId}</td>
                      )}
                      {visibleColumns.direction && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.direction}</td>
                      )}
                      {visibleColumns.consumerNumber && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.consumerNumber}</td>
                      )}
                      {visibleColumns.consumerDisplayName && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.consumerDisplayName}</td>
                      )}
                      {visibleColumns.queueName && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.queueName}</td>
                      )}
                      {visibleColumns.agentName && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.agentName}</td>
                      )}
                      {visibleColumns.channel && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.channel}</td>
                      )}
                      {visibleColumns.queueWaitType && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.queueWaitType}</td>
                      )}
                      {visibleColumns.waitingDuration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {(() => {
                            const seconds = record.waitingDuration || 0;
                            const hours = Math.floor(seconds / 3600);
                            const minutes = Math.floor((seconds % 3600) / 60);
                            const secs = seconds % 60;
                            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                          })()}
                        </td>
                      )}
                      {visibleColumns.voiceMail && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.voiceMail}</td>
                      )}
                      {visibleColumns.transferCount && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.transferCount}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <span>Showing</span>
              <select
                className="mx-2 border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                  setNextPageToken(null);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>records per page</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-2 py-1 border border-blue-500 bg-blue-500 text-white rounded text-xs">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}