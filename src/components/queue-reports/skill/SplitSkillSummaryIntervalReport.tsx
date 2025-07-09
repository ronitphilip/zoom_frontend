import React, { useEffect, useState } from 'react';
import { fetchIntervalAgentQueuesAPI, refreshQueuesAPI } from '@/services/queueAPI';
import { Headers } from '@/services/commonAPI';
import { RecordSummary } from '@/types/agentQueueTypes';
import { AlignJustify, Download, RefreshCcw } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface SplitSkillSummaryIntervalReportProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

export default function SplitSkillSummaryIntervalReport({
  startDate,
  endDate,
  setStartDate,
  setEndDate
}: SplitSkillSummaryIntervalReportProps) {
  const [reportData, setReportData] = useState<RecordSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState<string>('all');
  const [selectedInterval, setSelectedInterval] = useState<string>('15');
  const [isLoading, setIsLoading] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    date: true,
    time: true,
    queueId: true,
    queueName: true,
    totalOffered: true,
    totalAnswered: true,
    abandonedCalls: true,
    voiceCalls: true,
    digitalInteractions: true,
    transferCount: true,
    agentRingTime: true,
    acdTime: true,
    acwTime: true,
    avgHandleTime: true,
    avgAcwTime: true,
    maxHandleTime: true
  });

  // Get unique queues for the filter
  const uniqueQueues = React.useMemo(
    () =>
      Array.from(new Set(reportData.map(record => record.queueId))).map(queueId => {
        const record = reportData.find(r => r.queueId === queueId);
        return {
          id: queueId,
          name: record?.queueName || queueId
        };
      }),
    [reportData]
  );

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  useEffect(() => {
    fetchReports(1, null);
  }, [itemsPerPage]);

  const fetchReports = async (page: number = 1, nextPageToken: string | null = null) => {
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
        interval: selectedInterval,
        count: itemsPerPage,
        page,
        nextPageToken,
        queueId: selectedQueue !== 'all' ? selectedQueue : undefined
      };
      const result = await fetchIntervalAgentQueuesAPI(reqBody, header);

      if (result.success && Array.isArray(result.data.reports)) {
        const reports = result.data.reports;
        setReportData(reports);
        setTotalRecords(result.data.totalRecords || 0);
        setNextPageToken(result.data.nextPageToken || null);
        setCurrentPage(page);
        if (reports.length > itemsPerPage) {
          console.warn(`Received ${reports.length} records, expected up to ${itemsPerPage}`);
        }
      } else {
        console.error('Invalid API response');
        setReportData([]);
        setTotalRecords(0);
        setNextPageToken(null);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setReportData([]);
      setTotalRecords(0);
      setNextPageToken(null);
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
        interval: selectedInterval,
        count: itemsPerPage,
        page: 1,
        queueId: selectedQueue !== 'all' ? selectedQueue : undefined
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
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateSummary = () => {
    const summary = {
      date: "SUMMARY",
      time: "",
      queueId: "",
      queueName: "",
      totalOffered: reportData.reduce((acc, curr) => acc + curr.totalOffered, 0),
      totalAnswered: reportData.reduce((acc, curr) => acc + curr.totalAnswered, 0),
      abandonedCalls: reportData.reduce((acc, curr) => acc + curr.abandonedCalls, 0),
      voiceCalls: reportData.reduce((acc, curr) => acc + curr.voiceCalls, 0),
      digitalInteractions: reportData.reduce((acc, curr) => acc + curr.digitalInteractions, 0),
      transferCount: reportData.reduce((acc, curr) => acc + curr.transferCount, 0),
      agentRingTime: reportData.reduce((acc, curr) => acc + curr.agentRingTime, 0),
      acdTime: reportData.reduce((acc, curr) => acc + curr.acdTime, 0),
      acwTime: reportData.reduce((acc, curr) => acc + curr.acwTime, 0),
      avgHandleTime: reportData.reduce((acc, curr) => acc + curr.avgHandleTime, 0),
      avgAcwTime: reportData.reduce((acc, curr) => acc + curr.avgAcwTime, 0),
      maxHandleTime: reportData.reduce((acc, curr) => Math.max(acc, curr.maxHandleTime), 0)
    };

    return {
      ...summary,
      agentRingTime: formatDuration(summary.agentRingTime),
      acdTime: formatDuration(summary.acdTime),
      acwTime: formatDuration(summary.acwTime),
      avgHandleTime: formatDuration(summary.avgHandleTime / (reportData.length || 1)),
      avgAcwTime: formatDuration(summary.avgAcwTime / (reportData.length || 1)),
      maxHandleTime: formatDuration(summary.maxHandleTime)
    };
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const summary = calculateSummary();

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

    XLSX.writeFile(workbook, 'skill_interval_report.xlsx', { bookType: 'xlsx', type: 'binary' });
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
    link.setAttribute('download', 'skill_interval_report.csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page header with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-800">Split/Skill Summary Interval Report</h2>
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
            <button
              onClick={() => setShowColumnMenu(!showColumnMenu)}
              className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
            >
              <AlignJustify size={16} className="mr-2" />Columns
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
          <button
            onClick={() => refreshReports()}
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
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Queue:</span>
              <select
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-48"
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
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Interval:</span>
              <select
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                value={selectedInterval}
                onChange={(e) => {
                  setSelectedInterval(e.target.value);
                  setCurrentPage(1);
                  setNextPageToken(null);
                }}
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
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

      {/* Summary Cards */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex flex-wrap divide-x divide-gray-200">
          <div className="flex-1 py-3 px-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-blue-100 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none " viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <div className="w-full">
                {(selectedQueue === 'all' && selectedInterval === '15') ? (
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
                    {selectedInterval && (
                      <div className="flex items-center">
                        <span className="text-indigo-600">Interval:</span>
                        <span className="font-medium text-indigo-900 ml-1">
                          {selectedInterval} Minutes
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

      {/* Report Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        <div className="flex flex-col" style={{ height: "calc(98vh - 270px)" }}>
          <div className="overflow-auto flex-grow">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : reportData.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No data available</div>
            ) : (
              <table className="w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.date && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Date</th>}
                    {visibleColumns.time && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Time</th>}
                    {visibleColumns.queueId && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Queue ID</th>}
                    {visibleColumns.queueName && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Queue Name</th>}
                    {visibleColumns.totalOffered && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total Offered</th>}
                    {visibleColumns.totalAnswered && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total Answered</th>}
                    {visibleColumns.abandonedCalls && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Abandoned Calls</th>}
                    {visibleColumns.voiceCalls && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Voice Calls</th>}
                    {visibleColumns.digitalInteractions && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Digital Interactions</th>}
                    {visibleColumns.transferCount && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Transfer Count</th>}
                    {visibleColumns.agentRingTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Agent Ring Time</th>}
                    {visibleColumns.acdTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">ACD Time</th>}
                    {visibleColumns.acwTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">ACW Time</th>}
                    {visibleColumns.avgHandleTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Avg Handle Time</th>}
                    {visibleColumns.avgAcwTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Avg ACW Time</th>}
                    {visibleColumns.maxHandleTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Max Handle Time</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="bg-blue-50 font-semibold">
                    {visibleColumns.date && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.date}</td>}
                    {visibleColumns.time && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.time}</td>}
                    {visibleColumns.queueId && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.queueId}</td>}
                    {visibleColumns.queueName && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.queueName}</td>}
                    {visibleColumns.totalOffered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalOffered}</td>}
                    {visibleColumns.totalAnswered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalAnswered}</td>}
                    {visibleColumns.abandonedCalls && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.abandonedCalls}</td>}
                    {visibleColumns.voiceCalls && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.voiceCalls}</td>}
                    {visibleColumns.digitalInteractions && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.digitalInteractions}</td>}
                    {visibleColumns.transferCount && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.transferCount}</td>}
                    {visibleColumns.agentRingTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.agentRingTime}</td>}
                    {visibleColumns.acdTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.acdTime}</td>}
                    {visibleColumns.acwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.acwTime}</td>}
                    {visibleColumns.avgHandleTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.avgHandleTime}</td>}
                    {visibleColumns.avgAcwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.avgAcwTime}</td>}
                    {visibleColumns.maxHandleTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.maxHandleTime}</td>}
                  </tr>
                  {reportData.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {visibleColumns.date && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatDate(record.date)}</td>}
                      {visibleColumns.time && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatTime(record.date)}</td>}
                      {visibleColumns.queueId && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.queueId}</td>}
                      {visibleColumns.queueName && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.queueName}</td>}
                      {visibleColumns.totalOffered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalOffered}</td>}
                      {visibleColumns.totalAnswered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalAnswered}</td>}
                      {visibleColumns.abandonedCalls && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.abandonedCalls}</td>}
                      {visibleColumns.voiceCalls && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.voiceCalls}</td>}
                      {visibleColumns.digitalInteractions && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.digitalInteractions}</td>}
                      {visibleColumns.transferCount && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.transferCount}</td>}
                      {visibleColumns.agentRingTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatDuration(record.agentRingTime)}</td>}
                      {visibleColumns.acdTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatDuration(record.acdTime)}</td>}
                      {visibleColumns.acwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatDuration(record.acwTime)}</td>}
                      {visibleColumns.avgHandleTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatDuration(record.avgHandleTime)}</td>}
                      {visibleColumns.avgAcwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatDuration(record.avgAcwTime)}</td>}
                      {visibleColumns.maxHandleTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatDuration(record.maxHandleTime)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500 space-x-4">
              <div className="flex items-center">
                <span>Showing</span>
                <select
                  className="mx-2 border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                    setNextPageToken(null);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
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