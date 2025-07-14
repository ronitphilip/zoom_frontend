import React, { useEffect, useState } from 'react';
import { fetchAgentVDNIntervalAPI, refreshQueuesAPI } from '@/services/vdnAPI';
import { Headers } from '@/services/commonAPI';
import { Download, Filter, RefreshCcw, AlignJustify } from 'lucide-react';
import { ReportRecord } from '@/types/agentQueueTypes';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { formatDuration } from '@/utils/formatters';

interface VdnIntervalReportProps {
    startDate: string;
    endDate: string;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
}

export default function VdnIntervalReport({ startDate, endDate, setStartDate, setEndDate }: VdnIntervalReportProps) {
    const [reportData, setReportData] = useState<ReportRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [selectedFlow, setSelectedFlow] = useState<string>('all');
    const [selectedInterval, setSelectedInterval] = useState<string>('15');
    const [showColumnMenu, setShowColumnMenu] = useState(false);

    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
        date: true,
        flowName: true,
        totalOffered: true,
        totalAnswered: true,
        abandonedCalls: true,
        abandonPercentage: true,
        acdTime: true,
        acwTime: true,
        agentRingTime: true,
        avgAcwTime: true,
        avgHandleTime: true,
        digitalInteractions: true,
        inboundCalls: true,
        maxHandleTime: true,
        outboundCalls: true,
        successPercentage: true,
        transferCount: true,
        voiceCalls: true,
    });

    useEffect(() => {
        fetchDailyReport(1, null);
    }, [itemsPerPage]);

    const fetchDailyReport = async (page: number = 1, pageToken: string | null = null) => {
        const token = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
        if (!token) {
            console.error('No authentication token found');
            alert('Authentication token missing. Please log in again.');
            return;
        }

        setIsLoading(true);

        try {
            const reqBody = {
                from: startDate,
                to: endDate,
                count: itemsPerPage,
                page,
                nextPageToken: pageToken,
                interval: selectedInterval,
                flowName: selectedFlow !== 'all' ? selectedFlow : undefined
            };
            const header: Headers = {
                Authorization: `Bearer ${token}`,
            };
            const result = await fetchAgentVDNIntervalAPI(reqBody, header);

            if (result.success) {
                setReportData(result.data.reports || []);
                setNextPageToken(result.data.nextPageToken || null);
                setTotalRecords(result.data.totalRecords || 0);
                setCurrentPage(page);
            } else {
                console.error('Invalid API response:', result);
                setReportData([]);
                setNextPageToken(null);
                setTotalRecords(0);
            }
        } catch (err) {
            console.error('Error fetching reports:', err);
            setReportData([]);
            setNextPageToken(null);
            setTotalRecords(0);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshReport = async () => {
        const token = sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : null;
        if (!token) {
            console.error('No authentication token found');
            alert('Authentication token missing. Please log in again.');
            return;
        }

        setIsLoading(true);

        try {
            const reqBody = {
                from: startDate,
                to: endDate,
                count: itemsPerPage,
                page: 1,
                interval: selectedInterval,
            };
            const header: Headers = {
                Authorization: `Bearer ${token}`,
            };
            const result = await refreshQueuesAPI(reqBody, header);

            if (result.success) {
                setReportData(result.data.reports || []);
                setNextPageToken(result.data.nextPageToken || null);
                setTotalRecords(result.data.totalRecords || 0);
                setCurrentPage(1);
            } else {
                console.error('Invalid API response:', result);
                setReportData([]);
                setNextPageToken(null);
                setTotalRecords(0);
            }
        } catch (err) {
            console.error('Error fetching reports:', err);
            setReportData([]);
            setNextPageToken(null);
            setTotalRecords(0);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadExcel = () => {
        if (!reportData || reportData.length === 0) {
            console.error('No data available for export');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

        const colWidths = Object.keys(reportData[0] || {}).map((key) => ({
            wch: Math.max(key.length, ...reportData.map((row: any) => String(row[key]).length))
        }));
        worksheet['!cols'] = colWidths;

        XLSX.writeFile(workbook, 'vdn_interval_report.xlsx', { bookType: 'xlsx', type: 'binary' });
    };

    const downloadCSV = () => {
        if (!reportData || reportData.length === 0) {
            console.error('No data available for export');
            return;
        }

        const csv = Papa.unparse(reportData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'vdn_interval_report.csv');
        link.click();
        URL.revokeObjectURL(url);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            fetchDailyReport(prevPage, null);
        }
    };

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < totalRecords) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchDailyReport(nextPage, nextPageToken);
        }
    };

    const toggleColumn = (column: string) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [column]: !prev[column],
        }));
    };

    const calculateSummary = () => {
        const summary = {
            date: 'SUMMARY',
            flowId: '',
            flowName: '',
            totalOffered: reportData.reduce((acc, curr) => acc + (curr.totalOffered || 0), 0),
            totalAnswered: reportData.reduce((acc, curr) => acc + (curr.totalAnswered || 0), 0),
            abandonedCalls: reportData.reduce((acc, curr) => acc + (curr.abandonedCalls || 0), 0),
            abandonPercentage: '',
            acdTime: reportData.reduce((acc, curr) => acc + (curr.acdTime || 0), 0),
            acwTime: reportData.reduce((acc, curr) => acc + (curr.acwTime || 0), 0),
            agentRingTime: reportData.reduce((acc, curr) => acc + (curr.agentRingTime || 0), 0),
            avgAcwTime: reportData.reduce((acc, curr) => acc + (curr.avgAcwTime || 0), 0),
            avgHandleTime: reportData.reduce((acc, curr) => acc + (curr.avgHandleTime || 0), 0),
            digitalInteractions: reportData.reduce((acc, curr) => acc + (curr.digitalInteractions || 0), 0),
            inboundCalls: reportData.reduce((acc, curr) => acc + (curr.inboundCalls || 0), 0),
            maxHandleTime: reportData.reduce((acc, curr) => acc + (curr.maxHandleTime || 0), 0),
            outboundCalls: reportData.reduce((acc, curr) => acc + (curr.outboundCalls || 0), 0),
            successPercentage: '',
            transferCount: reportData.reduce((acc, curr) => acc + (curr.transferCount || 0), 0),
            voiceCalls: reportData.reduce((acc, curr) => acc + (curr.voiceCalls || 0), 0),
        };

        const formatTime = (seconds: number) => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };

        return {
            ...summary,
            acdTime: formatTime(summary.acdTime),
            acwTime: formatTime(summary.acwTime),
            agentRingTime: formatTime(summary.agentRingTime),
            avgAcwTime: formatTime(Math.round(summary.avgAcwTime)),
            avgHandleTime: formatTime(Math.round(summary.avgHandleTime)),
            maxHandleTime: formatTime(summary.maxHandleTime),
            abandonPercentage: summary.totalOffered ? Math.round((summary.abandonedCalls / summary.totalOffered) * 100) + '%' : '0%',
            successPercentage: summary.totalOffered ? Math.round((summary.totalAnswered / summary.totalOffered) * 100) + '%' : '0%',
        };
    };

    const uniqueQueues = Array.from(new Set(reportData.map(item => item.flowName))).filter(Boolean);
    const summary = calculateSummary();
    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    return (
        <div className="space-y-6">
            {/* Page header with title and actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-bold text-blue-800">VDN Report Interval</h2>
                <div className="flex flex-wrap gap-2">
                    <button onClick={downloadExcel} className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
                        <Download size={16} className="mr-2" />Excel
                    </button>
                    <button onClick={downloadCSV} className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
                        <Download size={16} className="mr-2" />CSV
                    </button>
                    <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
                        <Download size={16} className="mr-2" />PDF
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowColumnMenu(!showColumnMenu)}
                            className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
                        >
                            <AlignJustify size={16} className="mr-2" />Columns
                        </button>
                        {showColumnMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="p-2 max-h-96 overflow-y-auto">
                                    {Object.entries(visibleColumns).map(([column, isVisible]) => (
                                        <label key={column} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                                            <input
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                type="checkbox"
                                                checked={isVisible}
                                                onChange={() => toggleColumn(column)}
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
                        className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
                        onClick={refreshReport}
                    >
                        <RefreshCcw size={16} className="mr-2" />Refresh
                    </button>
                </div>
            </div>

            {/* Date Filter */}
            <div className="bg-white rounded-lg shadow w-full p-4">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="flex items-center space-x-4">
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
                        <div className="flex items-center">
                            <div className="h-8 border-l border-gray-300 mx-2"></div>
                            <div className="flex items-center space-x-1 text-gray-700">
                                <Filter size={18} /><span className="text-sm font-medium">Filters</span>
                            </div>
                            <div className="h-8 border-l border-gray-300 mx-2"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Interval:</span>
                            <select
                                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                                value={selectedInterval}
                                onChange={(e) => setSelectedInterval(e.target.value)}
                            >
                                <option value="15">15 Minutes</option>
                                <option value="30">30 Minutes</option>
                                <option value="60">60 Minutes</option>
                            </select>
                        </div>
                        <div className="relative inline-block w-44">
                            <select
                                className="block w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedFlow}
                                onChange={(e) => setSelectedFlow(e.target.value)}
                            >
                                <option value="all" className="text-gray-500">All Flows</option>
                                {uniqueQueues.map((queue, idx) => (
                                    <option key={idx} value={queue}>{queue}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setCurrentPage(1);
                            setNextPageToken(null);
                            fetchDailyReport(1, null);
                        }}
                        className="mt-4 sm:mt-0 px-4 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 border border-blue-600 shadow-sm"
                    >
                        Generate Report
                    </button>
                </div>
            </div>

            {/* VDN Information */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-base font-semibold text-blue-800 mb-2">VDN Information</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <span className="text-sm font-medium text-gray-500">VDN Name:</span>
                        <span className="ml-2 text-sm font-semibold">{selectedFlow}</span>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-500">Reporting Period:</span>
                        <span className="ml-2 text-sm font-semibold">{startDate} to {endDate}</span>
                    </div>
                </div>
            </div>

            {/* Report Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden w-full">
                <div className="flex flex-col" style={{ height: 'calc(98vh - 310px)' }}>
                    <div className="overflow-auto flex-grow">
                        {isLoading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : reportData.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">No data available</div>
                        ) : (
                            <table className="w-full divide-y divide-gray-200 text-xs">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {visibleColumns.date && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Date</th>
                                        )}
                                        {visibleColumns.flowName && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] sticky top-0 bg-gray-50">Flow Name</th>
                                        )}
                                        {visibleColumns.totalOffered && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total Offered</th>
                                        )}
                                        {visibleColumns.totalAnswered && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Total Answered</th>
                                        )}
                                        {visibleColumns.abandonedCalls && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Abandoned Calls</th>
                                        )}
                                        {visibleColumns.abandonPercentage && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Abandon %</th>
                                        )}
                                        {visibleColumns.acdTime && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">ACD Time</th>
                                        )}
                                        {visibleColumns.acwTime && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">ACW Time</th>
                                        )}
                                        {visibleColumns.agentRingTime && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Agent Ring Time</th>
                                        )}
                                        {visibleColumns.avgAcwTime && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Avg ACW Time</th>
                                        )}
                                        {visibleColumns.avgHandleTime && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Avg Handle Time</th>
                                        )}
                                        {visibleColumns.digitalInteractions && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Digital Interactions</th>
                                        )}
                                        {visibleColumns.inboundCalls && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Inbound Calls</th>
                                        )}
                                        {visibleColumns.maxHandleTime && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Max Handle Time</th>
                                        )}
                                        {visibleColumns.outboundCalls && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray">Outbound Calls</th>
                                        )}
                                        {visibleColumns.successPercentage && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Success %</th>
                                        )}
                                        {visibleColumns.transferCount && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Transfer Count</th>
                                        )}
                                        {visibleColumns.voiceCalls && (
                                            <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] sticky top-0 bg-gray-50">Voice Calls</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr className="bg-blue-50 font-semibold">
                                        {visibleColumns.date && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.date}</td>
                                        )}
                                        {visibleColumns.flowName && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.flowName}</td>
                                        )}
                                        {visibleColumns.totalOffered && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalOffered}</td>
                                        )}
                                        {visibleColumns.totalAnswered && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.totalAnswered}</td>
                                        )}
                                        {visibleColumns.abandonedCalls && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.abandonedCalls}</td>
                                        )}
                                        {visibleColumns.abandonPercentage && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.abandonPercentage}</td>
                                        )}
                                        {visibleColumns.acdTime && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.acdTime}</td>
                                        )}
                                        {visibleColumns.acwTime && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.acwTime}</td>
                                        )}
                                        {visibleColumns.agentRingTime && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.agentRingTime}</td>
                                        )}
                                        {visibleColumns.avgAcwTime && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.avgAcwTime}</td>
                                        )}
                                        {visibleColumns.avgHandleTime && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.avgHandleTime}</td>
                                        )}
                                        {visibleColumns.digitalInteractions && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.digitalInteractions}</td>
                                        )}
                                        {visibleColumns.inboundCalls && (
                                            <td className="px-3 py-1.5 whitespace FOURTH EDITION whitespace-nowrap text-xs text-blue-800">{summary.inboundCalls}</td>
                                        )}
                                        {visibleColumns.maxHandleTime && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.maxHandleTime}</td>
                                        )}
                                        {visibleColumns.outboundCalls && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.outboundCalls}</td>
                                        )}
                                        {visibleColumns.successPercentage && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.successPercentage}</td>
                                        )}
                                        {visibleColumns.transferCount && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.transferCount}</td>
                                        )}
                                        {visibleColumns.voiceCalls && (
                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs text-blue-800">{summary.voiceCalls}</td>
                                        )}
                                    </tr>
                                    {reportData.map((record, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            {visibleColumns.date && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.date || 'N/A'}</td>
                                            )}
                                            {visibleColumns.flowName && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.flowName || 'N/A'}</td>
                                            )}
                                            {visibleColumns.totalOffered && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalOffered || '0'}</td>
                                            )}
                                            {visibleColumns.totalAnswered && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.totalAnswered || '0'}</td>
                                            )}
                                            {visibleColumns.abandonedCalls && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.abandonedCalls || '0'}</td>
                                            )}
                                            {visibleColumns.abandonPercentage && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.abandonPercentage || '0%'}</td>
                                            )}
                                            {visibleColumns.acdTime && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatDuration(record.acdTime) || '00:00:00'}</td>
                                            )}
                                            {visibleColumns.acwTime && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatDuration(record.acwTime) || '00:00:00'}</td>
                                            )}
                                            {visibleColumns.agentRingTime && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatDuration(record.agentRingTime) || '00:00:00'}</td>
                                            )}
                                            {visibleColumns.avgAcwTime && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatDuration(Math.floor(record.avgAcwTime)) || '00:00:00'}</td>
                                            )}
                                            {visibleColumns.avgHandleTime && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatDuration(Math.floor(record.avgHandleTime)) || '00:00:00'}</td>
                                            )}
                                            {visibleColumns.digitalInteractions && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.digitalInteractions || '0'}</td>
                                            )}
                                            {visibleColumns.inboundCalls && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.inboundCalls || '0'}</td>
                                            )}
                                            {visibleColumns.maxHandleTime && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{formatDuration(record.maxHandleTime) || '00:00:00'}</td>
                                            )}
                                            {visibleColumns.outboundCalls && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.outboundCalls || '0'}</td>
                                            )}
                                            {visibleColumns.successPercentage && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.successPercentage || '0%'}</td>
                                            )}
                                            {visibleColumns.transferCount && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.transferCount || '0'}</td>
                                            )}
                                            {visibleColumns.voiceCalls && (
                                                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.voiceCalls || '0'}</td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                            <span>Showing</span>
                            <select
                                className="mx-2 border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(parseInt(e.target.value));
                                    setCurrentPage(1);
                                    setNextPageToken(null);
                                    fetchDailyReport(1, null);
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
                                disabled={currentPage * itemsPerPage >= totalRecords || !nextPageToken}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}