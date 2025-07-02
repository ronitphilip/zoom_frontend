"use client";
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout'
import AbandonedCallsReport from '@/components/queue-reports/AbandonedCallsReport'

const page = () => {
  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-06-30");
  return (
    <MainLayout>
      <div>
        <AbandonedCallsReport
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </div>
    </MainLayout>
  )
}

export default page