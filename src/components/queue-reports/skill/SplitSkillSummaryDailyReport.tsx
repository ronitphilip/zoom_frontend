import React, { useEffect, useState } from 'react';
import { fetchDailyAgentQueuesAPI } from '@/services/queueAPI';
import { Headers } from '@/services/commonAPI';
import { RecordSummary } from '@/types/agentQueueTypes';

interface SplitSkillSummaryDailyReportProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

export default function SplitSkillSummaryDailyReport({
  startDate,
  endDate,
  setStartDate,
  setEndDate
}: SplitSkillSummaryDailyReportProps) {
  const [reportData, setReportData] = useState<RecordSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState<string>('all');
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    date: true,
    queueId: true,
    queueName: true,
    agentId: true,
    agentName: true,
    totalOffered: true,
    totalAnswered: true,
    abandonedCalls: true,
    acdTime: true,
    acwTime: true,
    agentRingTime: true,
    avgAcwTime: true,
    avgHandleTime: true,
    digitalInteractions: true,
    maxHandleTime: true,
    transferCount: true,
    voiceCalls: true,
  });

  // Get unique queues for the filter
  const uniqueQueues = Array.from(new Set(reportData.map(record => record.queueId)))
    .map(queueId => {
      const record = reportData.find(r => r.queueId === queueId);
      return {
        id: queueId,
        name: record?.queueName || queueId
      };
    });

  const totalPages = Math.ceil(reportData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = reportData.slice(startIndex, endIndex);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
      const header: Headers = { Authorization: `Bearer ${token}` };
      const reqBody = {
        from: startDate,
        to: endDate,
      };
      const result = await fetchDailyAgentQueuesAPI(reqBody, header);
      if (result.success && Array.isArray(result.data)) {
        setReportData(result.data);
      } else {
        console.error('Invalid API response');
        setReportData([]);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setReportData([]);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const calculateSummary = () => {
    const summary = {
      date: "SUMMARY",
      queueId: "",
      queueName: "",
      agentId: "",
      agentName: "",
      totalOffered: reportData.reduce((acc, curr) => acc + curr.totalOffered, 0),
      totalAnswered: reportData.reduce((acc, curr) => acc + curr.totalAnswered, 0),
      abandonedCalls: reportData.reduce((acc, curr) => acc + curr.abandonedCalls, 0),
      acdTime: reportData.reduce((acc, curr) => acc + curr.acdTime, 0),
      acwTime: reportData.reduce((acc, curr) => acc + curr.acwTime, 0),
      agentRingTime: reportData.reduce((acc, curr) => acc + curr.agentRingTime, 0),
      avgAcwTime: reportData.reduce((acc, curr) => acc + curr.avgAcwTime, 0),
      avgHandleTime: reportData.reduce((acc, curr) => acc + curr.avgHandleTime, 0),
      digitalInteractions: reportData.reduce((acc, curr) => acc + curr.digitalInteractions, 0),
      maxHandleTime: reportData.reduce((acc, curr) => acc + curr.maxHandleTime, 0),
      transferCount: reportData.reduce((acc, curr) => acc + curr.transferCount, 0),
      voiceCalls: reportData.reduce((acc, curr) => acc + curr.voiceCalls, 0),
    };

    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return {
      ...summary,
      acdTime: formatTime(summary.acdTime),
      acwTime: formatTime(summary.acwTime),
      agentRingTime: formatTime(summary.agentRingTime),
      avgAcwTime: formatTime(summary.avgAcwTime / (reportData.length || 1)),
      avgHandleTime: formatTime(summary.avgHandleTime / (reportData.length || 1)),
      maxHandleTime: formatTime(summary.maxHandleTime),
    };
  };

  const summary = calculateSummary();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-800">Split/Skill Summary Daily Report</h2>
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
                        onChange={() => toggleColumn(column)}
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
          <button onClick={fetchReports} className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow w-full p-4">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center space-x-4">
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
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Queue:</span>
              <div className="relative">
                <select
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-48"
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
              </div>
            </div>
          </div>
          <button
            onClick={fetchReports}
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Total Offered</p>
                <p className="text-xl font-bold text-gray-800">{summary.totalOffered}</p>
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
                <p className="text-xs font-medium text-gray-500">Total Answered</p>
                <p className="text-xl font-bold text-gray-800">{summary.totalAnswered}</p>
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
                <p className="text-xs font-medium text-gray-500">Abandoned Calls</p>
                <p className="text-xl font-bold text-gray-800">{summary.abandonedCalls}</p>
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
                {(selectedQueue === 'all') ? (
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
                        <span className="font-medium text-indigo-900 ml-1 truncate max-w-[150px]">
                          {uniqueQueues.find(queue => queue.id === selectedQueue)?.name || selectedQueue}
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
      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        <div className="flex flex-col" style={{ height: "calc(98vh - 320px)" }}>
          <div className="overflow-auto flex-grow">
            <table className="w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  {visibleColumns.date && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Date</th>}
                  {visibleColumns.queueId && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Queue ID</th>}
                  {visibleColumns.queueName && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Queue Name</th>}
                  {visibleColumns.agentId && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Agent ID</th>}
                  {visibleColumns.agentName && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Agent Name</th>}
                  {visibleColumns.totalOffered && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total Offered</th>}
                  {visibleColumns.totalAnswered && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total Answered</th>}
                  {visibleColumns.abandonedCalls && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Abandoned Calls</th>}
                  {visibleColumns.acdTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">ACD Time</th>}
                  {visibleColumns.acwTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">ACW Time</th>}
                  {visibleColumns.agentRingTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Agent Ring Time</th>}
                  {visibleColumns.avgAcwTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Avg ACW Time</th>}
                  {visibleColumns.avgHandleTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Avg Handle Time</th>}
                  {visibleColumns.digitalInteractions && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Digital Interactions</th>}
                  {visibleColumns.maxHandleTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Max Handle Time</th>}
                  {visibleColumns.transferCount && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Transfer Count</th>}
                  {visibleColumns.voiceCalls && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Voice Calls</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="bg-blue-50 font-semibold">
                  {visibleColumns.date && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.date}</td>}
                  {visibleColumns.queueId && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.queueId}</td>}
                  {visibleColumns.queueName && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.queueName}</td>}
                  {visibleColumns.agentId && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.agentId}</td>}
                  {visibleColumns.agentName && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.agentName}</td>}
                  {visibleColumns.totalOffered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalOffered}</td>}
                  {visibleColumns.totalAnswered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalAnswered}</td>}
                  {visibleColumns.abandonedCalls && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.abandonedCalls}</td>}
                  {visibleColumns.acdTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.acdTime}</td>}
                  {visibleColumns.acwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.acwTime}</td>}
                  {visibleColumns.agentRingTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.agentRingTime}</td>}
                  {visibleColumns.avgAcwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.avgAcwTime}</td>}
                  {visibleColumns.avgHandleTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.avgHandleTime}</td>}
                  {visibleColumns.digitalInteractions && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.digitalInteractions}</td>}
                  {visibleColumns.maxHandleTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.maxHandleTime}</td>}
                  {visibleColumns.transferCount && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.transferCount}</td>}
                  {visibleColumns.voiceCalls && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.voiceCalls}</td>}
                </tr>
                {currentItems.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {visibleColumns.date && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.date}</td>}
                    {visibleColumns.queueId && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.queueId}</td>}
                    {visibleColumns.queueName && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.queueName}</td>}
                    {visibleColumns.agentId && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.agentId || 'N/A'}</td>}
                    {visibleColumns.agentName && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.agentName || 'N/A'}</td>}
                    {visibleColumns.totalOffered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalOffered}</td>}
                    {visibleColumns.totalAnswered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalAnswered}</td>}
                    {visibleColumns.abandonedCalls && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.abandonedCalls}</td>}
                    {visibleColumns.acdTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatTime(record.acdTime)}</td>}
                    {visibleColumns.acwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatTime(record.acwTime)}</td>}
                    {visibleColumns.agentRingTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatTime(record.agentRingTime)}</td>}
                    {visibleColumns.avgAcwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatTime(record.avgAcwTime)}</td>}
                    {visibleColumns.avgHandleTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatTime(record.avgHandleTime)}</td>}
                    {visibleColumns.digitalInteractions && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.digitalInteractions}</td>}
                    {visibleColumns.maxHandleTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatTime(record.maxHandleTime)}</td>}
                    {visibleColumns.transferCount && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.transferCount}</td>}
                    {visibleColumns.voiceCalls && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.voiceCalls}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50} > 50</option>
            <option value={100}>100</option>
          </select>
          <span>records per page</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span className="px-2 py-1 border border-blue-500 bg-blue-500 text-white rounded text-xs">
            {currentPage}
          </span>
          <button
            className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </div >
  );

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}