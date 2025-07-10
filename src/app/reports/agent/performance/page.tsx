'use client';
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ReportHeader from '@/components/queue-reports/agent/ReportHeader';
import { PerformanceData, VisibleColumnType } from '@/types/reportTypes';
import { fetchAgentPerfomanceAPI, refreshAgentPerformanceAPI } from '@/services/reportAPI';
import { Headers } from '@/services/commonAPI';
import { formatDate, formatTimeAMPM } from '@/utils/formatters';

const Page = () => {
    const [startDate, setStartDate] = useState<string>('2025-06-01');
    const [endDate, setEndDate] = useState<string>('2025-06-23');
    const [selectedAgent, setSelectedAgent] = useState<string>('');
    const [selectedChannel, setSelectedChannel] = useState<string>('');
    const [selectedFormat, setSelectedFormat] = useState<string>('DESC');
    const [selectedCount, setSelectedCount] = useState<string>('10');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [nextPageToken, setNextPageToken] = useState<string | undefined>();
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [visibleColumns, setVisibleColumns] = useState<VisibleColumnType>({
        index: true,
        engagementId: true,
        date: true,
        time: true,
        queue: true,
        channel: true,
        direction: true,
        userName: true,
        duration: true,
        transferInitiatedCount: true,
        transferCompletedCount: true,
        holdCount: true,
        agentOfferedCount: true,
        status: true,
    });

    const fetchPerformanceReports = async (page: number = 1, token?: string) => {
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
                channel: selectedChannel,
                agent: selectedAgent,
                format: selectedFormat,
                count: parseInt(selectedCount),
                page,
                nextPageToken: token,
            };

            const header: Headers = {
                authorization: `Bearer ${authToken}`,
            };

            const result = await fetchAgentPerfomanceAPI(reqBody, header);
            if (result.success) {
                setPerformanceData(result.data?.performance || []);
                setAllUsers(result.data?.users || []);
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
    };

    const fetchReports = async () => {
        setPerformanceData([]);
        setCurrentPage(1);
        setNextPageToken(undefined);
        await fetchPerformanceReports(1);
    };

    const refreshPerformanceReports = async () => {
        const tokenStorage = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
        if (!tokenStorage) {
            console.error('No authentication token found');
            return;
        }

        setIsLoading(true);
        setPerformanceData([]);
        setCurrentPage(1);
        setNextPageToken(undefined);

        try {
            const reqBody = {
                from: startDate,
                to: endDate,
                count: selectedCount
            };

            const headers: Headers = { Authorization: `Bearer ${tokenStorage}` };
            const result = await refreshAgentPerformanceAPI(reqBody, headers);

            if (result.success) {
                setPerformanceData(result.data.performance || []);
                setAllUsers(result.data.users || []);
                setNextPageToken(result.data?.nextPageToken);
                setTotalRecords(result.data?.totalRecords || 0);
                setCurrentPage(1);
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
        fetchPerformanceReports();
    }, [selectedCount]);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            fetchPerformanceReports(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (nextPageToken || currentPage * parseInt(selectedCount) < totalRecords) {
            fetchPerformanceReports(currentPage + 1, nextPageToken);
        }
    };

    const totalPages = Math.ceil(totalRecords / parseInt(selectedCount));

    const formatDuration = (seconds: number | null | undefined): string => {
        if (!seconds || seconds <= 0) {
            return '00:00:00';
        }

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            remainingSeconds.toString().padStart(2, '0'),
        ].join(':');
    };

    const summaryMetrics = [
        { label: 'Total Interactions', value: totalRecords, bgColor: 'bg-blue-100' },
        {
            label: 'Avg Handle Duration',
            value: performanceData.length
                ? formatDuration(
                    performanceData.reduce((sum, row) => sum + (Number(row.conversation_duration) || 0), 0) /
                    performanceData.length
                )
                : '00:00:00',
            bgColor: 'bg-orange-100',
        },
        {
            label: 'Most Common Channel',
            value: performanceData.length
                ? [...performanceData]
                    .sort(
                        (a, b) =>
                            performanceData.filter((row) => row.channel === b.channel).length -
                            performanceData.filter((row) => row.channel === a.channel).length
                    )[0].channel
                : 'N/A',
            bgColor: 'bg-red-100',
        },
    ];

    const columnHeaders = [
        { key: 'index', label: 'No', minWidth: '10px' },
        { key: 'engagementId', label: 'Engagement ID', minWidth: '150px' },
        { key: 'date', label: 'Date', minWidth: '100px' },
        { key: 'time', label: 'Time', minWidth: '100px' },
        { key: 'queue', label: 'Queue', minWidth: '120px' },
        { key: 'channel', label: 'Channel', minWidth: '120px' },
        { key: 'direction', label: 'Direction', minWidth: '120px' },
        { key: 'userName', label: 'User Name', minWidth: '120px' },
        { key: 'duration', label: 'Duration', minWidth: '120px' },
        { key: 'transferInitiatedCount', label: 'Transfer Initiated', minWidth: '120px' },
        { key: 'transferCompletedCount', label: 'Transfer Completed', minWidth: '120px' },
        { key: 'holdCount', label: 'Hold Count', minWidth: '120px' },
        { key: 'agentOfferedCount', label: 'Agent Offered', minWidth: '120px' },
    ];

    const channels = ['voice', 'messaging', 'video', 'email'];

    return (
        <MainLayout>
            <ReportHeader
                title="Agent Performance Report"
                startDate={startDate}
                endDate={endDate}
                reportData={performanceData}
                visibleColumns={visibleColumns}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                fetchReports={fetchReports}
                refreshReports={refreshPerformanceReports}
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
                        value={selectedChannel}
                        onChange={(e) => setSelectedChannel(e.target.value)}
                    >
                        <option value="">Channels</option>
                        {channels.map((channel, index) => (
                            <option key={index} value={channel}>
                                {channel}
                            </option>
                        ))}
                    </select>

                    <select className="border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                    >
                        <option value="DESC">Newest First</option>
                        <option value="ASC">Oldest First</option>
                    </select>
                </div>
            </ReportHeader>

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
                            <div className='flex items-center h-full'>
                                <div className="p-1.5 rounded-md bg-indigo-100 mr-3">
                                    <User size={16} />
                                </div>
                                <div className='ps-2'>
                                    {
                                        selectedAgent || selectedChannel ? (
                                            <>
                                                {selectedAgent && <p className="text-sm font-medium text-indigo-700">Agent: {selectedAgent}</p>}
                                                {selectedChannel && <p className="text-sm font-medium text-indigo-700">Channel: {selectedChannel}</p>}
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
                                    ) : performanceData.length > 0 ? (
                                        performanceData.map((data, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{(currentPage - 1) * parseInt(selectedCount) + index + 1}</td>
                                                {visibleColumns.engagementId && (
                                                    <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.engagement_id || '-'}</td>
                                                )}
                                                {visibleColumns.date && (
                                                    <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{formatDate(data.start_time) || '-'}</td>
                                                )}
                                                {visibleColumns.time && (
                                                    <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{formatTimeAMPM(data.start_time) || '-'}</td>
                                                )}
                                                {visibleColumns.queue && (
                                                    <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.queue_name || '-'}</td>
                                                )}
                                                {visibleColumns.channel && (
                                                    <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.channel || '-'}</td>
                                                )}
                                                {visibleColumns.direction && (
                                                    <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.direction || '-'}</td>
                                                )}
                                                {visibleColumns.userName && (
                                                    <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.user_name || '-'}</td>
                                                )}
                                                {visibleColumns.duration && (
                                                    <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{(data.conversation_duration) || '-'}</td>
                                                )}
                                                {visibleColumns.transferInitiatedCount && (
                                                    <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.transfer_initiated_count || 0}</td>
                                                )}
                                                {visibleColumns.transferCompletedCount && (
                                                    <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.transfer_completed_count || 0}</td>
                                                )}
                                                {visibleColumns.holdCount && (
                                                    <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.hold_count || 0}</td>
                                                )}
                                                {visibleColumns.agentOfferedCount && (
                                                    <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">{data.agent_offered_count || 0}</td>
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