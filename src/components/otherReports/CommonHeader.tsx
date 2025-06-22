'use client';

import { Download, Filter, RefreshCcw } from 'lucide-react';
import React from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CallLogEntry } from '@/types/zoomTypes';
import { formatDateTimeTable } from '@/utils/formatters';

interface CommonProps {
    title: string;
    startDate: string;
    endDate: string;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
    fetchCallLogs: () => void;
    refreshCallLogs: () => void;
    callLog: CallLogEntry[] | null;
}

const CommonHeader: React.FC<CommonProps> = ({ title, startDate, endDate, callLog, setStartDate, setEndDate, fetchCallLogs, refreshCallLogs }) => {

    const exportToExcel = () => {
        if (!callLog || callLog.length === 0) {
            alert('No data to export!');
            return;
        }

        const data = callLog.map((log, index) => ({
            No: index + 1,
            Caller: log.caller_name ?? 'N/a',
            'Caller No.': log.caller_did_number ?? 'N/a',
            Callee: log.callee_name ?? 'N/a',
            'Callee No.': log.callee_did_number ?? 'N/a',
            Duration: log.duration ?? 'N/a',
            Result: log.call_result ?? 'N/a',
            'Start Time': log.start_time ? formatDateTimeTable(log.start_time) : 'N/a',
            'End Time': log.end_time ? formatDateTimeTable(log.end_time) : 'N/a',
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Call Logs');
        XLSX.writeFile(workbook, `${title}_Log.xlsx`);
    };

    const exportToCSV = () => {
        if (!callLog || callLog.length === 0) {
            alert('No data to export!');
            return;
        }

        const data = callLog.map((log, index) => ({
            No: index + 1,
            Caller: log.caller_name ?? 'N/a',
            'Caller No.': log.caller_did_number ?? 'N/a',
            Callee: log.callee_name ?? 'N/a',
            'Callee No.': log.callee_did_number ?? 'N/a',
            Duration: log.duration ?? 'N/a',
            Result: log.call_result ?? 'N/a',
            'Start Time': log.start_time ? formatDateTimeTable(log.start_time) : 'N/a',
            'End Time': log.end_time ? formatDateTimeTable(log.end_time) : 'N/a',
        }));

        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}_Log.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const exportToPDF = () => {
        if (!callLog || callLog.length === 0) {
            alert('No data to export!');
            return;
        }

        const doc = new jsPDF();
        doc.text(`${title} Call Logs`, 14, 20);

        const tableData = callLog.map((log, index) => [
            index + 1,
            log.caller_name ?? 'N/a',
            log.caller_did_number ?? 'N/a',
            log.callee_name ?? 'N/a',
            log.callee_did_number ?? 'N/a',
            log.duration ?? 'N/a',
            log.call_result ?? 'N/a',
            log.start_time ? formatDateTimeTable(log.start_time) : 'N/a',
            log.end_time ? formatDateTimeTable(log.end_time) : 'N/a',
        ]);

        autoTable(doc, {
            head: [['No.', 'Caller', 'Caller No.', 'Callee', 'Callee No.', 'Duration', 'Result', 'Start Time', 'End Time']],
            body: tableData,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [0, 105, 217] },
        });

        doc.save(`${title}_Log.pdf`);
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-bold text-blue-800">{title}</h2>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={exportToExcel}
                        className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
                    >
                        <Download size={16} className="mr-2" />
                        Excel
                    </button>

                    <button
                        onClick={exportToCSV}
                        className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
                    >
                        <Download size={16} className="mr-2" />
                        CSV
                    </button>

                    <button
                        onClick={exportToPDF}
                        className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
                    >
                        <Download size={16} className="mr-2" />
                        PDF
                    </button>

                    <button
                        onClick={refreshCallLogs}
                        className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm"
                    >
                        <RefreshCcw size={16} className="mr-2" />
                        Refresh
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow w-full p-4 mt-6">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">From:</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">To:</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="h-8 border-l border-gray-300 mx-2"></div>
                            <div className="flex items-center space-x-1 text-gray-700">
                                <Filter size={18} />
                                <span className="text-sm font-medium">Filters</span>
                            </div>
                            <div className="h-8 border-l border-gray-300 mx-2"></div>
                        </div>
                    </div>

                    <button
                        onClick={fetchCallLogs}
                        className="mt-4 sm:mt-0 px-4 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 border border-blue-600 shadow-sm"
                    >
                        Generate Report
                    </button>
                </div>
            </div>
        </>
    );
};

export default CommonHeader;