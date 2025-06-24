'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ReportHeader from '@/components/queue-reports/agent/ReportHeader';
import { TraceData, VisibleColumnType } from '@/types/reportTypes';

const Page = () => {
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-23');
  const [traceData, setTraceData] = useState<TraceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumnType>({
    workSessionId: true,
    date: true,
    time: true,
    userName: true,
    userStatus: true,
    userSubStatus: true,
    teamName: true,
    duration: true,
    viewSession: true,
  });

  const fetchTraceReports = useCallback(async () => {
    const token = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    setIsLoading(true);
    try {
      const rawData = [
        {
          work_session_id: '8120876c-74f3-45fd-9dd3-2d50a410af37',
          start_time: '2025-06-23T02:36:07Z',
          end_time: '2025-06-24T00:29:36Z',
          user_id: '1mn27jJ1TVKN-0ZK5bK6sw',
          user_name: 'Melissa',
          user_status: 'Not Ready',
          user_sub_status: 'Forced',
          team: { team_id: '', team_name: '' },
          not_ready_duration: 78809000,
        },
        {
          work_session_id: 'a2c2f43a-657b-4ec8-9924-a3cffc669c3f',
          start_time: '2025-06-23T02:35:48Z',
          end_time: '2025-06-23T02:36:04Z',
          user_id: '1mn27jJ1TVKN-0ZK5bK6sw',
          user_name: 'Melissa',
          user_status: 'Ready',
          user_sub_status: 'Idle',
          team: { team_id: '', team_name: '' },
          ready_duration: 16000,
        },
        {
          work_session_id: 'a2c2f43a-657b-4ec8-9924-a3cffc669c3f',
          start_time: '2025-06-23T02:35:41Z',
          end_time: '2025-06-23T02:35:48Z',
          user_id: '1mn27jJ1TVKN-0ZK5bK6sw',
          user_name: 'Melissa',
          user_status: 'Occupied',
          user_sub_status: 'Wrapping up',
          team: { team_id: '', team_name: '' },
          occupied_duration: 7000,
        },
      ];

      const processedData: TraceData[] = rawData.map((item) => {
        const duration =
          item.not_ready_duration ||
          item.ready_duration ||
          item.occupied_duration ||
          Math.round((new Date(item.end_time).getTime() - new Date(item.start_time).getTime()) / 1000);
        return {
          workSessionId: item.work_session_id,
          date: new Date(item.start_time).toLocaleDateString(),
          time: new Date(item.start_time).toLocaleTimeString(),
          userName: item.user_name,
          userStatus: item.user_status,
          userSubStatus: item.user_sub_status,
          teamName: item.team.team_name || '-',
          duration: `${Math.round(duration / 1000)} sec`,
          viewSession: 'View',
        };
      });

      setTraceData(processedData);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshTraceReports = useCallback(async () => {
    setTraceData([]);
    await fetchTraceReports();
  }, [fetchTraceReports]);

  useEffect(() => {
    fetchTraceReports();
  }, [fetchTraceReports]);

  const summaryMetrics = [
    { label: 'Total Sessions', value: traceData.length, bgColor: 'bg-blue-100' },
    {
      label: 'Avg Session Duration',
      value: traceData.length
        ? `${Math.round(
          traceData.reduce((sum, row) => sum + parseInt(row.duration), 0) / traceData.length
        )} sec`
        : '0 sec',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Most Common Status',
      value: traceData.length
        ? [...traceData]
          .sort(
            (a, b) =>
              traceData.filter((row) => row.userStatus === b.userStatus).length -
              traceData.filter((row) => row.userStatus === a.userStatus).length
          )[0].userStatus
        : 'N/A',
      bgColor: 'bg-red-100',
    },
  ];

  const columnHeaders = [
    { key: 'workSessionId', label: 'Work Session ID', minWidth: '150px' },
    { key: 'date', label: 'Date', minWidth: '100px' },
    { key: 'time', label: 'Time', minWidth: '100px' },
    { key: 'userName', label: 'User Name', minWidth: '120px' },
    { key: 'userStatus', label: 'Status', minWidth: '120px' },
    { key: 'userSubStatus', label: 'Sub Status', minWidth: '120px' },
    { key: 'teamName', label: 'Team Name', minWidth: '120px' },
    { key: 'duration', label: 'Duration', minWidth: '120px' },
    { key: 'viewSession', label: 'View', minWidth: '100px' },
  ];

  return (
    <MainLayout>
      <ReportHeader
        title="Agent Trace Reports"
        startDate={startDate}
        endDate={endDate}
        reportData={traceData}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        fetchReports={fetchTraceReports}
        refreshReports={refreshTraceReports}
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
                        visibleColumns[header.key] && (
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
                  ) : traceData.length > 0 ? (
                    traceData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td
                          className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900"
                        >
                          ---
                        </td>
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