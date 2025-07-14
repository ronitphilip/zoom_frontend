'use client'
import MainLayout from '@/components/layout/MainLayout';
import ReportHeader from '@/components/queue-reports/agent/ReportHeader';
import { Headers } from '@/services/commonAPI';
import { fetchAgentLoginReportAPI, refreshAgentLoginReportAPI } from '@/services/reportAPI';
import { AgentLoginReport, VisibleColumnType } from '@/types/reportTypes';
import { formatDateToDDMMYYYY, formatMillisecondsToHours, formatMillisecondsToMinutes, formatTimeAMPM } from '@/utils/formatters';
import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [startDate, setStartDate] = useState<string>('2025-07-01');
  const [endDate, setEndDate] = useState<string>('2025-07-11');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('DESC');
  const [selectedCount, setSelectedCount] = useState<string>('10');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [data, setData] = useState<AgentLoginReport[]>([]);
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [visibleColumns, setVisibleColumns] = useState<VisibleColumnType>({
    index: true,
    agent: true,
    date: true,
    login: true,
    logout: true,
    duration: true,
  });

  useEffect(() => {
    fetchReports();
  }, [selectedCount]);

  const fetchReports = async (page: number = 1) => {
    const authToken = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
    if (!authToken) {
      setError('Authentication token not found. Please log in again.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const reqBody = {
        from: startDate,
        to: endDate,
        agent: selectedAgent,
        format: selectedFormat,
        count: parseInt(selectedCount),
        page,
      };

      const header: Headers = {
        authorization: `Bearer ${authToken}`,
      };

      const result = await fetchAgentLoginReportAPI(reqBody, header);

      if (result.success) {
        setData(result.data?.reports || []);
        setAllUsers(result.data?.users || []);
        setTotalRecords(result.data?.totalRecords || 0);
        setCurrentPage(page);
      } else {
        setError(result.error || 'Failed to fetch reports.');
        console.log(result);
      }
    } catch (error) {
      setError('An error occurred while fetching reports. Please try again.');
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    setData([]);
    setCurrentPage(1);
    await fetchReports(1);
  };

  const refreshPerformanceReports = async () => {
    const tokenStorage = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
    if (!tokenStorage) {
      setError('Authentication token not found. Please log in again.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setData([]);
    setCurrentPage(1);

    try {
      const reqBody = {
        from: startDate,
        to: endDate,
        count: selectedCount,
      };

      const headers: Headers = { Authorization: `Bearer ${tokenStorage}` };
      const result = await refreshAgentLoginReportAPI(reqBody, headers);

      if (result.success) {
        setData(result.data.reports || []);
        setAllUsers(result.data.users || []);
        setTotalRecords(result.data?.totalRecords || 0);
        setCurrentPage(1);
      } else {
        setError(result.error || 'Failed to refresh reports.');
      }
    } catch (error) {
      setError('An error occurred while refreshing reports. Please try again.');
      console.error('Error refreshing reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchReports(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * parseInt(selectedCount) < totalRecords) {
      fetchReports(currentPage + 1);
    }
  };

  const totalPages = Math.ceil(totalRecords / parseInt(selectedCount));

  const summaryMetrics = [
    { label: 'Total Logins', value: totalRecords, bgColor: 'bg-blue-100' },
    { label: 'Avg Duration(H)', value: '10', bgColor: 'bg-orange-100' },
    { label: 'Most Common Channel', value: 'voice', bgColor: 'bg-red-100' },
  ];

  const columnHeaders = [
    { key: 'index', label: 'No', minWidth: '60px' },
    { key: 'agent', label: 'Agent Name', minWidth: '150px' },
    { key: 'date', label: 'Date', minWidth: '100px' },
    { key: 'login', label: 'Login Time', minWidth: '100px' },
    { key: 'logout', label: 'Logout time', minWidth: '100px' },
    { key: 'duration', label: 'Total Duration', minWidth: '100px' },
  ];

  return (
    <MainLayout>
      <ReportHeader
        title="Agent Login-Logout Report"
        startDate={startDate}
        endDate={endDate}
        reportData={data}
        visibleColumns={visibleColumns}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        fetchReports={fetchData}
        refreshReports={refreshPerformanceReports}
        setVisibleColumns={setVisibleColumns}
      >
        <div className="flex space-x-4">
          <select
            className="border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-30"
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            aria-label="Select Agent"
          >
            <option value="">All Agents</option>
            {allUsers.map((agentName, index) => (
              <option key={index} value={agentName}>
                {agentName}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            aria-label="Select Sort Order"
          >
            <option value="DESC">Newest First</option>
            <option value="ASC">Oldest First</option>
          </select>
        </div>
      </ReportHeader>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="flex flex-wrap divide-x divide-gray-200">
            {summaryMetrics.map((metric, index) => (
              <div key={index} className="flex-1 py-3 px-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-md ${metric.bgColor}`}>
                    <User size={16} />
                  </div>
                  <div className="ps-5">
                    <p className="text-xs font-medium text-gray-500">{metric.label}</p>
                    <p className="text-xl font-bold text-gray-800">{metric.value}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex-1 py-2 items-center px-4 bg-indigo-50">
              <div className="flex items-center h-full">
                <div className="p-1.5 rounded-md bg-indigo-100 mr-3">
                  <User size={16} />
                </div>
                <div className="ps-2">
                  {selectedAgent ? (
                    <p className="text-sm font-medium text-indigo-700">Agent: {selectedAgent}</p>
                  ) : (
                    <p className="text-sm font-medium text-indigo-700">All data (no filters applied)</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex flex-col" style={{ height: 'calc(98vh - 270px)' }}>
            <div className="overflow-auto flex-grow">
              <table className="w-full divide-y divide-gray-200 text-xs" aria-label="Agent Login-Logout Report Table">
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
                      <td
                        colSpan={columnHeaders.length}
                        className="px-3 py-1.5 text-center text-sm text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : data.length > 0 ? (
                    data.map((data, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {visibleColumns.index && (
                          <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">
                            {(currentPage - 1) * parseInt(selectedCount) + index + 1}
                          </td>
                        )}
                        {visibleColumns.agent && (
                          <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">
                            {data.user_name || '-'}
                          </td>
                        )}
                        {visibleColumns.date && (
                          <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">
                            {data.login_time ? formatDateToDDMMYYYY(data.login_time) : '-'}
                          </td>
                        )}
                        {visibleColumns.login && (
                          <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">
                            {data.login_time ? formatTimeAMPM(data.login_time) : '-'}
                          </td>
                        )}
                        {visibleColumns.logout && (
                          <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">
                            {data.logout_time ? formatTimeAMPM(data.logout_time) : '-'}
                          </td>
                        )}
                        {visibleColumns.duration && (
                          <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">
                            {data.duration ? formatMillisecondsToHours(data.duration) : '-'}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columnHeaders.length}
                        className="px-3 py-1.5 text-center text-sm text-gray-500"
                      >
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
                  }}
                  aria-label="Select Records Per Page"
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
                  aria-label="Previous Page"
                >
                  Previous
                </button>
                <span className="px-2 py-1 border border-blue-500 bg-blue-500 text-white rounded text-xs">
                  {currentPage} of {totalPages}
                </span>
                <button
                  className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  onClick={handleNextPage}
                  disabled={currentPage * parseInt(selectedCount) >= totalRecords}
                  aria-label="Next Page"
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