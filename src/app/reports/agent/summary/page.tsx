'use client'
import MainLayout from '@/components/layout/MainLayout';
import ReportHeader from '@/components/queue-reports/agent/ReportHeader';
import { VisibleColumnType } from '@/types/reportTypes';
import { User } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';

const Page = () => {
  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-06-23");
  const [groupSummaryData, setGroupSummaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumnType>({
    teamName: true,
    totalInteractions: true,
    avgHandleDuration: true,
    totalHoldCount: true,
    avgWrapUpDuration: true,
    channel: true,
    direction: true,
    transferInitiatedCount: true,
    transferCompletedCount: true,
    totalReadyDuration: true,
    totalNotReadyDuration: true,
    totalOccupiedDuration: true,
    queueName: true,
    status: true,
    subStatus: true,
  });

  useEffect(() => {
    if (groupSummaryData.length > 0) {
      const columns = Object.keys(groupSummaryData[0] || {});
      setVisibleColumns(columns.reduce((acc, col) => ({ ...acc, [col]: true }), {}));
    }
  }, [groupSummaryData]);

  const fetchSummaryReports = useCallback(async () => {
    const token = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    setIsLoading(true);
    try {
      // const headers = { Authorization: `Bearer ${token}` };
      //   const response = await fetch('/api/reports/agent/summary', {
      //     method: 'POST',
      //     headers,
      //     body: JSON.stringify({ startDate, endDate }),
      //   });
      //   const result = await response.json();
      //   if (result.success) {
      //     setGroupSummaryData(result.data);
      //   } else {
      //     console.error('Failed to fetch reports:', result.error);
      //   }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSummaryReports = useCallback(async () => {
    setGroupSummaryData([]);
    await fetchSummaryReports();
  }, [fetchSummaryReports]);

  useEffect(() => {
    fetchSummaryReports();
  }, [fetchSummaryReports]);

  const summaryMetrics = [
    { label: 'Total Teams', value: '10', bgColor: 'bg-blue-100' },
    { label: 'Avg Handle Duration', value: '10 mins', bgColor: 'bg-orange-100' },
    { label: 'Most Common Channel', value: 'Voice', bgColor: 'bg-red-100' },
  ];

  const columnHeaders = [
    { key: 'teamName', label: 'Team Name', minWidth: '150px' },
    { key: 'totalInteractions', label: 'Total Interactions', minWidth: '120px' },
    { key: 'avgHandleDuration', label: 'Avg Handle Duration', minWidth: '120px' },
    { key: 'totalHoldCount', label: 'Total Hold Count', minWidth: '120px' },
    { key: 'avgWrapUpDuration', label: 'Avg Wrap Up Duration', minWidth: '120px' },
    { key: 'channel', label: 'Channel', minWidth: '120px' },
    { key: 'direction', label: 'Direction', minWidth: '120px' },
    { key: 'transferInitiatedCount', label: 'Transfer Initiated', minWidth: '120px' },
    { key: 'transferCompletedCount', label: 'Transfer Completed', minWidth: '120px' },
    { key: 'totalReadyDuration', label: 'Total Ready Duration', minWidth: '120px' },
    { key: 'totalNotReadyDuration', label: 'Total Not Ready Duration', minWidth: '120px' },
    { key: 'totalOccupiedDuration', label: 'Total Occupied Duration', minWidth: '120px' },
    { key: 'queueName', label: 'Queue Name', minWidth: '120px' },
    { key: 'status', label: 'Status', minWidth: '120px' },
    { key: 'subStatus', label: 'Sub Status', minWidth: '120px' },
  ];

  return (
    <MainLayout>
      <ReportHeader
        title={'Agent Group Summary'}
        startDate={startDate}
        endDate={endDate}
        reportData={groupSummaryData}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        fetchReports={fetchSummaryReports}
        refreshReports={refreshSummaryReports}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      >
        <div className="flex space-x-2">
          <p>Filter 1</p>
          <p>Filter 2</p>
          <p>Filter 3</p>
        </div>
      </ReportHeader>
      <div className="mt-6 space-y-6">

        <div className="bg-white rounded-lg shadow">
          <div className="flex flex-wrap divide-x divide-gray-200">
            {summaryMetrics.map((metric, index) => (
              <div key={index} className="flex-1 py-3 px-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-md ${metric.bgColor} mr-3`}>
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">{metric.label}</p>
                    <p className="text-xl font-bold text-gray-800">{metric.value}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex-1 py-2 px-4 bg-indigo-50">
              <div className="flex items-center">
                <div className="p-1.5 rounded-md bg-indigo-100 mr-3">
                  <User size={16} />
                </div>
                <p className="text-sm font-medium text-indigo-700">All data (no filters applied)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex flex-col" style={{ height: 'calc(98vh - 270px)' }}>
            <div className="overflow-auto flex-grow">
              <table className="w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {columnHeaders.map(
                      (header) =>
                        visibleColumns[header.key as keyof VisibleColumnType] && (
                          <th
                            key={header.key}
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50"
                            style={{ minWidth: header.minWidth }}
                          >
                            {header.label}
                          </th>
                        ),
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={columnHeaders.length} className="px-3 py-1.5 text-center text-sm text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : groupSummaryData.length > 0 ? (
                    groupSummaryData.map((row: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {columnHeaders.map(
                          (header) =>
                            visibleColumns[header.key as keyof VisibleColumnType] && (
                              <td
                                key={`${header.key}-${index}`}
                                className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900"
                                style={{ minWidth: header.minWidth }}
                              >
                                {row[header.key] || '-'}
                              </td>
                            ),
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columnHeaders.length} className="px-3 py-1.5 text-center text-sm text-gray-500">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <span>Showing</span>
                <select className="mx-2 border border-gray-300 rounded px-2 py-1 text-xs bg-white">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span>records per page</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                  Previous
                </button>
                <span className="px-2 py-1 border border-blue-500 bg-blue-500 text-white rounded text-xs">1</span>
                <button className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Page;