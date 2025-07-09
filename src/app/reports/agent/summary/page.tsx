'use client'
import MainLayout from '@/components/layout/MainLayout';
import ReportHeader from '@/components/queue-reports/agent/ReportHeader';
import { Headers } from '@/services/commonAPI';
import { fetchGroupSummaryAPI, refreshGroupSummaryAPI } from '@/services/reportAPI';
import { VisibleColumnType } from '@/types/reportTypes';
import { User } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';

const Page = () => {
  const [startDate, setStartDate] = useState<string>("2025-06-01");
  const [endDate, setEndDate] = useState<string>("2025-06-23");
  const [teamName, setTeamName] = useState<string>("");
  const [allTeams, setAllTeams] = useState([]);
  const [channel, setChannel] = useState<string>("");
  const [groupSummaryData, setGroupSummaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumnType>({
    team_name: true,
    total_interactions: true,
    avg_handle_duration: true,
    total_hold_count: true,
    avg_wrap_up_duration: true,
    channels: true,
    directions: true,
    transfer_initiated: true,
    transfer_completed: true,
    total_ready_duration: true,
    total_not_ready_duration: true,
    total_occupied_duration: true,
    queues: true,
    status: true,
    sub_status: true,
  });

  useEffect(() => {
    if (groupSummaryData.length > 0) {
      const columns = Object.keys(groupSummaryData[0] || {});
      setVisibleColumns(columns.reduce((acc, col) => ({ ...acc, [col]: true }), {}));
    }
  }, [groupSummaryData]);

  const fetchSummaryReports = async () => {
    const token = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    setIsLoading(true);
    try {
      const reqBody = {
        from: startDate,
        to: endDate,
        team_name: teamName,
        channel: channel,
      };
      const headers: Headers = { Authorization: `Bearer ${token}` };
      const result = await fetchGroupSummaryAPI(reqBody, headers);
      console.log(result);

      if (result.success) {
        setGroupSummaryData(result.data?.summary);
        setAllTeams(result.data?.allteams);
      } else {
        console.error('Failed to fetch reports:', result.error);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSummaryReports = async () => {
    const tokenStorage = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
    if (!tokenStorage) {
      console.error('No authentication token found');
      return;
    }

    setIsLoading(true);
    setGroupSummaryData([]);

    try {
      const reqBody = {
        from: startDate,
        to: endDate,
      };

      const headers: Headers = { Authorization: `Bearer ${tokenStorage}` };
      const result = await refreshGroupSummaryAPI(reqBody, headers);

      if (result.success) {
        fetchSummaryReports();
      } else {
        console.error('Failed to refresh reports:', result.error);
      }
    } catch (error) {
      console.error('Error refreshing reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryReports();
  }, []);

  const summaryMetrics = useMemo(() => {
    if (isLoading || groupSummaryData.length === 0) {
      return [
        { label: 'Total Teams', value: '0', bgColor: 'bg-blue-100' },
        { label: 'Avg Handle Duration', value: 'N/A', bgColor: 'bg-orange-100' },
        { label: 'Most Common Channel', value: 'N/A', bgColor: 'bg-red-100' },
      ];
    }

    const uniqueTeams = new Set(groupSummaryData.map((row: any) => row.team_name)).size;

    const totalHandleDuration = groupSummaryData.reduce((sum: number, row: any) => {
      const duration = parseFloat(row.avg_handle_duration) || 0;
      return sum + duration;
    }, 0);
    const avgHandleDuration = totalHandleDuration / groupSummaryData.length;
    const formattedAvgHandle = isNaN(avgHandleDuration) ? 'N/A' : `${Math.round(avgHandleDuration)} mins`;

    const channelCounts = groupSummaryData.reduce((acc: Record<string, number>, row: any) => {
      const channel = Array.isArray(row.channels) ? row.channels[0] : row.channels || 'Unknown';
      acc[channel] = (acc[channel] || 0) + 1;
      return acc;
    }, {});
    const mostCommonChannel = Object.entries(channelCounts).reduce((a, b) => (b[1] > a[1] ? b : a), ['N/A', 0])[0];

    return [
      { label: 'Total Teams', value: uniqueTeams.toString(), bgColor: 'bg-blue-100' },
      { label: 'Avg Handle Duration', value: formattedAvgHandle, bgColor: 'bg-orange-100' },
      { label: 'Most Common Channel', value: mostCommonChannel, bgColor: 'bg-red-100' },
    ];
  }, [groupSummaryData, isLoading]);

  const columnHeaders = [
    { key: 'team_name', label: 'Team Name', minWidth: '150px' },
    { key: 'total_interactions', label: 'Total Interactions', minWidth: '120px' },
    { key: 'avg_handle_duration', label: 'Avg Handle Duration', minWidth: '120px' },
    { key: 'total_hold_count', label: 'Total Hold Count', minWidth: '120px' },
    { key: 'avg_wrap_up_duration', label: 'Avg Wrap Up Duration', minWidth: '120px' },
    { key: 'channels', label: 'Channel', minWidth: '120px' },
    { key: 'directions', label: 'Direction', minWidth: '120px' },
    { key: 'transfer_initiated', label: 'Transfer Initiated', minWidth: '120px' },
    { key: 'transfer_completed', label: 'Transfer Completed', minWidth: '120px' },
    { key: 'total_ready_duration', label: 'Total Ready Duration', minWidth: '120px' },
    { key: 'total_not_ready_duration', label: 'Total Not Ready Duration', minWidth: '120px' },
    { key: 'total_occupied_duration', label: 'Total Occupied Duration', minWidth: '120px' },
    { key: 'queues', label: 'Queue Name', minWidth: '120px' },
    { key: 'status', label: 'Status', minWidth: '120px' },
    { key: 'sub_status', label: 'Sub Status', minWidth: '120px' },
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
          <select
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
          >
            <option value="">All Teams</option>
            {allTeams.map((team: { team_name: string }, index: number) => (
              <option key={index} value={team.team_name}>
                {team.team_name}
              </option>
            ))}
          </select>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
          >
            <option value="">All Channels</option>
            <option value="voice">Voice</option>
            <option value="video">Video</option>
            <option value="messaging">Messaging</option>
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
            <div className="flex-1 py-2 items-center px-4 bg-indigo-50">
              <div className='flex items-center h-full'>
                <div className="p-1.5 rounded-md bg-indigo-100 mr-3">
                  <User size={16} />
                </div>
                <div className='ps-2'>
                  {
                    teamName || channel ? (
                      <>
                        {teamName && <p className="text-sm font-medium text-indigo-700">Team: {teamName}</p>}
                        {channel && <p className="text-sm font-medium text-indigo-700">Channel: {channel}</p>}
                      </>
                    ) : (
                      <p className="text-sm font-medium text-indigo-700">All data (no filters applied)</p>
                    )
                  }
                </div>
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
                              <td key={header.key} className="px-3 py-1.5 whitespace-nowrap">
                                {Array.isArray(row[header.key])
                                  ? row[header.key].join(", ")
                                  : row[header.key] || "-"}
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