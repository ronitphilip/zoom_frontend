import React, { useState } from 'react';
import { agentGroupSummaryData } from '@/data/avayaReportData';
import { AgentGroupSummaryRecord } from '@/types/avayaReportTypes';

interface AgentGroupSummaryReportProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

export default function AgentGroupSummaryReport({ 
  startDate, 
  endDate, 
  setStartDate, 
  setEndDate 
}: AgentGroupSummaryReportProps) {
  const [reportData, setReportData] = useState<AgentGroupSummaryRecord[]>(agentGroupSummaryData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [agentGroup, setAgentGroup] = useState('all');
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    agentName: true,
    agentId: true,
    staffedTime: true,
    availTime: true,
    auxTime: true,
    occupiedTime: true,
    occupancyPercentage: true,
    totalHandled: true,
    inboundHandled: true,
    outboundHandled: true,
    digitalHandled: true,
    concurrentMax: true,
    avgHandleTime: true,
    avgWrapTime: true,
    totalAcdTime: true,
    totalAcwTime: true,
    agentRingTime: true,
    totalHoldTime: true,
    firstResponseAvg: true,
    channelEscalations: true,
    voiceOccupancy: true,
    digitalOccupancy: true
  });

  const totalPages = Math.ceil(reportData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = reportData.slice(startIndex, endIndex);

  const generateReport = () => {
    console.log('Generating report with dates:', { startDate, endDate });
    setReportData(agentGroupSummaryData);
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
      agentName: "SUMMARY",
      agentId: "",
      staffedTime: "08:00:00", // Fixed as all agents have same staffed time
      availTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.availTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      auxTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.auxTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      occupiedTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.occupiedTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      occupancyPercentage: reportData.reduce((acc, curr) => acc + curr.occupancyPercentage, 0) / reportData.length,
      totalHandled: reportData.reduce((acc, curr) => acc + curr.totalHandled, 0),
      inboundHandled: reportData.reduce((acc, curr) => acc + curr.inboundHandled, 0),
      outboundHandled: reportData.reduce((acc, curr) => acc + curr.outboundHandled, 0),
      digitalHandled: reportData.reduce((acc, curr) => acc + curr.digitalHandled, 0),
      concurrentMax: reportData.reduce((acc, curr) => acc + curr.concurrentMax, 0) / reportData.length,
      avgHandleTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.avgHandleTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      avgWrapTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.avgWrapTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      totalAcdTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.totalAcdTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      totalAcwTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.totalAcwTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      agentRingTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.agentRingTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      totalHoldTime: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.totalHoldTime.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      firstResponseAvg: reportData.reduce((acc, curr) => {
        const [hours, minutes, seconds] = curr.firstResponseAvg.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0),
      channelEscalations: reportData.reduce((acc, curr) => acc + curr.channelEscalations, 0),
      voiceOccupancy: reportData.reduce((acc, curr) => acc + curr.voiceOccupancy, 0) / reportData.length,
      digitalOccupancy: reportData.reduce((acc, curr) => acc + curr.digitalOccupancy, 0) / reportData.length
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
      availTime: formatTime(summary.availTime / reportData.length),
      auxTime: formatTime(summary.auxTime / reportData.length),
      occupiedTime: formatTime(summary.occupiedTime / reportData.length),
      avgHandleTime: formatTime(summary.avgHandleTime / reportData.length),
      avgWrapTime: formatTime(summary.avgWrapTime / reportData.length),
      totalAcdTime: formatTime(summary.totalAcdTime),
      totalAcwTime: formatTime(summary.totalAcwTime),
      agentRingTime: formatTime(summary.agentRingTime / reportData.length),
      totalHoldTime: formatTime(summary.totalHoldTime),
      firstResponseAvg: formatTime(summary.firstResponseAvg / reportData.length)
    };
  };

  const summary = calculateSummary();

  return (
    <div className="space-y-6">
      {/* Page header with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-800">Agent Group Summary Report</h2>
        
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
            
            {/* Agent Group Filter */}
            <div className="relative inline-block w-44">
              <div className="relative">
                <select 
                  className={`block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none ${!agentGroup ? 'text-gray-500' : 'text-gray-900'}`}
                  value={agentGroup || ""}
                  onChange={(e) => setAgentGroup(e.target.value)}
                >
                  <option value="all" className="text-gray-500">Agent Group</option>
                  <option value="sales">Sales Team</option>
                  <option value="support">Support Team</option>
                  <option value="technical">Technical Team</option>
                  <option value="management">Management Team</option>
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
          <button 
            onClick={generateReport}
            className="mt-4 sm:mt-0 px-4 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 border border-blue-600 shadow-sm"
          >
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
                <p className="text-xs font-medium text-gray-500">Total Agents</p>
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
                <p className="text-xs font-medium text-gray-500">Avg Occupancy</p>
                <p className="text-xl font-bold text-gray-800">{summary.occupancyPercentage.toFixed(1)}%</p>
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
                <p className="text-xs font-medium text-gray-500">Total Handled</p>
                <p className="text-xl font-bold text-gray-800">{summary.totalHandled}</p>
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
                {(agentGroup === 'all') ? (
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
                    
                    {agentGroup !== 'all' && (
                      <div className="flex items-center">
                        <span className="text-indigo-600">Group:</span>
                        <span className="font-medium text-indigo-900 ml-1 truncate max-w-[150px]">
                          {agentGroup === 'sales' ? 'Sales Team' : 
                           agentGroup === 'support' ? 'Support Team' : 
                           agentGroup === 'technical' ? 'Technical Team' : 
                           agentGroup === 'management' ? 'Management Team' : agentGroup}
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
        {/* Fixed height container with table */}
        <div className="flex flex-col" style={{ height: "calc(98vh - 320px)" }}>
          {/* Single scrollable container for both header and body */}
          <div className="overflow-auto flex-grow">
            <table className="w-full divide-y divide-gray-200 text-xs">
              {/* Table header - sticky at top */}
              <thead className="bg-gray-50">
                <tr>
                  {visibleColumns.agentName && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Agent Name</th>}
                  {visibleColumns.agentId && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Agent ID</th>}
                  {visibleColumns.staffedTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Staffed Time</th>}
                  {visibleColumns.availTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Available Time</th>}
                  {visibleColumns.auxTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">AUX Time</th>}
                  {visibleColumns.occupiedTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Occupied Time</th>}
                  {visibleColumns.occupancyPercentage && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Occupancy %</th>}
                  {visibleColumns.totalHandled && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total Handled</th>}
                  {visibleColumns.inboundHandled && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Inbound Handled</th>}
                  {visibleColumns.outboundHandled && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Outbound Handled</th>}
                  {visibleColumns.digitalHandled && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Digital Handled</th>}
                  {visibleColumns.concurrentMax && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Concurrent Max</th>}
                  {visibleColumns.avgHandleTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Avg Handle Time</th>}
                  {visibleColumns.avgWrapTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Avg Wrap Time</th>}
                  {visibleColumns.totalAcdTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total ACD Time</th>}
                  {visibleColumns.totalAcwTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total ACW Time</th>}
                  {visibleColumns.agentRingTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Agent Ring Time</th>}
                  {visibleColumns.totalHoldTime && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total Hold Time</th>}
                  {visibleColumns.firstResponseAvg && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">First Response Avg</th>}
                  {visibleColumns.channelEscalations && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Channel Escalations</th>}
                  {visibleColumns.voiceOccupancy && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Voice Occupancy</th>}
                  {visibleColumns.digitalOccupancy && <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Digital Occupancy</th>}
                </tr>
              </thead>
              
              {/* Table body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Summary Row */}
                <tr className="bg-blue-50 font-semibold">
                  {visibleColumns.agentName && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.agentName}</td>}
                  {visibleColumns.agentId && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.agentId}</td>}
                  {visibleColumns.staffedTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.staffedTime}</td>}
                  {visibleColumns.availTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.availTime}</td>}
                  {visibleColumns.auxTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.auxTime}</td>}
                  {visibleColumns.occupiedTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.occupiedTime}</td>}
                  {visibleColumns.occupancyPercentage && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.occupancyPercentage.toFixed(1)}%</td>}
                  {visibleColumns.totalHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalHandled}</td>}
                  {visibleColumns.inboundHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.inboundHandled}</td>}
                  {visibleColumns.outboundHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.outboundHandled}</td>}
                  {visibleColumns.digitalHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.digitalHandled}</td>}
                  {visibleColumns.concurrentMax && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.concurrentMax.toFixed(1)}</td>}
                  {visibleColumns.avgHandleTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.avgHandleTime}</td>}
                  {visibleColumns.avgWrapTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.avgWrapTime}</td>}
                  {visibleColumns.totalAcdTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalAcdTime}</td>}
                  {visibleColumns.totalAcwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalAcwTime}</td>}
                  {visibleColumns.agentRingTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.agentRingTime}</td>}
                  {visibleColumns.totalHoldTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalHoldTime}</td>}
                  {visibleColumns.firstResponseAvg && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.firstResponseAvg}</td>}
                  {visibleColumns.channelEscalations && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.channelEscalations}</td>}
                  {visibleColumns.voiceOccupancy && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.voiceOccupancy.toFixed(1)}%</td>}
                  {visibleColumns.digitalOccupancy && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.digitalOccupancy.toFixed(1)}%</td>}
                </tr>

                {/* Individual Records */}
                {currentItems.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {visibleColumns.agentName && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.agentName}</td>}
                    {visibleColumns.agentId && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.agentId}</td>}
                    {visibleColumns.staffedTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.staffedTime}</td>}
                    {visibleColumns.availTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.availTime}</td>}
                    {visibleColumns.auxTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.auxTime}</td>}
                    {visibleColumns.occupiedTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.occupiedTime}</td>}
                    {visibleColumns.occupancyPercentage && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.occupancyPercentage}%</td>}
                    {visibleColumns.totalHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalHandled}</td>}
                    {visibleColumns.inboundHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.inboundHandled}</td>}
                    {visibleColumns.outboundHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.outboundHandled}</td>}
                    {visibleColumns.digitalHandled && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.digitalHandled}</td>}
                    {visibleColumns.concurrentMax && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.concurrentMax}</td>}
                    {visibleColumns.avgHandleTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.avgHandleTime}</td>}
                    {visibleColumns.avgWrapTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.avgWrapTime}</td>}
                    {visibleColumns.totalAcdTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalAcdTime}</td>}
                    {visibleColumns.totalAcwTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalAcwTime}</td>}
                    {visibleColumns.agentRingTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.agentRingTime}</td>}
                    {visibleColumns.totalHoldTime && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalHoldTime}</td>}
                    {visibleColumns.firstResponseAvg && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.firstResponseAvg}</td>}
                    {visibleColumns.channelEscalations && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.channelEscalations}</td>}
                    {visibleColumns.voiceOccupancy && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.voiceOccupancy}%</td>}
                    {visibleColumns.digitalOccupancy && <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.digitalOccupancy}%</td>}
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
