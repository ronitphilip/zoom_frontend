import React, { useState } from 'react';
import { vdnDailyData } from '@/data/avayaReportData';
import { ReportFilterCriteria } from '@/types/avayaReportTypes';
import ReportFilter from '@/components/filters/ReportFilter';

interface VdnDailyReportProps {
  initialFilterCriteria: ReportFilterCriteria;
}

export default function VdnDailyReport({ initialFilterCriteria }: VdnDailyReportProps) {
  const [filterCriteria, setFilterCriteria] = useState<ReportFilterCriteria>(initialFilterCriteria);
  const [reportData, setReportData] = useState(vdnDailyData);
  
  const generateReport = () => {
    // In a real app, this would fetch data from an API
    console.log('Generating report with criteria:', filterCriteria);
    // For demonstration, we're using the static sample data
    setReportData(vdnDailyData);
  };
  
  return (
    <div className="space-y-6">
      {/* Page header with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-800">VDN Report (Skill) Daily</h2>
        
        <div className="flex flex-wrap gap-2">
          {/* Action buttons with blue styling */}
          <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Excel
          </button>
          
          <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </button>
          
          <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            PDF
          </button>
          
          <button className="px-3 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 flex items-center border border-blue-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      {/* Report Filter */}
      <ReportFilter 
        filterCriteria={filterCriteria}
        onFilterChange={setFilterCriteria}
        onGenerateReport={generateReport}
        showVdnFilter={true}
      />
      
      {/* VDN Information */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-base font-semibold text-blue-800 mb-2">VDN Information</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">VDN Name:</span>
            <span className="ml-2 text-sm font-semibold">Main Line</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">VDN ID:</span>
            <span className="ml-2 text-sm font-semibold">vdn1000</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Reporting Period:</span>
            <span className="ml-2 text-sm font-semibold">{filterCriteria.startDate} to {filterCriteria.endDate}</span>
          </div>
        </div>
      </div>
      
      {/* Report Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Vector Inbound Calls</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Flow In</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Calls</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg Speed Ans</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg ACD Time</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg ACW Time</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Main ACD Calls</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Backup ACD Calls</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Connect Time</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg Connect Calls</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Aban Calls</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg Aban Time</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">% Aban</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Forced Busy Calls</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">% Busy</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Forced Disc Calls</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Flow Out</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">% Flow Out</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg VDN Time</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">1st Skill Pref</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">2nd Skill Pref</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">3rd Skill Pref</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.date}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.vectorInboundCalls}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.flowIn}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.calls}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.avgSpeedAns}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.avgAcdTime}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.avgAcwTime}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.mainAcdCalls}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.backupAcdCalls}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.connectTime}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.avgConnectCalls}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.abanCalls}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.avgAbanTime}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.percentAban}%</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.forcedBusyCalls}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.percentBusy}%</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.forcedDiscCalls}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.flowOut}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.percentFlowOut}%</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.avgVdnTime}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.firstSkillPref}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.secondSkillPref}</td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-900">{record.thirdSkillPref}</td>
                </tr>
              ))}
              
              {/* Summary row */}
              <tr className="bg-blue-50 font-semibold">
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">TOTALS</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">1874</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">195</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">1732</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">0:28</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">3:15</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">0:48</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">1532</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">124</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">32:45:00</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">3</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">142</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">0:32</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">7.5%</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">28</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">1.4%</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">12</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">87</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">4.6%</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">2:10</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">-</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">-</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-800">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
