import React, { useEffect, useState } from 'react';
import { fetchAgentQueuesAPI, refreshQueuesAPI } from '@/services/queueAPI';
import { Headers } from '@/services/commonAPI';
import { SkillRecord } from '@/types/agentQueueTypes';
import { AlignJustify, Download, Filter, RefreshCcw } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { formatMillisecondsToMinutes } from '@/utils/formatters';

interface SplitSkillDailyReportProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

export default function SplitSkillDailyReport({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: SplitSkillDailyReportProps) {
  const [reportData, setReportData] = useState<SkillRecord[]>([]);
  const [allAgents, setAllAgents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    date: true,
    time: true,
    queue_name: true,
    display_name: true,
    user_id: true,
    consumer_display_name: true,
    consumer_number: true,
    direction: true,
    channel: true,
    duration: true,
    flow_duration: true,
    handling_duration: true,
    talk_duration: true,
    waiting_duration: true,
    wrap_up_duration: true,
    transferCount: true,
    voice_mail: true,
    flow_name: true,
    queue_wait_type: true,
    engagement_id: true,
  });

  useEffect(() => {
    fetchReports(1);
  }, [itemsPerPage]);

  const fetchReports = async (page: number = 1) => {
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
        queue: selectedQueue === 'all' ? null : selectedQueue,
        agent: selectedAgent === 'all' ? null : selectedAgent,
      };

      const result = await fetchAgentQueuesAPI(reqBody, header);

      if (result.success) {
        setReportData(result.data.reports || []);
        setAllAgents(result.data.agents || []);
        setTotalRecords(result.data.totalRecords || 0);
        setCurrentPage(page);
      } else {
        console.error('Invalid API response:', result);
        setReportData([]);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setReportData([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshReports = async (page: number = 1) => {
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
      };

      const result = await refreshQueuesAPI(reqBody, header);

      if (result.success) {
        setReportData(result.data.reports || []);
        setAllAgents(result.data.agents || []);
        setTotalRecords(result.data.totalRecords || 0);
        setCurrentPage(page);
      } else {
        console.error('Invalid API response:', result);
        setReportData([]);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setReportData([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
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

    XLSX.writeFile(workbook, 'skill_daily_report.xlsx', { bookType: 'xlsx', type: 'binary' });
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
    link.setAttribute('download', 'skill_daily_report.csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchReports(prevPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < totalRecords) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchReports(nextPage);
    }
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const uniqueQueues = Array.from(new Set(reportData.map(item => item.queue_name))).filter(Boolean);
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const currentItems = reportData;

  const calculateSummary = () => {
    const summary = {
      date: 'SUMMARY',
      time: '',
      queue_name: '',
      display_name: '',
      user_id: '',
      consumer_display_name: '',
      consumer_number: '',
      direction: '',
      channel: '',
      duration: reportData.reduce((acc, curr) => acc + (curr.duration || 0), 0),
      flow_duration: reportData.reduce((acc, curr) => acc + (curr.flow_duration || 0), 0),
      handling_duration: reportData.reduce((acc, curr) => acc + (curr.handling_duration || 0), 0),
      talk_duration: reportData.reduce((acc, curr) => acc + (curr.talk_duration || 0), 0),
      waiting_duration: reportData.reduce((acc, curr) => acc + (curr.waiting_duration || 0), 0),
      wrap_up_duration: reportData.reduce((acc, curr) => acc + (curr.wrap_up_duration || 0), 0),
      transferCount: reportData.reduce((acc, curr) => acc + (curr.transferCount || 0), 0),
      voice_mail: reportData.reduce((acc, curr) => acc + (curr.voice_mail || 0), 0),
      flow_name: '',
      queue_wait_type: '',
      engagement_id: '',
    };

    return {
      ...summary,
      duration: formatMillisecondsToMinutes(summary.duration),
      flow_duration: formatMillisecondsToMinutes(summary.flow_duration),
      handling_duration: formatMillisecondsToMinutes(summary.handling_duration),
      talk_duration: formatMillisecondsToMinutes(summary.talk_duration),
      waiting_duration: formatMillisecondsToMinutes(summary.waiting_duration),
      wrap_up_duration: formatMillisecondsToMinutes(summary.wrap_up_duration),
    };
  };

  const summary = calculateSummary();

  return (
    <div className="space-y-6">

      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-800">Split/Skill Daily Report</h2>
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
            onClick={() => {
              setCurrentPage(1);
              refreshReports(1);
            }}
          >
            <RefreshCcw size={16} className='mr-2' />Refresh
          </button>
        </div>
      </div>

      {/* date n filters */}
      <div className="bg-white rounded-lg shadow w-full p-4">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">From:</span>
              <div className="relative">
                <input type="date" className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">To:</span>
              <div className="relative">
                <input type="date" className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-8 border-l border-gray-300 mx-2"></div>
              <div className="flex items-center space-x-1 text-gray-700">
                <Filter size={18} /><span className="text-sm font-medium">Filters</span>
              </div>
              <div className="h-8 border-l border-gray-300 mx-2"></div>
            </div>
            <div className="relative inline-block w-44">
              <select
                className="block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={selectedQueue}
                onChange={(e) => setSelectedQueue(e.target.value)}
              >
                <option value="all" className="text-gray-500">
                  All Queues
                </option>
                {uniqueQueues.map((queue, idx) => (
                  <option key={idx} value={queue}>
                    {queue}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative inline-block w-44">
              <select
                className="block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                <option value="all" className="text-gray-500">
                  All Agents
                </option>
                {allAgents.map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentPage(1);
              fetchReports(1);
            }}
            className="mt-4 sm:mt-0 px-4 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 border border-blue-600 shadow-sm"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* summary card */}
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
                <p className="text-xs font-medium text-gray-500">Total Duration</p>
                <p className="text-xl font-bold text-gray-800">{summary.duration}</p>
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
                <p className="text-xs font-medium text-gray-500">Total Transfers</p>
                <p className="text-xl font-bold text-gray-800">{summary.transferCount}</p>
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
                <p className="text-xs font-medium text-gray-500">Total Voice Mails</p>
                <p className="text-xl font-bold text-gray-800">{summary.voice_mail}</p>
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
                    <span className="font-medium text-indigo-900 ml-1">
                      {selectedQueue === 'all' ? 'All Queues' : selectedQueue}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-indigo-600">Agent:</span>
                    <span className="font-medium text-indigo-900 ml-1">
                      {selectedAgent === 'all' ? 'All Agents' : selectedAgent}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* table */}
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
                    {visibleColumns.date && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Date
                      </th>
                    )}
                    {visibleColumns.time && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Time
                      </th>
                    )}
                    {visibleColumns.queue_name && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50"
                      >
                        Queue Name
                      </th>
                    )}
                    {visibleColumns.display_name && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Agent Name
                      </th>
                    )}
                    {visibleColumns.user_id && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Agent ID
                      </th>
                    )}
                    {visibleColumns.consumer_display_name && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50"
                      >
                        Consumer Name
                      </th>
                    )}
                    {visibleColumns.consumer_number && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50"
                      >
                        Consumer Number
                      </th>
                    )}
                    {visibleColumns.direction && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Direction
                      </th>
                    )}
                    {visibleColumns.channel && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Channel
                      </th>
                    )}
                    {visibleColumns.duration && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Duration
                      </th>
                    )}
                    {visibleColumns.flow_duration && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Flow Duration
                      </th>
                    )}
                    {visibleColumns.handling_duration && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Handling Duration
                      </th>
                    )}
                    {visibleColumns.talk_duration && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Talk Duration
                      </th>
                    )}
                    {visibleColumns.waiting_duration && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Waiting Duration
                      </th>
                    )}
                    {visibleColumns.wrap_up_duration && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Wrap Up Duration
                      </th>
                    )}
                    {visibleColumns.transferCount && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Transfer Count
                      </th>
                    )}
                    {visibleColumns.voice_mail && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50"
                      >
                        Voice Mail
                      </th>
                    )}
                    {visibleColumns.flow_name && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50"
                      >
                        Flow Name
                      </th>
                    )}
                    {visibleColumns.queue_wait_type && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50"
                      >
                        Queue Wait Type
                      </th>
                    )}
                    {visibleColumns.engagement_id && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50"
                      >
                        Engagement ID
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="bg-blue-50 font-semibold">
                    {visibleColumns.date && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.date}
                      </td>
                    )}
                    {visibleColumns.time && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.time}
                      </td>
                    )}
                    {visibleColumns.queue_name && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.queue_name}
                      </td>
                    )}
                    {visibleColumns.display_name && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.display_name}
                      </td>
                    )}
                    {visibleColumns.user_id && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.user_id}
                      </td>
                    )}
                    {visibleColumns.consumer_display_name && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.consumer_display_name}
                      </td>
                    )}
                    {visibleColumns.consumer_number && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.consumer_number}
                      </td>
                    )}
                    {visibleColumns.direction && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.direction}
                      </td>
                    )}
                    {visibleColumns.channel && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.channel}
                      </td>
                    )}
                    {visibleColumns.duration && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.duration}
                      </td>
                    )}
                    {visibleColumns.flow_duration && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.flow_duration}
                      </td>
                    )}
                    {visibleColumns.handling_duration && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.handling_duration}
                      </td>
                    )}
                    {visibleColumns.talk_duration && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.talk_duration}
                      </td>
                    )}
                    {visibleColumns.waiting_duration && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.waiting_duration}
                      </td>
                    )}
                    {visibleColumns.wrap_up_duration && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.wrap_up_duration}
                      </td>
                    )}
                    {visibleColumns.transferCount && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.transferCount}
                      </td>
                    )}
                    {visibleColumns.voice_mail && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.voice_mail}
                      </td>
                    )}
                    {visibleColumns.flow_name && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.flow_name}
                      </td>
                    )}
                    {visibleColumns.queue_wait_type && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.queue_wait_type}
                      </td>
                    )}
                    {visibleColumns.engagement_id && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">
                        {summary.engagement_id}
                      </td>
                    )}
                  </tr>
                  {currentItems.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {visibleColumns.date && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.start_time
                            ? new Date(record.start_time).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                            : 'N/A'}
                        </td>
                      )}
                      {visibleColumns.time && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.start_time
                            ? new Date(record.start_time).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false,
                            })
                            : 'N/A'}
                        </td>
                      )}
                      {visibleColumns.queue_name && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.queue_name || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.display_name && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.display_name || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.user_id && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.user_id || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.consumer_display_name && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.consumer_display_name || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.consumer_number && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.consumer_number || 'N/A'}
                        </td>
                      )}
                      {(visibleColumns.direction && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.direction || 'N/A'}
                        </td>
                      ))}
                      {visibleColumns.channel && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.channel || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.duration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {formatMillisecondsToMinutes(record.duration) || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.flow_duration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {formatMillisecondsToMinutes(record.flow_duration) || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.handling_duration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {formatMillisecondsToMinutes(record.handling_duration) || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.talk_duration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {formatMillisecondsToMinutes(record.talk_duration) || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.waiting_duration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {formatMillisecondsToMinutes(record.waiting_duration) || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.wrap_up_duration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {formatMillisecondsToMinutes(record.wrap_up_duration) || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.transferCount && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {formatMillisecondsToMinutes(record.transferCount) || '0'}
                        </td>
                      )}
                      {visibleColumns.voice_mail && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.voice_mail || '0'}
                        </td>
                      )}
                      {visibleColumns.flow_name && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.flow_name || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.queue_wait_type && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.queue_wait_type || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.engagement_id && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">
                          {record.engagement_id || 'N/A'}
                        </td>
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
                  fetchReports(1);
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
                {currentPage} of {totalPages}
              </span>
              <button
                className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={handleNextPage}
                disabled={currentPage * itemsPerPage >= totalRecords}
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