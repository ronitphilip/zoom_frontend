'use client'
import MainLayout from '@/components/layout/MainLayout'
import VdnDailyReport from '@/components/queue-reports/vdn/VdnDailyReport'
import React, { useState } from 'react'

const Page = () => {
  const [startDate, setStartDate] = useState<string>('2025-06-01');
  const [endDate, setEndDate] = useState<string>('2025-06-23');

  return (
    <MainLayout>
      <VdnDailyReport
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    </MainLayout>
  )
}

export default Page