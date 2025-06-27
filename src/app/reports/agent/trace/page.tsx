'use client';
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ReportHeader from '@/components/queue-reports/agent/ReportHeader';
import { TraceData, VisibleColumnType } from '@/types/reportTypes';
import { Headers } from '@/services/commonAPI';
import { fetchAgentQueueAPI } from '@/services/reportAPI';
import { formatDate, formatTimeAMPM } from '@/utils/formatters';

const Page = () => {
  const [startDate, setStartDate] = useState<string>('2025-06-01');
  const [endDate, setEndDate] = useState<string>('2025-06-23');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('ASC');
  const [selectedCount, setSelectedCount] = useState<string>('10');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [traceData, setTraceData] = useState<TraceData[]>([]);
  const [allUsers, setAllUsers] = useState([]);
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

  const fetchTraceReports = async (page: number = 1, token?: string) => {
    const authToken = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
    if (!authToken) {
      console.error('No authentication token found');
      return;
    }

    setIsLoading(true);
    try {
      const reqBody = {
        from: startDate,
        to: endDate,
        status: selectedStatus,
        agent: selectedAgent,
        format: selectedFormat,
        count: parseInt(selectedCount),
        page,
        nextPageToken: token,
      };

      const header: Headers = {
        authorization: `Bearer ${authToken}`
      }
      const result = await fetchAgentQueueAPI(reqBody, header);
      console.log(result);
      
      if (result.success) {
        setTraceData(result.data?.traceData);
        setAllUsers(result.data?.users);
        setNextPageToken(result.data?.nextPageToken);
        setTotalRecords(result.data?.totalRecords || 0);
        setCurrentPage(page);
      } else {
        console.error('Failed to fetch reports:', result.error);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const listStatus = (data: TraceData[]): string[] => {
    const status = new Set(data.map(item => item.user_status).filter(user_status => user_status));
    return Array.from(status.values());
  };

  const refreshTraceReports = async () => {
    setTraceData([]);
    await fetchTraceReports();
  };

  useEffect(() => {
    fetchTraceReports();
  }, [selectedCount]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchTraceReports(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (nextPageToken || currentPage * parseInt(selectedCount) < totalRecords) {
      fetchTraceReports(currentPage + 1, nextPageToken);
    }
  };

  const totalPages = Math.ceil(totalRecords / parseInt(selectedCount));

  const summaryMetrics = [
    { label: 'Total Sessions', value: traceData.length, bgColor: 'bg-blue-100' },
    {
      label: 'Avg Session Duration',
      value: traceData.length
        ? `${Math.round(
          traceData.reduce((sum, row) => sum + parseInt(row.occupied_duration), 0) / traceData.length
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
              traceData.filter((row) => row.user_status === b.user_status).length -
              traceData.filter((row) => row.user_status === a.user_status).length
          )[0].user_status
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

  const status = listStatus(traceData)

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
        <div className="flex space-x-4">
          <select className="border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-30"
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            <option value="">All Agents</option>
            {allUsers.map((agentName, index) => (
              <option key={index} value={agentName}>
                {agentName}
              </option>
            ))}
          </select>

          <select className="border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-30"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Channels</option>
            {status.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select className="border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="ASC">Newest First</option>
            <option value="DESC">Oldest First</option>
          </select>
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
                    traceData.map((data, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.work_session_id || '-'}</td>
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{formatDate(data.start_time) || '-'}</td>
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{formatTimeAMPM(data.start_time) || '-'}</td>
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.user_name || '-'}</td>
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.user_status || '-'}</td>
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.user_sub_status || '-'}</td>
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">-</td>
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.occupied_duration || 0}</td>
                        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">view</td>
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
                <select
                  className="mx-2 border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                  value={selectedCount}
                  onChange={(e) => {
                    setSelectedCount(e.target.value);
                    setCurrentPage(1);
                    setNextPageToken(undefined);
                  }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
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
                  disabled={!nextPageToken && currentPage * parseInt(selectedCount) >= totalRecords}
                >
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