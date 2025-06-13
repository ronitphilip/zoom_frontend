import React, { useState } from 'react';
import { agentSplitSkillData } from '@/data/avayaReportData';
import { ReportFilterCriteria } from '@/types/avayaReportTypes';
import ReportFilter from '@/components/filters/ReportFilter';

interface AgentSplitSkillReportProps {
  initialFilterCriteria: ReportFilterCriteria;
}

export default function AgentSplitSkillReport({ initialFilterCriteria }: AgentSplitSkillReportProps) {
  const [filterCriteria, setFilterCriteria] = useState<ReportFilterCriteria>(initialFilterCriteria);
  const [reportData, setReportData] = useState(agentSplitSkillData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    agentId: true,
    agentName: true,
    queueId: true,
    queueName: true,
    channelType: true,
    channelSource: true,
    handledCalls: true,
    missedCalls: true,
    refusedCalls: true,
    acdTime: true,
    acwTime: true,
    outboundCalls: true,
    outboundTime: true,
    firstResponseTime: true,
    holdCount: true,
    holdDuration: true,
    transferCount: true,
    transferDuration: true,
    conferenceCount: true,
    conferenceDuration: true
  });

  const generateReport = () => {
    // In a real app, this would fetch data from an API
    console.log('Generating report with criteria:', filterCriteria);
    // For demonstration, we're using the static sample data
    setReportData(agentSplitSkillData);
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
        <h2 className="text-xl font-bold text-blue-800">Agent Split/Skill Report</h2>
        
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

      {/* Report Filter */}
      <ReportFilter 
        filterCriteria={filterCriteria}
        onFilterChange={setFilterCriteria}
        onGenerateReport={generateReport}
        showAgentFilter={true}
      />

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
                  {visibleColumns.agentId && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Agent ID
                    </th>
                  )}
                  {visibleColumns.agentName && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[150px] sticky top-0 bg-gray-50">
                      Agent Name
                    </th>
                  )}
                  {visibleColumns.queueId && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Queue ID
                    </th>
                  )}
                  {visibleColumns.queueName && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[150px] sticky top-0 bg-gray-50">
                      Queue Name
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
                  {visibleColumns.handledCalls && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Handled Calls
                    </th>
                  )}
                  {visibleColumns.missedCalls && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Missed Calls
                    </th>
                  )}
                  {visibleColumns.refusedCalls && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Refused Calls
                    </th>
                  )}
                  {visibleColumns.acdTime && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      ACD Time
                    </th>
                  )}
                  {visibleColumns.acwTime && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      ACW Time
                    </th>
                  )}
                  {visibleColumns.outboundCalls && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Outbound Calls
                    </th>
                  )}
                  {visibleColumns.outboundTime && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Outbound Time
                    </th>
                  )}
                  {visibleColumns.firstResponseTime && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      First Response Time
                    </th>
                  )}
                  {visibleColumns.holdCount && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Hold Count
                    </th>
                  )}
                  {visibleColumns.holdDuration && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Hold Duration
                    </th>
                  )}
                  {visibleColumns.transferCount && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Transfer Count
                    </th>
                  )}
                  {visibleColumns.transferDuration && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Transfer Duration
                    </th>
                  )}
                  {visibleColumns.conferenceCount && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                      Conference Count
                    </th>
                  )}
                  {visibleColumns.conferenceDuration && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                      Conference Duration
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
                    {visibleColumns.agentId && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.agentId}</td>
                    )}
                    {visibleColumns.agentName && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[150px]">{record.agentName}</td>
                    )}
                    {visibleColumns.queueId && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.queueId}</td>
                    )}
                    {visibleColumns.queueName && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[150px]">{record.queueName}</td>
                    )}
                    {visibleColumns.channelType && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.channelType}</td>
                    )}
                    {visibleColumns.channelSource && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.channelSource}</td>
                    )}
                    {visibleColumns.handledCalls && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.handledCalls}</td>
                    )}
                    {visibleColumns.missedCalls && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.missedCalls}</td>
                    )}
                    {visibleColumns.refusedCalls && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.refusedCalls}</td>
                    )}
                    {visibleColumns.acdTime && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.acdTime}</td>
                    )}
                    {visibleColumns.acwTime && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.acwTime}</td>
                    )}
                    {visibleColumns.outboundCalls && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.outboundCalls}</td>
                    )}
                    {visibleColumns.outboundTime && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.outboundTime}</td>
                    )}
                    {visibleColumns.firstResponseTime && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.firstResponseTime}</td>
                    )}
                    {visibleColumns.holdCount && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.holdCount}</td>
                    )}
                    {visibleColumns.holdDuration && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.holdDuration}</td>
                    )}
                    {visibleColumns.transferCount && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.transferCount}</td>
                    )}
                    {visibleColumns.transferDuration && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.transferDuration}</td>
                    )}
                    {visibleColumns.conferenceCount && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">{record.conferenceCount}</td>
                    )}
                    {visibleColumns.conferenceDuration && (
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">{record.conferenceDuration}</td>
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
