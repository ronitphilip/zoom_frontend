import React, { useState } from 'react';
import { agentTraceData } from '@/data/avayaReportData';
import { AgentTraceRecord } from '@/types/avayaReportTypes';

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
  const [agentType, setAgentType] = useState('all');
  const [specificAgent, setSpecificAgent] = useState('all');
  const [reportData, setReportData] = useState(agentTraceData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    time: true,
    sequence: true,
    state: true,
    statusReason: true,
    splitSkill: true,
    queueWaitTime: true,
    duration: true,
    hold: true,
    ring: true,
    channelType: true,
    channelSource: true,
    deviceType: true,
    callingParty: true,
    interactionStatus: true,
    responseTime: true,
    mediaCount: true,
    transferOut: true,
    concurrentCount: true,
    disposition: true,
    viewInteraction: true
  });
  
  const generateReport = () => {
    // In a real app, this would fetch data from an API
    console.log('Generating report with dates:', { startDate, endDate });
    // For demonstration, we're using the static sample data
    setReportData(agentTraceData);
  };
  
  const handleViewInteraction = (record: AgentTraceRecord) => {
    // In a real app, this would open a modal or navigate to a detailed view
    console.log('Viewing interaction:', record);
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(reportData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reportData.slice(indexOfFirstItem, indexOfLastItem);
  
  return (
    <div className="space-y-6">
      {/* Page header with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-800">Agent Trace by Location Report</h2>
        
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
            
            {/* Agent Type Filter */}
            <div className="relative inline-block w-44">
              <div className="relative">
                <select 
                  className={`block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none ${!agentType ? 'text-gray-500' : 'text-gray-900'}`}
                  value={agentType || ""}
                  onChange={(e) => setAgentType(e.target.value)}
                >
                  <option value="all" className="text-gray-500">Agent Type</option>
                  <option value="regular">Regular Agent</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="manager">Manager</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-600">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Specific Agent Filter */}
            <div className="relative inline-block w-44">
              <div className="relative">
                <select 
                  className={`block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none ${!specificAgent ? 'text-gray-500' : 'text-gray-900'}`}
                  value={specificAgent || ""}
                  onChange={(e) => setSpecificAgent(e.target.value)}
                  disabled={agentType === 'all'}
                >
                  <option value="all" className="text-gray-500">Specific Agent</option>
                  {agentType === 'regular' && (
                    <>
                      <option value="agent1">John Smith</option>
                      <option value="agent2">Jane Doe</option>
                      <option value="agent3">Michael Brown</option>
                    </>
                  )}
                  {agentType === 'supervisor' && (
                    <>
                      <option value="sup1">Sarah Johnson</option>
                      <option value="sup2">David Wilson</option>
                    </>
                  )}
                  {agentType === 'manager' && (
                    <>
                      <option value="mgr1">Robert Taylor</option>
                      <option value="mgr2">Emily Davis</option>
                    </>
                  )}
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
                <p className="text-xs font-medium text-gray-500">Total State Changes</p>
                <p className="text-xl font-bold text-gray-800">142</p>
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
                <p className="text-xs font-medium text-gray-500">Avg State Duration</p>
                <p className="text-xl font-bold text-gray-800">2m 15s</p>
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
                <p className="text-xs font-medium text-gray-500">Most Common State</p>
                <p className="text-xl font-bold text-gray-800">Available</p>
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
                {(agentType === 'all' && specificAgent === 'all') ? (
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
                    
                    {agentType !== 'all' && (
                      <div className="flex items-center">
                        <span className="text-indigo-600">Type:</span>
                        <span className="font-medium text-indigo-900 ml-1 truncate max-w-[150px]">
                          {agentType === 'regular' ? 'Regular Agent' : 
                           agentType === 'supervisor' ? 'Supervisor' : 
                           agentType === 'manager' ? 'Manager' : agentType}
                        </span>
                      </div>
                    )}
                    
                    {specificAgent !== 'all' && (
                      <div className="flex items-center">
                        <span className="text-indigo-600">Agent:</span>
                        <span className="font-medium text-indigo-900 ml-1 truncate max-w-[150px]">
                          {specificAgent === 'agent1' ? 'John Smith' :
                           specificAgent === 'agent2' ? 'Jane Doe' :
                           specificAgent === 'agent3' ? 'Michael Brown' :
                           specificAgent === 'sup1' ? 'Sarah Johnson' :
                           specificAgent === 'sup2' ? 'David Wilson' :
                           specificAgent === 'mgr1' ? 'Robert Taylor' :
                           specificAgent === 'mgr2' ? 'Emily Davis' : specificAgent}
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
                  {visibleColumns.sequence && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Sequence
                    </th>
                  )}
                  {visibleColumns.state && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      State
                    </th>
                  )}
                  {visibleColumns.statusReason && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Status Reason
                    </th>
                  )}
                  {visibleColumns.duration && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Duration
                    </th>
                  )}
                  {visibleColumns.splitSkill && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Split/Skill
                    </th>
                  )}
                  {visibleColumns.queueWaitTime && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Queue Wait Time
                    </th>
                  )}
                  {visibleColumns.hold && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Hold
                    </th>
                  )}
                  {visibleColumns.ring && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Ring
                    </th>
                  )}
                  {visibleColumns.channelType && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Channel Type
                    </th>
                  )}
                  {visibleColumns.channelSource && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Channel Source
                    </th>
                  )}
                  {visibleColumns.deviceType && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Device Type
                    </th>
                  )}
                  {visibleColumns.callingParty && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[150px] sticky top-0 bg-gray-50">
                      Calling Party
                    </th>
                  )}
                  {visibleColumns.interactionStatus && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Interaction Status
                    </th>
                  )}
                  {visibleColumns.responseTime && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Response Time
                    </th>
                  )}
                  {visibleColumns.mediaCount && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Media Count
                    </th>
                  )}
                  {visibleColumns.transferOut && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Transfer Out
                    </th>
                  )}
                  {visibleColumns.concurrentCount && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Concurrent Count
                    </th>
                  )}
                  {visibleColumns.disposition && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Disposition
                    </th>
                  )}
                  {visibleColumns.viewInteraction && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      View Interaction
                    </th>
                  )}
                </tr>
              </thead>
              
              {/* Table body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {visibleColumns.date && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.date}</td>
                    )}
                    {visibleColumns.time && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.time}</td>
                    )}
                    {visibleColumns.sequence && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.sequence}</td>
                    )}
                    {visibleColumns.state && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.state}</td>
                    )}
                    {visibleColumns.statusReason && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.statusReason}</td>
                    )}
                    {visibleColumns.duration && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.duration}</td>
                    )}
                    {visibleColumns.splitSkill && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.splitSkill}</td>
                    )}
                    {visibleColumns.queueWaitTime && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.queueWaitTime}</td>
                    )}
                    {visibleColumns.hold && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.hold}</td>
                    )}
                    {visibleColumns.ring && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.ring}</td>
                    )}
                    {visibleColumns.channelType && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.channelType}</td>
                    )}
                    {visibleColumns.channelSource && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.channelSource}</td>
                    )}
                    {visibleColumns.deviceType && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.deviceType}</td>
                    )}
                    {visibleColumns.callingParty && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[150px]">{record.callingParty}</td>
                    )}
                    {visibleColumns.interactionStatus && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.interactionStatus}</td>
                    )}
                    {visibleColumns.responseTime && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.responseTime}</td>
                    )}
                    {visibleColumns.mediaCount && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.mediaCount}</td>
                    )}
                    {visibleColumns.transferOut && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.transferOut ? 'Yes' : 'No'}</td>
                    )}
                    {visibleColumns.concurrentCount && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.concurrentCount}</td>
                    )}
                    {visibleColumns.disposition && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.disposition}</td>
                    )}
                    {visibleColumns.viewInteraction && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">
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
    </div>
  );
}
