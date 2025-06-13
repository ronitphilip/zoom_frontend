import React, { useState } from 'react';
import { splitSkillSummaryDailyData } from '@/data/avayaReportData';
import { SplitSkillSummaryDailyRecord } from '@/types/avayaReportTypes';

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
  const [reportData, setReportData] = useState<SplitSkillSummaryDailyRecord[]>(splitSkillSummaryDailyData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState<string>('all');
  const [selectedInterval, setSelectedInterval] = useState<string>('15');
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    date: true,
    queueId: true,
    queueName: true,
    totalOffered: true,
    totalHandled: true,
    abandonedCalls: true,
    abandonmentRate: true,
    averageSpeedAnswer: true,
    maxWaitTime: true,
    serviceLevelPercentage: true,
    transferredIn: true,
    transferredOut: true,
    averageHandleTime: true,
    averageAcwTime: true,
    totalTalkTime: true,
    totalAcwTime: true,
    voiceOffered: true,
    voiceHandled: true,
    digitalOffered: true,
    digitalHandled: true,
    averageFirstResponse: true,
    overflowedCalls: true
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

  const generateReport = () => {
    console.log('Generating report with dates:', { startDate, endDate, selectedQueue, selectedInterval });
    let filteredData = splitSkillSummaryDailyData;
    
    if (selectedQueue !== 'all') {
      filteredData = filteredData.filter(record => record.queueId === selectedQueue);
    }
    
    // Here you would typically filter by interval
    // For now, we're using the same data structure
    setReportData(filteredData);
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
      totalOffered: reportData.reduce((acc, curr) => acc + curr.totalOffered, 0),
      totalHandled: reportData.reduce((acc, curr) => acc + curr.totalHandled, 0),
      abandonedCalls: reportData.reduce((acc, curr) => acc + curr.abandonedCalls, 0),
      abandonmentRate: reportData.reduce((acc, curr) => acc + curr.abandonmentRate, 0) / reportData.length,
      averageSpeedAnswer: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.averageSpeedAnswer.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      maxWaitTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.maxWaitTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      serviceLevelPercentage: reportData.reduce((acc, curr) => acc + curr.serviceLevelPercentage, 0) / reportData.length,
      transferredIn: reportData.reduce((acc, curr) => acc + curr.transferredIn, 0),
      transferredOut: reportData.reduce((acc, curr) => acc + curr.transferredOut, 0),
      averageHandleTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.averageHandleTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      averageAcwTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.averageAcwTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      totalTalkTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.totalTalkTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      totalAcwTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.totalAcwTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      voiceOffered: reportData.reduce((acc, curr) => acc + curr.voiceOffered, 0),
      voiceHandled: reportData.reduce((acc, curr) => acc + curr.voiceHandled, 0),
      digitalOffered: reportData.reduce((acc, curr) => acc + curr.digitalOffered, 0),
      digitalHandled: reportData.reduce((acc, curr) => acc + curr.digitalHandled, 0),
      averageFirstResponse: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.averageFirstResponse.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      overflowedCalls: reportData.reduce((acc, curr) => acc + curr.overflowedCalls, 0)
    };

    // Convert seconds back to time format
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return {
      ...summary,
      averageSpeedAnswer: formatTime(summary.averageSpeedAnswer / reportData.length),
      maxWaitTime: formatTime(summary.maxWaitTime),
      averageHandleTime: formatTime(summary.averageHandleTime / reportData.length),
      averageAcwTime: formatTime(summary.averageAcwTime / reportData.length),
      totalTalkTime: formatTime(summary.totalTalkTime),
      totalAcwTime: formatTime(summary.totalAcwTime),
      averageFirstResponse: formatTime(summary.averageFirstResponse / reportData.length)
    };
  };

  const summary = calculateSummary();

  return (
    <div className="space-y-6">
      {/* Page header with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-800">Split/Skill Summary Interval Report</h2>
        
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

          {/* Column Visibility Toggle */}
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
            
            {/* Queue Filter */}
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

            {/* Interval Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Interval:</span>
              <div className="relative">
                <select
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                  value={selectedInterval}
                  onChange={(e) => setSelectedInterval(e.target.value)}
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Generate Report Button */}
          <button 
            onClick={generateReport}
            className="mt-4 sm:mt-0 px-4 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 border border-blue-600 shadow-sm"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        {/* Fixed height container with table */}
        <div className="flex flex-col" style={{ height: "calc(98vh - 320px)" }}>
          {/* Single scrollable container for both header and body */}
          <div className="overflow-auto flex-grow">
            <table className="w-full divide-y divide-gray-200 text-xs">
              {/* Table header - sticky at top */}
              <thead className="bg-gray-50">
                <tr>
                  {visibleColumns.date && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Date</th>}
                  {visibleColumns.queueId && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Queue ID</th>}
                  {visibleColumns.queueName && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Queue Name</th>}
                  {visibleColumns.totalOffered && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total Offered</th>}
                  {visibleColumns.totalHandled && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total Handled</th>}
                  {visibleColumns.abandonedCalls && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Abandoned Calls</th>}
                  {visibleColumns.abandonmentRate && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Abandonment Rate</th>}
                  {visibleColumns.averageSpeedAnswer && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Avg Speed Answer</th>}
                  {visibleColumns.maxWaitTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Max Wait Time</th>}
                  {visibleColumns.serviceLevelPercentage && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Service Level %</th>}
                  {visibleColumns.transferredIn && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Transferred In</th>}
                  {visibleColumns.transferredOut && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Transferred Out</th>}
                  {visibleColumns.averageHandleTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Avg Handle Time</th>}
                  {visibleColumns.averageAcwTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Avg ACW Time</th>}
                  {visibleColumns.totalTalkTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total Talk Time</th>}
                  {visibleColumns.totalAcwTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total ACW Time</th>}
                  {visibleColumns.voiceOffered && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Voice Offered</th>}
                  {visibleColumns.voiceHandled && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Voice Handled</th>}
                  {visibleColumns.digitalOffered && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Digital Offered</th>}
                  {visibleColumns.digitalHandled && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Digital Handled</th>}
                  {visibleColumns.averageFirstResponse && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Avg First Response</th>}
                  {visibleColumns.overflowedCalls && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Overflowed Calls</th>}
                </tr>
              </thead>
              
              {/* Table body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Summary Row */}
                <tr className="bg-blue-50 font-semibold">
                  {visibleColumns.date && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.date}</td>}
                  {visibleColumns.queueId && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.queueId}</td>}
                  {visibleColumns.queueName && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.queueName}</td>}
                  {visibleColumns.totalOffered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalOffered}</td>}
                  {visibleColumns.totalHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalHandled}</td>}
                  {visibleColumns.abandonedCalls && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.abandonedCalls}</td>}
                  {visibleColumns.abandonmentRate && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.abandonmentRate.toFixed(2)}%</td>}
                  {visibleColumns.averageSpeedAnswer && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.averageSpeedAnswer}</td>}
                  {visibleColumns.maxWaitTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.maxWaitTime}</td>}
                  {visibleColumns.serviceLevelPercentage && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.serviceLevelPercentage.toFixed(2)}%</td>}
                  {visibleColumns.transferredIn && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.transferredIn}</td>}
                  {visibleColumns.transferredOut && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.transferredOut}</td>}
                  {visibleColumns.averageHandleTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.averageHandleTime}</td>}
                  {visibleColumns.averageAcwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.averageAcwTime}</td>}
                  {visibleColumns.totalTalkTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalTalkTime}</td>}
                  {visibleColumns.totalAcwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalAcwTime}</td>}
                  {visibleColumns.voiceOffered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.voiceOffered}</td>}
                  {visibleColumns.voiceHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.voiceHandled}</td>}
                  {visibleColumns.digitalOffered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.digitalOffered}</td>}
                  {visibleColumns.digitalHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.digitalHandled}</td>}
                  {visibleColumns.averageFirstResponse && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.averageFirstResponse}</td>}
                  {visibleColumns.overflowedCalls && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.overflowedCalls}</td>}
                </tr>

                {/* Individual Records */}
                {currentItems.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {visibleColumns.date && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.date}</td>}
                    {visibleColumns.queueId && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.queueId}</td>}
                    {visibleColumns.queueName && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.queueName}</td>}
                    {visibleColumns.totalOffered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalOffered}</td>}
                    {visibleColumns.totalHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalHandled}</td>}
                    {visibleColumns.abandonedCalls && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.abandonedCalls}</td>}
                    {visibleColumns.abandonmentRate && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.abandonmentRate.toFixed(2)}%</td>}
                    {visibleColumns.averageSpeedAnswer && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.averageSpeedAnswer}</td>}
                    {visibleColumns.maxWaitTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.maxWaitTime}</td>}
                    {visibleColumns.serviceLevelPercentage && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.serviceLevelPercentage.toFixed(2)}%</td>}
                    {visibleColumns.transferredIn && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.transferredIn}</td>}
                    {visibleColumns.transferredOut && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.transferredOut}</td>}
                    {visibleColumns.averageHandleTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.averageHandleTime}</td>}
                    {visibleColumns.averageAcwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.averageAcwTime}</td>}
                    {visibleColumns.totalTalkTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalTalkTime}</td>}
                    {visibleColumns.totalAcwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalAcwTime}</td>}
                    {visibleColumns.voiceOffered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.voiceOffered}</td>}
                    {visibleColumns.voiceHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.voiceHandled}</td>}
                    {visibleColumns.digitalOffered && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.digitalOffered}</td>}
                    {visibleColumns.digitalHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.digitalHandled}</td>}
                    {visibleColumns.averageFirstResponse && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.averageFirstResponse}</td>}
                    {visibleColumns.overflowedCalls && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.overflowedCalls}</td>}
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