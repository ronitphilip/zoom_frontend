'use client'
import React, { useState, useEffect } from 'react';
import { AgentSplitSkillRecord, ReportFilterCriteria } from '@/types/avayaReportTypes';
import ReportFilter from '@/components/filters/ReportFilter';
import { fetchAgentQueueAPI } from '@/services/reportAPI';
import { Headers } from '@/services/commonAPI';

interface AgentSplitSkillReportProps {
  initialFilterCriteria: ReportFilterCriteria;
}

export default function AgentSplitSkillReport({ initialFilterCriteria }: AgentSplitSkillReportProps) {
  const [filterCriteria, setFilterCriteria] = useState<ReportFilterCriteria>(initialFilterCriteria);
  const [reportData, setReportData] = useState<AgentSplitSkillRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    userId: true,
    userName: true,
    queueName: true,
    totalHandleDuration: true,
    totalHoldDuration: true,
    totalWrapUpDuration: true,
    totalTransferInitiatedCount: true,
    totalTransferCompletedCount: true,
    totalHandledCount: true,
    totalOutboundHandledCount: true,
    totalInboundHandledCount: true,
    totalReadyDuration: true,
    totalOccupiedDuration: true
  });

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const reqBody = {
        from: initialFilterCriteria.startDate,
        to: initialFilterCriteria.endDate
      };
      const headers: Headers = {
        authorization: `Bearer ${JSON.parse(sessionStorage.getItem('tk') || '"tk')}`
      };
      const response = await fetchAgentQueueAPI(reqBody, headers);
      if (response.success) {
        setReportData(response.data);
      } else {
        setError('Failed to fetch report data');
      }
    } catch (err) {
      setError('An error occurred while fetching the report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filter criteria change
  useEffect(() => {
    generateReport();
  }, [filterCriteria]);

  // Calculate pagination
  const totalPages = Math.ceil(reportData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reportData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-800">Agent Split/Skill Report</h2>
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
          <button
            onClick={generateReport}
            className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
            disabled={loading}
          >
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

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center text-gray-600">Loading report data...</div>
      )}
      {error && (
        <div className="text-center text-red-600">{error}</div>
      )}

      {/* Report Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden w-full">
          <div className="flex flex-col" style={{ height: "calc(98vh - 320px)" }}>
            <div className="overflow-auto flex-grow">
              <table className="w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.date && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">
                        Date
                      </th>
                    )}
                    {visibleColumns.userId && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[150px] sticky top-0 bg-gray-50">
                        User ID
                      </th>
                    )}
                    {visibleColumns.userName && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[150px] sticky top-0 bg-gray-50">
                        User Name
                      </th>
                    )}
                    {visibleColumns.queueName && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[150px] sticky top-0 bg-gray-50">
                        Queue Name
                      </th>
                    )}
                    {visibleColumns.totalHandleDuration && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Handle Duration
                      </th>
                    )}
                    {visibleColumns.totalHoldDuration && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Hold Duration
                      </th>
                    )}
                    {visibleColumns.totalWrapUpDuration && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Wrap Up Duration
                      </th>
                    )}
                    {visibleColumns.totalTransferInitiatedCount && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Transfer Initiated
                      </th>
                    )}
                    {visibleColumns.totalTransferCompletedCount && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Transfer Completed
                      </th>
                    )}
                    {visibleColumns.totalHandledCount && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Handled Count
                      </th>
                    )}
                    {visibleColumns.totalOutboundHandledCount && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Outbound Handled
                      </th>
                    )}
                    {visibleColumns.totalInboundHandledCount && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Inbound Handled
                      </th>
                    )}
                    {visibleColumns.totalReadyDuration && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Ready Duration
                      </th>
                    )}
                    {visibleColumns.totalOccupiedDuration && (
                      <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">
                        Occupied Duration
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {visibleColumns.date && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[100px]">{record.date}</td>
                      )}
                      {visibleColumns.userId && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[150px]">{record.user_id}</td>
                      )}
                      {visibleColumns.userName && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[150px]">{record.user_name}</td>
                      )}
                      {visibleColumns.queueName && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[150px]">{record.queue_name}</td>
                      )}
                      {visibleColumns.totalHandleDuration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.total_handle_duration}s</td>
                      )}
                      {visibleColumns.totalHoldDuration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.total_hold_duration}s</td>
                      )}
                      {visibleColumns.totalWrapUpDuration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.total_wrap_up_duration}s</td>
                      )}
                      {visibleColumns.totalTransferInitiatedCount && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.total_transfer_initiated_count}</td>
                      )}
                      {visibleColumns.totalTransferCompletedCount && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.total_transfer_completed_count}</td>
                      )}
                      {visibleColumns.totalHandledCount && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.total_handled_count}</td>
                      )}
                      {visibleColumns.totalOutboundHandledCount && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.total_outbound_handled_count}</td>
                      )}
                      {visibleColumns.totalInboundHandledCount && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.total_inbound_handled_count}</td>
                      )}
                      {visibleColumns.totalReadyDuration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.total_ready_duration}s</td>
                      )}
                      {visibleColumns.totalOccupiedDuration && (
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">{record.total_occupied_duration}s</td>
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
      )}
    </div>
  );
}