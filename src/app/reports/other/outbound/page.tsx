'use client';

import MainLayout from '@/components/layout/MainLayout'
import CommonHeader from '@/components/otherReports/CommonHeader'
import { Headers } from '@/services/commonAPI';
import { fetchOutbondCallLogsAPI, refreshCallLogsAPI } from '@/services/zoomAPI';
import { CallLogEntry, CallLogRequestBody } from '@/types/zoomTypes';
import { formatDateTimeTable } from '@/utils/formatters';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const ITEMS_PER_PAGE = 20;

const Page = () => {

  const [startDate, setStartDate] = useState<string>('2025-01-01');
  const [endDate, setEndDate] = useState<string>('2025-06-01');
  const [callLog, setCallLog] = useState<CallLogEntry[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOutBondCallLogs();
  }, [])

  const fetchOutBondCallLogs = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem('tk') || "'tk")
      const header: Headers = {
        authorization: `Bearer ${token}`
      }
      const reqBody: CallLogRequestBody = {
        from: startDate,
        to: endDate,
      }

      const result = await fetchOutbondCallLogsAPI(header, reqBody);

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
  }

    const refreshCallLogs = async () => {
      setLoading(true);
      setError(null);
      setCurrentPage(1);
      try {
        const token = JSON.parse(sessionStorage.getItem('tk') || '"tk"');
        const header: Headers = {
          authorization: `Bearer ${token}`
        };
        const reqBody: CallLogRequestBody = {
          from: startDate,
          to: endDate,
          direction: 'outbound'
        };
  
        const result = await refreshCallLogsAPI(header, reqBody);
  
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
        title={'Outbond Calls'}
        startDate={startDate}
        endDate={endDate}
        callLog={callLog} 
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        fetchCallLogs={fetchOutBondCallLogs}
        refreshCallLogs={refreshCallLogs}
      />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-146 flex flex-col justify-between mt-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full text-red-600">
            {error}
          </div>
        ) : (
          <>
            <table className="w-full max-h-130">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0">No.</th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0">Caller</th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0">Caller No.</th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0">Callee</th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0">Callee No.</th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0">Duration</th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0">Result</th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0">Start Time</th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0">End Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.length > 0 ? (
                  paginatedData.map((log: CallLogEntry, index) => (
                    <tr key={index} className='hover:bg-gray-50'>
                      <td className="px-3 h-6 text-xs text-gray-900">{startIndex + index + 1}</td>
                      <td className="px-3 h-6 text-xs text-gray-900">{log.caller_name}</td>
                      <td className="px-3 h-6 text-xs text-gray-900">{log.caller_did_number}</td>
                      <td className="px-3 h-6 text-xs text-gray-900">{log.callee_name}</td>
                      <td className="px-3 h-6 text-xs text-gray-900">{log.callee_did_number}</td>
                      <td className="px-3 h-6 text-xs text-gray-900">{log.duration}</td>
                      <td className="px-3 h-6 text-xs text-gray-900">{log.call_result}</td>
                      <td className="px-3 h-6 text-xs text-gray-900">{log.start_time ? formatDateTimeTable(log.start_time) : 'N/a'}</td>
                      <td className="px-3 h-6 text-xs text-gray-900">{log.end_time ? formatDateTimeTable(log.end_time) : 'N/a'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                      No data found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

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
  )
}

export default Page