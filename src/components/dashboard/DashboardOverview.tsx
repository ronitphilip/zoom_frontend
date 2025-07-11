import { zoomDataAttributes } from '@/services/dashboardAPI';
import { Calendar } from 'lucide-react';

interface DashProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  data: zoomDataAttributes | undefined;
  fetchReports: () => void;
}

const DashboardOverview = ({ startDate, endDate, setStartDate, setEndDate, data, fetchReports }: DashProps) => {

  return (
    <>
      <div className='flex justify-between items-center mb-5'>
        <h1 className='dash-heading'>Dashboard Overview</h1>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
            <span className="text-sm text-gray-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
          </div>
          <button onClick={fetchReports} className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700">
            Generate Report
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Total Calls</h4>
          <p className="text-xl font-bold mt-1">{data?.total_calls ? data.total_calls : '0'}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Inbound</h4>
          <p className="text-xl font-bold mt-1 text-green-600">{data?.inbound_calls ? data.inbound_calls : '0'}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Outbound</h4>
          <p className="text-xl font-bold mt-1 text-blue-600">{data?.outbound_calls ? data.outbound_calls : '0'}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Missed</h4>
          <p className="text-xl font-bold mt-1 text-red-600">{data?.missed_calls ? data.missed_calls : '0'}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Abandoned</h4>
          <p className="text-xl font-bold mt-1 text-orange-600">{data?.abandoned_calls ? data.abandoned_calls : '0'}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Avg. Duration</h4>
          <p className="text-xl font-bold mt-1">{data?.avg_call_duration ? data.avg_call_duration : '0'} Mins</p>
        </div>
      </div>
    </>
  )
}

export default DashboardOverview