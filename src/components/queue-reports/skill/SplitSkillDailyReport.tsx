import React, { useEffect, useState } from 'react';
import { fetchAgentQueuesAPI } from '@/services/queueAPI';
import { Headers } from '@/services/commonAPI';
import { SkillRecord } from '@/types/agentQueueTypes';

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
  setEndDate
}: SplitSkillDailyReportProps) {
  const [reportData, setReportData] = useState<SkillRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [queueId, setQueueId] = useState('all');
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    start_time: true,
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
      const result = await fetchAgentQueuesAPI(reqBody, header);
      if (result.success) {
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
      start_time: "SUMMARY",
      queue_name: "",
      display_name: "",
      user_id: "",
      consumer_display_name: "",
      consumer_number: "",
      direction: "",
      channel: "",
      duration: reportData.reduce((acc, curr) => acc + curr.duration, 0),
      flow_duration: reportData.reduce((acc, curr) => acc + curr.flow_duration, 0),
      handling_duration: reportData.reduce((acc, curr) => acc + curr.handling_duration, 0),
      talk_duration: reportData.reduce((acc, curr) => acc + curr.talk_duration, 0),
      waiting_duration: reportData.reduce((acc, curr) => acc + curr.waiting_duration, 0),
      wrap_up_duration: reportData.reduce((acc, curr) => acc + curr.wrap_up_duration, 0),
      transferCount: reportData.reduce((acc, curr) => acc + curr.transferCount, 0),
      voice_mail: reportData.reduce((acc, curr) => acc + curr.voice_mail, 0),
      flow_name: "",
      queue_wait_type: "",
      engagement_id: "",
    };

    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return {
      ...summary,
      duration: formatTime(summary.duration),
      flow_duration: formatTime(summary.flow_duration),
      handling_duration: formatTime(summary.handling_duration),
      talk_duration: formatTime(summary.talk_duration),
      waiting_duration: formatTime(summary.waiting_duration),
      wrap_up_duration: formatTime(summary.wrap_up_duration),
    };
  };

  const summary = calculateSummary();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-800">Split/Skill Daily Report</h2>
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
          <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
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
              <div className="relative">
                <select
                  className={`block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none ${!queueId ? 'text-gray-500' : 'text-gray-900'}`}
                  value={queueId || ""}
                  onChange={(e) => setQueueId(e.target.value)}
                >
                  <option value="all" className="text-gray-500">Queue ID</option>
                  <option value="queue1">Queue 1</option>
                  <option value="queue2">Queue 2</option>
                  <option value="queue3">Queue 3</option>
                  <option value="queue4">Queue 4</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-600">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
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
                <p className="text-xs font-medium text-gray-500">Total Duration</p>
                <p className="text-xl font-bold text-gray-800">{summary.duration}</p>
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
                <p className="text-xs font-medium text-gray-500">Total Transfers</p>
                <p className="text-xl font-bold text-gray-800">{summary.transferCount}</p>
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
                <p className="text-xs font-medium text-gray-500">Total Voice Mails</p>
                <p className="text-xl font-bold text-gray-800">{summary.voice_mail}</p>
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
                {(queueId === 'all') ? (
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
                    {queueId !== 'all' && (
                      <div className="flex items-center">
                        <span className="text-indigo-600">Queue:</span>
                        <span className="font-medium text-indigo-900 ml-1 truncate max-w-[150px]">
                          {queueId === 'queue1' ? 'Queue 1' :
                            queueId === 'queue2' ? 'Queue 2' :
                              queueId === 'queue3' ? 'Queue 3' :
                                queueId === 'queue4' ? 'Queue 4' : queueId}
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
                  {visibleColumns.start_time && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Start Time</th>}
                  {visibleColumns.queue_name && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Queue Name</th>}
                  {visibleColumns.display_name && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Agent Name</th>}
                  {visibleColumns.user_id && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Agent ID</th>}
                  {visibleColumns.consumer_display_name && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Consumer Name</th>}
                  {visibleColumns.consumer_number && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Consumer Number</th>}
                  {visibleColumns.direction && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Direction</th>}
                  {visibleColumns.channel && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Channel</th>}
                  {visibleColumns.duration && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Duration</th>}
                  {visibleColumns.flow_duration && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Flow Duration</th>}
                  {visibleColumns.handling_duration && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Handling Duration</th>}
                  {visibleColumns.talk_duration && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Talk Duration</th>}
                  {visibleColumns.waiting_duration && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Waiting Duration</th>}
                  {visibleColumns.wrap_up_duration && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Wrap Up Duration</th>}
                  {visibleColumns.transferCount && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Transfer Count</th>}
                  {visibleColumns.voice_mail && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Voice Mail</th>}
                  {visibleColumns.flow_name && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Flow Name</th>}
                  {visibleColumns.queue_wait_type && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Queue Wait Type</th>}
                  {visibleColumns.engagement_id && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Engagement ID</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="bg-blue-50 font-semibold">
                  {visibleColumns.start_time && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.start_time}</td>}
                  {visibleColumns.queue_name && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.queue_name}</td>}
                  {visibleColumns.display_name && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.display_name}</td>}
                  {visibleColumns.user_id && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.user_id}</td>}
                  {visibleColumns.consumer_display_name && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.consumer_display_name}</td>}
                  {visibleColumns.consumer_number && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.consumer_number}</td>}
                  {visibleColumns.direction && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.direction}</td>}
                  {visibleColumns.channel && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.channel}</td>}
                  {visibleColumns.duration && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.duration}</td>}
                  {visibleColumns.flow_duration && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.flow_duration}</td>}
                  {visibleColumns.handling_duration && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.handling_duration}</td>}
                  {visibleColumns.talk_duration && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.talk_duration}</td>}
                  {visibleColumns.waiting_duration && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.waiting_duration}</td>}
                  {visibleColumns.wrap_up_duration && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.wrap_up_duration}</td>}
                  {visibleColumns.transferCount && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.transferCount}</td>}
                  {visibleColumns.voice_mail && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.voice_mail}</td>}
                  {visibleColumns.flow_name && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.flow_name}</td>}
                  {visibleColumns.queue_wait_type && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.queue_wait_type}</td>}
                  {visibleColumns.engagement_id && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.engagement_id}</td>}
                </tr>
                {currentItems.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {visibleColumns.start_time && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{new Date(record.start_time).toLocaleString()}</td>}
                    {visibleColumns.queue_name && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.queue_name}</td>}
                    {visibleColumns.display_name && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.display_name}</td>}
                    {visibleColumns.user_id && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.user_id}</td>}
                    {visibleColumns.consumer_display_name && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.consumer_display_name || 'N/A'}</td>}
                    {visibleColumns.consumer_number && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.consumer_number || 'N/A'}</td>}
                    {visibleColumns.direction && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.direction}</td>}
                    {visibleColumns.channel && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.channel}</td>}
                    {visibleColumns.duration && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.duration}</td>}
                    {visibleColumns.flow_duration && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.flow_duration}</td>}
                    {visibleColumns.handling_duration && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.handling_duration}</td>}
                    {visibleColumns.talk_duration && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.talk_duration}</td>}
                    {visibleColumns.waiting_duration && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.waiting_duration}</td>}
                    {visibleColumns.wrap_up_duration && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.wrap_up_duration}</td>}
                    {visibleColumns.transferCount && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.transferCount}</td>}
                    {visibleColumns.voice_mail && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.voice_mail}</td>}
                    {visibleColumns.flow_name && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.flow_name}</td>}
                    {visibleColumns.queue_wait_type && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.queue_wait_type}</td>}
                    {visibleColumns.engagement_id && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.engagement_id}</td>}
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
              <option value={50}>50</option>
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
    </div>
  );
}