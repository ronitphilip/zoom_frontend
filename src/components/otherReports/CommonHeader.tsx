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

const getAvailableFields = (callLog: CallLogEntry[]) => {
    const fieldDisplayNames: { [key in keyof CallLogEntry]?: string } = {
        id: 'ID',
        call_id: 'Call ID',
        call_path_id: 'Call Path',
        call_result: 'Result',
        call_type: 'Type',
        callee_country_code: 'Callee Country Code',
        callee_country_iso_code: 'Callee ISO',
        callee_did_number: 'Callee DID No.',
        callee_email: 'Callee Email',
        callee_ext_id: 'Callee Ext ID',
        callee_ext_number: 'Callee Ext Number',
        callee_ext_type: 'Callee Ext Type',
        callee_name: 'Callee Name',
        callee_number_type: 'Callee Number Type',
        caller_country_code: 'Caller Country Code',
        caller_country_iso_code: 'Caller ISO',
        caller_did_number: 'Caller DID No.',
        caller_name: 'Caller Name',
        caller_number_type: 'Caller Number Type',
        connect_type: 'Connect Type',
        direction: 'Direction',
        duration: 'Duration',
        end_time: 'End Time',
        end_to_end: 'End to End',
        hide_caller_id: 'Hide Caller ID',
        international: 'International',
        recording_status: 'Recording Status',
        site_id: 'Site ID',
        site_name: 'Site Name',
        start_time: 'Start Time',
    };

    const availableFields: (keyof CallLogEntry)[] = [];
    for (const log of callLog) {
        for (const key in log) {
            if (
                log[key as keyof CallLogEntry] !== null &&
                log[key as keyof CallLogEntry] !== undefined &&
                !availableFields.includes(key as keyof CallLogEntry)
            ) {
                availableFields.push(key as keyof CallLogEntry);
            }
        }
    }

    return availableFields
        .filter((field) => fieldDisplayNames[field])
        .map((field) => ({
            key: field,
            displayName: fieldDisplayNames[field]!,
        }));
};

const CommonHeader: React.FC<CommonProps> = ({ title, startDate, endDate, callLog, setStartDate, setEndDate, fetchCallLogs, refreshCallLogs }) => {
    
    const exportToExcel = () => {
        if (!callLog || callLog.length === 0) {
            alert('No data to export!');
            return;
        }

        const fields = getAvailableFields(callLog);
        const data = callLog.map((log, index) => {
            const row: { [key: string]: any } = { No: index + 1 };
            for (const { key } of fields) {
                let value = log[key] ?? 'N/a';
                if (key === 'start_time' || key === 'end_time') {
                    value = log[key] ? formatDateTimeTable(log[key] as string) : 'N/a';
                }
                row[key] = value;
            }
            return row;
        });

        const headers = data.map((row) => {
            const headerRow: { [key: string]: string } = {};
            for (const { key, displayName } of fields) {
                headerRow[key] = displayName;
            }
            return headerRow;
        });

        const worksheet = XLSX.utils.json_to_sheet(data, {
            header: ['No', ...fields.map((f) => f.key)],
        });

        XLSX.utils.sheet_add_aoa(worksheet, [['No', ...fields.map((f) => f.displayName)]], {
            origin: 'A1',
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Call Logs');
        XLSX.writeFile(workbook, `${title}_Log.xlsx`);
    };

    const exportToCSV = () => {
        if (!callLog || callLog.length === 0) {
            alert('No data to export!');
            return;
        }

        const fields = getAvailableFields(callLog);
        const data = callLog.map((log, index) => {
            const row: { [key: string]: any } = { No: index + 1 };
            for (const { key, displayName } of fields) {
                let value = log[key] ?? 'N/a';
                if (key === 'start_time' || key === 'end_time') {
                    value = log[key] ? formatDateTimeTable(log[key] as string) : 'N/a';
                }
                row[displayName] = value;
            }
            return row;
        });

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

        const fields = getAvailableFields(callLog);
        const doc = new jsPDF();
        doc.text(`${title} Call Logs`, 14, 20);

        const tableData = callLog.map((log, index) => {
            const row: string[] = [String(index + 1)];
            for (const { key } of fields) {
                let value = log[key] ?? 'N/a';
                if (key === 'start_time' || key === 'end_time') {
                    value = log[key] ? formatDateTimeTable(log[key] as string) : 'N/a';
                }
                row.push(String(value));
            }
            return row;
        });

        autoTable(doc, {
            head: [['No.', ...fields.map((f) => f.displayName)]],
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