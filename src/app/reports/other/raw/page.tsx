'use client';

import MainLayout from '@/components/layout/MainLayout';
import CommonHeader from '@/components/otherReports/CommonHeader';
import { Headers } from '@/services/commonAPI';
import { rawCallLogsAPI } from '@/services/zoomAPI';
import { CallLogEntry, CallLogRequestBody } from '@/types/zoomTypes';
import { formatDateTimeTable } from '@/utils/formatters';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 16;

const Page = () => {
  const [startDate, setStartDate] = useState<string>('2025-01-01');
  const [endDate, setEndDate] = useState<string>('2025-06-01');
  const [callLog, setCallLog] = useState<CallLogEntry[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log(callLog);

  useEffect(() => {
    fetchRawCallLogs();
  }, []);

  const fetchRawCallLogs = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(sessionStorage.getItem('tk') || '"tk"');
      const header: Headers = {
        authorization: `Bearer ${token}`,
      };
      const reqBody: CallLogRequestBody = {
        from: startDate,
        to: endDate,
      };

      const result = await rawCallLogsAPI(header, reqBody);

      if (result.success) {
        setCallLog(result.data);
      } else {
        setError('Failed to fetch call logs');
      }
    } catch (err) {
      setError('An error occurred while fetching call logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalItems = callLog?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = callLog?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === i ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <MainLayout>
      <CommonHeader
        title={'Raw Call Data'}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        callLog={callLog}
        fetchCallLogs={fetchRawCallLogs}
        refreshCallLogs={fetchRawCallLogs}
      />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-between mt-6 h-[calc(100vh-200px)]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full text-red-600">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full h-125">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[60px]">No.</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[150px]">Call ID</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[300px]">Call Path ID</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[90px]">Call Type</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[120px]">Connect Type</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[90px]">Direction</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[90px]">Result</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[70px]">Caller</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[100px]">Caller No.</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[140px]">Caller Country</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[100px]">Caller ISO</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[110px]">Caller Type</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[100px]">Callee</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[120px]">Callee No.</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[150px]">Callee Email</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[120px]">Callee Ext ID</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[130px]">Callee Ext No.</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[140px]">Callee Ext Type</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[140px]">Callee Country</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[100px]">Callee ISO</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[110px]">Callee Type</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[90px]">Duration</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[100px]">Start Time</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[100px]">End Time</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[100px]">End-to-End</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[125px]">Hide Caller ID</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[100px]">International</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[160px]">Recording Status</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[120px]">Site ID</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 min-w-[120px]">Site Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((log: CallLogEntry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="ps-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{startIndex + index + 1}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.call_id ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.call_path_id ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.call_type ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.connect_type ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.direction ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.call_result ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.caller_name ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.caller_did_number ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.caller_country_code ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.caller_country_iso_code ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.caller_number_type ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.callee_name ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.callee_did_number ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.callee_email ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.callee_ext_id ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.callee_ext_number ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.callee_ext_type ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.callee_country_code ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.callee_country_iso_code ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.callee_number_type ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.duration ?? '0'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.start_time ? formatDateTimeTable(log.start_time) : 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.end_time ? formatDateTimeTable(log.end_time) : 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.end_to_end ? 'Yes' : 'No'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.hide_caller_id ? 'Yes' : 'No'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.international ? 'Yes' : 'No'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.recording_status ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.site_id ?? 'N/A'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">{log.site_name ?? 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={30} className="px-6 py-4 text-center text-sm text-gray-500">
                        No data found!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="h-15 flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex space-x-1">{renderPagination()}</div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Page;